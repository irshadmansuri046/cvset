import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';

// Configure worker for browser environment
if (typeof window !== 'undefined') {
  try {
    // If workerSrc is not configured, configure worker
    if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version || '4.10.38'}/pdf.worker.min.mjs`;
    }
  } catch (err) {
    // Fallback: continue without explicit workerSrc
  }
}

/**
 * Removes artificial letter-spacing inside uppercase words produced by PDF layout engines
 * (e.g. "P R O F E S S I O N A L   S U M M A R Y" -> "PROFESSIONAL SUMMARY").
 */
export function unspaceText(str) {
  if (!str) return '';
  return str
    .split(/\s{2,}/)
    .map(word => word.replace(/([A-Za-z])\s+(?=[A-Za-z](\s|$))/g, '$1').trim())
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Reconstructs lines from text content items based on geometric coordinates.
 * Handles multi-column layouts so sidebar text does not interleave with main content.
 */
export function processPageItems(items) {
  if (!items || items.length === 0) return '';

  const cleanItems = items
    .filter(it => it.str && typeof it.str === 'string' && it.str.trim().length > 0)
    .map(it => ({
      str: unspaceText(it.str),
      x: it.transform ? it.transform[4] : 0,
      y: it.transform ? it.transform[5] : 0,
      w: it.width || 0,
      h: it.height || 0
    }))
    .filter(it => it.str.length > 0);

  if (cleanItems.length === 0) return '';

  // Detect 2-column layout (e.g. sidebar at x < 195 and main content at x >= 195)
  const leftItems = cleanItems.filter(it => it.x < 195);
  const rightItems = cleanItems.filter(it => it.x >= 195);
  const isTwoCol = leftItems.length >= 6 && rightItems.length >= 6;

  const buildLinesFromItems = (colItems) => {
    // Sort top-to-bottom (Y descending), then left-to-right (X ascending)
    const sorted = [...colItems].sort((a, b) => {
      const dy = b.y - a.y;
      if (Math.abs(dy) > 3.5) return dy;
      return a.x - b.x;
    });

    const lines = [];
    let curY = null;
    let curLine = [];

    sorted.forEach(it => {
      if (curY === null || Math.abs(curY - it.y) > 3.5) {
        if (curLine.length > 0) {
          lines.push(curLine.join(' '));
        }
        curLine = [it.str];
        curY = it.y;
      } else {
        curLine.push(it.str);
      }
    });

    if (curLine.length > 0) {
      lines.push(curLine.join(' '));
    }

    return lines.join('\n');
  };

  if (isTwoCol) {
    const leftText = buildLinesFromItems(leftItems);
    const rightText = buildLinesFromItems(rightItems);
    // If right column contains contact information (email/phone), place right column first so header comes first
    const hasContact = /@|phone|linkedin|github|\+?\d{8,}/i.test(rightText);
    return hasContact ? `${rightText}\n\n${leftText}` : `${leftText}\n\n${rightText}`;
  }

  return buildLinesFromItems(cleanItems);
}

/**
 * Extracts plain text from an uploaded PDF file (File, Blob, ArrayBuffer, or Uint8Array)
 * using Mozilla PDF.js with column-aware line reconstruction.
 *
 * @param {File|Blob|ArrayBuffer|Uint8Array} file
 * @returns {Promise<string|null>}
 */
export async function extractTextFromPdf(file) {
  if (!file) return null;

  try {
    let data;
    if (file instanceof ArrayBuffer) {
      data = new Uint8Array(file);
    } else if (file instanceof Uint8Array || (typeof Buffer !== 'undefined' && Buffer.isBuffer(file))) {
      data = new Uint8Array(file.buffer, file.byteOffset, file.byteLength);
    } else if (file && typeof file.arrayBuffer === 'function') {
      const ab = await file.arrayBuffer();
      data = new Uint8Array(ab);
    } else if (file && file.buffer instanceof ArrayBuffer) {
      data = new Uint8Array(file.buffer, file.byteOffset || 0, file.byteLength || file.buffer.byteLength);
    } else {
      const ab = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
      });
      data = new Uint8Array(ab);
    }

    if (!data || data.byteLength === 0) {
      return null;
    }

    const doc = await pdfjsLib.getDocument({
      data,
      isEvalSupported: false,
      useSystemFonts: true,
      disableFontFace: true
    }).promise;

    if (!doc || doc.numPages === 0) {
      return null;
    }

    const pageTexts = [];
    for (let p = 1; p <= doc.numPages; p++) {
      const page = await doc.getPage(p);
      const textContent = await page.getTextContent();
      const pageStr = processPageItems(textContent.items);
      if (pageStr.trim()) {
        pageTexts.push(pageStr);
      }
    }

    const fullText = pageTexts.join('\n\n').trim();
    return fullText.length > 20 ? fullText : null;
  } catch (err) {
    console.error('Failed to parse PDF via PDF.js:', err);
    return null;
  }
}
