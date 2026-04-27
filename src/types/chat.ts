export interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp?: Date;
  error?: boolean;
  // Optional fields to support concurrent in-flight messages
  id?: string;
  loading?: boolean;
}

export interface ChatResponse {
  reply: string;
  detected_language?: string;
  detected_confidence?: number;
}

export interface ApiError {
  status: number;
  message: string;
  detail?: string;
}

export type QueryType = "General" | "Farming Advice" | "Pest & Disease Control" | "Business & Marketing";