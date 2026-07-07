import React, { useState } from 'react';
import { stories, poems } from '../data/reading';
import { Story, Poem, VocabularyItem } from '../types';
import { Volume2, BookOpen, Music, Languages, ArrowRight, HelpCircle } from 'lucide-react';

export default function ReadingTab() {
  const [activeType, setActiveType] = useState<'stories' | 'poems'>('stories');
  const [selectedStoryIdx, setSelectedStoryIdx] = useState<number>(0);
  const [selectedPoemIdx, setSelectedPoemIdx] = useState<number>(0);
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);
  const [ttsState, setTtsState] = useState<'idle' | 'playing' | 'error'>('idle');
  const [ttsMessage, setTtsMessage] = useState<string | null>(null);

  const activeStory = stories[selectedStoryIdx];
  const activePoem = poems[selectedPoemIdx];

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
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left side list of Stories / Poems */}
      <div className="lg:col-span-4 flex flex-col gap-5">
        
        {/* Toggle between Stories & Poems */}
        <div className="flex bg-slate-100 p-1.5 rounded-xl border border-slate-200">
          <button
            onClick={() => {
              setActiveType('stories');
              setHighlightedIndex(null);
            }}
            className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition flex items-center justify-center gap-2 ${
              activeType === 'stories'
                ? 'bg-white text-amber-800 shadow-sm border border-slate-200/50'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <BookOpen size={16} />
            <span>Stories (ಕಥೆಗಳು)</span>
          </button>
          <button
            onClick={() => {
              setActiveType('poems');
              setHighlightedIndex(null);
            }}
            className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition flex items-center justify-center gap-2 ${
              activeType === 'poems'
                ? 'bg-white text-amber-800 shadow-sm border border-slate-200/50'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Music size={16} />
            <span>Poems (ಕವನಗಳು)</span>
          </button>
        </div>

        {/* List items */}
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

        {/* Tip panel */}
        <div className="bg-amber-50/30 border border-amber-100/50 p-4 rounded-xl flex items-start gap-2.5">
          <HelpCircle size={16} className="text-amber-800 mt-0.5 flex-shrink-0" />
          <div className="text-xs text-amber-900 leading-relaxed">
            <h5 className="font-bold mb-1">How to practice reading:</h5>
            <ol className="list-decimal pl-4 flex flex-col gap-1">
              <li>Listen to each line using the dedicated audio button on that block.</li>
              <li>Practice reading the Kannada script aloud as you listen to the correct pronunciation!</li>
              <li>Learn individual word translations using the Vocabulary table below!</li>
            </ol>
          </div>
        </div>

      </div>

      {/* Right side Active Reading Display */}
      <div className="lg:col-span-8 flex flex-col gap-6">
        
        {/* Story / Poem Content Main Card */}
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

                    {/* Bottom Row: English Translation + Explicit "Listen Option" Indicator */}
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
