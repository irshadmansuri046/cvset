import React from 'react';

const LEVEL_MAP = {
  novice: 1,
  beginner: 2,
  intermediate: 3,
  skillful: 3,
  experienced: 4,
  expert: 5
};

export function SkillBar({ level = 4, color = '#1a91f0', max = 5 }) {
  const numericLevel = typeof level === 'number'
    ? level
    : (LEVEL_MAP[String(level).toLowerCase()] || 3);

  return (
    <div className="flex items-center gap-1.5 mt-1" data-testid="skill-bar">
      {Array.from({ length: max }).map((_, i) => (
        <span
          key={i}
          className={`h-2 w-2 rounded-full transition-colors ${
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
