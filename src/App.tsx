import React, { useState } from 'react';
import AlphabetTab from './components/AlphabetTab';
import KagunithaTab from './components/KagunithaTab';
import OttaksharaTab from './components/OttaksharaTab';
import ReadingTab from './components/ReadingTab';
import ScribblePadTab from './components/ScribblePadTab';
import { BookOpen, Compass, Award, Heart, Edit3, Sparkles, ArrowLeft } from 'lucide-react';

type TabType = 'alphabet' | 'kagunitha' | 'ottakshara' | 'reading' | 'canvas';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType | null>(null);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800 antialiased font-sans pb-12">
      {/* Karnataka Red-Yellow Aesthetic Top Accent Strip */}
      <div className="h-2.5 w-full flex">
        <div className="flex-1 bg-[#fde047]" title="Karnataka Yellow" />
        <div className="flex-1 bg-[#de2910]" title="Karnataka Red" />
      </div>

      {/* Hero Header Section */}
      <header className="bg-white border-b border-slate-100 shadow-xs relative overflow-hidden py-5">
        {/* Subtle Decorative background circles */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-50 rounded-full blur-3xl -mr-20 -mt-20 opacity-40 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-50 rounded-full blur-3xl -ml-20 -mb-20 opacity-30 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setActiveTab(null)}
                className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center text-white text-xl font-extrabold shadow-sm hover:rotate-6 transition select-none"
              >
                ಕ
              </button>
              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 
                    onClick={() => setActiveTab(null)}
                    className="text-2xl font-extrabold tracking-tight text-amber-950 font-sans cursor-pointer hover:text-amber-800 transition"
                  >
                    Kannada Kaliyona
                  </h1>
                  <span className="text-xs font-bold bg-amber-100 text-amber-950 border border-amber-200/50 px-2.5 py-0.5 rounded-full font-sans">
                    ಕನ್ನಡ ಕಲಿಯೋಣ
                  </span>
                </div>
              </div>
            </div>

            {/* Back Button displayed when viewing any tab */}
            {activeTab !== null && (
              <button
                id="btn-nav-home"
                onClick={() => setActiveTab(null)}
                className="flex items-center gap-2 px-6 py-3 bg-[#de2910] hover:bg-[#c2200c] text-white text-xs sm:text-sm font-black rounded-2xl transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 border border-red-600/30"
              >
                <ArrowLeft size={16} className="stroke-[3px]" />
                <span>Back to Main Menu (ಮುಖಪುಟಕ್ಕೆ ಹಿಂತಿರುಗಿ)</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 flex flex-col gap-8 flex-grow w-full">
        
        {/* VIEW 1: Landing Dashboard (Only shown when activeTab is null) */}
        {activeTab === null && (
          <div className="flex flex-col gap-8 justify-center items-center py-6 flex-grow">
            <div className="text-center max-w-xl flex flex-col gap-2">
              <h2 className="text-3xl font-extrabold text-amber-950 tracking-tight">
                What would you like to learn today?
              </h2>
              <p className="text-sm text-slate-500 font-medium">
                Choose an interactive study guide below to practice reading, writing with a stylus, or exploring Kannada poetry.
              </p>
            </div>

            {/* Large Bento Grid for Dashboard selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 w-full max-w-6xl mt-4">
              {[
                {
                  id: 'alphabet',
                  title: 'Aksharamale',
                  native: 'ಅಕ್ಷರಮಾಲೆ',
                  desc: 'Vowels, Consonants & Tracing levels',
                  icon: BookOpen,
                  bgColor: 'hover:border-amber-400 group-hover:bg-amber-500/10',
                  iconColor: 'bg-amber-500 text-white',
                  borderColor: 'border-amber-200/60'
                },
                {
                  id: 'kagunitha',
                  title: 'Kagunitha',
                  native: 'ಕಗುಣಿತ',
                  desc: 'Vowel-Consonant combining grids',
                  icon: Compass,
                  bgColor: 'hover:border-orange-400 group-hover:bg-orange-500/10',
                  iconColor: 'bg-orange-500 text-white',
                  borderColor: 'border-orange-200/60'
                },
                {
                  id: 'ottakshara',
                  title: 'Ottakshara',
                  native: 'ಒತ್ತಕ್ಷರ',
                  desc: 'Double-stops & Conjunct sounds',
                  icon: Award,
                  bgColor: 'hover:border-red-400 group-hover:bg-red-500/10',
                  iconColor: 'bg-red-500 text-white',
                  borderColor: 'border-red-200/60'
                },
                {
                  id: 'reading',
                  title: 'Reading Room',
                  native: 'ಓದುವ ಕೋಣೆ',
                  desc: 'Classic regional stories & poems',
                  icon: Heart,
                  bgColor: 'hover:border-emerald-400 group-hover:bg-emerald-500/10',
                  iconColor: 'bg-emerald-500 text-white',
                  borderColor: 'border-emerald-200/60'
                },
                {
                  id: 'canvas',
                  title: 'Scribble Pad',
                  native: 'ಬರಹ ಫಲಕ',
                  desc: 'Free whiteboard stylus writing',
                  icon: Edit3,
                  bgColor: 'hover:border-blue-400 group-hover:bg-blue-500/10',
                  iconColor: 'bg-blue-500 text-white',
                  borderColor: 'border-blue-200/60'
                }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    id={`nav-tab-${tab.id}`}
                    onClick={() => setActiveTab(tab.id as TabType)}
                    className={`flex flex-col p-6 rounded-3xl text-left border bg-white transition-all duration-300 relative overflow-hidden group shadow-sm hover:shadow-md hover:scale-[1.03] active:scale-[0.98] ${tab.bgColor} ${tab.borderColor} min-h-[190px]`}
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-slate-500/5 rounded-full blur-xl -mr-6 -mt-6 group-hover:bg-amber-500/10 transition-colors" />

                    <div className={`p-3.5 rounded-2xl mb-5 self-start transition-all shadow-xs ${tab.iconColor}`}>
                      <Icon size={22} />
                    </div>

                    <div className="font-extrabold text-base text-slate-800 group-hover:text-amber-950 transition flex items-center gap-1.5 leading-tight">
                      {tab.title}
                    </div>
                    <div className="text-sm font-semibold text-slate-400 font-sans mt-0.5">{tab.native}</div>
                    <p className="text-xs text-slate-400 font-medium mt-3 border-t border-slate-100/70 pt-3 leading-relaxed">
                      {tab.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* VIEW 2: Active Tab View Panel (Takes up full space once selected) */}
        {activeTab !== null && (
          <div className="w-full">
            {activeTab === 'alphabet' && <AlphabetTab />}
            {activeTab === 'kagunitha' && <KagunithaTab />}
            {activeTab === 'ottakshara' && <OttaksharaTab />}
            {activeTab === 'reading' && <ReadingTab />}
            {activeTab === 'canvas' && <ScribblePadTab />}
          </div>
        )}

      </main>

      {/* Footer Branding */}
      <footer className="mt-auto border-t border-slate-200/60 bg-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 font-medium">
          <div className="flex items-center gap-2">
            <span>© 2026 Kannada Kali</span>
            <span className="text-slate-300">|</span>
            <span className="text-amber-800">ಸಿರಿಗನ್ನಡಂ ಗೆಲ್ಗೆ, ಸಿರಿಗನ್ನಡಂ ಬಾಳ್ಗೆ!</span>
          </div>
          <div>
            <span>Crafted with pure client-side React, Tailwind &amp; HTML5 Speech Synthesis</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
