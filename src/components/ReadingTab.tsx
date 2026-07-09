import React, { useState, useEffect, useRef, useMemo } from 'react';
import { stories, poems } from '../data/reading';
import { Story, Poem, VocabularyItem } from '../types';
import { 
  Volume2, BookOpen, Music, Languages, ArrowRight, HelpCircle, 
  GraduationCap, Play, Square, Check, RefreshCw, Search, 
  ChevronLeft, ChevronRight, Award, Timer, BookMarked, Sparkles
} from 'lucide-react';
import { getGeneratedTrainerWords, TrainerWord } from '../data/trainerWords';

export default function ReadingTab() {
  const [activeType, setActiveType] = useState<'stories' | 'poems' | 'trainer'>('stories');
  const [selectedStoryIdx, setSelectedStoryIdx] = useState<number>(0);
  const [selectedPoemIdx, setSelectedPoemIdx] = useState<number>(0);
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);
  const [ttsState, setTtsState] = useState<'idle' | 'playing' | 'error'>('idle');
  const [ttsMessage, setTtsMessage] = useState<string | null>(null);

  const activeStory = stories[selectedStoryIdx];
  const activePoem = poems[selectedPoemIdx];

  // --- WORD TRAINER STATES & REFS ---
  const trainerWordsList = useMemo(() => getGeneratedTrainerWords(), []);
  const playbackTimeoutRef = useRef<any>(null);

  // Keep refs of latest values for the asynchronous playback loop to avoid stale closure issues
  const handleNextTrainerWordRef = useRef<any>(null);

  // Load from local storage
  const [activeWordIdx, setActiveWordIdx] = useState<number>(() => {
    const saved = localStorage.getItem('kannada_kali_trainer_idx');
    return saved ? parseInt(saved, 10) : 0;
  });

  const [learnedWords, setLearnedWords] = useState<number[]>(() => {
    const saved = localStorage.getItem('kannada_kali_trainer_learned');
    return saved ? JSON.parse(saved) : [];
  });

  const [autoAdvance, setAutoAdvance] = useState<boolean>(() => {
    const saved = localStorage.getItem('kannada_kali_trainer_autoadvance');
    return saved === 'true';
  });

  const autoAdvanceRef = useRef<boolean>(autoAdvance);
  autoAdvanceRef.current = autoAdvance;

  // Filters & Pagination
  const [trainerLevel, setTrainerLevel] = useState<number | 'all'>('all');
  const [trainerSearch, setTrainerSearch] = useState<string>('');
  const [trainerPage, setTrainerPage] = useState<number>(0);

  // Active Reading step-by-step states
  const [isReading, setIsReading] = useState<boolean>(false);
  const [readStep, setReadStep] = useState<'idle' | 'countdown' | 'syllables' | 'combined'>('idle');
  const [currentSyllableIdx, setCurrentSyllableIdx] = useState<number>(-1);
  const [countdown, setCountdown] = useState<number>(2);
  const [transliterationRevealed, setTransliterationRevealed] = useState<boolean>(false);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('kannada_kali_trainer_idx', activeWordIdx.toString());
  }, [activeWordIdx]);

  useEffect(() => {
    setTransliterationRevealed(false);
  }, [activeWordIdx]);

  useEffect(() => {
    localStorage.setItem('kannada_kali_trainer_learned', JSON.stringify(learnedWords));
  }, [learnedWords]);

  useEffect(() => {
    localStorage.setItem('kannada_kali_trainer_autoadvance', autoAdvance.toString());
  }, [autoAdvance]);

  // Cleanup on unmount or tab switch
  useEffect(() => {
    return () => {
      if (playbackTimeoutRef.current) {
        clearTimeout(playbackTimeoutRef.current);
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [activeType]);

  // Filter 1000 words
  const filteredWords = useMemo(() => {
    return trainerWordsList.filter((w) => {
      const matchLevel = trainerLevel === 'all' || w.level === trainerLevel;
      const matchSearch = w.word.includes(trainerSearch) || 
                          w.transliteration.toLowerCase().includes(trainerSearch.toLowerCase()) ||
                          w.meaning.toLowerCase().includes(trainerSearch.toLowerCase());
      return matchLevel && matchSearch;
    });
  }, [trainerWordsList, trainerLevel, trainerSearch]);

  // Reset page when filters change
  useEffect(() => {
    setTrainerPage(0);
  }, [trainerLevel, trainerSearch]);

  // Pagination bounds
  const itemsPerPage = 8;
  const totalTrainerPages = Math.ceil(filteredWords.length / itemsPerPage);
  const paginatedTrainerWords = useMemo(() => {
    return filteredWords.slice(trainerPage * itemsPerPage, (trainerPage + 1) * itemsPerPage);
  }, [filteredWords, trainerPage]);

  // Calculate current active trainer word safely
  const currentTrainerWord = useMemo(() => {
    const word = trainerWordsList[activeWordIdx];
    if (word && filteredWords.some(fw => fw.word === word.word)) {
      return word;
    }
    if (filteredWords.length > 0) {
      return filteredWords[0];
    }
    return trainerWordsList[0] || { word: '', syllables: [], transliteration: '', meaning: '', level: 1, levelName: '' };
  }, [activeWordIdx, filteredWords, trainerWordsList]);

  // Speech synthesis helpers
  const speakText = (text: string, rate: number = 1.0) => {
    if (!('speechSynthesis' in window)) return;
    try {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'kn-IN';
      utterance.rate = rate;
      
      const voices = window.speechSynthesis.getVoices();
      const knVoice = voices.find(v => v.lang.toLowerCase().includes('kn') || v.lang.toLowerCase().includes('kannada'));
      if (knVoice) {
        utterance.voice = knVoice;
      }
      
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.error('Speech synthesis error:', e);
    }
  };

  const stopTrainerPlayback = () => {
    if (playbackTimeoutRef.current) {
      clearTimeout(playbackTimeoutRef.current);
      playbackTimeoutRef.current = null;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsReading(false);
    setReadStep('idle');
    setCurrentSyllableIdx(-1);
  };

  const startTrainerPlayback = (wordObj: TrainerWord) => {
    stopTrainerPlayback();
    setIsReading(true);
    setReadStep('countdown');
    setCountdown(2);

    let count = 2;
    const runCountdown = () => {
      if (count > 0) {
        setCountdown(count);
        playbackTimeoutRef.current = setTimeout(() => {
          count--;
          runCountdown();
        }, 1000);
      } else {
        setCountdown(0);
        readSyllableStep(wordObj, 0);
      }
    };
    runCountdown();
  };

  const readSyllableStep = (wordObj: TrainerWord, idx: number) => {
    if (idx < wordObj.syllables.length) {
      setReadStep('syllables');
      setCurrentSyllableIdx(idx);
      speakText(wordObj.syllables[idx], 0.75); // slower spelling rate

      playbackTimeoutRef.current = setTimeout(() => {
        readSyllableStep(wordObj, idx + 1);
      }, 1500); // 1.5 second pause between characters
    } else {
      setReadStep('combined');
      setCurrentSyllableIdx(-1);
      setTransliterationRevealed(true); // Automatically reveal the transliteration once the full word is read
      speakText(wordObj.word, 0.9); // announce full word

      playbackTimeoutRef.current = setTimeout(() => {
        setIsReading(false);
        setReadStep('idle');
        
        if (autoAdvanceRef.current) {
          handleNextTrainerWordRef.current?.();
        }
      }, 1500); // 1.5 seconds combined announcement state
    }
  };

  const handleSelectTrainerWord = (wordObj: TrainerWord) => {
    stopTrainerPlayback();
    const originalIdx = trainerWordsList.findIndex(w => w.word === wordObj.word);
    if (originalIdx !== -1) {
      setActiveWordIdx(originalIdx);
      if (autoAdvance) {
        playbackTimeoutRef.current = setTimeout(() => {
          startTrainerPlayback(wordObj);
        }, 100);
      }
    }
  };

  const handleNextTrainerWord = (forcePlay: boolean = false) => {
    stopTrainerPlayback();
    const activeWord = trainerWordsList[activeWordIdx];
    const currentFilteredIdx = filteredWords.findIndex(w => w.word === activeWord?.word);
    
    let targetWord: TrainerWord | null = null;
    if (currentFilteredIdx !== -1 && currentFilteredIdx < filteredWords.length - 1) {
      const nextWord = filteredWords[currentFilteredIdx + 1];
      const nextOriginalIdx = trainerWordsList.findIndex(w => w.word === nextWord.word);
      if (nextOriginalIdx !== -1) {
        setActiveWordIdx(nextOriginalIdx);
        const nextFilteredIdx = currentFilteredIdx + 1;
        const newPage = Math.floor(nextFilteredIdx / itemsPerPage);
        setTrainerPage(newPage);
        targetWord = nextWord;
      }
    } else {
      if (filteredWords.length > 0) {
        const firstWord = filteredWords[0];
        const firstOriginalIdx = trainerWordsList.findIndex(w => w.word === firstWord.word);
        if (firstOriginalIdx !== -1) {
          setActiveWordIdx(firstOriginalIdx);
          setTrainerPage(0);
          targetWord = firstWord;
        }
      }
    }

    if ((autoAdvance || forcePlay) && targetWord) {
      playbackTimeoutRef.current = setTimeout(() => {
        startTrainerPlayback(targetWord!);
      }, 100);
    }
  };

  // Keep ref in sync on every render
  handleNextTrainerWordRef.current = handleNextTrainerWord;

  const handlePrevTrainerWord = () => {
    stopTrainerPlayback();
    const activeWord = trainerWordsList[activeWordIdx];
    const currentFilteredIdx = filteredWords.findIndex(w => w.word === activeWord?.word);
    
    let targetWord: TrainerWord | null = null;
    if (currentFilteredIdx > 0) {
      const prevWord = filteredWords[currentFilteredIdx - 1];
      const prevOriginalIdx = trainerWordsList.findIndex(w => w.word === prevWord.word);
      if (prevOriginalIdx !== -1) {
        setActiveWordIdx(prevOriginalIdx);
        const prevFilteredIdx = currentFilteredIdx - 1;
        const newPage = Math.floor(prevFilteredIdx / itemsPerPage);
        setTrainerPage(newPage);
        targetWord = prevWord;
      }
    } else {
      if (filteredWords.length > 0) {
        const lastWord = filteredWords[filteredWords.length - 1];
        const lastOriginalIdx = trainerWordsList.findIndex(w => w.word === lastWord.word);
        if (lastOriginalIdx !== -1) {
          setActiveWordIdx(lastOriginalIdx);
          setTrainerPage(Math.floor((filteredWords.length - 1) / itemsPerPage));
          targetWord = lastWord;
        }
      }
    }

    if (autoAdvance && targetWord) {
      playbackTimeoutRef.current = setTimeout(() => {
        startTrainerPlayback(targetWord!);
      }, 100);
    }
  };

  const toggleWordLearned = (idx: number) => {
    setLearnedWords(prev => {
      if (prev.includes(idx)) {
        return prev.filter(i => i !== idx);
      } else {
        return [...prev, idx];
      }
    });
  };

  const resetTrainerProgress = () => {
    if (window.confirm("Are you sure you want to reset your word practice progress?")) {
      setLearnedWords([]);
      setActiveWordIdx(0);
      setTrainerPage(0);
      stopTrainerPlayback();
    }
  };

  const playTTS = (text: string, index: number) => {
    if (!('speechSynthesis' in window)) {
      setTtsState('error');
      setTtsMessage('Speech synthesis is not supported on this device.');
      setTimeout(() => setTtsMessage(null), 3000);
      return;
    }

    try {
      setHighlightedIndex(index);
      setTtsState('playing');
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'kn-IN';
      
      const voices = window.speechSynthesis.getVoices();
      const knVoice = voices.find(v => v.lang.toLowerCase().includes('kn') || v.lang.toLowerCase().includes('kannada'));
      if (knVoice) {
        utterance.voice = knVoice;
      }
      
      utterance.onend = () => {
        setTtsState('idle');
        setHighlightedIndex(null);
      };
      utterance.onerror = () => {
        setTtsState('error');
        setHighlightedIndex(null);
        setTtsMessage('Kannada voice is not installed. Enjoy the written transliteration guides!');
        setTimeout(() => {
          setTtsState('idle');
          setTtsMessage(null);
        }, 5000);
      };

      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      setTtsState('error');
      setHighlightedIndex(null);
      setTimeout(() => setTtsState('idle'), 3000);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fade-in">
      {/* Left side list of Stories / Poems / Trainer */}
      <div className="lg:col-span-4 flex flex-col gap-5">
        
        {/* Toggle between Stories, Poems & Word Trainer */}
        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200/80 gap-1 select-none">
          <button
            onClick={() => {
              stopTrainerPlayback();
              setActiveType('stories');
              setHighlightedIndex(null);
            }}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              activeType === 'stories'
                ? 'bg-white text-amber-800 shadow-sm border border-slate-200/50 font-extrabold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50/50'
            }`}
          >
            <BookOpen size={13} className="shrink-0" />
            <span>Stories (ಕಥೆಗಳು)</span>
          </button>
          
          <button
            onClick={() => {
              stopTrainerPlayback();
              setActiveType('poems');
              setHighlightedIndex(null);
            }}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              activeType === 'poems'
                ? 'bg-white text-amber-800 shadow-sm border border-slate-200/50 font-extrabold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50/50'
            }`}
          >
            <Music size={13} className="shrink-0" />
            <span>Poems (ಕವನಗಳು)</span>
          </button>

          <button
            onClick={() => {
              setActiveType('trainer');
              setHighlightedIndex(null);
            }}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              activeType === 'trainer'
                ? 'bg-white text-amber-800 shadow-sm border border-slate-200/50 font-extrabold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50/50'
            }`}
          >
            <GraduationCap size={14} className="shrink-0 text-amber-600" />
            <span>Trainer (ವಾಚನ)</span>
          </button>
        </div>

        {/* List items for Stories & Poems */}
        {activeType !== 'trainer' ? (
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="bg-slate-50 px-4 py-3 border-b border-slate-200/60 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">
                Choose {activeType === 'stories' ? 'a Story' : 'a Poem'}
              </span>
              <span className="text-xs font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-100">
                {activeType === 'stories' ? `${stories.length} Available` : `${poems.length} Available`}
              </span>
            </div>

            <div className="divide-y divide-slate-100 max-h-[420px] overflow-y-auto">
              {activeType === 'stories' ? (
                stories.map((st, idx) => (
                  <button
                    key={st.id}
                    onClick={() => {
                      setSelectedStoryIdx(idx);
                      setHighlightedIndex(null);
                    }}
                    className={`w-full text-left p-4 hover:bg-amber-50/10 transition-all flex items-center justify-between gap-3 ${
                      selectedStoryIdx === idx
                        ? 'bg-amber-500/5 border-l-4 border-amber-500'
                        : ''
                    }`}
                  >
                    <div>
                      <h4 className="text-sm font-bold text-slate-800 leading-tight">
                        {idx + 1}. {st.title}
                      </h4>
                      <p className="text-xs text-slate-400 mt-1">{st.titleEn}</p>
                    </div>
                    <ChevronRightIcon active={selectedStoryIdx === idx} />
                  </button>
                ))
              ) : (
                poems.map((pm, idx) => (
                  <button
                    key={pm.id}
                    onClick={() => {
                      setSelectedPoemIdx(idx);
                      setHighlightedIndex(null);
                    }}
                    className={`w-full text-left p-4 hover:bg-amber-50/10 transition-all flex items-center justify-between gap-3 ${
                      selectedPoemIdx === idx
                        ? 'bg-amber-500/5 border-l-4 border-amber-500'
                        : ''
                    }`}
                  >
                    <div>
                      <h4 className="text-sm font-bold text-slate-800 leading-tight">
                        {idx + 1}. {pm.title}
                      </h4>
                      <p className="text-xs text-slate-400 mt-1">{pm.titleEn}</p>
                    </div>
                    <ChevronRightIcon active={selectedPoemIdx === idx} />
                  </button>
                ))
              )}
            </div>
          </div>
        ) : (
          /* WORD TRAINER: Filters, Progress & Sidebar list */
          <div className="flex flex-col gap-4">
            
            {/* Master Progress Card */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Award size={15} className="text-amber-600" />
                  <span className="text-xs font-bold text-slate-700">Mastery Progress</span>
                </div>
                <button
                  onClick={resetTrainerProgress}
                  className="text-[10px] font-bold text-slate-400 hover:text-red-500 flex items-center gap-1 transition"
                  title="Reset Progress"
                >
                  <RefreshCw size={10} />
                  <span>Reset</span>
                </button>
              </div>

              {/* Progress stats */}
              <div className="flex items-end justify-between font-mono text-[11px] font-bold">
                <span className="text-slate-400">LEARNED WORDS</span>
                <span className="text-amber-900 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded">
                  {learnedWords.length} / {trainerWordsList.length} ({Math.round((learnedWords.length / trainerWordsList.length) * 100)}%)
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-amber-500 rounded-full transition-all duration-500"
                  style={{ width: `${(learnedWords.length / trainerWordsList.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Level Selector & Search Controls */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider font-mono">
                  Complexity Level
                </label>
                <select
                  value={trainerLevel}
                  onChange={(e) => {
                    const val = e.target.value;
                    setTrainerLevel(val === 'all' ? 'all' : parseInt(val, 10));
                  }}
                  className="w-full text-xs font-bold bg-slate-50 border border-slate-200/70 p-2.5 rounded-xl text-slate-800 outline-none focus:border-amber-400 focus:bg-white transition"
                >
                  <option value="all">📚 All Levels (1,000 Words)</option>
                  <option value="1">🌱 Level 1: 2-Letter Simple</option>
                  <option value="2">🍀 Level 2: 2-Letter Vowels</option>
                  <option value="3">🌿 Level 3: 3-Letter Simple</option>
                  <option value="4">🍂 Level 4: 3-Letter Vowels</option>
                  <option value="5">🔥 Level 5: Ottakshara Words</option>
                  <option value="6">👑 Level 6: 4-Letter Complex</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider font-mono">
                  Search Words
                </label>
                <div className="relative">
                  <Search size={13} className="absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    value={trainerSearch}
                    onChange={(e) => setTrainerSearch(e.target.value)}
                    placeholder="Search word, meaning..."
                    className="w-full text-xs bg-slate-50 border border-slate-200/70 pl-9 pr-4 py-2.5 rounded-xl text-slate-800 outline-none focus:border-amber-400 focus:bg-white transition font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Word List Grid */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col">
              <div className="bg-slate-50 px-4 py-3 border-b border-slate-200/60 flex items-center justify-between">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider font-mono">
                  Practice Word List
                </span>
                <span className="text-[10px] font-bold text-slate-500 font-mono">
                  {filteredWords.length} found
                </span>
              </div>

              {filteredWords.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400 font-medium">
                  No matching words found.
                </div>
              ) : (
                <div className="divide-y divide-slate-100 max-h-[300px] overflow-y-auto">
                  {paginatedTrainerWords.map((item) => {
                    const mainIdx = trainerWordsList.findIndex(w => w.word === item.word);
                    const isSelected = currentTrainerWord.word === item.word;
                    const isLearned = learnedWords.includes(mainIdx);
                    
                    return (
                      <button
                        key={item.word}
                        onClick={() => handleSelectTrainerWord(item)}
                        className={`w-full text-left p-3 hover:bg-amber-50/10 transition-all flex items-center justify-between gap-3 ${
                          isSelected
                            ? 'bg-amber-500/5 border-l-4 border-amber-500'
                            : ''
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-extrabold ${isSelected ? 'text-amber-950 font-black' : 'text-slate-800'}`}>
                            {item.word}
                          </span>
                          {isLearned && (
                            <span className="text-[10px] text-emerald-600 font-mono font-bold">
                              /{item.transliteration}/
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5">
                          {isLearned && (
                            <span className="p-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100" title="Mastered">
                              <Check size={10} className="stroke-[3px]" />
                            </span>
                          )}
                          <span className="text-[9px] font-bold bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-mono">
                            L{item.level}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Sidebar Pagination Controls */}
              {totalTrainerPages > 1 && (
                <div className="bg-slate-50 border-t border-slate-100 p-2.5 flex items-center justify-between">
                  <button
                    onClick={() => setTrainerPage(p => Math.max(0, p - 1))}
                    disabled={trainerPage === 0}
                    className="p-1 rounded bg-white border border-slate-200 text-slate-500 disabled:opacity-40 transition"
                  >
                    <ChevronLeft size={12} />
                  </button>
                  <span className="text-[10px] font-bold text-slate-500 font-mono">
                    Page {trainerPage + 1} of {totalTrainerPages}
                  </span>
                  <button
                    onClick={() => setTrainerPage(p => Math.min(totalTrainerPages - 1, p + 1))}
                    disabled={trainerPage === totalTrainerPages - 1}
                    className="p-1 rounded bg-white border border-slate-200 text-slate-500 disabled:opacity-40 transition"
                  >
                    <ChevronRight size={12} />
                  </button>
                </div>
              )}
            </div>

          </div>
        )}

        {/* Tip panel */}
        <div className="bg-amber-50/30 border border-amber-100/50 p-4 rounded-xl flex items-start gap-2.5 select-none">
          <HelpCircle size={16} className="text-amber-800 mt-0.5 flex-shrink-0" />
          <div className="text-xs text-amber-900 leading-relaxed">
            <h5 className="font-bold mb-1">How to practice reading:</h5>
            <ol className="list-decimal pl-4 flex flex-col gap-1 font-medium">
              {activeType !== 'trainer' ? (
                <>
                  <li>Listen to each line using the dedicated audio button on that block.</li>
                  <li>Practice reading the Kannada script aloud as you listen to the correct pronunciation!</li>
                  <li>Learn individual word translations using the Vocabulary table below!</li>
                </>
              ) : (
                <>
                  <li>Choose any word from the list of 1000 complexity-ordered words.</li>
                  <li>Click <span className="font-bold">Start Practice</span>: each alphabet block will flash and play every 1.5 seconds.</li>
                  <li>Repeat the sounds aloud to build spelling/reading confidence!</li>
                  <li>Toggle <span className="font-bold">Auto-Advance</span> for seamless hands-free practice loops!</li>
                </>
              )}
            </ol>
          </div>
        </div>

      </div>

      {/* Right side Active Content Display */}
      <div className="lg:col-span-8 flex flex-col gap-6">
        
        {activeType !== 'trainer' ? (
          /* STORY / POEM CORE MODULE */
          <>
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-md">
              {/* Main Title Banner */}
              <div className="border-b border-slate-100 pb-5 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-amber-950 font-sans">
                    {activeType === 'stories' ? activeStory.title : activePoem.title}
                  </h3>
                  <p className="text-sm font-medium text-slate-400 mt-1">
                    {activeType === 'stories' ? activeStory.titleEn : activePoem.titleEn}
                  </p>
                </div>
                <div>
                  <button
                    onClick={() => {
                      const fullText = activeType === 'stories' 
                        ? activeStory.paragraphs.join(' ') 
                        : activePoem.verses.join(' ');
                      playTTS(fullText, -1);
                    }}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition shadow-sm"
                  >
                    <Volume2 size={14} />
                    <span>Play Entire {activeType === 'stories' ? 'Story' : 'Poem'}</span>
                  </button>
                </div>
              </div>

              {/* Voice status toast if any */}
              {ttsMessage && (
                <div className="bg-amber-50 border border-amber-100 text-amber-800 rounded-xl p-3 text-xs mb-5">
                  {ttsMessage}
                </div>
              )}

              {/* Story Paragraphs / Poem Verses list */}
              <div className="flex flex-col gap-5">
                {activeType === 'stories' ? (
                  activeStory.paragraphs.map((para, idx) => {
                    const isHighlighted = highlightedIndex === idx;
                    return (
                      <div
                        key={idx}
                        onClick={() => playTTS(para, idx)}
                        className={`cursor-pointer p-5 rounded-2xl border transition-all flex flex-col gap-3.5 ${
                          isHighlighted
                            ? 'bg-amber-500/10 border-amber-400 shadow-inner ring-2 ring-amber-300/20'
                            : 'bg-white border-slate-100 hover:border-amber-200 hover:bg-amber-50/5 shadow-xs'
                        }`}
                      >
                        {/* Top Content Row: Text + Primary Play/Listen button */}
                        <div className="flex items-start justify-between gap-4 w-full">
                          <p className="text-lg font-bold text-slate-800 font-sans leading-relaxed">
                            {para}
                          </p>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              playTTS(para, idx);
                            }}
                            className={`p-2.5 rounded-xl transition-all border flex items-center justify-center shrink-0 ${
                              isHighlighted
                                ? 'bg-amber-500 border-amber-600 text-white shadow-xs'
                               : 'bg-slate-50 border-slate-200/60 text-slate-600 hover:bg-amber-50 hover:text-amber-800 hover:border-amber-200'
                            }`}
                            title="Listen to this block"
                          >
                            <Volume2 size={16} className={isHighlighted ? "animate-pulse" : ""} />
                          </button>
                        </div>

                        {/* Bottom Row: English Translation */}
                        <div className="border-t border-slate-100/85 pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 w-full">
                          <div className="flex items-center gap-2">
                            <Languages size={13} className="text-amber-700/60 shrink-0" />
                            <p className="text-xs text-slate-600 font-medium font-sans leading-relaxed">
                              {activeStory.translation[idx]}
                            </p>
                          </div>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              playTTS(para, idx);
                            }}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold self-start sm:self-auto transition-all border shrink-0 ${
                              isHighlighted
                                ? 'bg-amber-500 border-amber-600 text-white font-extrabold'
                                : 'bg-amber-50 hover:bg-amber-100 text-amber-800 border-amber-200/50 hover:border-amber-300'
                            }`}
                          >
                            <Volume2 size={12} />
                            <span>{isHighlighted ? 'Listening...' : 'Listen (ಆಲಿಸಿ)'}</span>
                          </button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="bg-slate-50/50 rounded-3xl border border-slate-100 p-5 sm:p-7 flex flex-col gap-5">
                    {activePoem.verses.map((verse, idx) => {
                      const isHighlighted = highlightedIndex === idx;
                      return (
                        <div
                          key={idx}
                          onClick={() => playTTS(verse, idx)}
                          className={`cursor-pointer p-4 rounded-2xl border transition-all flex flex-col gap-3 ${
                            isHighlighted
                              ? 'bg-amber-500/15 border-amber-400 shadow-inner ring-2 ring-amber-300/20'
                              : 'bg-white border-slate-100/80 hover:border-amber-200 shadow-xs'
                          }`}
                        >
                          {/* Verse Text + Play/Listen Button */}
                          <div className="flex items-start justify-between gap-4 w-full">
                            <p className="text-lg font-extrabold text-amber-900 leading-snug">
                              {verse}
                            </p>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                playTTS(verse, idx);
                              }}
                              className={`p-2 rounded-xl transition-all border flex items-center justify-center shrink-0 ${
                                isHighlighted
                                  ? 'bg-amber-500 border-amber-600 text-white shadow-xs'
                                  : 'bg-slate-50 border-slate-200/60 text-slate-600 hover:bg-amber-50 hover:text-amber-800 hover:border-amber-200'
                              }`}
                              title="Listen to this verse"
                            >
                              <Volume2 size={14} className={isHighlighted ? "animate-pulse" : ""} />
                            </button>
                          </div>

                          {/* Bottom translation & explicit button */}
                          <div className="border-t border-slate-100/60 pt-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 w-full">
                            <p className="text-xs text-slate-500 font-sans font-medium leading-relaxed">
                              {activePoem.translation[idx]}
                            </p>
                            
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                playTTS(verse, idx);
                              }}
                              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold self-start sm:self-auto transition-all border shrink-0 ${
                                isHighlighted
                                  ? 'bg-amber-500 border-amber-600 text-white font-extrabold'
                                  : 'bg-amber-50 hover:bg-amber-100 text-amber-800 border-amber-200/50 hover:border-amber-300'
                              }`}
                            >
                              <Volume2 size={12} />
                              <span>{isHighlighted ? 'Listening...' : 'Listen (ಆಲಿಸಿ)'}</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Vocabulary Word-by-Word Study Card */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
              <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
                <Languages size={16} className="text-amber-700" />
                <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                  Word-by-Word Vocabulary List (ಪದಕೋಶ)
                </h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {(activeType === 'stories' ? activeStory.vocabulary : activePoem.vocabulary).map((voc: VocabularyItem, idx: number) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/40 hover:bg-slate-50 transition"
                  >
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => playTTS(voc.word, -2)}
                        className="p-1.5 rounded-lg bg-white text-slate-500 hover:bg-amber-100 hover:text-amber-800 transition shadow-sm"
                        title="Pronounce word"
                      >
                        <Volume2 size={12} />
                      </button>
                      <div>
                        <h5 className="text-sm font-bold text-slate-800 leading-tight">
                          {voc.word}
                        </h5>
                        <p className="text-[10px] text-slate-400 font-mono">
                          /{voc.transliteration}/
                        </p>
                      </div>
                    </div>
                    <div className="text-right flex items-center gap-1.5 text-xs font-semibold text-amber-900 bg-amber-50 border border-amber-100/60 px-2 py-1 rounded-lg">
                      <span>{voc.meaning}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          /* WORD-BY-WORD TRAINER INTERACTIVE BOARD */
          <div className="flex flex-col gap-6 animate-fade-in select-none">
            
            {/* Active Trainer Card */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-md flex flex-col gap-6">
              
              {/* Header Title with stats */}
              <div className="border-b border-slate-100 pb-4 flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-extrabold text-amber-950 flex items-center gap-2">
                    <BookMarked size={18} className="text-amber-600" />
                    <span>Loud Practice & Recognition</span>
                  </h3>
                  <p className="text-xs font-medium text-slate-400 mt-0.5">
                    Read syllables letter-by-letter, then speak the combined word.
                  </p>
                </div>
                
                {/* Active index badge */}
                <span className="text-[10px] font-bold text-amber-900 bg-amber-50 border border-amber-100 px-2.5 py-1 rounded-full font-mono">
                  Word #{trainerWordsList.findIndex(w => w.word === currentTrainerWord.word) + 1} of {trainerWordsList.length}
                </span>
              </div>

              {/* Large Visual board with Syllable Tiles */}
              <div className="flex flex-col items-center justify-center py-10 px-4 bg-slate-50/50 rounded-2xl border border-slate-100/80 relative min-h-[300px] shadow-inner">
                
                {/* Visual Level indicator badge */}
                <div className="absolute top-4 right-4">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100/40 border border-amber-200/30 px-2 py-0.5 rounded-full font-mono">
                    {currentTrainerWord.levelName}
                  </span>
                </div>

                {/* Main large combined word */}
                <div className="text-center mb-8">
                  <h2 className="text-5xl sm:text-6xl font-black text-amber-950 font-sans tracking-tight mb-2 flex items-center justify-center gap-3">
                    <span className={readStep === 'combined' ? "text-emerald-700 font-extrabold" : ""}>
                      {currentTrainerWord.word}
                    </span>
                  </h2>
                  
                  <div className="min-h-[32px] flex items-center justify-center mt-2.5">
                    {transliterationRevealed ? (
                      <p className="text-sm text-amber-900 font-bold tracking-widest uppercase font-mono bg-amber-50 border border-amber-100/50 px-3.5 py-1 rounded-xl inline-block shadow-sm animate-fade-in">
                        {currentTrainerWord.transliteration}
                      </p>
                    ) : (
                      <button
                        onClick={() => setTransliterationRevealed(true)}
                        className="text-[10px] sm:text-xs text-slate-400 font-bold hover:text-amber-700 border border-dashed border-slate-200/80 px-3 py-1 rounded-xl transition-all flex items-center gap-1.5 bg-slate-50/50 hover:bg-amber-50/40 hover:border-amber-200"
                        title="Show pronunciation transliteration"
                      >
                        <Sparkles size={11} className="text-amber-500 animate-pulse" />
                        <span>Click to show Transliteration</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Interactive Letter blocks */}
                <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
                  {currentTrainerWord.syllables.map((syl, sIdx) => {
                    const isSyllableHighlighted = isReading && readStep === 'syllables' && currentSyllableIdx === sIdx;
                    const hasBeenSpoken = isReading && readStep === 'syllables' && currentSyllableIdx > sIdx;
                    
                    return (
                      <div
                        key={sIdx}
                        className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border-2 flex flex-col items-center justify-center transition-all duration-300 relative select-none ${
                          isSyllableHighlighted
                            ? 'bg-amber-500/10 border-amber-500 scale-105 shadow-md shadow-amber-500/10 ring-4 ring-amber-400/20 text-amber-900 font-black'
                            : hasBeenSpoken
                              ? 'bg-slate-100 border-slate-200 text-slate-400'
                              : 'bg-white border-slate-200 text-slate-800 hover:border-amber-200'
                        }`}
                      >
                        <span className={`text-3xl font-extrabold ${isSyllableHighlighted ? 'text-amber-900 animate-pulse' : 'text-slate-800'}`}>
                          {syl}
                        </span>
                        
                        {/* Tiny index indicator */}
                        <span className="absolute top-1.5 left-1.5 text-[9px] font-bold text-slate-400 font-mono">
                          {sIdx + 1}
                        </span>
                        
                        {/* Small pulsing indicator for active syllable */}
                        {isSyllableHighlighted && (
                          <span className="absolute top-1.5 right-1.5 flex h-1.5 w-1.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-500"></span>
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Dynamic Playback Guidance Prompts */}
                <div className="text-center w-full max-w-md mx-auto">
                  {readStep === 'idle' && (
                    <p className="text-xs text-slate-400 font-bold leading-relaxed">
                      Press <span className="text-amber-800">Start Practice</span> below. Syllables play every 1.5 seconds, followed by the combined word.
                    </p>
                  )}
                  {readStep === 'countdown' && (
                    <div className="flex flex-col items-center justify-center gap-1">
                      <div className="text-[10px] font-bold text-amber-800 uppercase tracking-widest font-mono flex items-center gap-1.5">
                        <Timer className="animate-spin text-amber-600" size={12} />
                        <span>Practice starting in</span>
                      </div>
                      <div className="text-3xl font-black text-amber-600 animate-pulse">{countdown}s</div>
                    </div>
                  )}
                  {readStep === 'syllables' && (
                    <p className="text-xs text-amber-800 font-bold bg-amber-500/5 border border-amber-200/50 px-4 py-2 rounded-xl inline-block shadow-sm">
                      Repeat Aloud: <span className="text-sm font-extrabold text-amber-950 font-mono">"{currentTrainerWord.syllables[currentSyllableIdx]}"</span>
                    </p>
                  )}
                  {readStep === 'combined' && (
                    <p className="text-xs text-emerald-800 font-bold bg-emerald-50 border border-emerald-200/50 px-4 py-2 rounded-xl inline-block shadow-sm">
                      Pronounce Together: <span className="text-sm font-extrabold text-emerald-950">"{currentTrainerWord.word}"</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Action Controls Toolbar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                
                {/* Auto Playback Settings */}
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={autoAdvance}
                      onChange={(e) => setAutoAdvance(e.target.checked)}
                      className="w-4 h-4 rounded text-amber-600 border-slate-300 focus:ring-amber-400 focus:ring-offset-2 accent-amber-600"
                    />
                    <span className="text-xs font-bold text-slate-600">Auto-advance to Next Word</span>
                  </label>
                </div>

                {/* Core Player buttons */}
                <div className="flex items-center gap-2.5">
                  <button
                    onClick={handlePrevTrainerWord}
                    className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 active:scale-[0.97] transition-all"
                    title="Previous Word"
                  >
                    <ChevronLeft size={16} />
                  </button>

                  {isReading ? (
                    <button
                      onClick={stopTrainerPlayback}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-xs font-bold transition shadow-md shadow-red-500/10 active:scale-[0.97]"
                    >
                      <Square size={13} className="fill-current" />
                      <span>Stop (ನಿಲ್ಲಿಸಿ)</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => startTrainerPlayback(currentTrainerWord)}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition shadow-md shadow-amber-500/10 active:scale-[0.97]"
                    >
                      <Play size={13} className="fill-current" />
                      <span>Start Practice (ಕೇಳಿ)</span>
                    </button>
                  )}

                  <button
                    onClick={handleNextTrainerWord}
                    className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 active:scale-[0.97] transition-all"
                    title="Next Word"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>

                {/* Mark Learned Action */}
                <div>
                  <button
                    onClick={() => {
                      const mainIdx = trainerWordsList.findIndex(w => w.word === currentTrainerWord.word);
                      if (mainIdx !== -1) {
                        toggleWordLearned(mainIdx);
                      }
                    }}
                    className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold border transition active:scale-[0.97] ${
                      learnedWords.includes(trainerWordsList.findIndex(w => w.word === currentTrainerWord.word))
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-800 font-extrabold'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Check size={14} className="stroke-[2.5px]" />
                    <span>
                      {learnedWords.includes(trainerWordsList.findIndex(w => w.word === currentTrainerWord.word))
                        ? 'Mastered! (ಕಲಿತಿದ್ದೇನೆ)'
                        : 'Mark Learned'}
                    </span>
                  </button>
                </div>

              </div>

              {/* Detail explanations of word */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex flex-col gap-1">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider font-mono">
                    English Meaning
                  </span>
                  <p className="text-sm font-extrabold text-slate-700 capitalize leading-relaxed">
                    {currentTrainerWord.meaning}
                  </p>
                </div>
                
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex flex-col gap-1">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider font-mono">
                    Phonetics Spelling
                  </span>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-amber-900 font-mono">
                      {currentTrainerWord.syllables.map((_, sIdx) => currentTrainerWord.syllables[sIdx]).join(' - ')}
                    </p>
                  </div>
                </div>
              </div>

            </div>

            {/* Programmatic expansion description details */}
            <div className="bg-amber-50/20 border border-amber-100/50 p-4 rounded-xl flex items-start gap-3">
              <Sparkles size={16} className="text-amber-700 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-amber-950/80 leading-relaxed font-medium">
                <h5 className="font-extrabold text-amber-950 mb-1">About our Programmatic Word Database</h5>
                <p>
                  This Practice Room contains exactly <span className="font-bold">1,000 carefully curated Kannada reading exercises</span> of increasing difficulty (Levels 1 to 6). It is built combining daily-vocabulary with structured combinations of vowel-signs (Kagunitha) and double-consonant signs (Ottaksharas). It operates entirely client-side using browser local storage, making it fully offline-compatible!
                </p>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}

// Subcomponent: Animated Chevron Icon
function ChevronRightIcon({ active }: { active: boolean }) {
  return (
    <div className={`p-1.5 rounded-full transition-all ${active ? 'bg-amber-500 text-white' : 'bg-slate-50 text-slate-400'}`}>
      <ArrowRight size={14} className={`transition-transform ${active ? 'translate-x-0.5' : ''}`} />
    </div>
  );
}

