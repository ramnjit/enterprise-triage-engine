import { useState } from 'react';

// Explicitly type payload to match the backend Zod schema
export interface TriageResult {
  patientInfo?: {
    age?: number | null;
    gender?: string | null;
    insurance?: string | null;
  };
  vitals?: {
    temperature?: number | null;
    bloodPressure?: string | null;
  };
  symptoms?: string[];
  triageLevel?: "1" | "2" | "3" | "4" | "5";
  systemAlerts?: string[];
  recommendedAction?: string;
}

export function useTriageStream() {
  const [isLoading, setIsLoading] = useState(false);
  // Remove the 'any' type and use our interface
  const [triageData, setTriageData] = useState<TriageResult | null>(null);
  // Add proper error state for the UI
  const [error, setError] = useState<string | null>(null);

  const processStream = async (inputText: string) => {
    setIsLoading(true);
    setTriageData(null);
    setError(null); 

    try {
      const response = await fetch('http://localhost:8080/api/triage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clinicalText: inputText }),
      });

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) throw new Error('Failed to initialize stream reader');

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const dataStr = line.replace('data: ', '').trim();
            if (dataStr) {
              try {
                const parsedData = JSON.parse(dataStr) as TriageResult;
                setTriageData(parsedData);
              } catch (e) {
                // Silently ignore incomplete JSON chunks during active streaming
              }
            }
          }
        }
      }
    } catch (err) {
      console.error("Triage stream failed:", err);
      setError("Unable to connect to the extraction engine. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, triageData, error, processStream };
}