import type { Layout, BezelOffset } from '$lib/types';

export interface LayoutPreset {
    id: string;
    name: string;
    layout: Layout;
    bezelOffsets: Record<string, BezelOffset>;
    createdAt: number;
}

const STORAGE_KEY = 'wallpaper-cutter-presets';

/**
 * Load all presets from localStorage
 */
export function loadPresets(): LayoutPreset[] {
    if (typeof window === 'undefined') return [];
    
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) return [];
        return JSON.parse(stored);
    } catch (e) {
        console.error('Failed to load presets:', e);
        return [];
    }
}

/**
 * Save a new preset
 */
export function savePreset(name: string, layout: Layout, bezelOffsets: Record<string, BezelOffset>): LayoutPreset {
    const presets = loadPresets();
    const preset: LayoutPreset = {
        id: crypto.randomUUID(),
        name,
        layout,
        bezelOffsets,
        createdAt: Date.now()
    };
    
    presets.push(preset);
    presets.sort((a, b) => b.createdAt - a.createdAt); // Newest first
    
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(presets));
    } catch (e) {
        console.error('Failed to save preset:', e);
    }
    
    return preset;
}

/**
 * Delete a preset by ID
 */
export function deletePreset(id: string): void {
    const presets = loadPresets();
    const filtered = presets.filter(p => p.id !== id);
    
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    } catch (e) {
        console.error('Failed to delete preset:', e);
    }
}

/**
 * Load a preset by ID
 */
export function getPreset(id: string): LayoutPreset | null {
    const presets = loadPresets();
    return presets.find(p => p.id === id) || null;
}

