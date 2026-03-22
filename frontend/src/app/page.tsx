'use client';

import { useState } from 'react';
import IngestionPane from '@/components/IngestionPane';
import OutputPane from '@/components/OutputPane';
import { useTriageStream } from '@/hooks/useTriageStream';

export default function TriageDashboard() {
  const [inputText, setInputText] = useState('');
  
  // Destructure the newly added 'error' state from our custom hook
  const { isLoading, triageData, error, processStream } = useTriageStream();

  return (
    <div className="min-h-screen bg-slate-900 p-4 md:p-8 text-slate-200">
      
      <div className="max-w-6xl mx-auto flex flex-col gap-6">
        
        {/* Navigation Bar */}
        <nav className="flex justify-between items-center pb-2">
          <a href="#" className="text-sm text-slate-400 hover:text-slate-200 flex items-center gap-2 transition-colors font-semibold">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
            Back to Portfolio
          </a>
          <a href="#" className="text-sm bg-purple-600 hover:bg-purple-500 text-white px-4 py-2.5 rounded-lg flex items-center gap-2 transition-colors font-bold shadow-sm border border-purple-500/20">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.45-1.15-1.11-1.46-1.11-1.46-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2Z"/></svg>
            View Source on GitHub
          </a>
        </nav>

        {/* Hiring Manager Context Header */}
        <header className="bg-slate-800/80 border border-slate-700 rounded-2xl p-6 md:p-8 shadow-sm flex flex-col gap-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4 flex-wrap">
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-100">
                AI Medical Scribe & Triage Engine
              </h1>
            </div>
          </div>
          
          <p className="text-slate-300 leading-relaxed text-sm md:text-base max-w-5xl">
            <strong className="text-slate-100 font-bold">Architecture Overview:</strong> Doctors and nurses shouldn't have to fight with manual data entry. This application solves that by turning messy, unstructured clinical text into clean, standardized EMR data. Built with a Next.js frontend and a secure Node.js backend, the system routes raw notes directly to OpenAI's API. Under the hood, it uses an Agentic LLM workflow with engineered system prompts and Zod schema validation to force OpenAI to return perfectly categorized JSON. That parsed data is then streamed back to the UI in real-time via Server-Sent Events (SSE).
          </p>
        </header>

        {/* The Two Panes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <IngestionPane 
            inputText={inputText} 
            setInputText={setInputText} 
            isLoading={isLoading} 
            onProcess={() => processStream(inputText)} 
          />
          <OutputPane 
            isLoading={isLoading} 
            triageData={triageData} 
            error={error} /* 2. Pass the error down to the UI component */
          />
        </div>

      </div>
    </div>
  );
}