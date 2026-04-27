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
import { Message, QueryType } from "@/types/chat";

const Index = () => {
  const { theme, toggleTheme } = useTheme();
  const [backendOnline, setBackendOnline] = useState<boolean | null>(null);
  const [queryType, setQueryType] = useState<QueryType>("General");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Moni! I'm your friendly Malawi farming advisor. Tell me what you're growing or ask a question.",
      timestamp: new Date()
    },
  ]);
  const [activeRequests, setActiveRequests] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sidebarTab, setSidebarTab] = useState<"settings" | "knowledge-base">("settings");
  const imageInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const checkBackend = async () => {
      try {
        const res = await fetch('http://localhost:8000/');
        setBackendOnline(res.ok);
      } catch {
        setBackendOnline(false);
      }
    };
    checkBackend();
    const interval = setInterval(checkBackend, 30000);
    return () => clearInterval(interval);
  }, []);

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
      content: "Moni! I'm your friendly Malawi farming advisor. Tell me what you're growing or ask a question.",
      timestamp: new Date(),
    };
    setMessages([welcome]);
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
  };

  // ... rest of the component (handleSendMessage, etc.)

  return (
    <div className="min-h-screen bg-background">
      {backendOnline === false && (
        <div className="bg-yellow-500/10 border-b border-yellow-500/20 px-4 py-2 text-center text-sm">
          <AlertCircle className="inline w-4 h-4 mr-2" />
          Backend offline - showing demo data.
          <a href="/backend/README.md" className="underline ml-1">Setup guide</a>
        </div>
      )}
      {/* Rest of chat UI */}
    </div>
  );
};

export default Index;
