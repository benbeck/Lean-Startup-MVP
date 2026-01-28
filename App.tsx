
import React, { useState, useEffect, useRef, useCallback } from 'react://esm.sh/react@19.2.4';
import { CanvasData, CanvasKey } from './types.ts';
import { CANVAS_SECTIONS, INITIAL_CANVAS_DATA } from './constants.ts';
import CanvasSection from './components/CanvasSection.tsx';
import { generateCanvasSuggestions } from './services/geminiService.ts';

const RowContainer = ({ children, isPrinting }: { children: React.ReactNode, isPrinting?: boolean }) => (
  <div className={`grid grid-cols-1 ${isPrinting ? 'gap-0' : 'md:grid-cols-2 gap-8 mb-8'} last:mb-0 w-full`}>
    {children}
  </div>
);

const App: React.FC = () => {
  const [data, setData] = useState<CanvasData>(() => {
    const saved = localStorage.getItem('lean_canvas_data');
    return saved ? JSON.parse(saved) : INITIAL_CANVAS_DATA;
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [ideaPrompt, setIdeaPrompt] = useState('');
  const [showAiModal, setShowAiModal] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem('lean_canvas_data', JSON.stringify(data));
  }, [data]);

  const updateField = useCallback((key: CanvasKey | 'projectName' | 'designedBy' | 'date' | 'version', value: string) => {
    setData(prev => ({ ...prev, [key]: value }));
  }, []);

  const handleAiFill = async () => {
    if (!ideaPrompt.trim()) return;
    setIsGenerating(true);
    try {
      const suggestions = await generateCanvasSuggestions(ideaPrompt);
      setData(prev => ({ ...prev, ...suggestions }));
      setShowAiModal(false);
    } catch (err) {
      alert("Failed to generate strategy. Please verify your connection.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExportPdf = useCallback(async () => {
    if (!canvasRef.current) return;
    
    setIsPrinting(true);
    window.scrollTo({ top: 0, behavior: 'auto' });

    setTimeout(() => {
      const element = document.getElementById('canvas-content');
      if (!element) {
        setIsPrinting(false);
        return;
      }

      const opt = {
        margin: [10, 10, 10, 10],
        filename: `${data.projectName.replace(/\s+/g, '_')}_MVP_Roadmap.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2, 
          useCORS: true,
          logging: false,
          letterRendering: true,
          scrollY: 0,
          windowWidth: 1200,
          backgroundColor: '#ffffff'
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
      };

      // @ts-ignore
      html2pdf().set(opt).from(element).save().then(() => {
        setIsPrinting(false);
      }).catch((err: any) => {
        console.error("PDF Export Error:", err);
        setIsPrinting(false);
      });
    }, 1500); 
  }, [data.projectName]);

  const getSection = (key: CanvasKey) => CANVAS_SECTIONS.find(s => s.id === key)!;

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#F9FAFB] text-slate-900">
      <header className="bg-white border-b border-slate-200 p-5 shadow-sm sticky top-0 z-50 flex flex-col sm:flex-row justify-between items-center gap-4 no-print">
        <div className="flex items-center gap-4">
          <div className="bg-[#0055FF] w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg">L</div>
          <h1 className="text-xl font-bold tracking-tight text-slate-800">Lean Startup MVP Roadmap</h1>
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={() => setShowAiModal(true)}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#0055FF] hover:bg-blue-700 text-white rounded-xl text-sm font-bold transition-all shadow-md active:scale-95"
          >
            <span>✨ Build MVP Roadmap</span>
          </button>
          <button 
            onClick={handleExportPdf}
            className="flex items-center gap-2 px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-bold transition-all active:scale-95"
          >
            <span>📥 Export PDF</span>
          </button>
          <button 
            onClick={() => { if(confirm("Clear roadmap?")) setData(INITIAL_CANVAS_DATA); }}
            className="flex items-center gap-2 px-4 py-2 text-slate-400 hover:text-slate-600 transition-colors text-sm font-medium"
          >
            <span>Reset</span>
          </button>
        </div>
      </header>

      <main className={`flex-1 flex flex-col items-center ${isPrinting ? 'p-0 bg-white' : 'p-6 sm:p-12'}`}>
        <div 
          id="canvas-content"
          ref={canvasRef}
          className={`w-full max-w-5xl flex flex-col transition-all duration-300 ${isPrinting ? 'bg-white p-4' : ''}`}
          style={isPrinting ? { height: 'auto', overflow: 'visible' } : {}}
        >
          <div className={`grid grid-cols-2 md:grid-cols-4 gap-8 mb-12 bg-white p-10 rounded-[2rem] border border-slate-100 shadow-sm ${isPrinting ? 'border-b-2 border-slate-200 mb-16 rounded-none' : ''}`}>
            <div>
              <label className="block text-[11px] uppercase font-bold text-slate-400 mb-2 tracking-widest">Company / Project</label>
              <input 
                className="w-full bg-slate-50 p-3.5 rounded-2xl border border-transparent hover:border-blue-100 focus:bg-white focus:border-[#0055FF] outline-none font-bold text-[15px] transition-all"
                value={data.projectName}
                placeholder="Ex: Acme Corp"
                onChange={(e) => updateField('projectName', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-[11px] uppercase font-bold text-slate-400 mb-2 tracking-widest">Architect</label>
              <input 
                className="w-full bg-slate-50 p-3.5 rounded-2xl border border-transparent hover:border-blue-100 focus:bg-white focus:border-[#0055FF] outline-none font-medium text-[15px] transition-all"
                value={data.designedBy}
                placeholder="Ex: Benjamin Beck"
                onChange={(e) => updateField('designedBy', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-[11px] uppercase font-bold text-slate-400 mb-2 tracking-widest">Launch Date</label>
              <input 
                type="date"
                className="w-full bg-slate-50 p-3.5 rounded-2xl border border-transparent hover:border-blue-100 focus:bg-white focus:border-[#0055FF] outline-none text-[15px] transition-all"
                value={data.date}
                onChange={(e) => updateField('date', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-[11px] uppercase font-bold text-slate-400 mb-2 tracking-widest">Iteration</label>
              <input 
                className="w-full bg-slate-50 p-3.5 rounded-2xl border border-transparent hover:border-blue-100 focus:bg-white focus:border-[#0055FF] outline-none text-[15px] transition-all"
                value={data.version}
                placeholder="v1.0"
                onChange={(e) => updateField('version', e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col w-full">
            <RowContainer isPrinting={isPrinting}>
              <CanvasSection metadata={getSection('tam')} value={data.tam} onChange={(v) => updateField('tam', v)} isPrinting={isPrinting} />
              <CanvasSection metadata={getSection('hypothesis')} value={data.hypothesis} onChange={(v) => updateField('hypothesis', v)} isPrinting={isPrinting} />
            </RowContainer>

            <RowContainer isPrinting={isPrinting}>
              <CanvasSection metadata={getSection('problems')} value={data.problems} onChange={(v) => updateField('problems', v)} isPrinting={isPrinting} />
              <CanvasSection metadata={getSection('alternatives')} value={data.alternatives} onChange={(v) => updateField('alternatives', v)} isPrinting={isPrinting} />
            </RowContainer>
            
            <RowContainer isPrinting={isPrinting}>
              <CanvasSection metadata={getSection('solution')} value={data.solution} onChange={(v) => updateField('solution', v)} isPrinting={isPrinting} />
              <CanvasSection metadata={getSection('metrics')} value={data.metrics} onChange={(v) => updateField('metrics', v)} isPrinting={isPrinting} />
            </RowContainer>

            <RowContainer isPrinting={isPrinting}>
              <CanvasSection metadata={getSection('uvp')} value={data.uvp} onChange={(v) => updateField('uvp', v)} isPrinting={isPrinting} />
              <CanvasSection metadata={getSection('concept')} value={data.concept} onChange={(v) => updateField('concept', v)} isPrinting={isPrinting} />
            </RowContainer>

            <RowContainer isPrinting={isPrinting}>
              <CanvasSection metadata={getSection('advantage')} value={data.advantage} onChange={(v) => updateField('advantage', v)} isPrinting={isPrinting} />
              <CanvasSection metadata={getSection('channels')} value={data.channels} onChange={(v) => updateField('channels', v)} isPrinting={isPrinting} />
            </RowContainer>

            <RowContainer isPrinting={isPrinting}>
              <CanvasSection metadata={getSection('segments')} value={data.segments} onChange={(v) => updateField('segments', v)} isPrinting={isPrinting} />
              <CanvasSection metadata={getSection('adopters')} value={data.adopters} onChange={(v) => updateField('adopters', v)} isPrinting={isPrinting} />
            </RowContainer>

            <RowContainer isPrinting={isPrinting}>
              <CanvasSection metadata={getSection('costs')} value={data.costs} onChange={(v) => updateField('costs', v)} isPrinting={isPrinting} />
              <CanvasSection metadata={getSection('revenue')} value={data.revenue} onChange={(v) => updateField('revenue', v)} isPrinting={isPrinting} />
            </RowContainer>
          </div>
        </div>

        <div className="no-print flex flex-col items-center gap-6 py-16 mb-16">
            <button 
              onClick={handleExportPdf}
              disabled={isGenerating || isPrinting}
              className="group flex items-center gap-4 px-16 py-7 bg-[#0055FF] hover:bg-blue-700 text-white rounded-[2.5rem] font-black text-2xl transition-all shadow-2xl shadow-blue-200 active:scale-95 disabled:opacity-50"
            >
              <span>{isPrinting ? 'Rendering Report...' : 'Download MVP Roadmap PDF'}</span>
            </button>
            <p className="text-slate-400 text-sm font-bold uppercase tracking-[0.3em]">Built for Speed & Strategy</p>
        </div>
      </main>

      {showAiModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[3rem] shadow-3xl w-full max-w-2xl overflow-hidden border border-slate-100 animate-in fade-in zoom-in duration-300">
            <div className="p-12">
              <div className="flex justify-between items-center mb-10">
                <div className="flex flex-col">
                  <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Build MVP Roadmap</h2>
                  <p className="text-slate-400 font-medium text-lg mt-1">Transform your vision into a data-backed plan.</p>
                </div>
                <button onClick={() => setShowAiModal(false)} className="bg-slate-50 w-12 h-12 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors border border-slate-100">✕</button>
              </div>
              <textarea 
                value={ideaPrompt}
                onChange={(e) => setIdeaPrompt(e.target.value)}
                placeholder="Describe your business idea... Ex: A platform for connecting freelance data scientists with medical researchers."
                className="w-full h-48 p-8 bg-slate-50 border border-slate-100 rounded-[2rem] focus:ring-4 focus:ring-blue-500/10 outline-none text-slate-800 text-xl leading-relaxed resize-none mb-10"
              />
              <div className="flex gap-4">
                <button onClick={() => setShowAiModal(false)} className="flex-1 py-5 px-8 rounded-[1.5rem] font-bold text-slate-500 hover:bg-slate-50 transition-all">Close</button>
                <button 
                  onClick={handleAiFill}
                  disabled={isGenerating || !ideaPrompt.trim()}
                  className="flex-[2] py-5 px-10 rounded-[1.5rem] font-black bg-[#0055FF] hover:bg-blue-700 text-white disabled:opacity-50 shadow-xl shadow-blue-200 transition-all text-xl"
                >
                  {isGenerating ? 'Architecting...' : 'Build MVP Roadmap'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <footer className="bg-white border-t border-slate-100 p-12 text-center text-sm text-slate-500 no-print font-medium">
        Lean Startup MVP Roadmap Built by {' '}
        <a href="https://benjaminbeck.com" target="_blank" rel="noopener noreferrer" className="text-[#0055FF] font-bold hover:underline">
          Benjamin Beck
        </a>, owner of {' '}
        <a href="https://onlinestampede.com" target="_blank" rel="noopener noreferrer" className="text-[#0055FF] font-bold hover:underline">
          Online Stampede
        </a>
      </footer>
    </div>
  );
};

export default App;
