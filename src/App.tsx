import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Menu, X, BookOpen, Layers, Clock, Settings, Shield, ChevronRight, Search, Play, Pause, Download, Volume2, VolumeX, RotateCcw, Headphones, AlertCircle, Check, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SYLLABUS } from './data';
import { VisualBlock } from './components/Visuals';
import { SnippetBlock } from './components/Snippets';
import { InteractiveClocks } from './components/InteractiveClocks';
import { AIChat } from './components/AIChat';

const getIcon = (id: string) => {
  if (id === 'Chapter 1') return Layers;
  if (id === 'Chapter 2') return Settings;
  if (id === 'Chapter 3') return Clock;
  if (id === 'Chapter 4') return Settings;
  if (id === 'Chapter 5') return Shield;
  return BookOpen;
};

// Simple highlight component
const Highlight = ({ text, highlight }: { text: string; highlight: string }) => {
  if (!highlight.trim()) {
    return <span>{text}</span>;
  }
  const regex = new RegExp(`(${highlight})`, 'gi');
  const parts = text.split(regex);
  return (
    <span>
      {parts.map((part, i) => 
        regex.test(part) ? <span key={i} className="bg-[#F2CC8F] bg-opacity-60 rounded px-0.5 text-[#3D405B]">{part}</span> : <span key={i}>{part}</span>
      )}
    </span>
  );
};

interface ChapterAudioPlayerProps {
  audioUrl?: string;
  chapterId: string;
}

