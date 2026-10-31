import React from 'react';

const LEVEL_MAP = {
  novice: 1,
  beginner: 2,
  intermediate: 3,
  skillful: 3,
  experienced: 4,
  expert: 5
};

export function SkillBar({ level = 4, color = '#1a91f0', max = 5, compact = false }) {
  const numericLevel = typeof level === 'number'
    ? level
    : (LEVEL_MAP[String(level).toLowerCase()] || 3);

  const dotSize = compact ? 'h-1.5 w-1.5' : 'h-2 w-2';
  const gap = compact ? 'gap-1' : 'gap-1.5';
  const margin = compact ? 'mt-0' : 'mt-1';

  return (
    <div className={`flex items-center ${gap} ${margin} shrink-0`} data-testid="skill-bar">
      {Array.from({ length: max }).map((_, i) => (
        <span
          key={i}
          className={`${dotSize} rounded-full transition-colors ${
            i < numericLevel ? 'opacity-100' : 'opacity-25 bg-slate-300'
          }`}
          style={{
            backgroundColor: i < numericLevel ? color : undefined
          }}
        />
      ))}
    </div>
  );
}
