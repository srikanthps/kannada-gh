import React, { useState } from 'react';
import { vowelSigns, kagunithaSamples } from '../data/kagunitha';
import { consonants } from '../data/alphabet';
import PracticeCanvas from './PracticeCanvas';
import { Volume2, Play, RefreshCw, PenTool, BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';

// Phonetic suffixes mapping
const vowelSounds: { [key: string]: string } = {
  'ಅ': 'uh',
  'ಆ': 'aa',
  'ಇ': 'ee',
  'ಈ': 'eee',
  'ಉ': 'oo',
  'ಊ': 'ooo',
  'ಋ': 'ru',
  'ಎ': 'eh',
  'ಏ': 'ay',
  'ಐ': 'eye',
  'ಒ': 'oh',
  'ಓ': 'ooh',
  'ಔ': 'ow',
  'ಅಂ': 'um',
  'ಅಃ': 'uh-huh'
};

const consonantLetters = consonants.map(c => c.letter);

// Groups consonants into 5 groups of 5, then groups of 4 for the remaining
const groupedConsonantLetters: string[][] = [];
for (let i = 0; i < 5; i++) {
  const start = i * 5;
  if (start < consonantLetters.length) {
    groupedConsonantLetters.push(consonantLetters.slice(start, start + 5));
  }
}
let remainingStart = 25;
while (remainingStart < consonantLetters.length) {
  groupedConsonantLetters.push(consonantLetters.slice(remainingStart, remainingStart + 4));
  remainingStart += 4;
}

export default function KagunithaTab() {
  const [selectedConsonant, setSelectedConsonant] = useState<string>('ಕ');
  const [selectedCellIdx, setSelectedCellIdx] = useState<number>(0);
  const [ttsState, setTtsState] = useState<'idle' | 'playing' | 'error'>('idle');
  const [ttsMessage, setTtsMessage] = useState<string | null>(null);

  // Dynamic row generator for any consonant
  const generateKagunithaRow = (consonant: string, translit: string, name: string) => {
    // Extract consonant root translit (e.g., 'ka' -> 'k', 'ca / ...' -> ['c', 'ch'])
    const roots = translit.split('/').map(part => {
      const trimmed = part.trim();
      if (trimmed.endsWith('a')) {
        return trimmed.slice(0, -1);
      }
      return trimmed;
    });

    // Extract consonant base pronunciation name (e.g., 'Ka' -> 'k')
    const baseName = name.split(' ')[0];
    const rootSound = baseName.toLowerCase().endsWith('a') ? baseName.slice(0, -1) : baseName;

    return vowelSigns.map(vs => {
      const pureVowel = vs.vowel.split(' ')[0]; // e.g. 'ಅ'
      const sign = vs.sign === 'None' ? '' : vs.sign;
      
      // Combined conjunct letter
      const combined = consonant + sign;
      
      // Combined transliteration (e.g. 'k' + 'ā' = 'kā')
      const pureVowelTranslit = vs.transliteration.split('/')[0].trim();
      const combinedTranslit = roots.map(r => {
        if (pureVowel === 'ಅ') return r + 'a';
        return r + pureVowelTranslit;
      }).join(' / ');
      
      // Pronunciation sound (e.g. 'k' + 'aa' = 'k-aa')
      const vowelSound = vowelSounds[pureVowel] || 'uh';
      const pronunciation = `${rootSound.toLowerCase()}-${vowelSound}`;
      
      return {
        vowel: pureVowel,
        combined,
        transliteration: combinedTranslit,
        pronunciation
      };
    });
  };

  const getActiveKagunithaRow = () => {
    // 1. Prefer custom manual sample preset if exists for high-quality audio
    const preset = kagunithaSamples.find(s => s.consonant === selectedConsonant);
    if (preset) return preset;

    // 2. Otherwise generate dynamically for any of the 34 consonants
    const meta = consonants.find(c => c.letter === selectedConsonant);
    if (meta) {
      const generatedRow = generateKagunithaRow(meta.letter, meta.transliteration, meta.name);
      return {
        consonant: meta.letter,
        consonantName: meta.name,
        row: generatedRow
      };
    }

    return kagunithaSamples[0];
  };

  const currentSample = getActiveKagunithaRow();
  const activeCell = currentSample.row[selectedCellIdx];

  // Paginated selection variables for 34 consonants
  const currentIndex = consonantLetters.indexOf(selectedConsonant);
  const currentPage = Math.floor(currentIndex / 5);
  const maxPages = Math.ceil(consonantLetters.length / 5);
  
  const startIndex = currentPage * 5;
  const endIndex = Math.min(startIndex + 5, consonantLetters.length);
  const pageLetters = consonantLetters.slice(startIndex, endIndex);

  const groupLabels = [
    "Classified Group 1 (ಕ-ವರ್ಗ)",
    "Classified Group 2 (ಚ-ವರ್ಗ)",
    "Classified Group 3 (ಟ-ವರ್ಗ)",
    "Classified Group 4 (ತ-ವರ್ಗ)",
    "Classified Group 5 (ಪ-ವರ್ಗ)",
    "Unclassified Group 1 (ಅವರ್ಗೀಯ - ಯ)",
    "Unclassified Group 2 (ಅವರ್ಗೀಯ - ಷ)"
  ];
  const currentGroupLabel = groupLabels[currentPage] || "";

  const handlePrevPage = () => {
    if (currentPage > 0) {
      const prevIndex = (currentPage - 1) * 5;
      setSelectedConsonant(consonantLetters[prevIndex]);
      setSelectedCellIdx(0);
    }
  };

  const handleNextPage = () => {
    if (currentPage < maxPages - 1) {
      const nextIndex = (currentPage + 1) * 5;
      setSelectedConsonant(consonantLetters[nextIndex]);
      setSelectedCellIdx(0);
    }
  };

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
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                  Step 1: Choose any Consonant (ವ್ಯಂಜನ - ೩೪)
                </span>
                <span className="text-[10px] font-bold text-slate-500 font-mono bg-slate-100 px-2 py-0.5 rounded-full">
                  Set {currentPage + 1} of {maxPages}
                </span>
              </div>
              
              <div className="flex items-center gap-3">
                {/* Left Navigation Arrow */}
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 0}
                  className={`p-2 rounded-xl border transition flex items-center justify-center min-h-[42px] min-w-[42px] ${
                    currentPage === 0
                      ? 'opacity-30 cursor-not-allowed bg-slate-50 border-slate-100 text-slate-400'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-amber-50/50 hover:border-amber-200'
                  }`}
                  title="Previous Group"
                >
                  <ChevronLeft size={18} />
                </button>

                {/* 5 Letters Grid */}
                <div className="grid grid-cols-5 gap-2 flex-1">
                  {pageLetters.map((char) => {
                    const meta = consonants.find(c => c.letter === char);
                    const nameLabel = meta ? meta.name.split(' ')[0] : '';
                    const isSelected = selectedConsonant === char;
                    return (
                      <button
                        key={char}
                        onClick={() => {
                          setSelectedConsonant(char);
                          setSelectedCellIdx(0); // reset cell selection
                        }}
                        className={`py-1 rounded-xl text-xs font-black border transition flex flex-col items-center justify-center min-h-[42px] ${
                          isSelected
                            ? 'bg-amber-500 border-amber-600 text-white shadow-sm ring-1 ring-amber-400'
                            : 'bg-slate-50 border-slate-200/60 text-slate-800 hover:bg-amber-50/50 hover:border-amber-200'
                        }`}
                      >
                        <span className="text-sm">{char}</span>
                        <span className={`text-[8px] font-normal ${isSelected ? 'text-amber-100' : 'text-slate-400'}`}>
                          {nameLabel}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Right Navigation Arrow */}
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === maxPages - 1}
                  className={`p-2 rounded-xl border transition flex items-center justify-center min-h-[42px] min-w-[42px] ${
                    currentPage === maxPages - 1
                      ? 'opacity-30 cursor-not-allowed bg-slate-50 border-slate-100 text-slate-400'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-amber-50/50 hover:border-amber-200'
                  }`}
                  title="Next Group"
                >
                  <ChevronRight size={18} />
                </button>
              </div>

              {/* Group Name Display */}
              <div className="text-center mt-2 text-[10px] font-black text-amber-800/80 uppercase tracking-widest">
                {currentGroupLabel}
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

          {/* Sound Equation Diagram */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col gap-2.5 items-center justify-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block text-center">
              How this letter is constructed (ಗುಣಿತಾಕ್ಷರ ಸಂಯೋಜನೆ):
            </span>
            <div className="flex items-center gap-3 text-xl font-bold text-slate-800 font-sans py-2">
              <span className="bg-slate-50 border border-slate-200/60 px-3 py-1.5 rounded-lg shadow-xs text-slate-700">
                {currentSample.consonant}್
              </span>
              <span className="text-amber-500 font-serif">+</span>
              <span className="bg-slate-50 border border-slate-200/60 px-3 py-1.5 rounded-lg shadow-xs text-slate-700">
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

        </div>

        {/* Right column: Interactive Detail & Trace Pad */}
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
                Kagunitha Letter
              </p>
            </div>
            <div className="text-right flex flex-col items-end">
              <span className="text-[10px] bg-amber-50 text-amber-800 px-2 py-0.5 rounded border border-amber-100 font-mono font-medium">
                /{activeCell.transliteration}/
              </span>
            </div>
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

      {/* Vowel Marks Cheat-sheet Table */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm mt-4">
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
  );
}