const ChapterAudioPlayer = ({ audioUrl, chapterId }: ChapterAudioPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [audioError, setAudioError] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Resolve the URL relative to the application's base path
  const resolvedAudioUrl = useMemo(() => {
    if (!audioUrl) return '';
    if (audioUrl.startsWith('/')) {
      return `${(import.meta as any).env.BASE_URL.replace(/\/$/, '')}${audioUrl}`;
    }
    return audioUrl;
  }, [audioUrl]);

  const fileExtension = useMemo(() => {
    if (!audioUrl) return 'mp3';
    const parts = audioUrl.split('.');
    if (parts.length > 1) {
      const ext = parts[parts.length - 1].toLowerCase();
      return ext.split(/[?#]/)[0];
    }
    return 'mp3';
  }, [audioUrl]);

  // Reset state when audioUrl changes
  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setAudioError(false);
    if (audioRef.current) {
      audioRef.current.load();
    }
  }, [audioUrl]);

  const togglePlay = () => {
    if (!audioUrl) return;
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
        setAudioError(false);
      }).catch((err) => {
        console.warn("Audio playback failed or file not found:", err);
        setAudioError(true);
      });
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
      setAudioError(false);
    }
  };

  const handleAudioError = () => {
    setAudioError(true);
    setIsPlaying(false);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseFloat(e.target.value);
    setVolume(vol);
    setIsMuted(vol === 0);
    if (audioRef.current) {
      audioRef.current.volume = vol;
      audioRef.current.muted = vol === 0;
    }
  };

  const skipBack = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 10);
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  if (!audioUrl) return null;

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-5 md:p-6 border border-[#E9E4D9] shadow-sm mb-8 relative overflow-hidden transition-all duration-300 hover:shadow-md hover:border-[#81B29A]/40">
      {/* Decorative background visual */}
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-linear-to-l from-[#81B29A]/5 to-transparent pointer-events-none rounded-r-3xl hidden md:block" />

      <audio 
        ref={audioRef}
        src={resolvedAudioUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onError={handleAudioError}
      />

      <div className="flex flex-col gap-4">
        {/* Top details and Download button */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#F2CC8F]/20 pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#81B29A]/10 rounded-2xl text-[#81B29A]">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#3D405B] uppercase tracking-wider">Audio Study Overview</h4>
              <p className="text-xs text-[#81B29A] font-semibold">Configured Path: <span className="font-mono bg-[#81B29A]/10 px-1.5 py-0.5 rounded text-[10px] break-all">{audioUrl}</span></p>
            </div>
          </div>

          <a 
            href={resolvedAudioUrl} 
            download={`Overview_${chapterId.replace(/\s+/g, '_')}.${fileExtension}`}
            title="Download Audio File"
            className="flex items-center gap-2 px-4 py-2.5 bg-[#3D405B] text-white text-xs font-bold rounded-2xl hover:bg-[#E07A5F] active:bg-[#AF4B32] transition-colors duration-200 outline-none select-none shadow-sm cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download {fileExtension.toUpperCase()}</span>
          </a>
        </div>

        {/* Audio control deck */}
        <div className="flex flex-col md:flex-row items-center gap-4 w-full">
          {/* Playback Controls button */}
          <div className="flex items-center gap-2 shrink-0">
            <button 
              onClick={skipBack}
              title="Rewind 10 Seconds"
              className="p-2.5 rounded-2xl text-[#5C5F7F] hover:bg-[#F2CC8F]/20 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button 
              onClick={togglePlay}
              className={`p-4 rounded-2xl cursor-pointer shadow-sm transition-all duration-200 text-white flex items-center justify-center ${
                isPlaying 
                ? 'bg-[#E07A5F] hover:bg-[#AF4B32]' 
                : 'bg-[#81B29A] hover:bg-[#68947C] hover:scale-105 active:scale-95'
              }`}
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
            </button>
          </div>

          {/* Time & Progress slider */}
          <div className="flex-1 flex items-center gap-3 w-full">
            <span className="text-xs font-mono font-bold text-[#5C5F7F] min-w-[35px] text-right">
              {formatTime(currentTime)}
            </span>
            
            <div className="flex-1 relative flex items-center group">
              <input 
                type="range" 
                min={0} 
                max={duration || 100} 
                value={currentTime} 
                onChange={handleSeek}
                className="w-full h-2 bg-[#E0D8C3]/50 rounded-lg appearance-none cursor-pointer accent-[#81B29A] hover:accent-[#E07A5F] transition-all"
              />
            </div>

            <span className="text-xs font-mono font-bold text-[#5C5F7F] min-w-[35px]">
              {duration ? formatTime(duration) : '0:00'}
            </span>
          </div>

          {/* Volume Control */}
          <div className="flex items-center gap-2 shrink-0 bg-[#F9F7F2]/60 px-3 py-1.5 rounded-2xl border border-[#E9E4D9] w-full md:w-auto justify-between md:justify-start">
            <button 
              onClick={toggleMute}
              className="text-[#5C5F7F] p-1.5 hover:bg-black/5 rounded-lg cursor-pointer transition-colors"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <input 
              type="range" 
              min={0} 
              max={1} 
              step={0.05} 
              value={isMuted ? 0 : volume} 
              onChange={handleVolumeChange}
              className="w-20 md:w-16 h-1 bg-[#E0D8C3]/50 rounded-lg appearance-none cursor-pointer accent-[#5C5F7F] transition-all"
            />
          </div>
        </div>

        {/* Warning block if files haven't been uploaded yet */}
        {audioError && (
          <div className="flex items-start gap-2 bg-[#E07A5F]/10 border border-[#E07A5F]/20 rounded-2xl p-3 mt-1" dir="auto">
            <AlertCircle className="w-4 h-4 text-[#E07A5F] shrink-0 mt-0.5" />
            <div className="text-xs text-[#E07A5F] font-semibold text-start">
              <span>ملف الصوت غير متوفر حالياً في هذا المسار. يرجى رفع ملف الصوت بالصيغة المحددة وتسميته ليتطابق مع المسار الظاهر أعلاه لتتمكن من تشغيله.</span>
              <span className="block mt-1 font-mono text-[10px] opacity-85">The audio file is not uploaded yet. Place your correct audio file (e.g., MP3 or M4A) at the configured path shown above to enable streaming.</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

interface InteractiveBulletItemProps {
  item: {
    text: string;
    subItems?: string[];
  };
  searchQuery: string;
}

const InteractiveBulletItem = ({ item, searchQuery }: InteractiveBulletItemProps) => {
  const [isOpen, setIsOpen] = useState(false);

  // Auto-expand if the search query matches any sub-item content
  const hasMatchingSubItem = useMemo(() => {
    if (!searchQuery.trim() || !item.subItems) return false;
    const lowerQuery = searchQuery.toLowerCase();
    return item.subItems.some((sub: string) => sub.toLowerCase().includes(lowerQuery));
  }, [searchQuery, item.subItems]);

  useEffect(() => {
    if (hasMatchingSubItem) {
      setIsOpen(true);
    }
  }, [hasMatchingSubItem]);

  const hasSubItems = item.subItems && item.subItems.length > 0;

  return (
    <li className="relative text-[#5C5F7F] text-[1rem] md:text-[1.125rem] font-medium ps-6 text-start">
      <span className="absolute inset-s-0 top-1.5 text-[#E07A5F] text-xl leading-none select-none">•</span>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F4EFEB] pb-2 hover:border-[#E9E4D9] transition-colors duration-200">
        <span className="text-[#3D405B]">
          <Highlight text={item.text} highlight={searchQuery} />
        </span>
        {hasSubItems && (
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="self-start sm:self-center shrink-0 flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-xl bg-[#81B29A]/10 border border-[#81B29A]/30 text-[#81B29A] hover:bg-[#81B29A]/20 hover:border-[#81B29A] transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#81B29A]/30"
            title={isOpen ? "Fold details / إخفاء التفاصيل" : "Expand details / عرض التفاصيل"}
          >
            <span>{isOpen ? 'Fold / إخفاء' : `Expand / عرض (${item.subItems.length})`}</span>
            <ChevronRight className={`w-3.5 h-3.5 transition-transform duration-200 transform ${isOpen ? 'rotate-90' : 'rotate-0'}`} />
          </button>
        )}
      </div>

      {hasSubItems && (
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.ul
              initial={{ height: 0, opacity: 0, marginTop: 0 }}
              animate={{ 
                height: 'auto', 
                opacity: 1, 
                marginTop: 10,
                transition: { height: { duration: 0.25, ease: 'easeOut' }, opacity: { duration: 0.15, delay: 0.05 } } 
              }}
              exit={{ 
                height: 0, 
                opacity: 0, 
                marginTop: 0,
                transition: { height: { duration: 0.2, ease: 'easeIn' }, opacity: { duration: 0.15 } } 
              }}
              className="mt-3 ps-2 space-y-3 overflow-hidden border-s-2 border-dashed border-[#81B29A]/20"
            >
              {item.subItems.map((subItem: string, sIndex: number) => {
                const isFirstTarget = sIndex === 0;
                return (
                  <li 
                    key={sIndex} 
                    className={`text-[0.95rem] md:text-[1.05rem] flex items-start gap-3 rounded-2xl p-3 transition-colors duration-200 ${
                      isFirstTarget 
                        ? 'bg-[#F2CC8F]/15 border border-[#F2CC8F]/30 shadow-xs text-gray-700' 
                        : 'text-gray-500 hover:text-gray-700 hover:bg-[#F9F7F2]'
                    }`}
                  >
                    <span className={`mt-0.5 select-none font-bold ${isFirstTarget ? 'text-[#E07A5F]' : 'text-[#81B29A]'}`}>
                      {isFirstTarget ? '★' : '◦'}
                    </span>
                    <span className={`flex-1 text-start leading-relaxed ${isFirstTarget ? 'font-semibold' : 'font-medium'}`}>
                      <Highlight text={subItem} highlight={searchQuery} />
                    </span>
                  </li>
                );
              })}
            </motion.ul>
          )}
        </AnimatePresence>
      )}
    </li>
  );
};

interface InteractiveArabicExplanationProps {
  content: string;
  searchQuery: string;
}

const InteractiveArabicExplanation = ({ content, searchQuery }: InteractiveArabicExplanationProps) => {
  const [isOpen, setIsOpen] = useState(true);

  // Auto-expand if the search query matches any text in this explanation
  const hasMatchingText = useMemo(() => {
    if (!searchQuery.trim()) return false;
    return content.toLowerCase().includes(searchQuery.toLowerCase());
  }, [searchQuery, content]);

  useEffect(() => {
    if (hasMatchingText) {
      setIsOpen(true);
    }
  }, [hasMatchingText]);

  return (
    <div className="border border-[#81B29A]/30 rounded-3xl overflow-hidden transition-all duration-300 shadow-xs mb-4">
      {/* Header and Toggle Button */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between gap-4 bg-[#81B29A]/10 px-5 py-3 md:px-6 md:py-4 border-b border-[#81B29A]/20 cursor-pointer select-none hover:bg-[#81B29A]/15 transition-colors"
      >
        <span className="text-xs font-bold text-[#81B29A] uppercase tracking-wider flex items-center gap-2">
          <span>Detailed Explanation / الشرح المفصل</span>
        </span>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
          className="shrink-0 flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-xl bg-white border border-[#81B29A]/40 text-[#81B29A] hover:bg-[#81B29A] hover:text-white hover:border-[#81B29A] transition-all cursor-pointer focus:outline-none"
          title={isOpen ? "Fold explanation / طي الشرح" : "Expand explanation / عرض الشرح"}
        >
          <span>{isOpen ? 'Fold / طي' : 'Expand / عرض'}</span>
          <ChevronRight className={`w-3.5 h-3.5 transition-transform duration-200 transform ${isOpen ? 'rotate-90' : 'rotate-0'}`} />
        </button>
      </div>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ 
              height: 'auto', 
              opacity: 1,
              transition: { height: { duration: 0.25, ease: 'easeOut' }, opacity: { duration: 0.15, delay: 0.05 } } 
            }}
            exit={{ 
              height: 0, 
              opacity: 0,
              transition: { height: { duration: 0.2, ease: 'easeIn' }, opacity: { duration: 0.15 } } 
            }}
            className="overflow-hidden bg-[#81B29A]/5"
          >
            <div className="p-6 md:p-8" dir="auto">
              <p className="text-[#3D405B] leading-[2.2] text-[1.15rem] md:text-[1.25rem] whitespace-pre-line font-medium text-start text-balance font-arabic">
                <Highlight text={content} highlight={searchQuery} />
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const MOCK_QUIZZES: Record<string, {question: string; options: string[]; correctAnswer: number}[]> = {
  'Chapter 1': [
    {
      question: 'What is a characteristic of Cluster Computing?',
      options: ['Homogeneous hardware', 'Heterogeneous systems', 'Wide-Area Network (WAN)', 'Service-oriented model'],
      correctAnswer: 0
    },
    {
      question: 'Which architecture layer in Grid Computing handles communication protocols?',
      options: ['Fabric', 'Connectivity', 'Collective', 'Application'],
      correctAnswer: 1
    },
    {
      question: 'Amazon S3 is an example of which Cloud Computing layer?',
      options: ['Hardware Layer', 'Infrastructure Layer (IaaS)', 'Platform Layer (PaaS)', 'Application Layer (SaaS)'],
      correctAnswer: 1
    }
  ],
  'Chapter 2': [
    {
      question: 'In Layered Architecture, how does communication flow?',
      options: ['Only between adjacent layers', 'Between any two layers randomly', 'Only from application to hardware', 'Through a central broker'],
      correctAnswer: 0
    },
    {
      question: 'What is an example of Layered Architecture?',
      options: ['Email application', 'Network Protocols', 'Database system', 'Microservices'],
      correctAnswer: 1
    }
  ]
};

const GLOSSARY_TERMS = [
  { term: 'Asynchronous RPC (Async RPC)', definition: 'Client calls an RPC but only waits for an "acceptance" ACK, then continues its work without waiting for full execution.' },
  { term: 'Central Broker (Middleware)', definition: 'Acts as a centralized wrapper management system for integrating legacy software with O(n) complexity.' },
  { term: 'Centralized Algorithm (Mutual Exclusion)', definition: 'Mimics a single-processor system by appointing one process to be coordinator; processes must request access from it to enter the Critical Section.' },
  { term: 'Client Stub', definition: 'A local function in RPC on the client side that marshals (packs) parameters into a message.' },
  { term: 'Cloud Computing', definition: 'An internet-based, service-oriented model structured as a stack of distinct layers.' },
  { term: 'Cluster Computing', definition: 'Consists of a group of high-end, usually homogeneous systems connected through a Local Area Network (LAN).' },
  { term: 'Compute Nodes', definition: 'Processing units running a standard OS extended with middleware to handle communication, storage, & reliability.' },
  { term: 'Concurrent Events', definition: 'Two distinct events where neither casually leads to the other (x ↛ y and y ↛ x).' },
  { term: 'Consistent Cut', definition: 'A cut where, for every event in its past, all other events that happened-before it are also included in the past.' },
  { term: 'Grid Computing', definition: 'Connecting a massive number of relatively heterogeneous nodes from various locations, easily spanning a WAN.' },
  { term: 'Happened-Before Relation', definition: 'A logical ordering condition determining if one event causally occurred before another event.' },
  { term: 'Inconsistent Cut', definition: 'A visual line that mistakenly places the effect in the past while its cause is in the future.' },
  { term: 'Infrastructure Layer (IaaS)', definition: 'Deploys virtualization to provide customers with virtual storage & computing resources.' },
  { term: 'Logical Time', definition: 'A system of tracking the ordering of events without requiring physical clocks to be synchronized.' },
  { term: 'Master Node (Cluster)', definition: 'Handles allocation of nodes, maintains a batch queue of submitted jobs, and provides a User Interface.' },
  { term: 'Message Broker', definition: 'Used to translate data formats between applications in different integrated systems so they can understand each other.' },
  { term: 'Message-Queuing Middleware (MOM)', definition: 'Provides high-level, persistent asynchronous communication with intermediate storage capacity for messages.' },
  { term: 'Middleware', definition: 'Acts as an abstraction layer between the OS and distributed apps, masking underlying network complexity.' },
  { term: 'Multicast RPC', definition: 'Sending a Remote Procedure Call to a group of servers simultaneously.' },
  { term: 'Mutual Exclusion', definition: 'A technique used to coordinate execution and allow only one process to get in a Critical Section (CS) at a time.' },
  { term: 'Platform Layer (PaaS)', definition: 'Provides higher-level abstractions & easy ways to develop & deploy apps in the cloud.' },
  { term: 'Publish-Subscribe (Pub/Sub) Model', definition: 'An event-based architecture where publishers generate event notifications without knowing who the subscribers are.' },
  { term: 'Remote Procedure Call (RPC)', definition: 'Allows an application on one machine to call a function or procedure on a remote machine transparently.' },
  { term: 'Scalar Clocks (Lamport Clocks)', definition: 'A logical clock algorithm that uses a single increasing integer counter for each process.' },
  { term: 'Software Layer (SaaS)', definition: 'Consists of actual end-user applications provided as a service over the cloud.' },
  { term: 'Vector Clocks', definition: 'A logical clock algorithm where each process keeps a vector representing its current knowledge of logical time at all processes to provide Strong Consistency.' }
].sort((a, b) => a.term.localeCompare(b.term));

const GlossaryView = () => {
  const [expandedTerm, setExpandedTerm] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredGlossary = useMemo(() => {
    return GLOSSARY_TERMS.filter(item => 
      item.term.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.definition.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const groupedGlossary = useMemo(() => {
    const groups: Record<string, typeof GLOSSARY_TERMS> = {};
    filteredGlossary.forEach(item => {
      const firstLetter = item.term.charAt(0).toUpperCase();
      if (!groups[firstLetter]) groups[firstLetter] = [];
      groups[firstLetter].push(item);
    });
    return Object.keys(groups).sort().map(letter => ({
      letter,
      terms: groups[letter]
    }));
  }, [filteredGlossary]);

  return (
    <div className="max-w-4xl mx-auto w-full pb-24">
      <header className="mb-8 border-b border-[#E0D8C3] pb-6 mt-4">
        <h2 className="text-3xl md:text-5xl font-serif font-bold text-[#E07A5F] leading-[1.15] mb-4">
          Glossary
        </h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Search terms or definitions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border-2 border-[#E9E4D9] rounded-2xl py-3 pl-12 pr-4 text-[#3D405B] font-medium focus:outline-none focus:border-[#81B29A] transition-colors"
          />
          <Search className="w-5 h-5 text-[#A8A29E] absolute left-4 top-3.5" />
        </div>
      </header>

      {groupedGlossary.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-gray-400">
           <Search className="w-12 h-12 mb-4 opacity-30 text-[#3D405B]" />
           <h3 className="text-xl font-bold text-[#3D405B]">No terms found</h3>
           <p className="mt-2 text-sm text-[#A8A29E]">Try a different search phrase.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {groupedGlossary.map(({ letter, terms }) => (
            <div key={letter} className="relative">
              <div className="sticky top-0 bg-[#F4EFEB] py-2 z-10">
                <span className="text-2xl font-serif font-bold text-[#81B29A]">{letter}</span>
              </div>
              <ul className="mt-4 space-y-3">
                {terms.map(item => (
                  <li key={item.term} className="bg-white rounded-2xl border border-[#E9E4D9] overflow-hidden shadow-sm hover:shadow relative">
                    <button
                      onClick={() => setExpandedTerm(expandedTerm === item.term ? null : item.term)}
                      className="w-full text-left px-5 py-4 flex justify-between items-center bg-white cursor-pointer hover:bg-black/5 transition-colors focus:outline-none"
                    >
                      <span className="text-lg font-bold text-[#3D405B]">{item.term}</span>
                      <ChevronRight className={`w-5 h-5 text-[#81B29A] transition-transform duration-200 transform ${expandedTerm === item.term ? 'rotate-90' : 'rotate-0'}`} />
                    </button>
                    <AnimatePresence>
                      {expandedTerm === item.term && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1, transition: { duration: 0.25, ease: 'easeOut' } }}
                          exit={{ height: 0, opacity: 0, transition: { duration: 0.2, ease: 'easeIn' } }}
                        >
                          <div className="px-5 pb-5 text-[#5C5F7F] font-medium text-lg leading-relaxed pt-2 border-t border-[#F4EFEB]/50">
                            <Highlight text={item.definition} highlight={searchQuery} />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const getQuizQuestions = (chapter: any) => {
  if (MOCK_QUIZZES[chapter.id]) return MOCK_QUIZZES[chapter.id];
  return chapter.topics.slice(0, 3).map((topic: any, idx: number) => {
    const options = [
      topic.title,
      'Distributed Shared Memory',
      'Centralized Broker Architecture',
      'Token Ring Algorithm'
    ];
    // deterministically shuffle using idx
    const shuffled = [options[0], options[1], options[2], options[3]];
    if (idx % 2 === 0) shuffled.reverse();
    const correctAns = shuffled.indexOf(options[0]);
    
    return {
      question: `Which of the following topics is discussed in ${chapter.id}?`,
      options: shuffled,
      correctAnswer: correctAns
    };
  });
};

interface QuizViewProps {
  chapter: any;
  onComplete: (score: number) => void;
  bestScore?: number;
}

const QuizView = ({ chapter, onComplete, bestScore }: QuizViewProps) => {
  const questions = useMemo(() => getQuizQuestions(chapter), [chapter.id]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedAns, setSelectedAns] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  // Reset state when chapter changes
  useEffect(() => {
    setCurrentQIndex(0);
    setSelectedAns(null);
    setIsAnswered(false);
    setScore(0);
    setIsFinished(false);
  }, [chapter.id]);

  const handleAnswer = (index: number) => {
    if (isAnswered) return;
    setSelectedAns(index);
    setIsAnswered(true);
    if (index === questions[currentQIndex].correctAnswer) {
      setScore(s => s + 1);
    }
  };

  const handleNext = () => {
    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex(c => c + 1);
      setSelectedAns(null);
      setIsAnswered(false);
    } else {
      setIsFinished(true);
      const finalScore = score + (selectedAns === questions[currentQIndex].correctAnswer && !isAnswered ? 1 : 0);
      onComplete(Math.max((finalScore / questions.length) * 100)); // We do the calc correctly inside handleAnswer, so here the score is already updated. Wait, the state might not be fully updated here due to async setScore if we called it inline, but we only have next button AFTER it is answered, so score is accurate!
      onComplete(Math.round((score / questions.length) * 100));
    }
  };

  if (isFinished) {
    const finalPct = Math.round((score / questions.length) * 100);
    return (
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#E9E4D9] text-center">
        <h3 className="text-3xl font-bold text-[#E07A5F] mb-4">Quiz Completed!</h3>
        <p className="text-[#3D405B] text-xl font-medium mb-8">You scored {score} out of {questions.length} ({finalPct}%)</p>
        <button 
          onClick={() => {
            setCurrentQIndex(0);
            setSelectedAns(null);
            setIsAnswered(false);
            setScore(0);
            setIsFinished(false);
          }}
          className="px-6 py-3 bg-[#81B29A] text-white rounded-2xl shadow-lg hover:bg-[#68947C] transition-colors"
        >
          Retake Quiz
        </button>
      </div>
    );
  }

  const currentQ = questions[currentQIndex];

  return (
    <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-[#E9E4D9]">
      <div className="flex justify-between items-center border-b border-[#E9E4D9] pb-4 mb-6">
        <h3 className="text-xl md:text-2xl font-bold text-[#3D405B]">
          Question {currentQIndex + 1} of {questions.length}
        </h3>
        {bestScore !== undefined && (
          <span className="text-sm font-bold text-[#81B29A] bg-[#81B29A]/10 px-3 py-1 rounded-xl">
            Best Score: {bestScore}%
          </span>
        )}
      </div>
      
      <p className="text-xl text-[#3D405B] font-medium mb-8">{currentQ.question}</p>
      
      <div className="space-y-4">
        {currentQ.options.map((opt, i) => {
          let btnClass = "w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ";
          
          if (isAnswered) {
            if (i === currentQ.correctAnswer) {
              btnClass += "bg-[#81B29A]/20 border-[#81B29A] text-[#2c4033]"; // correct
            } else if (i === selectedAns) {
              btnClass += "bg-[#E07A5F]/20 border-[#E07A5F] text-[#4a241b]"; // wrong selected
            } else {
              btnClass += "bg-white border-[#E9E4D9] opacity-50"; // other
            }
          } else {
            btnClass += "bg-white border-[#E9E4D9] hover:border-[#81B29A] hover:shadow-sm cursor-pointer";
          }

          return (
            <button 
              key={i} 
              disabled={isAnswered}
              onClick={() => handleAnswer(i)}
              className={btnClass}
            >
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full border-2 border-current flex items-center justify-center font-bold text-sm shrink-0">
                  {String.fromCharCode(65 + i)}
                </span>
                <span className="text-lg font-medium">{opt}</span>
              </div>
            </button>
          );
        })}
      </div>
      
      {isAnswered && (
        <div className="mt-8 flex justify-end">
          <button 
            onClick={handleNext}
            className="px-6 py-3 bg-[#3D405B] text-white rounded-2xl shadow-lg hover:bg-[#2A2C40] transition-colors flex items-center gap-2"
          >
            {currentQIndex < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default function App() {
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrollPercentage, setScrollPercentage] = useState(0);
  const [viewMode, setViewMode] = useState<'study' | 'quiz' | 'glossary'>('study');
  const [quizScores, setQuizScores] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem('ds_study_guide_scores');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });
  const [readSections, setReadSections] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('ds_study_guide_read_sections');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  const [isDarkMode, setIsDarkMode] = useState(() => {
    try {
      const saved = localStorage.getItem('ds_study_guide_theme');
      if (saved) return saved === 'dark';
      return false;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('ds_study_guide_theme', isDarkMode ? 'dark' : 'light');
    } catch (e) {}
  }, [isDarkMode]);

  const toggleReadSection = (key: string) => {
    setReadSections(prev => {
      const updated = { ...prev, [key]: !prev[key] };
      try {
        localStorage.setItem('ds_study_guide_read_sections', JSON.stringify(updated));
      } catch (e) {
        console.warn('Could not save progress to localStorage', e);
      }
      return updated;
    });
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const totalHeight = target.scrollHeight - target.clientHeight;
    if (totalHeight > 0) {
      setScrollPercentage((target.scrollTop / totalHeight) * 100);
    } else {
      setScrollPercentage(0);
    }
  };

  useEffect(() => {
    setScrollPercentage(0);
    const scrollContainer = document.getElementById('content-scroll');
    if (scrollContainer) {
      scrollContainer.scrollTop = 0;
    }
  }, [activeChapterIndex, searchQuery]);

  const filteredSyllabus = useMemo(() => {
    if (!searchQuery.trim()) return SYLLABUS;
    const lowerQuery = searchQuery.toLowerCase();
    
    return SYLLABUS.map(chapter => {
      const filteredTopics = chapter.topics.filter(topic => {
        if (topic.title.toLowerCase().includes(lowerQuery)) return true;
        return topic.blocks.some(block => {
          if (block.content && block.content.toLowerCase().includes(lowerQuery)) return true;
          if (block.items && block.items.some(item => 
            item.text.toLowerCase().includes(lowerQuery) || 
            (item.subItems && item.subItems.some(sub => sub.toLowerCase().includes(lowerQuery)))
          )) return true;
          return false;
        });
      });
      return { ...chapter, topics: filteredTopics };
    }).filter(chapter => chapter.topics.length > 0 || chapter.title.toLowerCase().includes(lowerQuery));
  }, [searchQuery]);

  // Adjust active chapter if the current one is filtered out
  const displayChapter = filteredSyllabus[activeChapterIndex] || filteredSyllabus[0];

  return (
    <div className={`flex flex-col md:flex-row h-screen bg-[#F9F7F2] font-sans text-[#3D405B] overflow-hidden sm:border-8 sm:border-[#E9E4D9] app-wrapper ${isDarkMode ? 'dark' : ''}`}>
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-[#3D405B]/40 backdrop-blur-sm md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-80 h-full overflow-y-auto custom-scrollbar bg-[#F9F7F2] md:bg-[#F2CC8F]/30 md:border-r border-[#E0D8C3] shadow-[4px_0_24px_rgba(0,0,0,0.1)] md:shadow-none transform transition-transform duration-300 ease-out md:translate-x-0 md:static md:shrink-0 flex flex-col p-8 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="mb-8 text-center relative">
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="absolute top-0 right-0 md:hidden text-[#3D405B] p-2 hover:bg-black/5 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="inline-block p-3 bg-[#81B29A] rounded-2xl mb-4 shadow-sm">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-serif font-bold tracking-tight text-[#3D405B]">Distributed Systems</h1>
          <p className="text-[10px] uppercase tracking-widest text-[#81B29A] font-bold mt-2 mb-4">Study Guide • دليل الدراسة</p>
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="absolute top-0 left-0 p-2 text-[#81B29A] hover:bg-black/5 rounded-full transition-colors hidden md:block border border-transparent hover:border-[#81B29A]/30"
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>

        <div className="mb-6 relative">
          <input 
            type="text" 
            placeholder="Search topics..." 
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setActiveChapterIndex(0); // reset to first result
            }}
            className="w-full bg-white border border-[#E0D8C3] rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#81B29A] shadow-sm placeholder:text-[#A8A29E]"
          />
          <Search className="w-4 h-4 text-[#A8A29E] absolute left-4 top-3.5" />
        </div>

        <div className="mb-6 flex p-1 bg-black/5 rounded-xl">
          <button 
            onClick={() => setViewMode('study')}
            className={`flex-1 text-xs font-bold uppercase tracking-wider py-2 rounded-lg transition-all ${
              viewMode === 'study' ? 'bg-[#3D405B] text-white shadow-md' : 'text-[#3D405B] hover:bg-black/5'
            }`}
          >
            Study Guide
          </button>
          <button 
            onClick={() => setViewMode('quiz')}
            className={`flex-1 text-xs font-bold uppercase tracking-wider py-2 rounded-lg transition-all ${
              viewMode === 'quiz' ? 'bg-[#E07A5F] text-white shadow-md' : 'text-[#3D405B] hover:bg-black/5'
            }`}
          >
            Quiz
          </button>
          <button 
            onClick={() => setViewMode('glossary')}
            className={`flex-1 text-xs font-bold uppercase tracking-wider py-2 rounded-lg transition-all ${
              viewMode === 'glossary' ? 'bg-[#81B29A] text-white shadow-md' : 'text-[#3D405B] hover:bg-black/5'
            }`}
          >
            Glossary
          </button>
        </div>

        <nav className="flex-1 space-y-3 pb-6 pr-2">
          {filteredSyllabus.length === 0 && (
            <div className="text-center text-sm text-[#A8A29E] py-4 font-medium">No matches found</div>
          )}
          {filteredSyllabus.map((chapter) => {
             const isActive = displayChapter && displayChapter.id === chapter.id;
             const Icon = getIcon(chapter.id);
             return (
              <button
                key={chapter.id}
                onClick={() => {
                  const newIndex = filteredSyllabus.findIndex(c => c.id === chapter.id);
                  if(newIndex !== -1) setActiveChapterIndex(newIndex);
                  setIsSidebarOpen(false);
                }}
                className={`w-full text-left p-4 rounded-xl transition-all duration-200 border cursor-pointer flex flex-col ${
                  isActive 
                    ? 'bg-[#3D405B] shadow-md border-[#3D405B]' 
                    : 'hover:bg-white hover:shadow-sm border-transparent hover:border-[#E0D8C3] opacity-80'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#F2CC8F]' : 'text-[#81B29A]'}`} />
                  <p className={`text-[10px] font-bold uppercase tracking-wider ${isActive ? 'text-[#F2CC8F]' : 'text-[#81B29A]'}`}>
                    {chapter.id}
                  </p>
                </div>
                <p className={`text-sm font-semibold truncate w-full ${isActive ? 'text-white' : 'text-[#3D405B]'}`}>
                  <Highlight text={chapter.title} highlight={searchQuery} />
                </p>
              </button>
            );
          })}
        </nav>
        
        <div className="mt-auto pt-6 text-[10px] text-[#A8A29E] text-center border-t border-[#E0D8C3] font-mono tracking-wider font-bold">
          لا تنسونا من صالح دعائكم
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full">
        
        {/* Mobile Header Tracker */}
        <header className="md:hidden bg-[#F9F7F2] shrink-0 border-b border-[#E0D8C3] p-4 flex items-center shadow-sm relative z-10 justify-between">
          <div className="flex items-center">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 -ml-2 text-[#3D405B] rounded-lg hover:bg-black/5 transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
          <div className="flex-1 text-center font-bold text-[#3D405B] text-sm uppercase tracking-widest px-4 truncate">
             {displayChapter ? displayChapter.id : 'Search'}
          </div>
          <div className="flex items-center">
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 -mr-2 text-[#81B29A] rounded-lg hover:bg-black/5 transition-colors"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </header>

        {/* Scroll Progress Bar */}
        <div className="w-full bg-[#E0D8C3]/30 h-[5px] shrink-0 overflow-hidden relative z-20">
          <div 
            className="bg-[#81B29A] h-full transition-all duration-100 ease-out shadow-[0_0_8px_rgba(129,178,154,0.6)]" 
            style={{ width: `${scrollPercentage}%` }}
          />
        </div>

        {/* Scrollable Document */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-6 md:p-10 relative" id="content-scroll" onScroll={handleScroll}>
          <div className="max-w-4xl mx-auto w-full pb-24">
            
            <AnimatePresence mode="wait">
              {viewMode === 'glossary' ? (
                 <GlossaryView />
              ) : displayChapter ? (
                <motion.div
                  key={`${displayChapter.id}_${searchQuery}`}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                >
                  {/* Chapter Header */}
                  <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4 border-b border-[#E0D8C3] pb-6">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-[#81B29A] mb-2 tracking-widest uppercase flex items-center gap-2">
                         <ChevronRight className="w-4 h-4" />
                         {displayChapter.id}
                         {viewMode === 'quiz' && <span className="ml-2 px-2 py-0.5 bg-[#E07A5F]/20 text-[#E07A5F] rounded-lg">QUIZ</span>}
                      </span>
                      <h2 className="text-3xl md:text-5xl font-serif font-bold text-[#E07A5F] leading-[1.15]">
                        <Highlight text={displayChapter.title} highlight={searchQuery} />
                      </h2>
                    </div>
                  </header>

                  {viewMode === 'study' && (
                    <ChapterAudioPlayer 
                      audioUrl={displayChapter.audioUrl} 
                      chapterId={displayChapter.id} 
                    />
                  )}

                  {viewMode === 'quiz' ? (
                    <QuizView 
                      chapter={displayChapter}
                      bestScore={quizScores[displayChapter.id]}
                      onComplete={(score) => {
                        setQuizScores(prev => {
                          const existingScore = prev[displayChapter.id] || 0;
                          const newScore = Math.max(existingScore, score);
                          const updated = { ...prev, [displayChapter.id]: newScore };
                          try {
                            localStorage.setItem('ds_study_guide_scores', JSON.stringify(updated));
                          } catch (e) {}
                          return updated;
                        });
                      }}
                    />
                  ) : (
                    <div className="grid grid-cols-1 gap-8">
                      {displayChapter.topics.map((topic, topicIndex) => {
                        const sectionKey = `${displayChapter.id}_${topicIndex}`;
                        const isRead = !!readSections[sectionKey];

                      return (
                        <motion.section 
                          key={topicIndex}
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: Math.min(topicIndex * 0.05, 0.3), ease: 'easeOut' }}
                          className={`rounded-3xl p-6 md:p-8 shadow-sm border flex flex-col overflow-hidden transition-all duration-300 relative ${
                            isRead 
                              ? 'bg-[#eeeeee] border-[#D8D3C4]' 
                              : 'bg-white border-[#E9E4D9] hover:shadow-md'
                          }`}
                        >
                          {/* Header with Mark as Read Button */}
                          <div className="flex justify-between items-start border-b border-[#E9E4D9] pb-4 mb-6 gap-4">
                            <h3 dir="auto" className="text-xl md:text-2xl font-bold text-[#E07A5F] border-s-4 border-s-[#81B29A] ps-3 text-start flex-1 leading-tight">
                              <Highlight text={topic.title} highlight={searchQuery} />
                            </h3>

                            {/* "Mark as Read" Button */}
                            <button
                              onClick={() => toggleReadSection(sectionKey)}
                              title={isRead ? "Mark as unread / تحديد كغير مقروء" : "Mark as read / تحديد كمقروء"}
                              className={`w-8 h-8 rounded-full flex items-center justify-center cursor-pointer shrink-0 transition-all duration-200 border-2 ${
                                isRead
                                  ? 'bg-[#81B29A] border-[#81B29A] text-white shadow-sm shadow-[#81B29A]/30 hover:bg-[#68947C] hover:border-[#68947C]'
                                  : 'bg-white border-[#81B29A]/40 text-[#81B29A]/30 hover:border-[#81B29A] hover:bg-[#81B29A]/10 hover:text-[#81B29A]'
                              }`}
                            >
                              <Check className={`w-4 h-4 stroke-[3px] transition-all duration-200 ${isRead ? 'scale-100 opacity-100' : 'scale-75 opacity-0 hover:opacity-100'}`} />
                            </button>
                          </div>

                          <div className="space-y-8">
                            {topic.blocks.map((block, bIndex) => {
                              if (block.type === 'text' && block.content) {
                                const content = block.content;
                                
                                // 1. If it has a newline, split it!
                                if (content.includes('\n')) {
                                  const parts = content.split('\n');
                                  const title = parts[0];
                                  const body = parts.slice(1).join('\n');
                                  return (
                                    <div key={bIndex} className="space-y-2 mt-6 first:mt-0 text-start">
                                      <h4 className="text-lg md:text-2xl font-serif font-bold text-[#81B29A] leading-tight pt-2">
                                        <Highlight text={title} highlight={searchQuery} />
                                      </h4>
                                      <p dir="auto" className="text-[#5C5F7F] leading-relaxed text-[1rem] md:text-[1.125rem] font-medium text-pretty w-full">
                                        <Highlight text={body} highlight={searchQuery} />
                                      </p>
                                    </div>
                                  );
                                }

                                // 2. If it is a known subtitle, or a short title without final punctuation, or ends with a colon
                                const lowercaseContent = content.toLowerCase().trim();
                                const isKnownSubtitle = [
                                  'steps', 'challenges', 'variants', 'how it works', 'pros', 'cons', 'three-tier:', 
                                  'the publish-subscribe (pub/sub) model', 'the happened-before relation (→)', 
                                  'publish/subscribe model', '(mutual exclusion)', '(election)', 'mutual exclusion', 
                                  'election algorithm', 'centralized algorithm', 'token ring algorithm', 
                                  'distributed algorithm (ricart & agrawala algorithms)'
                                ].includes(lowercaseContent);

                                const colonIndex = content.indexOf(':');
                                // If it starts with a key like "Compute Nodes: ..."
                                if (colonIndex > 0 && colonIndex < 40 && content.length > colonIndex + 2) {
                                  const title = content.substring(0, colonIndex);
                                  const body = content.substring(colonIndex + 1).trim();
                                  return (
                                    <div key={bIndex} className="space-y-2 mt-6 first:mt-0 text-start">
                                      <h4 className="text-lg md:text-2xl font-serif font-bold text-[#81B29A] leading-tight pt-2">
                                        <Highlight text={title} highlight={searchQuery} />
                                      </h4>
                                      <p dir="auto" className="text-[#5C5F7F] leading-relaxed text-[1rem] md:text-[1.125rem] font-medium text-pretty w-full">
                                        <Highlight text={body} highlight={searchQuery} />
                                      </p>
                                    </div>
                                  );
                                }

                                if (isKnownSubtitle || content.endsWith(':') || (content.length < 60 && !content.endsWith('.'))) {
                                  return (
                                    <h4 key={bIndex} className="text-lg md:text-2xl font-serif font-bold text-[#81B29A] mt-6 first:mt-0 mb-3 leading-tight text-start pt-2">
                                      <Highlight text={content} highlight={searchQuery} />
                                    </h4>
                                  );
                                }

                                return (
                                  <p key={bIndex} dir="auto" className="text-[#5C5F7F] leading-relaxed text-[1rem] md:text-[1.125rem] font-medium text-pretty w-full text-start">
                                    <Highlight text={block.content} highlight={searchQuery} />
                                  </p>
                                );
                              }
                              if (block.type === 'arabic' && block.content) {
                                return (
                                  <InteractiveArabicExplanation 
                                    key={bIndex} 
                                    content={block.content} 
                                    searchQuery={searchQuery} 
                                  />
                                );
                              }
                            if (block.type === 'bullet_list' && block.items) {
                              return (
                                <ul key={bIndex} dir="auto" className="space-y-4 ps-0 list-none relative w-full">
                                  {block.items.map((item, iIndex) => (
                                    <InteractiveBulletItem 
                                      key={iIndex} 
                                      item={item} 
                                      searchQuery={searchQuery} 
                                    />
                                  ))}
                                </ul>
                              );
                            }
                              if (block.type === 'visual' && block.id) {
                                return <VisualBlock key={bIndex} id={block.id} />;
                              }
                              if (block.type === 'snippet' && block.id) {
                                return <SnippetBlock key={bIndex} id={block.id} />;
                              }
                              if (block.type === 'interactive' && block.id === 'clocks') {
                                return <InteractiveClocks key={bIndex} />;
                              }
                              return null;
                            })}
                          </div>
                        </motion.section>
                      );
                    })}
                  </div>
                  )}

                  {/* Navigation Footer */}
                  {searchQuery.trim() === '' && viewMode === 'study' && (
                    <footer className="mt-12 pt-8 border-t border-[#E0D8C3] flex justify-between items-center gap-4 text-xs font-semibold uppercase tracking-wider">
                      {activeChapterIndex > 0 ? (
                        <button 
                          onClick={() => {
                            setActiveChapterIndex(Math.max(0, activeChapterIndex - 1));
                            document.getElementById('content-scroll')?.scrollTo({top: 0, behavior: 'smooth'});
                          }}
                          className="px-6 py-4 border-2 border-[#81B29A] text-[#81B29A] rounded-2xl hover:bg-[#81B29A] hover:text-white transition-colors animate-none"
                        >
                          Prev Chapter
                        </button>
                      ) : <div></div>}
                      {activeChapterIndex < filteredSyllabus.length - 1 ? (
                        <button 
                          onClick={() => {
                            setActiveChapterIndex(Math.min(filteredSyllabus.length - 1, activeChapterIndex + 1));
                            document.getElementById('content-scroll')?.scrollTo({top: 0, behavior: 'smooth'});
                          }}
                          className="px-6 py-4 bg-[#3D405B] text-white rounded-2xl shadow-lg hover:bg-[#2A2C40] transition-colors"
                        >
                          Next Chapter
                        </button>
                      ) : <div></div>}
                    </footer>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="no-results"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  className="flex flex-col items-center justify-center py-32 text-gray-400"
                >
                  <Search className="w-12 h-12 mb-4 opacity-30 text-[#3D405B]" />
                  <h2 className="text-xl font-bold text-[#3D405B]">No results found for "{searchQuery}"</h2>
                  <p className="mt-2 text-sm text-[#A8A29E]">Try adjusting your search query to find Topics or Arabic keywords.</p>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </div>
      </main>
      
      <AIChat />
    </div>
  );
}
