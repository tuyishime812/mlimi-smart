import { useState, useEffect, useCallback } from 'react';

const POLL_INTERVAL = 1000; // 1 second
const MAX_POLLS = 30; // 30 seconds max wait

type PredictionJob = {
  job_id: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  progress: number;
  result?: {
    predictions: Array<{ class?: string; confidence?: number }>;
    advice?: string | null;
    unknown_image?: boolean;
    message?: string;
  };
  error?: string;
};

export function useAsyncPrediction() {
  const [jobId, setJobId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PredictionJob['result'] | null>(null);
  const [pollCount, setPollCount] = useState(0);

  // Clear state for new prediction
  const reset = useCallback(() => {
    setJobId(null);
    setIsLoading(false);
    setProgress(0);
    setError(null);
    setResult(null);
    setPollCount(0);
  }, []);

  // Start a new prediction
  const predict = useCallback(async (file: File) => {
    reset();
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('http://localhost:8000/predict/async', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text);
      }

      const data = await res.json();
      setJobId(data.job_id);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
      setIsLoading(false);
    }
  }, [reset]);

  // Poll for job status
  useEffect(() => {
    if (!jobId || !isLoading || pollCount >= MAX_POLLS) return;

    const pollStatus = async () => {
      try {
        const res = await fetch(`http://localhost:8000/predict/status/${jobId}`);
        if (!res.ok) {
          throw new Error('Failed to get prediction status');
        }

        const job: PredictionJob = await res.json();
        setProgress(job.progress);

        if (job.status === 'completed') {
          setResult(job.result || null);
          setIsLoading(false);
        } else if (job.status === 'error') {
          setError(job.error || 'Prediction failed');
          setIsLoading(false);
        } else {
          // Still processing, increment poll count
          setPollCount(count => count + 1);
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : String(err));
        setIsLoading(false);
      }
    };

    const timer = setTimeout(pollStatus, POLL_INTERVAL);
    return () => clearTimeout(timer);
  }, [jobId, isLoading, pollCount]);

  // Handle timeout
  useEffect(() => {
    if (pollCount >= MAX_POLLS && isLoading) {
      setError('Prediction timed out. Please try again.');
      setIsLoading(false);
    }
  }, [pollCount, isLoading]);

  return {
    predict,
    isLoading,
    progress,
    error,
    result,
    reset
  };
}