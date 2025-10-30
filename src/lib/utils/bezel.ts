import type { BezelOffset } from '$lib/types';

// Convert mm to pixels assuming 96 DPI (standard screen density)
// 1 inch = 96 pixels, 1 inch = 25.4mm
// Therefore: 1mm = 96/25.4 ≈ 3.7795 pixels
const MM_TO_PX = 96 / 25.4;

export function bezelOffsetToPixels(bezel: BezelOffset): number {
    if (bezel.unit === 'mm') {
        return bezel.value * MM_TO_PX;
    }
    return bezel.value;
}

