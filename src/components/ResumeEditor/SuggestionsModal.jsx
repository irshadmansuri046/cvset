import React, { useState } from 'react';
import { X, Sparkles, Plus, Check } from 'lucide-react';
import { PREWRITTEN_SUGGESTIONS } from '../../constants/sampleData';

export function SuggestionsModal({ isOpen, onClose, onSelectSummary, onSelectBullet, type = 'summary' }) {
  const [selectedRole, setSelectedRole] = useState('Software Engineer');
  const [copiedIndex, setCopiedIndex] = useState(null);

  if (!isOpen) return null;

  const roles = Object.keys(PREWRITTEN_SUGGESTIONS);
  const currentData = PREWRITTEN_SUGGESTIONS[selectedRole] || PREWRITTEN_SUGGESTIONS['Software Engineer'];

  const handleSelect = (text, idx) => {
    setCopiedIndex(idx);
    if (type === 'summary') {
      onSelectSummary(text);
    } else {
      onSelectBullet(text);
    }
    setTimeout(() => {
      setCopiedIndex(null);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-white/10 rounded-lg">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h2 className="text-base font-bold">
                {type === 'summary' ? 'Pre-Written Summary Suggestions' : 'Action-Oriented Bullet Suggestions'}
              </h2>
              <p className="text-xs text-blue-100">
                Crafted by certified recruiters and tested for high ATS pass rates.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Role Selector Tabs */}
        <div className="p-3 bg-slate-50 border-b border-slate-200 flex gap-2 overflow-x-auto text-xs">
          {roles.map((role) => (
            <button
              key={role}
              type="button"
              onClick={() => setSelectedRole(role)}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition ${
                selectedRole === role
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              {role}
            </button>
          ))}
        </div>

        {/* Suggestions List */}
        <div className="p-5 overflow-y-auto space-y-3 flex-1">
          {type === 'summary' ? (
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Summaries for {selectedRole}
              </h3>
              {currentData.summaries?.map((text, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/30 transition group flex flex-col justify-between gap-3"
                >
                  <p className="text-xs text-slate-700 leading-relaxed">
                    "{text}"
                  </p>
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleSelect(text, idx)}
                      className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white transition"
                    >
                      {copiedIndex === idx ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Applied!</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span>Use This Summary</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2.5">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Experience Achievement Bullets for {selectedRole}
              </h3>
              {currentData.bullets?.map((text, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/30 transition flex items-start justify-between gap-3"
                >
                  <p className="text-xs text-slate-700 leading-normal flex-1">
                    • {text}
                  </p>
                  <button
                    type="button"
                    onClick={() => handleSelect(`• ${text}`, idx)}
                    className="flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white transition shrink-0"
                  >
                    {copiedIndex === idx ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <>
                        <Plus className="w-3 h-3" />
                        <span>Add</span>
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-slate-50 border-t border-slate-100 flex justify-between items-center text-xs text-slate-500">
          <span>Clicking 'Use This' will insert the selected text directly into your resume.</span>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 text-slate-600 hover:bg-slate-200 rounded-md transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
