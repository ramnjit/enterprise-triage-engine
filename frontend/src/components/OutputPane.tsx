import { Badge } from '@/components/ui/badge';
import { TriageResult } from '@/hooks/useTriageStream';

interface OutputPaneProps {
  isLoading: boolean;
  triageData: TriageResult | null;
  error?: string | null;
}

export default function OutputPane({ isLoading, triageData, error }: OutputPaneProps) {
  
  // Safe check to see if we actually extracted any demographic data
  const hasPatientInfo = triageData?.patientInfo && (
    triageData.patientInfo.age || 
    triageData.patientInfo.gender || 
    triageData.patientInfo.insurance
  );

  return (
    <div className="flex flex-col h-full p-6 rounded-2xl bg-slate-800/80 border border-slate-700 shadow-sm">
      
      <h2 className="text-base font-semibold text-slate-100 uppercase tracking-widest flex justify-between items-center mb-6">
        AI-Structured Triage Report
      </h2>
      
      <div className="flex-grow flex flex-col">

        {/* Graceful Error State */}
        {error && !isLoading && (
          <div className="flex-grow flex flex-col items-center justify-center text-red-400 space-y-4 py-10 bg-red-950/20 rounded-xl border border-red-900/50 mb-4 shadow-inner">
             <span className="text-3xl">⚠️</span>
             <p className="text-base font-medium text-center px-4">{error}</p>
          </div>
        )}

        {/* Empty State */}
        {!triageData && !isLoading && !error && (
          <div className="flex-grow flex flex-col items-center justify-center text-slate-500 space-y-4 py-10">
             <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="opacity-20"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/><path d="M16 18h.01"/></svg>
            <p className="text-base">No clinical data parsed yet.</p>
          </div>
        )}

        {/* Populated Data State */}
        {triageData && !error && (
          <div className="space-y-7 animate-in fade-in duration-500">
            
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-2">
              <div className="space-y-1">
                <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-widest">Calculated Triage Level</h3>
                {triageData.triageLevel ? (
                  <div className={`text-5xl font-bold flex items-center gap-2 
                    ${triageData.triageLevel === '1' || triageData.triageLevel === '2' ? 'text-red-400' : 
                      triageData.triageLevel === '3' ? 'text-amber-400' : 'text-emerald-400'}`}>
                    Level {triageData.triageLevel}
                  </div>
                ) : (
                  <div className="text-5xl font-bold text-slate-600">...</div>
                )}
              </div>
              
              {/* Conditional Rendering for Patient Info */}
              {hasPatientInfo ? (
                <div className="text-base text-slate-300 space-y-1.5 bg-slate-900/40 p-4 rounded-lg border border-slate-700/50 w-full md:w-auto shadow-inner">
                  {triageData.patientInfo?.age && <div>Age: <span className="text-slate-100 font-medium">{triageData.patientInfo.age}</span></div>}
                  {triageData.patientInfo?.gender && <div>Gender: <span className="text-slate-100 font-medium">{triageData.patientInfo.gender}</span></div>}
                  {triageData.patientInfo?.insurance && <div>Payer: <span className="text-slate-100 font-medium">{triageData.patientInfo.insurance}</span></div>}
                </div>
              ) : (
                <div className="text-sm text-slate-500 italic bg-slate-900/20 p-4 rounded-lg border border-slate-700/30 w-full md:w-auto flex items-center justify-center">
                  No patient demographics identified
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-700/50 shadow-inner">
                <span className="text-xs text-slate-300 uppercase font-semibold tracking-widest">Temperature</span>
                <div className="font-medium text-2xl mt-1 text-slate-100">{triageData.vitals?.temperature || '--'}</div>
              </div>
              <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-700/50 shadow-inner">
                <span className="text-xs text-slate-300 uppercase font-semibold tracking-widest">Blood Pressure</span>
                <div className="font-medium text-2xl mt-1 text-slate-100">{triageData.vitals?.bloodPressure || '--'}</div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <span className="text-xs text-slate-300 uppercase font-semibold tracking-widest block mb-3">Reported Symptoms</span>
                <div className="flex flex-wrap gap-2">
                  {triageData.symptoms?.map((sym: string, i: number) => (
                    <Badge key={i} variant="secondary" className="bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 px-3 py-1 text-sm font-medium transition-colors">
                      {sym}
                    </Badge>
                  ))}
                </div>
              </div>

              {triageData.systemAlerts && triageData.systemAlerts.length > 0 && (
                <div>
                  <span className="text-xs text-slate-300 uppercase font-semibold tracking-widest block mb-3">System Alerts</span>
                  <div className="flex flex-wrap gap-2">
                    {triageData.systemAlerts.map((alert: string, i: number) => (
                      <Badge key={i} variant="destructive" className="bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 px-3 py-1 text-sm font-medium transition-colors">
                        {alert}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {triageData.recommendedAction && (
              <div className="bg-blue-500/10 border-l-4 border-blue-500 p-5 rounded-r-xl mt-4">
                <span className="text-xs text-slate-300 uppercase font-semibold tracking-widest block mb-2">Recommended Action</span>
                <p className="text-base text-blue-100 font-medium leading-relaxed">{triageData.recommendedAction}</p>
              </div>
            )}
          </div>
        )}

        {/* Footer Subtext */}
        {(triageData || isLoading) && (
          <div className="mt-auto pt-8 flex justify-end">
            <span className="text-sm text-slate-500 font-medium flex items-center gap-1.5 opacity-80">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/></svg>
              Parsed by OpenAI
            </span>
          </div>
        )}

      </div>
    </div>
  );
}