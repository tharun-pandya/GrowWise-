import { GardenProfileData, OutdoorSession } from '../types';

const STORAGE_KEYS = {
  PROFILE: 'growwise_profile_v1',
  COMPLETED_TASKS: 'growwise_completed_tasks_v1',
  SESSIONS: 'growwise_outdoor_sessions_v1',
  AI_PROVIDER: 'growwise_ai_provider_v1',
};

export const defaultProfile: GardenProfileData = {
  location: 'Seattle, WA (Zone 8)',
  gardenType: 'container',
  sunlight: 'full_sun',
  growingSpaceSqFt: 12,
  preferredCategories: ['vegetable', 'herb'],
  preferredCropIds: ['sweet_basil', 'cherry_tomato'],
  experienceLevel: 'beginner',
  weeklyHoursAvailable: 2.5,
  soilType: 'potting_mix',
  waterAccess: 'watering_can',
};

export const storageService = {
  getProfile(): GardenProfileData {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROFILE);
      return data ? JSON.parse(data) : defaultProfile;
    } catch {
      return defaultProfile;
    }
  },

  saveProfile(profile: GardenProfileData): void {
    try {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
    } catch (e) {
      console.error('Failed to save profile to localStorage', e);
    }
  },

  getCompletedTaskIds(): string[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.COMPLETED_TASKS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  toggleTaskCompleted(taskId: string): string[] {
    try {
      const current = storageService.getCompletedTaskIds();
      const updated = current.includes(taskId)
        ? current.filter((id) => id !== taskId)
        : [...current, taskId];
      localStorage.setItem(STORAGE_KEYS.COMPLETED_TASKS, JSON.stringify(updated));
      return updated;
    } catch {
      return [];
    }
  },

  getOutdoorSessions(): OutdoorSession[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SESSIONS);
      if (data) return JSON.parse(data);
      // Default initial mock session to show UI
      const initial: OutdoorSession[] = [
        {
          id: 'sample-1',
          date: new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0],
          minutes: 30,
          notes: 'Prepped container pots and checked bottom drainage holes.',
          cropName: 'Sweet Basil',
        },
      ];
      localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(initial));
      return initial;
    } catch {
      return [];
    }
  },

  addOutdoorSession(session: Omit<OutdoorSession, 'id'>): OutdoorSession[] {
    try {
      const current = storageService.getOutdoorSessions();
      const newSession: OutdoorSession = {
        ...session,
        id: `sess-${Date.now()}`,
      };
      const updated = [newSession, ...current];
      localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(updated));
      return updated;
    } catch {
      return [];
    }
  },

  clearAllData(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.PROFILE);
      localStorage.removeItem(STORAGE_KEYS.COMPLETED_TASKS);
      localStorage.removeItem(STORAGE_KEYS.SESSIONS);
    } catch (e) {
      console.error('Failed to clear data', e);
    }
  },
};
