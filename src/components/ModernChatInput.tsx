import { useState, KeyboardEvent, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Mic, Square } from "lucide-react";
import { toast } from "sonner";

interface ModernChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export const ModernChatInput = ({ onSend, disabled }: ModernChatInputProps) => {
  const [input, setInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const handleSend = () => {
    if (input.trim() && !disabled) {
      onSend(input.trim());
      setInput("");
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Initialize and handle voice recording
  const startListening = () => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      toast.error("Voice input not supported in your browser");
      return;
    }

    const SpeechRecognition = (window as { webkitSpeechRecognition?: typeof SpeechRecognition; SpeechRecognition?: typeof SpeechRecognition }).webkitSpeechRecognition || (window as { SpeechRecognition?: typeof SpeechRecognition }).SpeechRecognition;
    if (!recognitionRef.current) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.onstart = () => setIsRecording(true);
      recognitionRef.current.onend = () => setIsRecording(false);
      recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
        let transcript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        if (event.isFinal) {
          setInput(transcript.trim());
        }
      };
      recognitionRef.current.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error("Speech recognition error", event.error);
        toast.error(`Voice error: ${event.error}`);
      };
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      recognitionRef.current.start();
    }
  };

  return (
    <div className="glass-card rounded-3xl p-3 shadow-lg">
      <div className="flex gap-3 items-end">
        <div className="flex-1 relative">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Hi — ask me any question about farming or crops?"
            className="min-h-[48px] max-h-[120px] resize-none border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 pr-4 text-sm leading-snug"
            disabled={disabled}
          />
          {/* Sparkles icon removed per request */}
        </div>
        <div className="flex gap-3 items-center">
          <Button
            onClick={startListening}
            disabled={disabled}
            size="icon"
            variant={isRecording ? "destructive" : "outline"}
            className="h-10 w-10 rounded-full"
            title={isRecording ? "Stop recording" : "Start voice input"}
          >
            {isRecording ? (
              <Square className="h-4 w-4" />
            ) : (
              <Mic className="h-4 w-4" />
            )}
          </Button>
          <Button
            onClick={handleSend}
            disabled={!input.trim() || disabled}
            size="icon"
            className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-secondary hover:shadow-lg transition-all duration-300 hover:scale-105"
            title="Send message"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
