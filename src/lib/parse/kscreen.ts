import type { Layout, Monitor } from '$lib/types';

const OUTPUT_RE = /^\s*Output:\s*(\d+)\s+(\S+)\s+([\w-]+)\s*$/i;
const GEOMETRY_RE = /^\s*Geometry:\s*(\d+),(\d+)\s+(\d+)x(\d+)\s*$/i;

export function parseKscreenDoctor(text: string): Layout {
    const lines = text.split(/\r?\n/);
    const monitors: Monitor[] = [];

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const outMatch = OUTPUT_RE.exec(line);
        if (!outMatch) continue;

        // Search for Geometry line until we hit the next Output: line or end of file
        let geometryMatch: RegExpExecArray | null = null;
        for (let j = i + 1; j < lines.length; j++) {
            // Stop if we hit another Output line
            if (/^\s*Output:/i.test(lines[j])) break;
            const match = GEOMETRY_RE.exec(lines[j]);
            if (match) {
                geometryMatch = match;
                break;
            }
        }
        if (!geometryMatch) continue;

        const [, index, name, id] = outMatch;
        const [, x, y, w, h] = geometryMatch;
        monitors.push({
            id,
            name: `${index} ${name}`,
            x: Number(x),
            y: Number(y),
            width: Number(w),
            height: Number(h)
        });
    }

    if (monitors.length === 0) {
        throw new Error('No monitors found in input');
    }

    const minX = Math.min(...monitors.map((m) => m.x));
    const minY = Math.min(...monitors.map((m) => m.y));
    const maxX = Math.max(...monitors.map((m) => m.x + m.width));
    const maxY = Math.max(...monitors.map((m) => m.y + m.height));

    return {
        monitors,
        bounds: { x: minX, y: minY, width: maxX - minX, height: maxY - minY }
    } satisfies Layout;
}


