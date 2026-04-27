import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Mic, Volume2, Square } from "lucide-react";
import { toast } from "sonner";

interface VoiceChatProps {
  onVoiceInput: (transcript: string) => void;
  isListening?: boolean;
}

export const VoiceChat = ({ onVoiceInput, isListening = false }: VoiceChatProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Initialize Web Speech API
  const startListening = () => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      toast.error("Voice input not supported in your browser");
      return;
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    if (!recognitionRef.current) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.onstart = () => setIsRecording(true);
      recognitionRef.current.onend = () => setIsRecording(false);
      recognitionRef.current.onresult = (event: any) => {
        let transcript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        if (event.isFinal) {
          onVoiceInput(transcript.trim());
        }
      };
      recognitionRef.current.onerror = (event: any) => {
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

  // Text-to-speech for assistant replies
  const speakText = (text: string) => {
    if (!("speechSynthesis" in window)) {
      toast.error("Text-to-speech not supported");
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9; // Slightly slower for clarity
    utterance.pitch = 1;
    utterance.volume = 1;

    window.speechSynthesis.speak(utterance);
    toast.success("Reading response aloud...");
  };

  return (
    <div className="flex gap-2">
      <Button
        size="sm"
        variant={isRecording ? "destructive" : "outline"}
        className="rounded-full h-10 w-10 p-0"
        onClick={startListening}
        title={isRecording ? "Stop recording" : "Start voice input"}
      >
        {isRecording ? (
          <Square className="h-4 w-4" />
        ) : (
          <Mic className="h-4 w-4" />
        )}
      </Button>
      <Button
        size="sm"
        variant="outline"
        className="rounded-full h-10 w-10 p-0"
        onClick={() => speakText("Voice output demo")}
        title="Read response aloud"
      >
        <Volume2 className="h-4 w-4" />
      </Button>
    </div>
  );
};
