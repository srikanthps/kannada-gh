import React, { useState } from 'react';
import { vowelSigns, kagunithaSamples } from '../data/kagunitha';
import PracticeCanvas from './PracticeCanvas';
import { Volume2, Play, RefreshCw, PenTool, BookOpen } from 'lucide-react';

export default function KagunithaTab() {
  const [selectedSampleIdx, setSelectedSampleIdx] = useState<number>(0);
  const [selectedCellIdx, setSelectedCellIdx] = useState<number>(0);
  const [ttsState, setTtsState] = useState<'idle' | 'playing' | 'error'>('idle');
  const [ttsMessage, setTtsMessage] = useState<string | null>(null);

  const currentSample = kagunithaSamples[selectedSampleIdx];
  const activeCell = currentSample.row[selectedCellIdx];

  const playTTS = (text: string) => {
    if (!('speechSynthesis' in window)) {
      setTtsState('error');
      setTtsMessage('Speech synthesis is not supported in this browser.');
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
        setTtsMessage('Kannada voice pack not fully loaded on this device.');
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

  return (
    <div className="flex flex-col gap-8">
      {/* Introduction to Kagunitha */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50/50 p-6 rounded-2xl border border-amber-100 shadow-sm">
        <h3 className="text-xl font-bold text-amber-900 mb-2">
          What is Kagunitha (ಕಗುಣಿತ)?
        </h3>
        <p className="text-sm text-amber-800 leading-relaxed max-w-4xl">
          <strong>Kagunitha (Gunithakshara)</strong> represents consonant-vowel combinations in Kannada. 
          When a pure consonant (e.g. ಕ್ - k) blends with an independent vowel (e.g. ಅ - a, ಆ - aa), it forms a fully voiced syllable 
          (e.g. ಕ - ka, ಕಾ - kaa). Special shapes called <strong>Vowel Signs</strong> (Gunitakshara symbols) are attached to the consonant 
          to indicate which vowel sound is blended.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left column: Cheat Sheet & Row Generator */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          
          {/* Active Consonant Row Selector */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col gap-4">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                Step 1: Choose a Consonant (ವ್ಯಂಜನ)
              </span>
              <div className="flex flex-wrap gap-2">
                {kagunithaSamples.map((sample, idx) => (
                  <button
                    key={sample.consonant}
                    onClick={() => {
                      setSelectedSampleIdx(idx);
                      setSelectedCellIdx(0); // reset cell selection
                    }}
                    className={`px-4 py-2 text-sm rounded-lg font-bold border transition ${
                      selectedSampleIdx === idx
                        ? 'bg-amber-500 border-amber-600 text-white shadow-sm'
                        : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                    }`}
                  >
                    {sample.consonant} <span className="font-normal font-sans text-xs">({sample.consonantName})</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Generated Kagunitha Row Grid */}
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">
                Step 2: Interactive Kagunitha Row for {currentSample.consonant}
              </span>
              <div className="grid grid-cols-5 sm:grid-cols-8 gap-2">
                {currentSample.row.map((cell, idx) => {
                  const isSelected = selectedCellIdx === idx;
                  return (
                    <button
                      key={cell.vowel}
                      onClick={() => setSelectedCellIdx(idx)}
                      className={`aspect-square p-2 rounded-xl border flex flex-col justify-between items-center transition-all ${
                        isSelected
                          ? 'bg-amber-50 border-amber-400 text-amber-900 shadow-sm ring-2 ring-amber-300 ring-offset-1'
                          : 'bg-white border-slate-100 text-slate-800 hover:border-amber-200 hover:bg-amber-50/10'
                      }`}
                    >
                      <span className="text-2xl font-bold select-none">{cell.combined}</span>
                      <span className="text-[9px] font-mono font-medium text-slate-400">
                        {cell.vowel}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Vowel Marks Cheat-sheet Table */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
            <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
              <BookOpen size={16} className="text-amber-700" />
              <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                Vowel Signs Cheat-Sheet (ಗುಣಿತಾಕ್ಷರ ಚಿಹ್ನೆಗಳು)
              </h4>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 uppercase font-mono tracking-wider font-semibold">
                    <th className="py-2">Vowel</th>
                    <th className="py-2">Sign Shape</th>
                    <th className="py-2">Sign Name</th>
                    <th className="py-2">Example with {currentSample.consonant}</th>
                    <th className="py-2">Sound</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {vowelSigns.map((v) => {
                    // Match sign example letter
                    const sampleCombined = currentSample.row.find(cell => v.vowel.startsWith(cell.vowel))?.combined || v.example;
                    return (
                      <tr key={v.vowel} className="hover:bg-slate-50/50 transition">
                        <td className="py-2 font-bold font-sans text-amber-900">{v.vowel}</td>
                        <td className="py-2 text-lg font-bold font-mono text-slate-500">{v.sign}</td>
                        <td className="py-2 text-slate-600 font-sans">{v.name}</td>
                        <td className="py-2 font-bold text-amber-700 font-sans text-sm">{sampleCombined}</td>
                        <td className="py-2 font-mono text-[10px] text-slate-400">/{v.transliteration}/</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Right column: Interactive Detail, Equation Card & Trace Pad */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-md flex flex-col gap-5">
          <div className="flex items-start justify-between border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-5xl font-extrabold text-amber-900 font-sans">
                  {activeCell.combined}
                </h3>
                <button
                  onClick={() => playTTS(activeCell.combined)}
                  className={`p-2 rounded-full transition-all ${
                    ttsState === 'playing'
                      ? 'bg-amber-100 text-amber-800 animate-pulse'
                      : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                  }`}
                  title="Pronounce"
                >
                  <Volume2 size={22} />
                </button>
              </div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono mt-1">
                Kagunitha Combination
              </p>
            </div>
            <div className="text-right flex flex-col items-end">
              <span className="text-[10px] bg-amber-50 text-amber-800 px-2 py-0.5 rounded border border-amber-100 font-mono font-medium">
                /{activeCell.transliteration}/
              </span>
            </div>
          </div>

          {/* Sound Equation Diagram */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col gap-2 items-center justify-center">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block text-center">
              How this letter is constructed:
            </span>
            <div className="flex items-center gap-3 text-xl font-bold text-slate-800 font-sans py-2">
              <span className="bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm text-slate-700">
                {currentSample.consonant}್
              </span>
              <span className="text-amber-500 font-serif">+</span>
              <span className="bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm text-slate-700">
                {activeCell.vowel}
              </span>
              <span className="text-amber-500 font-serif">=</span>
              <span className="bg-amber-500 border border-amber-600 text-white px-3 py-1.5 rounded-lg shadow-sm">
                {activeCell.combined}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-mono text-center mt-1">
              {currentSample.consonantName} (silent consonant) + {activeCell.vowel} (vowel) = {activeCell.combined} (/{activeCell.transliteration}/)
            </p>
          </div>

          {/* Speech Helper Notice if any */}
          {ttsMessage && (
            <div className="bg-amber-50 text-amber-800 border border-amber-100 rounded-xl p-3 text-xs leading-relaxed">
              {ttsMessage}
            </div>
          )}

          {/* Pronunciation description */}
          <div className="bg-amber-50/20 p-3.5 rounded-xl border border-amber-100/50">
            <span className="text-[10px] font-bold text-amber-800/60 uppercase tracking-widest block mb-0.5">
              Phonetic Hint
            </span>
            <p className="text-sm font-medium text-amber-900/80">
              Sounds like <code className="font-mono bg-white px-1.5 py-0.5 rounded text-amber-800 border border-amber-100">{activeCell.pronunciation}</code>.
            </p>
          </div>

          {/* Practice Canvas integration */}
          <div className="border-t border-slate-100 pt-4 mt-1">
            <div className="flex items-center gap-1.5 mb-2">
              <PenTool size={14} className="text-amber-700" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                Practice Tracing &amp; Writing {activeCell.combined}
              </span>
            </div>
            <PracticeCanvas guideLetter={activeCell.combined} />
          </div>

        </div>
      </div>
    </div>
  );
}
