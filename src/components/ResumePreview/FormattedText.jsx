import React from 'react';

/**
 * FormattedText component
 * Formats long descriptions and resumes text into clean paragraphs and
 * hanging-indented bullet point lists when lines start with bullet markers (•, -, *)
 * or numbered markers (1., 2., etc.).
 */
export function FormattedText({ text = '', className = '', bulletColor, bulletStyle = 'char' }) {
  if (!text || typeof text !== 'string') {
    return null;
  }

  // Parse lines and group consecutive bullet points into <ul> or <ol>
  const lines = text.split('\n');
  const elements = [];
  let currentList = null;

  const bulletRegex = /^([•\-\*])\s*(.*)$/;
  const numberRegex = /^(\d+)[.)]\s*(.*)$/;

  const flushList = () => {
    if (currentList) {
      if (currentList.type === 'bullet') {
        elements.push(
          <ul key={`list-${elements.length}`} className="space-y-1 my-1 list-none pl-0">
            {currentList.items.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2 break-inside-avoid">
                {bulletStyle === 'dot' ? (
                  <span
                    aria-hidden="true"
                    className="select-none shrink-0 rounded-full"
                    style={{
                      width: '3px',
                      height: '3px',
                      marginTop: '5.5px',
                      backgroundColor: bulletColor || '#4b5563'
                    }}
                  />
                ) : (
                  <span 
                    className="select-none font-bold shrink-0 leading-snug text-[10px] text-slate-500"
                    style={bulletColor ? { color: bulletColor } : undefined}
                  >
                    •
                  </span>
                )}
                <span className="flex-1 min-w-0 leading-snug break-words">{item}</span>
              </li>
            ))}
          </ul>
        );
      } else if (currentList.type === 'number') {
        elements.push(
          <ol key={`list-${elements.length}`} className="space-y-1 my-1 list-none pl-0">
            {currentList.items.map((item, idx) => (
              <li key={idx} className="flex items-start gap-1.5 break-inside-avoid">
                <span 
                  className="select-none font-bold shrink-0 text-[10.5px] mt-[1px] text-slate-500 min-w-[16px]"
                  style={bulletColor ? { color: bulletColor } : undefined}
                >
                  {item.num}.
                </span>
                <span className="flex-1 leading-snug">{item.text}</span>
              </li>
            ))}
          </ol>
        );
      }
      currentList = null;
    }
  };

  lines.forEach((rawLine, lineIdx) => {
    const trimmed = rawLine.trim();

    if (!trimmed) {
      flushList();
      // Prevent leading empty space or multiple consecutive blank divs
      if (elements.length > 0 && !elements[elements.length - 1]?.key?.startsWith('blank-')) {
        elements.push(<div key={`blank-${lineIdx}`} className="h-1.5" />);
      }
      return;
    }

    const bulletMatch = trimmed.match(bulletRegex);
    const numberMatch = trimmed.match(numberRegex);

    if (bulletMatch) {
      const bulletContent = bulletMatch[2];
      // Check if this line is an accidental wrapped continuation starting with lowercase
      const isContinuation = /^[a-z]/.test(bulletContent) && currentList && currentList.type === 'bullet' && currentList.items.length > 0;

      if (isContinuation) {
        currentList.items[currentList.items.length - 1] += ` ${bulletContent}`;
      } else {
        if (!currentList || currentList.type !== 'bullet') {
          flushList();
          currentList = { type: 'bullet', items: [] };
        }
        currentList.items.push(bulletContent);
      }
    } else if (numberMatch) {
      if (!currentList || currentList.type !== 'number') {
        flushList();
        currentList = { type: 'number', items: [] };
      }
      currentList.items.push({ num: numberMatch[1], text: numberMatch[2] });
    } else {
      flushList();
      elements.push(
        <p key={`p-${lineIdx}`} className="leading-relaxed my-1">
          {rawLine}
        </p>
      );
    }
  });

  flushList();

  return (
    <div className={`formatted-text leading-relaxed ${className}`}>
      {elements}
    </div>
  );
}
