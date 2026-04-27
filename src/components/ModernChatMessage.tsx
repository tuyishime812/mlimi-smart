import { cn } from "./lib/utils";
import { AlertCircle } from "lucide-react";
import { Message } from "@/types/chat";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ModernChatMessageProps extends Omit<Message, 'role'> {
  role: Message['role'];
  delay?: number;
  onSuggestedClick?: (suggestion: string) => void;
}

export const ModernChatMessage = ({ role, content, timestamp, error, delay = 0, loading, onSuggestedClick }: ModernChatMessageProps) => {
  const isUser = role === "user";

  return (
    <div
      className={cn(
        "flex gap-4 items-start float-up flex-col",
        isUser ? "items-end" : "items-start"
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex gap-4 items-start w-full" style={{ flexDirection: isUser ? "row-reverse" : "row" }}>
        {!isUser && (
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-xl shadow-lg">
            🌿
          </div>
        )}

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                className={cn(
                  "max-w-[75%] rounded-2xl p-4 shadow-md transition-all duration-300 hover:shadow-lg",
                  isUser
                    ? "bg-gradient-to-br from-primary to-secondary text-primary-foreground rounded-br-sm shadow-lg hover:shadow-xl"
                    : error
                    ? "bg-destructive/10 border border-destructive/50 rounded-bl-sm"
                    : "glass-card rounded-bl-sm border border-border/50 hover:border-border"
                )}
              >
                <div className="space-y-2">
                  {error && (
                    <div className="flex items-center gap-2 text-destructive mb-2">
                      <AlertCircle className="h-4 w-4" />
                      <span className="text-xs font-medium">Error Message</span>
                    </div>
                  )}
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                      <p className="text-sm text-muted-foreground ml-2">Thinking...</p>
                    </div>
                  ) : (
                    <>
                      <p
                        className={cn(
                          "text-sm leading-relaxed whitespace-pre-wrap",
                          isUser ? "text-primary-foreground" : error ? "text-destructive" : "text-foreground"
                        )}
                      >
                        {content}
                      </p>
                      {timestamp && (
                        <p className="text-[10px] text-muted-foreground mt-2">
                          {format(timestamp, 'HH:mm')}
                        </p>
                      )}
                    </>
                  )}
                </div>
              </div>
            </TooltipTrigger>
            {timestamp && (
              <TooltipContent>
                <p className="text-xs">{format(timestamp, 'EEEE, MMMM d, yyyy HH:mm:ss')}</p>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>

        {isUser && (
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-accent to-secondary flex items-center justify-center text-xl shadow-lg">
            👨‍🌾
          </div>
        )}
      </div>

      {/* Quick suggestions removed */}
    </div>
  );
};
