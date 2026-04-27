import { QueryType } from "@/types/chat";

interface ApiConfig {
  baseUrl: string;
  headers: Record<string, string>;
}

class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public detail?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

const DEFAULT_CONFIG: ApiConfig = {
  baseUrl: '/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Accept-Language': navigator.language
  }
};

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({
      message: 'Unknown error occurred'
    }));
    
    throw new ApiError(
      response.status,
      errorData.message || `HTTP error ${response.status}`,
      errorData.detail
    );
  }

  return response.json();
}

export async function chatRequest(query: string, queryType: QueryType) {
  const response = await fetch(`${DEFAULT_CONFIG.baseUrl}/chat`, {
    method: 'POST',
    headers: DEFAULT_CONFIG.headers,
    body: JSON.stringify({
      query,
      query_type: queryType,
      timestamp: new Date().toISOString()
    })
  });

  return handleResponse(response);
}

export async function analyzeImage(file: File) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${DEFAULT_CONFIG.baseUrl}/disease/detect-image`, {
    method: 'POST',
    body: formData
  });

  return handleResponse(response);
}

export async function getWeather(params: {
  latitude?: number;
  longitude?: number;
  city?: string;
  days?: number;
}) {
  const response = await fetch(`${DEFAULT_CONFIG.baseUrl}/weather`, {
    method: 'POST',
    headers: DEFAULT_CONFIG.headers,
    body: JSON.stringify(params)
  });

  return handleResponse(response);
}