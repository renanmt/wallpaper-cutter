import type { ExportOptions, Layout, EditorState } from '$lib/types';
import { getAdjustedMonitorPosition } from '$lib/utils/positions';

export async function exportPerMonitor(
    image: ImageBitmap,
    layout: Layout,
    groupOffset: { x: number; y: number },
    state: EditorState,
    options: ExportOptions
) {
    const downloads: Promise<void>[] = [];
    for (let idx = 0; idx < layout.monitors.length; idx++) {
        const m = layout.monitors[idx];
        // Use adjusted position accounting for bezel offsets
        const adjusted = getAdjustedMonitorPosition(m, layout, state);
        const cropX = Math.floor(adjusted.x + groupOffset.x);
        const cropY = Math.floor(adjusted.y + groupOffset.y);
        const w = m.width;
        const h = m.height;
        downloads.push(exportOne(image, cropX, cropY, w, h, idx, m.name, options));
    }
    await Promise.all(downloads);
}

async function exportOne(
    image: ImageBitmap,
    x: number,
    y: number,
    w: number,
    h: number,
    index: number,
    name: string,
    options: ExportOptions
) {
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (options.background === 'black') {
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, w, h);
    } else {
        ctx.clearRect(0, 0, w, h);
    }

    ctx.drawImage(image, x, y, w, h, 0, 0, w, h);

    const type = options.format === 'jpeg' ? 'image/jpeg' : 'image/png';
    const quality = options.format === 'jpeg' ? options.quality ?? 0.92 : undefined;
    const blob = await new Promise<Blob>((resolve) => canvas.toBlob((b) => resolve(b!), type, quality));
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const safe = name.replace(/\s+/g, '-');
    a.download = `${index + 1}-${safe}-${w}x${h}.${options.format}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
}


