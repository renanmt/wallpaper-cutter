import type { Monitor, Layout } from '$lib/types';
import type { EditorState } from '$lib/types';
import { getBezelOffset } from '$lib/store/editor';
import { bezelOffsetToPixels } from './bezel';

type Adjacency = 'left' | 'right' | 'top' | 'bottom';

interface MonitorAdjacency {
    monitor: Monitor;
    side: Adjacency;
}

/**
 * Find all monitors adjacent to a given monitor.
 */
function findAdjacentMonitors(monitor: Monitor, layout: Layout): MonitorAdjacency[] {
    const adjacencies: MonitorAdjacency[] = [];
    const tolerance = 1; // pixels

    for (const other of layout.monitors) {
        if (other.id === monitor.id) continue;

        const thisRight = monitor.x + monitor.width;
        const thisLeft = monitor.x;
        const thisBottom = monitor.y + monitor.height;
        const thisTop = monitor.y;

        const otherRight = other.x + other.width;
        const otherLeft = other.x;
        const otherBottom = other.y + other.height;
        const otherTop = other.y;

        // Check if vertically overlapping
        const vertOverlap = !(thisBottom <= otherTop || thisTop >= otherBottom);

        // Check if horizontally overlapping
        const horizOverlap = !(thisRight <= otherLeft || thisLeft >= otherRight);

        // Left adjacency: other monitor is to the left
        if (Math.abs(thisLeft - otherRight) <= tolerance && vertOverlap) {
            adjacencies.push({ monitor: other, side: 'left' });
        }

        // Right adjacency: other monitor is to the right
        if (Math.abs(thisRight - otherLeft) <= tolerance && vertOverlap) {
            adjacencies.push({ monitor: other, side: 'right' });
        }

        // Top adjacency: other monitor is above
        if (Math.abs(thisTop - otherBottom) <= tolerance && horizOverlap) {
            adjacencies.push({ monitor: other, side: 'top' });
        }

        // Bottom adjacency: other monitor is below
        if (Math.abs(thisBottom - otherTop) <= tolerance && horizOverlap) {
            adjacencies.push({ monitor: other, side: 'bottom' });
        }
    }

    return adjacencies;
}

/**
 * Calculate adjusted position for a monitor based on bezel offsets.
 * Rules:
 * - If a monitor has 2+ adjacencies: push adjacent monitors away
 * - If a monitor has 1 adjacency: push this monitor away
 */
export function getAdjustedMonitorPosition(
    monitor: Monitor,
    layout: Layout,
    state: EditorState
): { x: number; y: number } {
    let adjustX = 0;
    let adjustY = 0;
    const thisBezel = bezelOffsetToPixels(getBezelOffset(monitor.id, state));
    const adjacencies = findAdjacentMonitors(monitor, layout);

    // Rule 1: If this monitor has 1 adjacency and has a bezel, push this monitor away
    if (adjacencies.length === 1 && thisBezel > 0) {
        const adj = adjacencies[0];
        const otherBezel = bezelOffsetToPixels(getBezelOffset(adj.monitor.id, state));
        const combinedBezel = (thisBezel + otherBezel) / 2;

        if (adj.side === 'left') {
            // Push this monitor to the right
            adjustX = combinedBezel;
        } else if (adj.side === 'right') {
            // Push this monitor to the left
            adjustX = -combinedBezel;
        } else if (adj.side === 'top') {
            // Push this monitor down
            adjustY = combinedBezel;
        } else if (adj.side === 'bottom') {
            // Push this monitor up
            adjustY = -combinedBezel;
        }
    }

    // Rule 2: If any OTHER monitor has bezel and 2+ adjacencies,
    // and this monitor is adjacent to it, push this monitor away
    for (const other of layout.monitors) {
        if (other.id === monitor.id) continue;

        const otherBezel = bezelOffsetToPixels(getBezelOffset(other.id, state));
        if (otherBezel === 0) continue;

        const otherAdjacencies = findAdjacentMonitors(other, layout);
        if (otherAdjacencies.length >= 2) {
            // This other monitor should push its neighbors
            // Check if we are one of its neighbors
            const isNeighbor = otherAdjacencies.some(adj => adj.monitor.id === monitor.id);
            if (isNeighbor) {
                // Find which side we are on relative to other
                const otherRight = other.x + other.width;
                const otherLeft = other.x;
                const otherBottom = other.y + other.height;
                const otherTop = other.y;

                const thisRight = monitor.x + monitor.width;
                const thisLeft = monitor.x;
                const thisBottom = monitor.y + monitor.height;
                const thisTop = monitor.y;

                const combinedBezel = (thisBezel + otherBezel) / 2;

                // Left of other - push us left
                if (Math.abs(thisRight - otherLeft) <= 1) {
                    adjustX -= combinedBezel;
                }
                // Right of other - push us right
                else if (Math.abs(thisLeft - otherRight) <= 1) {
                    adjustX += combinedBezel;
                }
                // Above other - push us up
                else if (Math.abs(thisBottom - otherTop) <= 1) {
                    adjustY -= combinedBezel;
                }
                // Below other - push us down
                else if (Math.abs(thisTop - otherBottom) <= 1) {
                    adjustY += combinedBezel;
                }
            }
        }
    }

    return {
        x: monitor.x + adjustX,
        y: monitor.y + adjustY
    };
}
