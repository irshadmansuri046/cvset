import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  getStoredResumes,
  saveResume,
  createNewResume,
  duplicateResume,
  deleteResume,
  getActiveResumeId,
  setActiveResumeId,
  exportResumeAsJson,
  importResumeFromJson
} from '../utils/storage';
import { DEFAULT_RESUME, BLANK_RESUME } from '../constants/sampleData';

describe('LocalStorage Resume Store (cvset)', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  describe('getStoredResumes', () => {
    it('returns DEFAULT_RESUME wrapped in an array when localStorage is empty', () => {
      const resumes = getStoredResumes();
      expect(Array.isArray(resumes)).toBe(true);
      expect(resumes.length).toBe(1);
      expect(resumes[0].id).toBe(DEFAULT_RESUME.id);
      expect(resumes[0].title).toBe(DEFAULT_RESUME.title);
    });

    it('returns stored resumes when valid JSON is in localStorage', () => {
      const customResumes = [
        { ...DEFAULT_RESUME, id: 'test-1', title: 'Resume 1' },
        { ...DEFAULT_RESUME, id: 'test-2', title: 'Resume 2' }
      ];
      localStorage.setItem('cvset_user_resumes', JSON.stringify(customResumes));

      const loaded = getStoredResumes();
      expect(loaded.length).toBe(2);
      expect(loaded[0].id).toBe('test-1');
      expect(loaded[1].id).toBe('test-2');
    });

    it('gracefully recovers with DEFAULT_RESUME when corrupted data is in localStorage', () => {
      localStorage.setItem('cvset_user_resumes', 'NOT_VALID_JSON{[');
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const resumes = getStoredResumes();
      expect(resumes.length).toBe(1);
      expect(resumes[0].id).toBe(DEFAULT_RESUME.id);
      consoleSpy.mockRestore();
    });

    it('returns DEFAULT_RESUME when stored data is an empty array', () => {
      localStorage.setItem('cvset_user_resumes', JSON.stringify([]));
      const resumes = getStoredResumes();
      expect(resumes.length).toBe(1);
      expect(resumes[0].id).toBe(DEFAULT_RESUME.id);
    });
  });

  describe('saveResume', () => {
    it('updates an existing resume in the list and updates timestamp', () => {
      const initial = getStoredResumes();
      const target = initial[0];

      const modified = { ...target, title: 'Senior Software Engineer' };
      const saved = saveResume(modified);

      expect(saved.title).toBe('Senior Software Engineer');
      expect(saved.updatedAt).toBeDefined();

      const refreshed = getStoredResumes();
      expect(refreshed.find((r) => r.id === target.id)?.title).toBe('Senior Software Engineer');
    });

    it('prepends a newly created resume if ID does not exist', () => {
      const newResume = {
        ...BLANK_RESUME,
        id: 'new-cv-999',
        title: 'Brand New CV'
      };

      saveResume(newResume);
      const list = getStoredResumes();
      expect(list.some((r) => r.id === 'new-cv-999')).toBe(true);
      expect(list[0].id).toBe('new-cv-999');
    });
  });

  describe('createNewResume', () => {
    it('creates and saves a new resume with custom title and template', () => {
      const created = createNewResume('Product Lead CV', 'stockholm');
      expect(created.id).toMatch(/^cv-/);
      expect(created.title).toBe('Product Lead CV');
      expect(created.template).toBe('stockholm');

      // Verify active resume id was updated
      expect(getActiveResumeId()).toBe(created.id);

      // Verify it exists in storage
      const stored = getStoredResumes();
      expect(stored.find((r) => r.id === created.id)).toBeDefined();
    });

    it('uses sensible defaults if title and template are omitted', () => {
      const created = createNewResume();
      expect(created.title).toBe('Untitled Resume');
      expect(created.template).toBe('dublin');
    });
  });

  describe('duplicateResume', () => {
    it('duplicates an existing resume with a new ID and (Copy) in the title', () => {
      const initial = getStoredResumes()[0];
      const copy = duplicateResume(initial.id);

      expect(copy).not.toBeNull();
      expect(copy.id).not.toBe(initial.id);
      expect(copy.id).toMatch(/^cv-/);
      expect(copy.title).toBe(`${initial.title} (Copy)`);

      const stored = getStoredResumes();
      expect(stored.length).toBe(2);
      expect(stored.some((r) => r.id === copy.id)).toBe(true);
    });

    it('returns null if given a non-existent ID', () => {
      const copy = duplicateResume('non-existent-id');
      expect(copy).toBeNull();
    });
  });

  describe('deleteResume', () => {
    it('deletes an existing resume by ID', () => {
      const r1 = createNewResume('CV 1');
      const r2 = createNewResume('CV 2');

      deleteResume(r1.id);
      const stored = getStoredResumes();
      expect(stored.find((r) => r.id === r1.id)).toBeUndefined();
      expect(stored.find((r) => r.id === r2.id)).toBeDefined();
    });

    it('switches active ID when the currently active resume is deleted', () => {
      const r1 = createNewResume('CV 1');
      const r2 = createNewResume('CV 2');
      setActiveResumeId(r2.id);

      deleteResume(r2.id);
      const newActive = getActiveResumeId();
      expect(newActive).not.toBe(r2.id);
    });

    it('creates a fresh resume if all resumes are deleted', () => {
      const list = getStoredResumes();
      list.forEach((r) => deleteResume(r.id));

      const stored = getStoredResumes();
      expect(stored.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('Active Resume ID Helpers', () => {
    it('gets default id cv-default-1 when none is set', () => {
      expect(getActiveResumeId()).toBe('cv-default-1');
    });

    it('sets and retrieves active resume id', () => {
      setActiveResumeId('custom-cv-42');
      expect(getActiveResumeId()).toBe('custom-cv-42');
    });
  });

  describe('importResumeFromJson', () => {
    it('imports valid JSON and assigns unique ID and imported title', () => {
      const sample = {
        title: 'Original Backend CV',
        template: 'berlin',
        personalDetails: { firstName: 'Alice', lastName: 'Smith' },
        skills: [{ id: '1', name: 'Go', level: 'Expert' }]
      };

      const imported = importResumeFromJson(JSON.stringify(sample));
      expect(imported.id).toMatch(/^cv-/);
      expect(imported.title).toBe('Original Backend CV (Imported)');
      expect(imported.template).toBe('berlin');
      expect(imported.personalDetails.firstName).toBe('Alice');

      expect(getActiveResumeId()).toBe(imported.id);
    });

    it('throws an error when invalid JSON string is passed', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      expect(() => {
        importResumeFromJson('{ broken json');
      }).toThrow();
      consoleSpy.mockRestore();
    });

    it('throws when JSON parses to a non-object', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      expect(() => {
        importResumeFromJson('"just a string"');
      }).toThrow('Invalid JSON structure');
      consoleSpy.mockRestore();
    });
  });

  describe('exportResumeAsJson', () => {
    it('creates and clicks an anchor element for file download', () => {
      const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});

      exportResumeAsJson({ title: 'Export Test', id: '123' });
      expect(clickSpy).toHaveBeenCalled();
      clickSpy.mockRestore();
    });
  });
});
