import React, { useState } from 'react';
import { Wrench, Plus, Trash2, Sparkles } from 'lucide-react';

const COMMON_SKILL_SUGGESTIONS = [
  "React.js", "TypeScript", "JavaScript", "Python", "Node.js", 
  "SQL", "Git", "Docker", "AWS", "Communication", "Team Leadership", 
  "Problem Solving", "Figma", "REST APIs", "Project Management"
];

export function SkillsForm({ skills = [], onChange }) {
  const [newSkillName, setNewSkillName] = useState('');

  const handleAddSkill = (name) => {
    const trimmed = (name || newSkillName).trim();
    if (!trimmed) return;
    if (skills.some(s => s.name.toLowerCase() === trimmed.toLowerCase())) return;

    const newSkill = {
      id: "sk-" + Date.now() + Math.random().toString(36).substr(2, 4),
      name: trimmed,
      level: 4
    };
    onChange([...skills, newSkill]);
    setNewSkillName('');
  };

  const handleUpdateLevel = (id, level) => {
    onChange(skills.map(s => s.id === id ? { ...s, level: Number(level) } : s));
  };

  const handleDelete = (id) => {
    onChange(skills.filter(s => s.id !== id));
  };

  const levelLabels = {
    1: "Novice",
    2: "Beginner",
    3: "Skillful",
    4: "Experienced",
    5: "Expert"
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-violet-50 text-violet-600 rounded-lg">
            <Wrench className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-800">Skills</h2>
            <p className="text-xs text-slate-500">
              Highlight your top 5-10 core competencies to match job descriptions and pass ATS filters.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Add Suggested Skills Chips */}
      <div>
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mb-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Quick Add Popular Skills:</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {COMMON_SKILL_SUGGESTIONS.map((skillName) => {
            const isAdded = skills.some(s => s.name.toLowerCase() === skillName.toLowerCase());
            return (
              <button
                key={skillName}
                type="button"
                disabled={isAdded}
                onClick={() => handleAddSkill(skillName)}
                className={`text-xs px-2.5 py-1 rounded-lg border transition flex items-center gap-1 ${
                  isAdded
                    ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-default'
                    : 'bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 border-slate-200 hover:border-blue-300'
                }`}
              >
                <span>{isAdded ? '✓' : '+'}</span>
                <span>{skillName}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Add Custom Skill Input */}
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Type a skill and press Enter..."
          value={newSkillName}
          onChange={(e) => setNewSkillName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()}
          className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white outline-hidden text-slate-800"
        />
        <button
          type="button"
          onClick={() => handleAddSkill()}
          className="px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add</span>
        </button>
      </div>

      {/* Skills list with proficiency sliders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
        {skills.map((skill) => (
          <div
            key={skill.id}
            className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex flex-col gap-2"
          >
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-800 truncate mr-2">{skill.name}</span>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                  {levelLabels[skill.level] || 'Proficient'}
                </span>
                <button
                  type="button"
                  onClick={() => handleDelete(skill.id)}
                  className="text-slate-400 hover:text-red-600 p-0.5 rounded"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="range"
                min="1"
                max="5"
                step="1"
                value={skill.level || 3}
                onChange={(e) => handleUpdateLevel(skill.id, e.target.value)}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <span className="text-[11px] font-mono text-slate-500 w-6 text-right">
                {skill.level}/5
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
