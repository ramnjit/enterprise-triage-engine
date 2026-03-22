import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

const SCENARIOS = {
  rushedNote: "Patient is a 34yo male. Complains of severe throat pain for 3 days. Temp is 101.2. Rapid strep was positive. Prescribed Amoxicillin 500mg. Follow up in 5 days if no improvement.",
  ramblingEmail: "I fell off my bike yesterday and my wrist is super swollen. I think I need an x-ray. I have BlueCross insurance. Also my head hurts a little bit but I didn't hit it.",
  telehealthTranscript: "Yeah, so um, my stomach has been absolutely killing me since late last night. It's mostly down in the lower right side. I feel super nauseous and I threw up twice this morning. No fever that I know of, but I'm sweating a lot. I just have Aetna.",
  frontDeskWalkIn: "Patient walked in holding left arm. States he fell off a ladder, maybe 6 feet up. Obvious deformity to the forearm. Vitals taken at triage: BP 140/90, HR 110, Temp 98.6. Patient mentioned he takes Eliquis daily."
};

interface IngestionPaneProps {
  inputText: string;
  setInputText: (text: string) => void;
  isLoading: boolean;
  onProcess: () => void;
}

export default function IngestionPane({ inputText, setInputText, isLoading, onProcess }: IngestionPaneProps) {
  return (
    <div className="flex flex-col h-full p-6 rounded-2xl bg-slate-800/80 border border-slate-700 shadow-sm space-y-4">
      
      {/* Updated Title */}
      <h2 className="text-base font-semibold text-slate-100 uppercase tracking-widest">
        Doctor & Patient Notes
      </h2>
      
      <div className="bg-slate-900/40 border border-slate-700/50 rounded-xl p-4 flex flex-col gap-3">
        <span className="text-xs text-slate-300 uppercase font-semibold tracking-widest">
          Load Example Data:
        </span>
        <div className="flex gap-2 flex-wrap">
          <Button 
            variant="outline" size="sm" onClick={() => setInputText(SCENARIOS.rushedNote)} 
            className="bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 hover:text-emerald-300 rounded-md text-sm h-9 px-3 transition-colors"
          >
            Doctor Note
          </Button>
          <Button 
            variant="outline" size="sm" onClick={() => setInputText(SCENARIOS.frontDeskWalkIn)} 
            className="bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 hover:text-emerald-300 rounded-md text-sm h-9 px-3 transition-colors"
          >
            Walk-In Triage
          </Button>
          <Button 
            variant="outline" size="sm" onClick={() => setInputText(SCENARIOS.telehealthTranscript)} 
            className="bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 hover:text-emerald-300 rounded-md text-sm h-9 px-3 transition-colors"
          >
            Telehealth Transcript
          </Button>
          <Button 
            variant="outline" size="sm" onClick={() => setInputText(SCENARIOS.ramblingEmail)} 
            className="bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 hover:text-emerald-300 rounded-md text-sm h-9 px-3 transition-colors"
          >
            Patient Email
          </Button>
        </div>
      </div>

      <Textarea 
        placeholder="Paste raw clinical notes, patient emails, or transcriptions here..."
        className="flex-grow min-h-[160px] bg-slate-900/60 border-slate-700 text-slate-200 placeholder:text-slate-500 resize-none text-lg focus-visible:ring-slate-500 rounded-xl p-4 shadow-inner leading-relaxed"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
      />

      <div className="flex justify-center pt-2">
        <Button 
          onClick={onProcess} 
          disabled={!inputText || isLoading}
          className="px-10 py-6 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-full transition-colors w-full sm:w-auto shadow-lg shadow-blue-900/20 text-base"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="w-5 h-5 border-2 border-blue-200 border-t-white rounded-full animate-spin"></span>
              Processing...
            </span>
          ) : (
            "Run Extraction"
          )}
        </Button>
      </div>
    </div>
  );
}