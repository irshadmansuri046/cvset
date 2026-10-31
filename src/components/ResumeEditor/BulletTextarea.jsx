import React, { useRef } from 'react';
import { List, ListOrdered, ListX, Sparkles } from 'lucide-react';

export function BulletTextarea({
  id,
  label,
  value = '',
  onChange,
  placeholder,
  rows = 4,
  className = '',
  actionButton = null,
  tip = null
}) {
  const textareaRef = useRef(null);

  // Toggle or add bullets to lines
  const handleToggleBullets = () => {
    const el = textareaRef.current;
    if (!el) return;

    const start = el.selectionStart || 0;
    const end = el.selectionEnd || 0;
    const text = value || '';

    // If text is empty, just insert initial bullet
    if (!text.trim()) {
      onChange('• ');
      setTimeout(() => {
        el.focus();
        el.setSelectionRange(2, 2);
      }, 0);
      return;
    }

    // Determine lines covered by selection
    const lineStart = text.lastIndexOf('\n', start - 1) + 1;
    let lineEnd = text.indexOf('\n', end);
    if (lineEnd === -1) lineEnd = text.length;

    const selectedBlock = text.substring(lineStart, lineEnd);
    const lines = selectedBlock.split('\n');

    // Check if all lines are already bulleted
    const allBulleted = lines.every(l => l.trim().startsWith('•') || l.trim().startsWith('-') || l.trim().startsWith('*'));

    const modifiedLines = lines.map(line => {
      const trimmed = line.trim();
      if (!trimmed) return line;
      if (allBulleted) {
        // Remove bullets
        return line.replace(/^(\s*)[•\-\*]\s*/, '$1');
      } else {
        // Add bullet if not present
        if (/^[•\-\*]/.test(trimmed)) return line;
        return `• ${trimmed}`;
      }
    });

    const newBlock = modifiedLines.join('\n');
    const newText = text.substring(0, lineStart) + newBlock + text.substring(lineEnd);
    onChange(newText);

    setTimeout(() => {
      el.focus();
      el.setSelectionRange(lineStart, lineStart + newBlock.length);
    }, 0);
  };

  // Toggle or add numbered list
  const handleToggleNumberedList = () => {
    const el = textareaRef.current;
    if (!el) return;

    const start = el.selectionStart || 0;
    const end = el.selectionEnd || 0;
    const text = value || '';

    if (!text.trim()) {
      onChange('1. ');
      setTimeout(() => {
        el.focus();
        el.setSelectionRange(3, 3);
      }, 0);
      return;
    }

    const lineStart = text.lastIndexOf('\n', start - 1) + 1;
    let lineEnd = text.indexOf('\n', end);
    if (lineEnd === -1) lineEnd = text.length;

    const selectedBlock = text.substring(lineStart, lineEnd);
    const lines = selectedBlock.split('\n');

    let counter = 1;
    const modifiedLines = lines.map(line => {
      const trimmed = line.trim();
      if (!trimmed) return line;
      // Strip any existing bullets or numbers
      const cleanLine = trimmed.replace(/^([•\-\*]|\d+[.)])\s*/, '');
      const numbered = `${counter}. ${cleanLine}`;
      counter++;
      return numbered;
    });

    const newBlock = modifiedLines.join('\n');
    const newText = text.substring(0, lineStart) + newBlock + text.substring(lineEnd);
    onChange(newText);

    setTimeout(() => {
      el.focus();
      el.setSelectionRange(lineStart, lineStart + newBlock.length);
    }, 0);
  };

  // Remove bullets and numbers
  const handleClearFormat = () => {
    const el = textareaRef.current;
    if (!el) return;

    const text = value || '';
    const cleaned = text
      .split('\n')
      .map(line => line.replace(/^(\s*)([•\-\*]|\d+[.)])\s*/, '$1'))
      .join('\n');

    onChange(cleaned);
  };

  // Smart keyboard handling: Auto-continue or exit bullets on Enter
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      const el = textareaRef.current;
      if (!el) return;

      const cursor = el.selectionStart;
      const text = value || '';

      // Find current line up to cursor
      const lineStart = text.lastIndexOf('\n', cursor - 1) + 1;
      const currentLine = text.substring(lineStart, cursor);

      // Check if current line starts with bullet
      const bulletMatch = currentLine.match(/^(\s*)([•\-\*])\s*(.*)$/);
      if (bulletMatch) {
        const [, indent, bulletSymbol, content] = bulletMatch;
        // If the bullet has content, press Enter to create a new bullet line
        if (content.trim().length > 0) {
          e.preventDefault();
          const insert = `\n${indent}${bulletSymbol} `;
          const newText = text.substring(0, cursor) + insert + text.substring(cursor);
          onChange(newText);
          setTimeout(() => {
            el.selectionStart = el.selectionEnd = cursor + insert.length;
          }, 0);
          return;
        } else {
          // If the bullet is empty, press Enter to clear the bullet and create an empty line
          e.preventDefault();
          const newText = text.substring(0, lineStart) + text.substring(cursor);
          onChange(newText);
          setTimeout(() => {
            el.selectionStart = el.selectionEnd = lineStart;
          }, 0);
          return;
        }
      }

      // Check if current line starts with a number (e.g. 1. )
      const numberMatch = currentLine.match(/^(\s*)(\d+)[.)]\s*(.*)$/);
      if (numberMatch) {
        const [, indent, numStr, content] = numberMatch;
        if (content.trim().length > 0) {
          e.preventDefault();
          const nextNum = parseInt(numStr, 10) + 1;
          const insert = `\n${indent}${nextNum}. `;
          const newText = text.substring(0, cursor) + insert + text.substring(cursor);
          onChange(newText);
          setTimeout(() => {
            el.selectionStart = el.selectionEnd = cursor + insert.length;
          }, 0);
          return;
        } else {
          // Clear empty number
          e.preventDefault();
          const newText = text.substring(0, lineStart) + text.substring(cursor);
          onChange(newText);
          setTimeout(() => {
            el.selectionStart = el.selectionEnd = lineStart;
          }, 0);
          return;
        }
      }
    }
  };

  const hasBulletsOrNumbers = /^[•\-\*]|\n[•\-\*]|^\d+[.)]|\n\d+[.)]/.test(value);
  const lineCount = (value || '').split('\n').filter(l => l.trim().length > 0).length;

  return (
    <div className={`space-y-1.5 ${className}`}>
      {/* Top Header: Label & Action Button */}
      {(label || actionButton) && (
        <div className="flex justify-between items-center">
          {label && (
            <label htmlFor={id} className="block font-medium text-slate-700 text-xs">
              {label}
            </label>
          )}
          {actionButton}
        </div>
      )}

      {/* Formatting Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-1.5 px-3 py-1.5 bg-slate-100/90 rounded-t-xl border border-b-0 border-slate-200 text-xs">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handleToggleBullets}
            className="flex items-center gap-1 px-2 py-1 text-[11px] font-semibold text-slate-700 hover:text-blue-600 hover:bg-white rounded-md border border-transparent hover:border-slate-200 transition shadow-2xs"
            title="Add Bullet Points (•)"
          >
            <List className="w-3.5 h-3.5 text-blue-600" />
            <span>• Bullet List</span>
          </button>

          <button
            type="button"
            onClick={handleToggleNumberedList}
            className="flex items-center gap-1 px-2 py-1 text-[11px] font-semibold text-slate-700 hover:text-blue-600 hover:bg-white rounded-md border border-transparent hover:border-slate-200 transition shadow-2xs"
            title="Add Numbered List (1, 2, 3...)"
          >
            <ListOrdered className="w-3.5 h-3.5 text-indigo-600" />
            <span>1. Numbered</span>
          </button>

          {hasBulletsOrNumbers && (
            <button
              type="button"
              onClick={handleClearFormat}
              className="flex items-center gap-1 px-2 py-1 text-[11px] font-semibold text-slate-500 hover:text-red-600 hover:bg-white rounded-md border border-transparent hover:border-slate-200 transition shadow-2xs"
              title="Remove all bullets and numbers"
            >
              <ListX className="w-3.5 h-3.5" />
              <span>Clear Bullets</span>
            </button>
          )}
        </div>

        <div className="text-[10px] text-slate-400 font-medium">
          {lineCount > 0 ? `${lineCount} line${lineCount === 1 ? '' : 's'}` : 'Type or add bullets'}
        </div>
      </div>

      {/* Textarea */}
      <textarea
        id={id}
        ref={textareaRef}
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-b-xl focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-hidden text-xs leading-relaxed text-slate-800 font-sans"
      />

      {/* Helpful Hint */}
      <div className="flex justify-between items-center text-[11px] text-slate-400 px-1">
        <span>{tip || 'Press Enter on a bullet line to create the next bullet automatically.'}</span>
        <span>{(value || '').length} chars</span>
      </div>
    </div>
  );
}
