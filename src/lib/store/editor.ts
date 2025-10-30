import { writable, derived } from 'svelte/store';
import type { EditorState, Layout, BezelOffset } from '$lib/types';

const initialState: EditorState = {
    imageBitmap: null,
    imageNatural: null,
    layout: null,
    groupOffset: { x: 0, y: 0 },
    bezelOffsets: {} as Record<string, BezelOffset>,
    view: { zoom: 0.5, panX: 0, panY: 0 }
};

export const editor = writable<EditorState>(initialState);

export const hasImage = derived(editor, ($e) => !!$e.imageBitmap);
export const hasLayout = derived(editor, ($e) => !!$e.layout);

export function setLayout(layout: Layout) {
    editor.update((s) => ({ ...s, layout }));
}

export function setImage(imageBitmap: ImageBitmap, natural: { w: number; h: number }) {
    editor.update((s) => ({ ...s, imageBitmap, imageNatural: natural }));
}

export function setGroupOffset(dx: number, dy: number) {
    editor.update((s) => ({ ...s, groupOffset: { x: dx, y: dy } }));
}

export function nudgeGroupOffset(dx: number, dy: number) {
    editor.update((s) => ({ ...s, groupOffset: { x: s.groupOffset.x + dx, y: s.groupOffset.y + dy } }));
}

export function setViewZoom(zoom: number) {
    editor.update((s) => ({ ...s, view: { ...s.view, zoom } }));
}

export function setViewPan(panX: number, panY: number) {
    editor.update((s) => ({ ...s, view: { ...s.view, panX, panY } }));
}

export function setBezelOffset(monitorId: string, value: number, unit: 'px' | 'mm') {
    editor.update((s) => ({
        ...s,
        bezelOffsets: { ...s.bezelOffsets, [monitorId]: { value, unit } }
    }));
}

export function getBezelOffset(monitorId: string, state: EditorState): BezelOffset {
    return state.bezelOffsets[monitorId] || { value: 0, unit: 'px' };
}


