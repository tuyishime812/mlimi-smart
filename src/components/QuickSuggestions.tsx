import { Button } from "@/components/ui/button";
import { Lightbulb } from "lucide-react";

interface QuickSuggestionsProps {
  onSuggestionClick: (suggestion: string) => void;
}

export const QuickSuggestions = ({ onSuggestionClick }: QuickSuggestionsProps) => {
  const suggestions = [
    "How should I prepare soil for my crops?",
    "What are common crop pests and how do I control them?",
    "How do I know when my crops are ready to harvest?",
    "What's the best way to store harvested crops?",
  ];

  return (
    <div className="flex flex-wrap gap-2 mt-4">
      <div className="flex items-center gap-2 mb-2 w-full">
        <Lightbulb className="h-4 w-4 text-amber-500" />
        <span className="text-xs text-muted-foreground font-medium">Quick suggestions:</span>
      </div>
      {suggestions.map((suggestion, idx) => (
        <Button
          key={idx}
          size="sm"
          variant="outline"
          className="text-xs h-8 rounded-full hover:bg-primary/10 transition-colors"
          onClick={() => onSuggestionClick(suggestion)}
        >
          {suggestion}
        </Button>
      ))}
    </div>
  );
};
