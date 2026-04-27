import { useState, useRef, useCallback, useEffect } from "react";
import { ModernChatMessage } from "@/components/ModernChatMessage";
import { FloatingSidebar } from "@/components/FloatingSidebar";
import { ModernChatInput } from "@/components/ModernChatInput";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Settings, Leaf, Plus, AlertCircle, Moon, Sun, Trash2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useTheme } from "@/context/ThemeContext";
import { Message, QueryType, ChatResponse, ApiError } from "@/types/chat";

const Index = () => {
  const { theme, toggleTheme } = useTheme();
  const [queryType, setQueryType] = useState<QueryType>("General");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Moni! I'm your friendly Malawi farming advisor — a farmer's companion. Tell me what you're growing or ask a question and I'll help in your language.",
      timestamp: new Date()
    },
  ]);
  // Track number of active in-flight requests so input remains enabled for new questions
  const [activeRequests, setActiveRequests] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sidebarTab, setSidebarTab] = useState<"settings" | "knowledge-base">("settings");
  const imageInputRef = useRef<HTMLInputElement | null>(null);

  const STORAGE_KEY = "mlimi_chat_history_v1";

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const hydrated: Message[] = parsed.map((m: { role: string; content: string; timestamp: string }) => ({
            role: m.role,
            content: m.content,
            timestamp: m.timestamp ? new Date(m.timestamp) : new Date(),
          }));
          setMessages(hydrated);
        }
      }
    } catch (e) {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      const toStore = messages
        .filter((m) => !m.loading)
        .map((m) => ({ role: m.role, content: m.content, timestamp: m.timestamp?.toISOString() }));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
    } catch (e) {
      // ignore
    }
  }, [messages]);

  const clearHistory = () => {
    const welcome: Message = {
      role: "assistant",
      content: "Moni! I'm your friendly Malawi farming advisor — a farmer's companion. Tell me what you're growing or ask a question and I'll help in your language.",
      timestamp: new Date(),
    };
    setMessages([welcome]);
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
  };

  const handleSendMessage = useCallback(async (userInput: string) => {
    const userMessage: Message = {
      role: "user",
      content: userInput,
      timestamp: new Date(),
    };

    // Create a unique id for the assistant placeholder so we can replace it later
    const placeholderId = `pending-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const assistantPlaceholder: Message = {
      role: "assistant",
      content: "",
      timestamp: new Date(),
      loading: true,
      id: placeholderId,
    };

  // Prepare conversation to send: include recent non-loading messages and current user message
  const recent = messages.filter(m => !m.loading).slice(-12).map(m => ({ role: m.role, content: m.content }));
  const conversationToSend = [...recent, { role: 'user', content: userInput }];

  // Add user message and assistant placeholder immediately so UI remains responsive
  setMessages((prev) => [...prev, userMessage, assistantPlaceholder]);

    // Increment active requests counter
    setActiveRequests((n) => n + 1);

    try {
      // Call streaming endpoint and progressively update placeholder
      const resp = await fetch('/api/chat/stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept-Language': navigator.language,
        },
        body: JSON.stringify({
          query: userInput,
          query_type: queryType,
          timestamp: new Date().toISOString(),
          conversation: conversationToSend,
        }),
      });

      if (!resp.ok) {
        const text = await resp.text().catch(() => `Status ${resp.status}`);
        throw new Error(`API error: ${text}`);
      }

      const reader = resp.body?.getReader();
      if (!reader) {
        throw new Error('Streaming not supported by browser or response');
      }

      const decoder = new TextDecoder();
      let buffer = '';

      // Helper to smartly join token chunks (add space when needed)
      const joinChunk = (prev: string | undefined, chunk: string) => {
        if (!prev || prev.length === 0) return chunk;
        if (/^\s/.test(chunk)) return prev + chunk; // chunk already starts with space
        if (/\s$/.test(prev)) return prev + chunk; // prev already ends with space
        // Don't add space before common punctuation or dashes
        if (/^[.,:;!?)\]%—–-]/.test(chunk)) return prev + chunk;
        return prev + ' ' + chunk;
      };

      // Read loop
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        // Process any full SSE events separated by double newlines
        let idx;
        while ((idx = buffer.indexOf('\n\n')) !== -1) {
          const event = buffer.slice(0, idx).trim();
          buffer = buffer.slice(idx + 2);

          if (!event) continue;

          // event may be multiple lines; find lines starting with 'data:'
          const lines = event.split('\n');
          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed) continue;
            if (trimmed.startsWith('data:')) {
              const payload = trimmed.slice(5).trim();
              if (payload === '[DONE]') {
                // finished
                break;
              }
              if (payload.startsWith('ERROR:')) {
                // Show error in placeholder and finish
                setMessages((prev) => prev.map((m) => m.id === placeholderId ? ({ ...m, content: `Error: ${payload.slice(6).trim()}`, loading: false, error: true, timestamp: new Date() }) : m));
                throw new Error(payload);
              }

              // Append the chunk to the placeholder content using smart join
              setMessages((prev) => prev.map((m) => {
                if (m.id !== placeholderId) return m;
                const newContent = joinChunk(m.content, payload);
                return { ...m, content: newContent, loading: true };
              }));
            } else if (trimmed.startsWith('event:') && trimmed.includes('done')) {
              // finished event
            }
          }
        }
      }

      // After stream ends, finalize placeholder (turn off loading)
      setMessages((prev) => prev.map((m) => m.id === placeholderId ? ({ ...m, loading: false, timestamp: new Date() }) : m));
      toast.success('Response received!');
    } catch (error) {
      console.error('Chat API error (stream):', error);
      setMessages((prev) => prev.map((m) => m.id === placeholderId ? ({ ...m, content: error instanceof Error ? `Error: ${error.message}` : 'Request failed', loading: false, error: true, timestamp: new Date() }) : m));
      toast.error('Failed to get response', { description: error instanceof Error ? error.message : undefined });
    } finally {
      setActiveRequests((n) => Math.max(0, n - 1));
    }
  }, [queryType, messages]);

  return (
    <div className="min-h-screen organic-bg flex flex-col">
      {/* Floating Header */}
      <header className="fixed top-0 left-0 right-0 z-30 p-6">
        <div className="max-w-5xl mx-auto">
          <div className="glass-card rounded-3xl p-6 shadow-lg float-up">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
                  <Leaf className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    Mlimi Smart Farming Expert
                  </h1>
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <span>🇲🇼</span>
                    Smart, Sustainable & Farmer-Friendly
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-2xl hover:shadow-md transition-all duration-300"
                  onClick={() => setIsSidebarOpen(true)}
                  title="Settings"
                >
                  <Settings className="h-5 w-5" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-2xl hover:shadow-md hover:bg-destructive/10 transition-all duration-300"
                  onClick={() => {
                    if (window.confirm("Clear chat history? This cannot be undone.")) {
                      clearHistory();
                    }
                  }}
                  title="Clear chat history"
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-2xl hover:shadow-md transition-all duration-300"
                  onClick={toggleTheme}
                  title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                >
                  {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col pt-36 pb-8 px-6">
        <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col gap-6">
          {/* Messages Container */}
          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-6 pb-6">
              {messages.map((msg, idx) => (
                <ModernChatMessage
                  key={msg.id ?? idx}
                  role={msg.role}
                  content={msg.content}
                  loading={msg.loading}
                  error={msg.error}
                  timestamp={msg.timestamp}
                  delay={idx * 100}
                  onSuggestedClick={handleSendMessage}
                />
              ))}
              {messages.some(msg => msg.error) && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Some messages failed to send. Please try again or check your connection.
                  </AlertDescription>
                </Alert>
              )}
              {/* Global loading indicator removed - per-message placeholders show progress */}
            </div>
          </ScrollArea>

          {/* Input Area: Image upload removed from middle */}
            <div className="float-up" style={{ animationDelay: "200ms" }}>
            {/* Keep input enabled so users can send new questions while others load */}
            <ModernChatInput onSend={handleSendMessage} />
          </div>

          {/* Footer Badge */}
          <div className="text-center">
            <p className="text-xs text-muted-foreground inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card">
              <span className="inline-block w-2 h-2 bg-primary rounded-full animate-pulse" />
              Empowering Malawi's Farmers 🌾
            </p>
          </div>
        </div>
      </main>

      {/* Floating quick-upload button (green plus on right side) */}
      <div className="fixed right-6 bottom-6 z-40">
        <button
          onClick={() => imageInputRef.current?.click()}
          aria-label="Upload image"
          className="w-14 h-14 rounded-full bg-primary text-white shadow-lg flex items-center justify-center hover:scale-105 transition-transform"
        >
          <Plus className="w-6 h-6" />
        </button>
        <input
          ref={imageInputRef}
          id="main-image-input"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={async (e) => {
            const files = e.currentTarget.files;
            if (!files || files.length === 0) return;
            const file = files[0];
            const fd = new FormData();
            fd.append('file', file);
            setActiveRequests((n) => n + 1);
            try {
              const res = await fetch('/api/disease/detect-image', { method: 'POST', body: fd });
              const json = await res.json().catch(() => null);
              if (!res.ok) {
                const err = json?.detail || JSON.stringify(json) || `Status ${res.status}`;
                setMessages(prev => [...prev, { role: 'assistant', content: `Image analysis failed: ${err}` }]);
              } else {
                const preds = json?.predictions;
                const advice = json?.advice;
                if (preds && preds.length > 0) {
                  const top = preds[0];
                  const label = top.class || top.label || 'unknown';
                  const conf = (typeof top.confidence === 'number') ? top.confidence : (top.probability || 0);
                  setMessages(prev => [...prev, { role: 'assistant', content: `Image detected: ${label} (${(conf*100).toFixed(1)}%)` }]);
                  if (advice) {
                    let adviceText = advice.summary || '';
                    if (advice.actions && advice.actions.length > 0) {
                      adviceText += '\n\nRecommended actions:\n' + advice.actions.map(a => `- ${a}`).join('\n');
                    }
                    if (advice.chemicals && advice.chemicals.length > 0) {
                      adviceText += '\n\nRecommended treatments:\n' + advice.chemicals.map(c => `- ${c}`).join('\n');
                    }
                    setMessages(prev => [...prev, { role: 'assistant', content: adviceText }]);
                  }
                } else {
                  setMessages(prev => [...prev, { role: 'assistant', content: `No predictions returned` }]);
                }
              }
            } catch (err) {
              console.error(err);
              setMessages(prev => [...prev, { role: 'assistant', content: `Image call error: ${String(err)}` }]);
            } finally {
              setActiveRequests((n) => Math.max(0, n - 1));
              if (imageInputRef.current) imageInputRef.current.value = '';
            }
          }}
        />
      </div>

      {/* Floating Sidebar with tabs */}
      <FloatingSidebar
        queryType={queryType}
        onQueryTypeChange={setQueryType}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      >
        {sidebarTab === "settings" && (
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-sm mb-2">Chat Mode</h3>
              <div className="space-y-2">
                {["General", "Farming Advice", "Pest & Disease Control", "Business & Marketing"].map((mode) => (
                  <Button
                    key={mode}
                    variant={queryType === mode ? "default" : "outline"}
                    className="w-full justify-start text-sm"
                    onClick={() => setQueryType(mode as QueryType)}
                  >
                    {mode}
                  </Button>
                ))}
              </div>
            </div>
            <div className="pt-4 border-t">
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => setSidebarTab("knowledge-base")}
              >
                📚 View Disease/Pest KB
              </Button>
            </div>
          </div>
        )}
        {sidebarTab === "knowledge-base" && (
          <div>
            <Button
              variant="outline"
              size="sm"
              className="w-full mb-4"
              onClick={() => setSidebarTab("settings")}
            >
              ← Back to Settings
            </Button>
            <DiseaseKnowledgeBase
              onSelectItem={(category, item) => {
                handleSendMessage(`Tell me more about ${item.name}`);
                setIsSidebarOpen(false);
              }}
            />
          </div>
        )}
      </FloatingSidebar>
    </div>
  );
};

export default Index;
