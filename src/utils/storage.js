import { DEFAULT_RESUME, BLANK_RESUME } from '../constants/sampleData';

const STORAGE_KEY_RESUMES = 'cvset_user_resumes';
const STORAGE_KEY_ACTIVE_ID = 'cvset_active_resume_id';

export function getStoredResumes() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_RESUMES);
    if (!raw) {
      const initial = [DEFAULT_RESUME];
      localStorage.setItem(STORAGE_KEY_RESUMES, JSON.stringify(initial));
      return initial;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : [DEFAULT_RESUME];
  } catch (e) {
    console.error('Failed to load resumes from localStorage', e);
    return [DEFAULT_RESUME];
  }
}

export function saveResume(resume) {
  try {
    const resumes = getStoredResumes();
    const updatedResume = { ...resume, updatedAt: new Date().toISOString() };
    const index = resumes.findIndex((r) => r.id === resume.id);
    
    let next;
    if (index >= 0) {
      next = [...resumes];
      next[index] = updatedResume;
    } else {
      next = [updatedResume, ...resumes];
    }
    
    localStorage.setItem(STORAGE_KEY_RESUMES, JSON.stringify(next));
    return updatedResume;
  } catch (e) {
    console.error('Failed to save resume', e);
    return resume;
  }
}

export function createNewResume(title = "Untitled Resume", template = "dublin") {
  const newId = "cv-" + Date.now() + "-" + Math.random().toString(36).substr(2, 6);
  const newResume = {
    ...BLANK_RESUME,
    id: newId,
    title,
    template,
    updatedAt: new Date().toISOString()
  };
  saveResume(newResume);
  setActiveResumeId(newId);
  return newResume;
}

export function duplicateResume(id) {
  const resumes = getStoredResumes();
  const existing = resumes.find((r) => r.id === id);
  if (!existing) return null;
  
  const clonedId = "cv-" + Date.now() + "-" + Math.random().toString(36).substr(2, 6);
  const cloned = {
    ...JSON.parse(JSON.stringify(existing)),
    id: clonedId,
    title: `${existing.title} (Copy)`,
    updatedAt: new Date().toISOString()
  };
  saveResume(cloned);
  return cloned;
}

export function deleteResume(id) {
  const resumes = getStoredResumes();
  const filtered = resumes.filter((r) => r.id !== id);
  localStorage.setItem(STORAGE_KEY_RESUMES, JSON.stringify(filtered));
  
  // If active resume was deleted, point to the first remaining one
  const activeId = getActiveResumeId();
  if (activeId === id) {
    if (filtered.length > 0) {
      setActiveResumeId(filtered[0].id);
    } else {
      const fresh = createNewResume();
      return fresh.id;
    }
  }
  return filtered.length > 0 ? filtered[0].id : null;
}

export function getActiveResumeId() {
  return localStorage.getItem(STORAGE_KEY_ACTIVE_ID) || 'cv-default-1';
}

export function setActiveResumeId(id) {
  localStorage.setItem(STORAGE_KEY_ACTIVE_ID, id);
}

export function exportResumeAsJson(resume) {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(resume, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  const fileName = (resume.title || "cvset-resume").toLowerCase().replace(/[^a-z0-9]/g, "-") + ".json";
  downloadAnchor.setAttribute("download", fileName);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

export function importResumeFromJson(jsonString) {
  try {
    const parsed = JSON.parse(jsonString);
    if (!parsed || typeof parsed !== 'object') {
      throw new Error('Invalid JSON structure');
    }
    const newId = "cv-" + Date.now() + "-" + Math.random().toString(36).substr(2, 6);
    const imported = {
      ...BLANK_RESUME,
      ...parsed,
      id: newId,
      title: parsed.title ? `${parsed.title} (Imported)` : 'Imported Resume',
      updatedAt: new Date().toISOString()
    };
    saveResume(imported);
    setActiveResumeId(newId);
    return imported;
  } catch (err) {
    console.error('Import failed', err);
    throw err;
  }
}
