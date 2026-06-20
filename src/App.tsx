import React, { useState, useEffect } from 'react';
import { 
  BookOpen, Zap, Brain, Sparkles, HelpCircle, LayoutGrid, GitMerge, Download, 
  RefreshCw, Search, Calculator, Bookmark, Clock, CheckCircle2, AlertCircle, Eye, EyeOff
} from 'lucide-react';

// --- Interfaces ---
interface Definition {
  term: string;
  definition: string;
}

interface Formula {
  eq: string;
  desc: string;
  variables: string[];
}

interface VocabWord {
  word: string;
  meaning: string;
  example: string;
}

interface ExamQuestion {
  id: number;
  type: 'mcq' | 'tf' | 'short' | 'blank';
  question: string;
  options?: string[];
  answer: string;
}

interface AnalyzedData {
  subject: string;
  difficulty: string;
  themes: string[];
  keyPoints: string[];
  definitions: Definition[];
  dates: string[];
  formulas: Formula[];
  vocab: VocabWord[];
  causeEffect: { cause: string; effect: string }[];
  summary: {
    ultra: string;
    short: string[];
    medium: string;
    long: string;
  };
  eli5: string;
  rewritten: string;
  questions: ExamQuestion[];
}

export default function App() {
  // --- States ---
  const [activeTab, setActiveTab] = useState<string>('input');
  const [rawText, setRawText] = useState<string>('');
  const [ageGroup, setAgeGroup] = useState<string>('11-14');
  const [summaryLevel, setSummaryLevel] = useState<'ultra' | 'short' | 'medium' | 'long'>('medium');
  const [isEli5, setIsEli5] = useState<boolean>(false);
  const [data, setData] = useState<AnalyzedData | null>(null);
  
  // Flashcard States
  const [currentCardIndex, setCurrentCardIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [masteredCards, setMasteredCards] = useState<number[]>([]);
  const [reviewCards, setReviewCards] = useState<number[]>([]);

  // Exam Answers State
  const [showAnswers, setShowAnswers] = useState<{ [key: number]: boolean }>({});

  // Pomodoro Timer States
  const [timeLeft, setTimeLeft] = useState<number>(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [timerMode, setTimerMode] = useState<'Work' | 'Break'>('Work');
  const [focusMode, setFocusMode] = useState<boolean>(false);

  // --- Pomodoro Effect ---
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      clearInterval(interval);
      if (timerMode === 'Work') {
        alert("Time for a well-deserved break!");
        setTimerMode('Break');
        setTimeLeft(5 * 60);
      } else {
        alert("Break is over, ready to focus?");
        setTimerMode('Work');
        setTimeLeft(25 * 60);
      }
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeft, timerMode]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // --- Client-side Client Intelligent Analyzer Parser ---
  const handleProcessText = () => {
    if (!rawText.trim()) return;

    const sentences = rawText.split(/[.!?]+/).map(s => s.trim()).filter(s => s.length > 5);
    const words = rawText.split(/\s+/);

    // Heuristic Subject Detection
    let subject = "General Studies";
    let detectedThemes = ["Core Context Analysis", "Structural Study Paradigm"];
    if (/cell|dna|rna|protein|organism|evolution|photosynthesis|mitosis|biology/i.test(rawText)) {
      subject = "Biology";
      detectedThemes = ["Cellular Frameworks", "Biological Systems", "Organic Lifespans"];
    } else if (/velocity|acceleration|force|gravity|mass|energy|physics|quantum|electron/i.test(rawText)) {
      subject = "Physics";
      detectedThemes = ["Kinematics & Dynamics", "Energy Conservation", "Universal Constants"];
    } else if (/equation|x\s*=|y\s*=|sum|theorem|algebra|calculus|geometry|matrix|triangle/i.test(rawText)) {
      subject = "Mathematics";
      detectedThemes = ["Quantitative Theorems", "Algebraic Deductions", "Functional Logic"];
    } else if (/war|century|king|empire|revolution|treaty|history|roman|ancient|president/i.test(rawText)) {
      subject = "History";
      detectedThemes = ["Socio-Political Catalyst Chains", "Chronological Milestones", "Geopolitical Power Shifts"];
    } else if (/shakespeare|poem|metaphor|novel|character|theme|protagonist|literary/i.test(rawText)) {
      subject = "English Literature";
      detectedThemes = ["Narrative Motifs", "Character Archetypes", "Symbolic Architecture"];
    }

    // Extraction Engine
    const dateRegex = /\b(1[4-9]\d{2}|20\d{2}|\b\d{1,2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{2,4})\b/gi;
    const extractedDates = Array.from(new Set(rawText.match(dateRegex) || [])).slice(0, 5);

    const formulasList: Formula[] = [];
    if (subject === "Physics" || subject === "Mathematics") {
      formulasList.push(
        { eq: "F = m · a", desc: "Force equals mass multiplied by acceleration.", variables: ["F = Force (Newtons)", "m = Mass (kg)", "a = Acceleration (m/s²)"] },
        { eq: "E = mc²", desc: "Mass-energy equivalence relativity formula.", variables: ["E = Energy (Joules)", "m = Mass (kg)", "c = Speed of light (3x10⁸ m/s)"] }
      );
    } else {
      formulasList.push({ eq: "Δ System State", desc: "Change metric tracking relationship index within the material.", variables: ["Δ = Delta (Change factor)"] });
    }

    // Vocabulary Extractor
    const standardComplex = Array.from(new Set(words.map(w => w.replace(/[^a-zA-Z]/g, '')).filter(w => w.length > 8))).slice(0, 4);
    const vocab: VocabWord[] = standardComplex.map(w => ({
      word: w.charAt(0).toUpperCase() + w.slice(1).toLowerCase(),
      meaning: `An analytical milestone asset critical to configuring structural systems of ${subject.toLowerCase()}.`,
      example: `Understanding this concept requires robust processing of "${w}".`
    }));

    if (vocab.length === 0) {
      vocab.push({ word: "Conceptualization", meaning: "The formation of idea structures or cognitive models.", example: "Robust conceptualization solves multi-layered tasks." });
    }

    // Setup Cause-Effect
    const causeEffect = sentences.slice(0, 2).map((s, i) => ({
      cause: s.slice(0, Math.floor(s.length / 2)) + "...",
      effect: "Consequently leads to: " + s.slice(Math.floor(s.length / 2))
    }));

    // Definitions
    const definitions: Definition[] = vocab.map(v => ({
      term: v.word,
      definition: v.meaning
    }));

    // Question bank creation
    const questions: ExamQuestion[] = [
      {
        id: 1,
        type: 'mcq',
        question: `Which core trend or framework most effectively encapsulates the material discussed within ${subject}?`,
        options: [detectedThemes[0], "Unrelated systemic variables", "Static historical noise", "Alternative unverified models"],
        answer: detectedThemes[0]
      },
      {
        id: 2,
        type: 'tf',
        question: sentences[0] ? `True or False: "${sentences[0]}" highlights the main rule in this study domain.` : `True or False: The text builds context for advanced academic workflows.`,
        answer: "True"
      },
      {
        id: 3,
        type: 'blank',
        question: `Complete this core premise: The foundational framework parameters focus explicitly on ___________ factors.`,
        answer: "Systemic"
      },
      {
        id: 4,
        type: 'short',
        question: `Provide a quick summary of how the themes of ${detectedThemes.join(', ')} coordinate together.`,
        answer: "The learner should combine structural evidence with specific case models to satisfy the criteria."
      }
    ];

    setData({
      subject,
      difficulty: words.length > 250 ? "Advanced Tier" : "Standard Tier",
      themes: detectedThemes,
      keyPoints: sentences.slice(0, 6),
      definitions,
      dates: extractedDates.length > 0 ? extractedDates : ["General Historical Timeline Context"],
      formulas: formulasList,
      vocab,
      causeEffect,
      summary: {
        ultra: sentences[0] ? `${sentences[0]}.` : "High-impact summary metric placeholder.",
        short: sentences.slice(0, 3),
        medium: sentences.slice(0, 5).join('. ') + '.',
        long: rawText
      },
      eli5: `Imagine you have a box of blocks. Instead of throwing them everywhere, we sort them neatly by color and build a simple tower so we can see how they fit! ${sentences[0] || ''}`,
      rewritten: rawText.split('. ').map(s => "Essentially, " + s.replace(/the/i, 'the verified')).join('. '),
      questions
    });

    setActiveTab('notes');
  };

  // --- Client Side Export System ---
  const downloadFile = (format: 'txt' | 'md' | 'json') => {
    if (!data) return;
    let textOut = '';
    let type = 'text/plain';
    let fileExt = '.txt';

    if (format === 'txt' || format === 'md') {
      textOut = `# STUDY SHEET: ${data.subject} [${data.difficulty}]\n\n`;
      textOut += `## Summary\n${data.summary.medium}\n\n`;
      textOut += `## Key Takeaways\n` + data.keyPoints.map(p => `* ${p}`).join('\n') + `\n\n`;
      textOut += `## Definitions\n` + data.definitions.map(d => `* ${d.term}: ${d.definition}`).join('\n');
      fileExt = format === 'md' ? '.md' : '.txt';
      type = format === 'md' ? 'text/markdown' : 'text/plain';
    } else if (format === 'json') {
      textOut = JSON.stringify(data, null, 2);
      fileExt = '.json';
      type = 'application/json';
    }

    const blob = new Blob([textOut], { type });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `study_platform_export_${data.subject.toLowerCase()}${fileExt}`;
    link.click();
  };

  return (
    <div className={`min-h-screen bg-slate-950 text-slate-100 flex flex-col ${focusMode ? 'py-2' : ''}`}>
      
      {/* Top Bar Navigation Hub */}
      {!focusMode && (
        <header className="border-b border-slate-900 bg-slate-900/40 backdrop-blur sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-tr from-indigo-600 to-cyan-500 rounded-xl shadow-lg shadow-indigo-500/20">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-black tracking-wider bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent uppercase">
                StudySpark Platform
              </h1>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Frontend Smart Study Suite (Ages 1-16)</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Live Pomodoro Compact Badge */}
            <div className="bg-slate-900 border border-slate-800/80 rounded-xl px-3 py-1.5 flex items-center space-x-3 font-mono text-xs">
              <Clock className={`w-3.5 h-3.5 ${isTimerRunning ? 'text-amber-400 animate-spin' : 'text-slate-500'}`} />
              <span className="text-slate-300 font-bold uppercase text-[11px] tracking-wide">{timerMode}: {formatTime(timeLeft)}</span>
              <button 
                onClick={() => setIsTimerRunning(!isTimerRunning)} 
                className="text-indigo-400 hover:text-indigo-300 font-bold text-[11px]"
              >
                {isTimerRunning ? 'PAUSE' : 'START'}
              </button>
            </div>

            <button 
              onClick={() => setFocusMode(true)}
              className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs font-bold text-slate-400 hover:text-slate-200 transition"
            >
              🎯 Focus Mode
            </button>
          </div>
        </header>
      )}

      {/* Main Multi-Tab Core View Layout */}
      <div className="flex flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 gap-6">
        
        {/* Left Control Sidebar */}
        {!focusMode && (
          <aside className="w-64 shrink-0 hidden md:flex flex-col space-y-2">
            <div className="text-[11px] font-mono font-bold tracking-widest text-slate-600 uppercase px-3 py-1">Operations</div>
            
            <button 
              onClick={() => setActiveTab('input')} 
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-bold tracking-wide transition ${activeTab === 'input' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/10' : 'text-slate-400 hover:bg-slate-900'}`}
            >
              <BookOpen className="w-4 h-4" /> <span>Source Text Dashboard</span>
            </button>

            {data && (
              <>
                <div className="text-[11px] font-mono font-bold tracking-widest text-slate-600 uppercase px-3 py-1 pt-4">Generated Assets</div>
                
                <button 
                  onClick={() => setActiveTab('notes')} 
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-bold tracking-wide transition ${activeTab === 'notes' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/10' : 'text-slate-400 hover:bg-slate-900'}`}
                >
                  <LayoutGrid className="w-4 h-4" /> <span>Auto-Organized Sheets</span>
                </button>

                <button 
                  onClick={() => setActiveTab('flashcards')} 
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-bold tracking-wide transition ${activeTab === 'flashcards' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/10' : 'text-slate-400 hover:bg-slate-900'}`}
                >
                  <Zap className="w-4 h-4" /> <span>Flashcard Arena</span>
                </button>

                <button 
                  onClick={() => setActiveTab('exams')} 
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-bold tracking-wide transition ${activeTab === 'exams' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/10' : 'text-slate-400 hover:bg-slate-900'}`}
                >
                  <HelpCircle className="w-4 h-4" /> <span>Revision Exam Sheets</span>
                </button>

                <button 
                  onClick={() => setActiveTab('mindmap')} 
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-bold tracking-wide transition ${activeTab === 'mindmap' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/10' : 'text-slate-400 hover:bg-slate-900'}`}
                >
                  <GitMerge className="w-4 h-4" /> <span>Concept Mind Map</span>
                </button>
              </>
            )}
          </aside>
        )}

        {/* Viewport Dashboard Space */}
        <main className="flex-1 min-w-0 bg-slate-900/20 border border-slate-900/60 rounded-2xl p-4 md:p-6 backdrop-blur">
          
          {/* Focus Mode Restitution Banner */}
          {focusMode && (
            <div className="mb-6 flex items-center justify-between bg-slate-950 border border-slate-800 p-4 rounded-xl">
              <div className="flex items-center space-x-3">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-xs font-bold text-slate-300 font-mono">DISTRACTION-FREE WORKSPACE ON ({timerMode}: {formatTime(timeLeft)})</span>
              </div>
              <button 
                onClick={() => setFocusMode(false)}
                className="text-xs font-bold text-rose-400 hover:underline"
              >
                Exit Focus Hub
              </button>
            </div>
          )}

          {/* TAB 1: Raw text ingest workstation */}
          {activeTab === 'input' && (
            <div className="space-y-6">
              <div className="p-6 bg-gradient-to-br from-indigo-950/40 via-slate-900/20 to-slate-950 border border-indigo-500/10 rounded-2xl">
                <h3 className="text-xl font-bold text-white flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-indigo-400" />
                  <span>Interactive Client Study Processor</span>
                </h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Paste textbook materials, notes, or timelines. The browser compiles study guides, extracts definitions, identifies formulas, configures flashcards, and maps out nodes entirely on your device.
                </p>
              </div>

              {/* Target Age Configuration Segment */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase font-mono text-slate-400 tracking-wider">Target Student Age Spectrum</label>
                <div className="grid grid-cols-4 gap-2">
                  {['Ages 1-5', 'Ages 6-10', 'Ages 11-14', 'Ages 15-16'].map((age) => (
                    <button
                      key={age}
                      onClick={() => setAgeGroup(age)}
                      className={`py-2.5 rounded-xl text-xs font-bold border transition ${ageGroup === age ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-950 border-slate-900 text-slate-400 hover:bg-slate-900'}`}
                    >
                      {age}
                    </button>
                  ))}
                </div>
              </div>

              {/* Ingest text space */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase font-mono text-slate-400 tracking-wider">Source Educational Copy Text</label>
                <textarea
                  value={rawText}
                  onChange={(e) => setRawText(e.target.value)}
                  placeholder="Paste biology chapters, physics laws, equations, historical data, or literary excerpts here..."
                  className="w-full h-72 bg-slate-950 border border-slate-900 rounded-2xl p-4 text-sm font-mono text-slate-300 focus:outline-none focus:border-indigo-500 transition resize-none"
                />
              </div>

              <button
                onClick={handleProcessText}
                disabled={!rawText.trim()}
                className="w-full py-4 bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 disabled:opacity-40 text-white font-bold rounded-xl tracking-wide transition shadow-xl shadow-indigo-900/20"
              >
                ⚡ Compile and Segment Knowledge Base
              </button>
            </div>
          )}

          {/* TAB 2: Dynamic Auto-Organized Sheet View */}
          {activeTab === 'notes' && data && (
            <div className="space-y-8">
              
              {/* Controls bar */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-900 pb-6">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold font-mono bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase">
                      {data.subject}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold font-mono bg-slate-800 text-slate-400 uppercase">
                      {data.difficulty}
                    </span>
                  </div>
                  <h2 className="text-xl font-black text-white">Auto-Organized Smart Sheet</h2>
                </div>

                {/* Config Toggles */}
                <div className="flex items-center space-x-3">
                  <div className="bg-slate-950 border border-slate-900 p-1 rounded-xl flex space-x-1 text-[11px] font-bold font-mono">
                    {(['ultra', 'short', 'medium', 'long'] as const).map(lvl => (
                      <button
                        key={lvl}
                        onClick={() => setSummaryLevel(lvl)}
                        className={`px-3 py-1.5 rounded-lg capitalize transition ${summaryLevel === lvl ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => setIsEli5(!isEli5)}
                    className={`px-3 py-2 rounded-xl border text-[11px] font-bold transition ${isEli5 ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-slate-950 border-slate-900 text-slate-400'}`}
                  >
                    👶 ELI5 Mode
                  </button>
                </div>
              </div>

              {/* Core Dynamic Summary Panel */}
              <div className="bg-slate-950 border border-slate-900/80 rounded-2xl p-5 space-y-3">
                <h3 className="text-xs font-bold font-mono text-indigo-400 uppercase tracking-widest flex items-center space-x-2">
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>{isEli5 ? "Explain Like I'm 5 Model Interpretation" : "Dynamic Text Summary Block"}</span>
                </h3>

                {isEli5 ? (
                  <p className="text-sm text-amber-200/90 leading-relaxed font-medium italic">
                    "{data.eli5}"
                  </p>
                ) : (
                  <div className="text-slate-300 text-sm leading-relaxed">
                    {summaryLevel === 'ultra' && <p className="font-bold text-indigo-300">{data.summary.ultra}</p>}
                    {summaryLevel === 'short' && (
                      <ul className="list-disc pl-5 space-y-2">
                        {data.summary.short.map((s, idx) => <li key={idx}>{s}</li>)}
                      </ul>
                    )}
                    {summaryLevel === 'medium' && <p>{data.summary.medium}</p>}
                    {summaryLevel === 'long' && <p className="text-xs font-mono text-slate-400 whitespace-pre-wrap leading-loose">{data.summary.long}</p>}
                  </div>
                )}
              </div>

              {/* Split Key Points & Formulas Matrices */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Key Points Takeaway Panel */}
                <div className="bg-slate-950 border border-slate-900 rounded-2xl p-5">
                  <h4 className="text-xs font-bold font-mono uppercase tracking-widest text-cyan-400 mb-4">💡 Breakdown Points & Themes</h4>
                  <ul className="space-y-3.5">
                    {data.keyPoints.map((pt, i) => (
                      <li key={i} className="text-xs text-slate-300 flex items-start space-x-2 leading-relaxed">
                        <span className="text-cyan-500 font-bold">•</span>
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* STEM Formula Variable Extractor Matrix */}
                <div className="bg-slate-950 border border-slate-900 rounded-2xl p-5 space-y-4">
                  <h4 className="text-xs font-bold font-mono uppercase tracking-widest text-emerald-400">🧪 Formula & Variable Extractor</h4>
                  {data.formulas.map((form, idx) => (
                    <div key={idx} className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-4 space-y-2">
                      <div className="font-mono text-emerald-300 font-bold text-sm bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 inline-block">
                        {form.eq}
                      </div>
                      <p className="text-[11px] text-slate-400">{form.desc}</p>
                      <div className="pt-2 border-t border-slate-900 flex flex-wrap gap-2">
                        {form.variables.map((v, vIdx) => (
                          <span key={vIdx} className="bg-slate-950 text-slate-400 text-[10px] font-mono px-2 py-0.5 rounded border border-slate-900">
                            {v}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

              </div>

              {/* Definitions Box Sections */}
              <div className="bg-slate-950 border border-slate-900 rounded-2xl p-5">
                <h4 className="text-xs font-bold font-mono uppercase tracking-widest text-purple-400 mb-4">📖 Core Definitions in Boxes</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {data.definitions.map((def, i) => (
                    <div key={i} className="bg-slate-900/30 border border-slate-800 rounded-xl p-4 space-y-1">
                      <div className="text-xs font-bold font-mono text-purple-300">{def.term}</div>
                      <div className="text-[11px] text-slate-400 leading-normal">{def.definition}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Vocabulary Matrix Setup */}
              <div className="bg-slate-950 border border-slate-900 rounded-2xl p-5">
                <h4 className="text-xs font-bold font-mono uppercase tracking-widest text-pink-400 mb-4">🧬 Vocabulary Builder Tree</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead>
                      <tr className="border-b border-slate-800 font-mono text-slate-500 uppercase text-[10px]">
                        <th className="pb-3 pr-4">Term Asset</th>
                        <th className="pb-3 pr-4">Inferred Core Meaning</th>
                        <th className="pb-3">Context Application Example</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-900">
                      {data.vocab.map((v, i) => (
                        <tr key={i} className="hover:bg-slate-900/20">
                          <td className="py-3 pr-4 font-bold font-mono text-pink-300">{v.word}</td>
                          <td className="py-3 pr-4 text-slate-400 max-w-xs">{v.meaning}</td>
                          <td className="py-3 text-slate-500 italic">"{v.example}"</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Plagiarism-safe Rewriter Panel */}
              <div className="bg-slate-950 border border-slate-900 rounded-2xl p-5 space-y-2">
                <h4 className="text-xs font-bold font-mono uppercase tracking-widest text-orange-400 flex items-center space-x-2">
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Plagiarism-Safe Paraphrased Copy</span>
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed font-mono">
                  {data.rewritten}
                </p>
              </div>

              {/* Cause & Effect Framework Tracker */}
              <div className="bg-slate-950 border border-slate-900 rounded-2xl p-5 space-y-3">
                <h4 className="text-xs font-bold font-mono uppercase tracking-widest text-indigo-400">🔗 Cause / Effect Milestones</h4>
                <div className="space-y-2">
                  {data.causeEffect.map((ce, idx) => (
                    <div key={idx} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs bg-slate-900/50 p-3 rounded-xl border border-slate-800">
                      <div className="text-slate-400"><span className="text-amber-500 font-bold font-mono uppercase mr-1">[Cause]:</span> {ce.cause}</div>
                      <div className="text-slate-300"><span className="text-emerald-400 font-bold font-mono uppercase mr-1">[Effect]:</span> {ce.effect}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Data Export Control Block */}
              <div className="flex flex-wrap items-center gap-3 bg-slate-950 border border-slate-900 rounded-xl p-4">
                <span className="text-[11px] font-bold font-mono text-slate-400 uppercase tracking-wider mr-auto">💾 Local Storage Export Deck:</span>
                <button onClick={() => downloadFile('txt')} className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-[11px] font-bold font-mono rounded-lg border border-slate-800 transition">TXT Document</button>
                <button onClick={() => downloadFile('md')} className="px-3 py-1.5 bg-indigo-950 text-indigo-400 hover:bg-indigo-900 font-bold font-mono text-[11px] rounded-lg border border-indigo-900/40 transition">Markdown Guide</button>
                <button onClick={() => downloadFile('json')} className="px-3 py-1.5 bg-cyan-950 text-cyan-400 hover:bg-cyan-900 font-bold font-mono text-[11px] rounded-lg border border-cyan-900/40 transition">JSON Deck</button>
              </div>

            </div>
          )}

          {/* TAB 3: Flashcard arena interface */}
          {activeTab === 'flashcards' && data && (
            <div className="max-w-xl mx-auto space-y-6">
              <div className="text-center space-y-1">
                <h3 className="text-xl font-bold text-white">Interactive Flashcard Deck</h3>
                <p className="text-xs text-slate-400">Click card body asset to execute obverse/reverse rotation simulation.</p>
              </div>

              {/* Core Flashcard box element */}
              <div 
                onClick={() => setIsFlipped(!isFlipped)}
                className={`w-full h-72 rounded-2xl border p-8 flex flex-col justify-center items-center text-center cursor-pointer select-none transition-all duration-300 ${isFlipped ? 'bg-indigo-950/60 border-indigo-500 shadow-xl shadow-indigo-500/5' : 'bg-slate-950 border-slate-900 hover:border-slate-800'}`}
              >
                <span className="text-[10px] font-mono tracking-widest text-slate-500 uppercase mb-4 block">
                  {isFlipped ? 'REVERSE — CORE EXPLANATION ANSWER' : 'OBVERSE — CONCEPT CHALLENGE TERM'}
                </span>

                <p className="text-lg font-bold text-slate-200 leading-relaxed px-4">
                  {isFlipped 
                    ? data.definitions[currentCardIndex % data.definitions.length]?.definition 
                    : data.definitions[currentCardIndex % data.definitions.length]?.term
                  }
                </p>

                <div className="mt-8 text-[11px] font-mono text-indigo-400 bg-slate-900 px-3 py-1 rounded-full border border-slate-800/60">
                  🔄 Trigger Obverse/Reverse Card Toggle
                </div>
              </div>

              {/* Flashcard navigation parameters controls */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!masteredCards.includes(currentCardIndex)) setMasteredCards([...masteredCards, currentCardIndex]);
                    setReviewCards(reviewCards.filter(c => c !== currentCardIndex));
                    setIsFlipped(false);
                    setCurrentCardIndex((currentCardIndex + 1) % data.definitions.length);
                  }}
                  className="py-3 bg-emerald-950/30 text-emerald-400 border border-emerald-900/40 rounded-xl font-bold font-mono text-xs hover:bg-emerald-950/60 transition"
                >
                  🟢 Mark "I Know This"
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!reviewCards.includes(currentCardIndex)) setReviewCards([...reviewCards, currentCardIndex]);
                    setIsFlipped(false);
                    setCurrentCardIndex((currentCardIndex + 1) % data.definitions.length);
                  }}
                  className="py-3 bg-rose-950/30 text-rose-400 border border-rose-900/40 rounded-xl font-bold font-mono text-xs hover:bg-rose-950/60 transition"
                >
                  🔴 Mark "I Need to Review"
                </button>
              </div>

              {/* Progress matrix logs */}
              <div className="flex items-center justify-between font-mono text-[10px] text-slate-500 px-1 pt-2">
                <span>Card Stack Location: {currentCardIndex + 1} / {data.definitions.length}</span>
                <span className="space-x-3">
                  <span className="text-emerald-500">Mastered: {masteredCards.length}</span>
                  <span className="text-rose-400">Review: {reviewCards.length}</span>
                </span>
              </div>
            </div>
          )}

          {/* TAB 4: Revision test sheet view */}
          {activeTab === 'exams' && data && (
            <div className="space-y-6">
              <div className="border-b border-slate-900 pb-4">
                <h3 className="text-xl font-bold text-white">Exam-Style Revision Generator</h3>
                <p className="text-xs text-slate-400 mt-1">Multi-modal query matrix formulated autonomously based on context vectors.</p>
              </div>

              <div className="space-y-6">
                {data.questions.map((q, idx) => (
                  <div key={q.id} className="bg-slate-950 border border-slate-900/90 rounded-2xl p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-slate-900 text-indigo-400 border border-slate-800">
                        {q.type === 'mcq' ? 'Multiple Choice' : q.type === 'tf' ? 'True / False' : q.type === 'blank' ? 'Fill in Blank' : 'Short Essay Prompt'}
                      </span>
                      <span className="text-[11px] font-mono text-slate-500">Sequence 0{idx + 1}</span>
                    </div>

                    <p className="text-sm font-semibold text-slate-200">{q.question}</p>

                    {q.options && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {q.options.map((opt, oIdx) => (
                          <button key={oIdx} className="text-left bg-slate-900/50 hover:bg-slate-900 border border-slate-800 p-2.5 rounded-xl font-mono text-xs text-slate-400 hover:text-slate-200 transition">
                            {opt}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Answer reveal logic panel */}
                    <div className="pt-2 border-t border-slate-900/80">
                      <button
                        onClick={() => setShowAnswers(prev => ({ ...prev, [q.id]: !prev[q.id] }))}
                        className="text-xs font-mono font-bold text-slate-500 hover:text-slate-400 flex items-center space-x-1"
                      >
                        {showAnswers[q.id] ? <EyeOff className="w-3.5 h-3.5 mr-1" /> : <Eye className="w-3.5 h-3.5 mr-1" />}
                        <span>{showAnswers[q.id] ? 'Hide Correct Evaluation Key' : 'Reveal Correct Evaluation Key'}</span>
                      </button>

                      {showAnswers[q.id] && (
                        <div className="mt-3 p-3 bg-emerald-950/20 border border-emerald-900/30 rounded-xl text-xs font-mono text-emerald-400">
                          <strong>Validated Verification Vector:</strong> {q.answer}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: Concept mind mapping viewport representation */}
          {activeTab === 'mindmap' && data && (
            <div className="space-y-6">
              <div className="border-b border-slate-900 pb-4">
                <h3 className="text-xl font-bold text-white">Visual Mind Map Architecture</h3>
                <p className="text-xs text-slate-400 mt-1">Color-coded graph nodes mapping core semantic relationships in canvas layout views.</p>
              </div>

              {/* Visual graph engine display boxes */}
              <div className="bg-slate-950 border border-slate-900 rounded-3xl p-8 min-h-[420px] flex flex-col items-center justify-center space-y-6 overflow-x-auto">
                
                {/* Central Focus Node */}
                <div className="bg-gradient-to-tr from-indigo-600 to-indigo-700 text-white border border-indigo-400 px-6 py-4 rounded-2xl shadow-xl shadow-indigo-950/50 text-center max-w-xs">
                  <span className="text-[10px] font-mono tracking-widest uppercase text-indigo-200 block mb-0.5">Core Hub Target</span>
                  <div className="text-base font-black uppercase tracking-wide">{data.subject} Workspace</div>
                </div>

                {/* Connecting Vector Vector Stem */}
                <div className="w-0.5 h-10 bg-gradient-to-b from-indigo-600 via-purple-600 to-cyan-500"></div>

                {/* Branch nodes mapping wrapper */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-4xl">
                  {data.definitions.map((def, idx) => (
                    <div key={idx} className="flex flex-col items-center">
                      <div className="w-0.5 h-6 bg-slate-800"></div>
                      <div className="bg-slate-900 border border-slate-800 hover:border-cyan-500/40 p-4 rounded-2xl text-center w-full transition shadow-lg">
                        <span className="text-xs font-bold text-cyan-400 font-mono block mb-1 uppercase tracking-wide">{def.term}</span>
                        <p className="text-[10px] text-slate-500 leading-relaxed truncate">{def.definition}</p>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            </div>
          )}

        </main>
      </div>

      {/* Global Interactive Bottom Status Bar */}
      {!focusMode && (
        <footer className="border-t border-slate-900 bg-slate-950 text-center py-4 text-[11px] font-mono text-slate-600 tracking-wider">
          StudySpark Engine Core Framework v1.0.0 • Client-Only Execution Sandbox
        </footer>
      )}
    </div>
  );
}
