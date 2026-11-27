import React, { useEffect, useState } from 'react';
import { Eye, Sparkles, Compass, ImageIcon } from 'lucide-react';
import {
  ImageInterpretiveHotspot,
  SimulationVisualConfig,
} from '../data/simulationVisuals';

interface SimulationImageInterpreterProps {
  visual: SimulationVisualConfig;
  imageOverride?: string;
  titleOverride?: string;
  bilingualMode: boolean;
  /** Optional dynamic spotlight zone highlight tied to simulation state */
  activeLensZone?: 'left' | 'center' | 'right' | 'full';
  lensLabelHindi?: string;
  exploredKeys: string[];
  onInterpretClue: (clueKey: string) => void;
}

export const SimulationImageInterpreter: React.FC<SimulationImageInterpreterProps> = ({
  visual,
  imageOverride,
  titleOverride,
  bilingualMode,
  activeLensZone = 'full',
  lensLabelHindi,
  exploredKeys,
  onInterpretClue,
}) => {
  const hotspots = visual.hotspots || [];
  const [activeHotspotId, setActiveHotspotId] = useState<string>(
    hotspots[0]?.id || ''
  );
  const [imageError, setImageError] = useState<boolean>(false);

  useEffect(() => {
    setActiveHotspotId(hotspots[0]?.id || '');
    setImageError(false);
  }, [visual.moduleId, imageOverride]);

  const activeHotspot: ImageInterpretiveHotspot | undefined =
    hotspots.find((h) => h.id === activeHotspotId) || hotspots[0];

  const displayUrl = imageOverride || visual.imageUrl;

  const handleClickHotspot = (spot: ImageInterpretiveHotspot) => {
    setActiveHotspotId(spot.id);
    onInterpretClue(`img:${visual.moduleId}:${spot.id}`);
  };

  return (
    <div className="rounded-2xl bg-[#070B16] border border-slate-800/90 overflow-hidden shadow-xl">
      {/* Top Scene Bar */}
      <div className="px-4 sm:px-5 py-3 bg-[#0D1326] border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <Compass className="w-4 h-4 text-amber-400 shrink-0" />
          <div className="min-w-0">
            <div className="text-xs sm:text-sm font-black text-slate-100 truncate font-hindi">
              {titleOverride || visual.sceneTitleHindi}
            </div>
            {bilingualMode && !titleOverride && (
              <div className="text-[11px] text-slate-400 truncate">
                {visual.sceneTitleEnglish}
              </div>
            )}
          </div>
        </div>

        {lensLabelHindi ? (
          <span className="text-[11px] font-bold text-amber-300 bg-amber-500/10 border border-amber-400/25 px-2.5 py-1 rounded-lg whitespace-nowrap shrink-0">
            {lensLabelHindi}
          </span>
        ) : (
          <span className="text-[11px] font-semibold text-slate-300 whitespace-nowrap shrink-0">
            दृश्य संकेत-बिंदु पर क्लिक करें
          </span>
        )}
      </div>

      {/* Illustrated Image Stage with Optical Zone Overlay & Clickable Hotspots */}
      <div className="relative aspect-[16/7] min-h-[210px] sm:min-h-[260px] w-full bg-[#060913] overflow-hidden select-none">
        {!imageError ? (
          <img
            src={displayUrl}
            alt={visual.imageAlt}
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover object-center transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#0F172A] via-[#0B1120] to-[#1E1B4B] flex flex-col items-center justify-center p-6 text-center gap-2">
            <ImageIcon className="w-8 h-8 text-amber-400/80" />
            <div className="text-sm font-black text-slate-100 font-hindi">
              {titleOverride || visual.sceneTitleHindi}
            </div>
          </div>
        )}

        {/* Measured Dark Scrim for WCAG AA Contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#060913] via-[#060913]/25 to-[#060913]/55 pointer-events-none" />

        {/* Dynamic Optical Spotlight Scrim (Left / Center / Right) linked to active Simulation Control */}
        {activeLensZone !== 'full' && (
          <div
            className={`absolute inset-y-0 pointer-events-none transition-all duration-500 ${
              activeLensZone === 'left'
                ? 'left-0 w-[44%] bg-amber-400/10 border-r border-amber-400/40 shadow-[inset_0_0_45px_rgba(245,158,11,0.18)]'
                : activeLensZone === 'right'
                ? 'right-0 w-[44%] bg-amber-400/10 border-l border-amber-400/40 shadow-[inset_0_0_45px_rgba(245,158,11,0.18)]'
                : 'left-[28%] w-[44%] bg-amber-400/12 border-x border-amber-400/45 shadow-[inset_0_0_55px_rgba(245,158,11,0.22)]'
            }`}
          />
        )}

        {/* Interactive Image Hotspots */}
        {hotspots.map((spot, idx) => {
          const isSelected = activeHotspot?.id === spot.id;
          const isInterpreted = exploredKeys.includes(
            `img:${visual.moduleId}:${spot.id}`
          );
          return (
            <button
              key={spot.id}
              type="button"
              onClick={() => handleClickHotspot(spot)}
              style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
              aria-label={spot.labelHindi}
              className={`absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300 rounded-full transition-transform duration-200 ${
                isSelected ? 'scale-110 z-20' : 'hover:scale-105 z-10'
              }`}
            >
              <span
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-black border-2 shadow-lg transition-colors tabular-nums ${
                  isSelected
                    ? 'bg-amber-400 text-slate-950 border-white ring-4 ring-amber-400/35'
                    : isInterpreted
                    ? 'bg-emerald-500 text-slate-950 border-emerald-200'
                    : 'bg-[#0B1120]/90 text-amber-300 border-amber-400/80 hover:bg-amber-400 hover:text-slate-950'
                }`}
              >
                {idx + 1}
              </span>
            </button>
          );
        })}

        {/* Bottom Caption Strip inside image */}
        <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between gap-3 pointer-events-none">
          <div className="text-[11px] sm:text-xs font-bold text-slate-200/95 bg-[#060913]/85 backdrop-blur-sm border border-white/10 px-3 py-1.5 rounded-xl font-hindi truncate">
            {visual.interpretivePromptHindi}
          </div>
          <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-bold text-amber-300 bg-[#060913]/85 backdrop-blur-sm border border-amber-400/25 px-3 py-1.5 rounded-xl shrink-0">
            <Eye className="w-3.5 h-3.5" />
            <span>{hotspots.length} दृश्य संकेत</span>
          </div>
        </div>
      </div>

      {/* Hotspot Selector Tabs + Image-Based Grammar Reasoning Readout */}
      {activeHotspot && (
        <div className="p-4 sm:p-5 bg-[#0B1120] border-t border-slate-800 space-y-3.5">
          {/* Tactile Clue Switcher */}
          <div className="flex flex-wrap gap-2">
            {hotspots.map((spot, idx) => {
              const isSelected = activeHotspot.id === spot.id;
              const isInterpreted = exploredKeys.includes(
                `img:${visual.moduleId}:${spot.id}`
              );
              return (
                <button
                  key={spot.id}
                  type="button"
                  onClick={() => handleClickHotspot(spot)}
                  className={`px-3 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-2 ${
                    isSelected
                      ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-xs'
                      : isInterpreted
                      ? 'bg-emerald-950/60 text-emerald-200 border-emerald-500/40 hover:border-emerald-400'
                      : 'bg-[#111827] text-slate-200 border-slate-700 hover:border-amber-400/50'
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-md text-[11px] font-black flex items-center justify-center tabular-nums ${
                      isSelected
                        ? 'bg-slate-950 text-amber-300'
                        : 'bg-slate-800 text-amber-300'
                    }`}
                  >
                    {idx + 1}
                  </span>
                  <span className="font-hindi">{spot.labelHindi}</span>
                </button>
              );
            })}
          </div>

          {/* Picture-to-Grammar Explanation Cards */}
          <div className="grid md:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-[#111827] border border-slate-800 space-y-1">
              <div className="text-[11px] font-black text-amber-300 uppercase tracking-wide flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 shrink-0" />
                <span>चित्र में क्या दिखाई दे रहा है? (Scene Clue)</span>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-slate-100 leading-relaxed font-hindi tracking-[0.01em]">
                {activeHotspot.clueHindi}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-950/35 border border-emerald-500/30 space-y-1">
              <div className="text-[11px] font-black text-emerald-300 uppercase tracking-wide flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 shrink-0" />
                <span>चित्र से निकलने वाला व्याकरण तर्क (Grammar Logic)</span>
              </div>
              <p className="text-xs sm:text-sm font-bold text-emerald-100 leading-relaxed font-hindi tracking-[0.01em]">
                {activeHotspot.grammarLinkHindi}
              </p>
              {bilingualMode && activeHotspot.grammarLinkEnglish && (
                <p className="text-[11px] text-emerald-200/80">
                  {activeHotspot.grammarLinkEnglish}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
