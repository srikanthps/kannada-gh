import React, { useState } from 'react';
import { sajaatiyaExamples, vijaatiyaExamples, arkavattuExamples, ottaksharaList } from '../data/ottakshara';
import PracticeCanvas from './PracticeCanvas';
import { Volume2, ChevronRight, ChevronLeft, PenTool, Award, Compass, Heart } from 'lucide-react';

export default function OttaksharaTab() {
  const [activeSubTab, setActiveSubTab] = useState<'sajaatiya' | 'vijaatiya' | 'arkavattu'>('sajaatiya');
  const [selectedWord, setSelectedWord] = useState<any>(sajaatiyaExamples[0]);
  const [ttsState, setTtsState] = useState<'idle' | 'playing' | 'error'>('idle');
  const [ttsMessage, setTtsMessage] = useState<string | null>(null);
  const [wordPage, setWordPage] = useState(0);

  const handleSubTabChange = (tab: 'sajaatiya' | 'vijaatiya' | 'arkavattu') => {
    setActiveSubTab(tab);
    setWordPage(0);
    if (tab === 'sajaatiya') {
      setSelectedWord(sajaatiyaExamples[0]);
    } else if (tab === 'vijaatiya') {
      setSelectedWord(vijaatiyaExamples[0]);
    } else {
      setSelectedWord(arkavattuExamples[0]);
    }
  };

  const playTTS = (text: string) => {
    if (!('speechSynthesis' in window)) {
      setTtsState('error');
      setTtsMessage('Speech synthesis is not supported.');
      setTimeout(() => setTtsMessage(null), 3000);
      return;
    }

    try {
      setTtsState('playing');
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'kn-IN';
      
      const voices = window.speechSynthesis.getVoices();
      const knVoice = voices.find(v => v.lang.toLowerCase().includes('kn') || v.lang.toLowerCase().includes('kannada'));
      if (knVoice) {
        utterance.voice = knVoice;
      }
      
      utterance.onend = () => setTtsState('idle');
      utterance.onerror = () => {
        setTtsState('error');
        setTtsMessage('Kannada voice pack not fully loaded. Rely on phonetic guide below.');
        setTimeout(() => {
          setTtsState('idle');
          setTtsMessage(null);
        }, 4000);
      };

      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      setTtsState('error');
      setTimeout(() => setTtsState('idle'), 3000);
    }
  };

  const activeExamples = activeSubTab === 'sajaatiya'
    ? sajaatiyaExamples
    : activeSubTab === 'vijaatiya'
      ? vijaatiyaExamples
      : arkavattuExamples;

  const wordsPerPage = 6;
  const totalWordPages = Math.ceil(activeExamples.length / wordsPerPage);
  const paginatedExamples = activeExamples.slice(wordPage * wordsPerPage, (wordPage + 1) * wordsPerPage);

  const handleNextWordPage = () => {
    if (wordPage < totalWordPages - 1) {
      const nextPage = wordPage + 1;
      setWordPage(nextPage);
      setSelectedWord(activeExamples[nextPage * wordsPerPage]);
      playTTS(activeExamples[nextPage * wordsPerPage].word);
    }
  };

  const handlePrevWordPage = () => {
    if (wordPage > 0) {
      const prevPage = wordPage - 1;
      setWordPage(prevPage);
      setSelectedWord(activeExamples[prevPage * wordsPerPage]);
      playTTS(activeExamples[prevPage * wordsPerPage].word);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Intro to Conjuncts */}
      <div className="bg-gradient-to-r from-red-50 to-orange-50/50 p-6 rounded-2xl border border-red-100 shadow-sm">
        <h3 className="text-xl font-bold text-amber-900 mb-2">
          What are Ottaksharas (ಒತ್ತಕ್ಷರಗಳು)?
        </h3>
        <p className="text-sm text-amber-800 leading-relaxed max-w-4xl">
          An <strong>Ottakshara (Samyuktakshara)</strong> is a conjunct consonant in Kannada. When two or more consonants are joined 
          without any vowel sound between them, the first consonant is written in full size, and subsequent consonants are represented by 
          smaller symbols called <strong>Ottu (ಒತ್ತು)</strong> or "Vattu" written underneath or to the right of the main letter.
        </p>
      </div>

      {/* Subtab navigation */}
      <div className="flex bg-slate-100 p-1.5 rounded-xl border border-slate-200 self-start">
        {[
          { id: 'sajaatiya', label: 'Identical Conjuncts', native: 'ಸಜಾತೀಯ ಒತ್ತಕ್ಷರ' },
          { id: 'vijaatiya', label: 'Different Conjuncts', native: 'ವಿಜಾತೀಯ ಒತ್ತಕ್ಷರ' },
          { id: 'arkavattu', label: 'Arkavattu (R-hook)', native: 'ಅರ್ಕವತ್ತು' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleSubTabChange(tab.id as any)}
            className={`py-2 px-4 rounded-lg text-sm transition-all text-center ${
              activeSubTab === tab.id
                ? 'bg-white text-amber-800 shadow-sm font-semibold border border-slate-200/50'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <div>{tab.label}</div>
            <div className="text-[10px] text-slate-400 mt-0.5 font-normal">{tab.native}</div>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left pane: Descriptions and Word list */}
        <div className="lg:col-span-7 flex flex-col gap-5">
          {/* Explanation details */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
            {activeSubTab === 'sajaatiya' && (
              <div>
                <div className="flex items-center gap-1.5 mb-2 text-amber-800 font-bold text-sm">
                  <Heart size={16} className="text-red-500 fill-red-50" />
                  <h4>Sajaatiya Ottakshara (ಸಜಾತೀಯ ಒತ್ತಕ್ಷರ)</h4>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  These represent <strong>identical consonant doubling</strong>. The main letter is followed by its own exact matching 
                  Ottu symbol underneath. This doubles the intensity of the sound (like "mm" in "Amma" or "kk" in "Akka").
                </p>
              </div>
            )}
            {activeSubTab === 'vijaatiya' && (
              <div>
                <div className="flex items-center gap-1.5 mb-2 text-amber-800 font-bold text-sm">
                  <Compass size={16} className="text-blue-500" />
                  <h4>Vijaatiya Ottakshara (ವಿಜಾತೀಯ ಒತ್ತಕ್ಷರ)</h4>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  These represent <strong>different consonant blending</strong>. Here, a consonant is blended with a <em>different</em> consonant 
                  directly (like "st" in "Pustaka" or "dy" in "Vidya"). The secondary letter is written below as an Ottu sign.
                </p>
              </div>
            )}
            {activeSubTab === 'arkavattu' && (
              <div>
                <div className="flex items-center gap-1.5 mb-2 text-amber-800 font-bold text-sm">
                  <Award size={16} className="text-amber-500" />
                  <h4>Arkavattu - Preceding 'R' (ಅರ್ಕವತ್ತು)</h4>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  In Kannada, when an "R" (ರ) sound comes <strong>before</strong> another consonant (e.g. <em>r + ya</em> in "Sūrya" or 
                  <em>r + ma</em> in "Charma"), instead of drawing a typical ottu underneath, we add a beautiful crescent hook symbol 
                  <strong> "೯" </strong> called <strong>Arkavattu</strong> on the right of the main letter. It is pronounced <em>before</em> the main letter!
                </p>
              </div>
            )}
          </div>

          {/* Interactive Word Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {paginatedExamples.map((ex) => {
              const isSelected = selectedWord.word === ex.word;
              return (
                <button
                  key={ex.word}
                  onClick={() => {
                    setSelectedWord(ex);
                    playTTS(ex.word);
                  }}
                  className={`flex flex-col p-4 rounded-xl border text-left transition-all group ${
                    isSelected
                      ? 'bg-amber-500/10 border-amber-500/40 text-amber-950 shadow-sm ring-1 ring-amber-400'
                      : 'bg-white border-slate-200/60 hover:bg-amber-50/10 hover:border-amber-200'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className="text-2xl font-bold font-sans text-slate-800 flex items-center gap-1.5">
                      <span>{ex.word}</span>
                      <Volume2 size={16} className={`opacity-60 group-hover:opacity-100 transition-opacity ${isSelected ? 'text-amber-800' : 'text-slate-400'}`} />
                    </span>
                    <span className="text-xs font-semibold text-amber-800 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-full font-mono">
                      /{ex.transliteration}/
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-slate-600">{ex.meaning}</div>
                  <div className="text-[10px] text-slate-400 font-mono mt-2 border-t border-slate-100/50 pt-2 flex justify-between items-center w-full">
                    <span>{ex.breakdown}</span>
                    <ChevronRight size={12} className="text-slate-300" />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Pagination Controls */}
          {totalWordPages > 1 && (
            <div className="flex items-center justify-between bg-amber-50/30 border border-amber-100/60 p-3 rounded-2xl">
              <button
                onClick={handlePrevWordPage}
                disabled={wordPage === 0}
                className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-1 ${
                  wordPage === 0
                    ? 'opacity-30 cursor-not-allowed bg-slate-100 text-slate-400 border-slate-200'
                    : 'bg-white border-amber-200 text-amber-950 hover:bg-amber-100/40 hover:border-amber-300 active:scale-[0.98]'
                }`}
              >
                <ChevronLeft size={14} className="stroke-[2.5px]" />
                <span>Prev Words</span>
              </button>
              
              <span className="text-[11px] font-bold text-amber-900 font-mono">
                Set {wordPage + 1} of {totalWordPages} ({wordPage * wordsPerPage + 1}-{Math.min((wordPage + 1) * wordsPerPage, activeExamples.length)} of {activeExamples.length})
              </span>

              <button
                onClick={handleNextWordPage}
                disabled={wordPage === totalWordPages - 1}
                className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-1 ${
                  wordPage === totalWordPages - 1
                    ? 'opacity-30 cursor-not-allowed bg-slate-100 text-slate-400 border-slate-200'
                    : 'bg-white border-amber-200 text-amber-950 hover:bg-amber-100/40 hover:border-amber-300 active:scale-[0.98]'
                }`}
              >
                <span>Next Words</span>
                <ChevronRight size={14} className="stroke-[2.5px]" />
              </button>
            </div>
          )}

          {/* Core Ottu Symbols cheat sheet */}
          {activeSubTab === 'sajaatiya' && (
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wide block mb-3 border-b border-slate-100 pb-2">
                Common Ottu Sign Transformations (ಒತ್ತಕ್ಷರ ಚಿಹ್ನೆಗಳು) — Click to Hear Sound
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {ottaksharaList.map((item) => {
                  const rawLetter = item.letter.split(' ')[0];
                  return (
                    <button
                      key={item.letter}
                      onClick={() => playTTS(`${rawLetter} ಒತ್ತು`)}
                      className="flex items-center justify-between p-2.5 rounded-xl border border-slate-150 bg-slate-50/50 hover:bg-amber-50/40 hover:border-amber-200 transition text-left group"
                      title={`Click to hear ${item.name}`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-base font-bold text-slate-700">{rawLetter}</span>
                        <span className="text-slate-400 font-serif">→</span>
                        <span className="text-2xl font-bold text-amber-600 bg-white border border-slate-100 p-1 rounded w-10 text-center select-none shadow-sm">
                          {item.ottu.split(' ')[0]}
                        </span>
                      </div>
                      <Volume2 size={14} className="text-slate-400 group-hover:text-amber-600 transition-colors" />
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right pane: Advanced Equation & Scribble Trace Pad */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-md flex flex-col gap-5">
          <div className="flex items-start justify-between border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-4xl font-extrabold text-amber-900 font-sans">
                  {selectedWord.word}
                </h3>
                <button
                  onClick={() => playTTS(selectedWord.word)}
                  className={`p-2 rounded-full transition-all ${
                    ttsState === 'playing'
                      ? 'bg-amber-100 text-amber-800 animate-pulse'
                      : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                }`}
                  title="Speak Word"
                >
                  <Volume2 size={20} />
                </button>
              </div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono mt-1">
                Selected Word Study
              </p>
            </div>
            <div className="text-right flex flex-col items-end">
              <span className="text-xs font-bold text-slate-800 bg-amber-50 border border-amber-100 px-2.5 py-1 rounded-full">
                {selectedWord.meaning}
              </span>
            </div>
          </div>

          {/* Sound breakdown visual math */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col gap-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
              Syllable Construction Formula
            </span>
            <div className="text-sm font-bold text-slate-700 font-sans leading-relaxed">
              {selectedWord.breakdown}
            </div>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed border-t border-slate-200/60 pt-2">
              {selectedWord.description}
            </p>
          </div>

          {ttsMessage && (
            <div className="bg-amber-50 text-amber-800 border border-amber-100 rounded-xl p-3 text-xs leading-relaxed">
              {ttsMessage}
            </div>
          )}

          {/* Practice Canvas for writing word */}
          <div className="border-t border-slate-100 pt-4 mt-1">
            <div className="flex items-center gap-1.5 mb-2">
              <PenTool size={14} className="text-amber-700" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                Practice Drawing {selectedWord.word}
              </span>
            </div>
            <PracticeCanvas guideLetter={selectedWord.word} />
          </div>
        </div>
      </div>
    </div>
  );
}
