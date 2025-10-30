<script lang="ts">
    import { editor } from '$lib/store/editor';
    import { exportPerMonitor } from '$lib/canvas/export';
    import type { ExportOptions } from '$lib/types';

    let open = false;
    let format: ExportOptions['format'] = 'png';
    let quality = 0.92;
    let background: ExportOptions['background'] = 'transparent';

    async function doExport() {
        if (!$editor.imageBitmap || !$editor.layout) return;
        const options: ExportOptions = { format, background, quality: format === 'jpeg' ? quality : undefined };
        await exportPerMonitor($editor.imageBitmap, $editor.layout, $editor.groupOffset, $editor, options);
        open = false;
    }
</script>

<div class="export">
    <button on:click={() => (open = true)}>Export</button>
    {#if open}
        <div class="modal" on:click={() => (open = false)}>
            <div class="panel" on:click|stopPropagation>
                <h3>Export options</h3>
                <div class="row">
                    <label>Format</label>
                    <select bind:value={format}>
                        <option value="png">PNG (lossless)</option>
                        <option value="jpeg">JPEG</option>
                    </select>
                </div>
                {#if format === 'jpeg'}
                    <div class="row">
                        <label>Quality</label>
                        <input type="range" min="0.5" max="1" step="0.01" bind:value={quality} />
                        <span>{Math.round(quality * 100)}%</span>
                    </div>
                {/if}
                <div class="row">
                    <label>Background</label>
                    <select bind:value={background}>
                        <option value="transparent">Transparent</option>
                        <option value="black">Black</option>
                    </select>
                </div>
                <div class="actions">
                    <button on:click={() => (open = false)}>Cancel</button>
                    <button class="primary" on:click={doExport} disabled={!$editor.imageBitmap || !$editor.layout}>Export</button>
                </div>
            </div>
        </div>
    {/if}
    <style>
        .export button { padding: 0.5rem 0.75rem; border: 1px solid #d1d5db; border-radius: 0.375rem; background: #fff; }
        .modal { position: fixed; inset: 0; background: rgba(0,0,0,0.3); display: grid; place-items: center; }
        .panel { background: #fff; padding: 1rem; border-radius: 0.5rem; min-width: 320px; display: grid; gap: 0.75rem; }
        .row { display: flex; gap: 0.5rem; align-items: center; justify-content: space-between; }
        .actions { display: flex; gap: 0.5rem; justify-content: flex-end; }
        .primary { background: #111827; color: white; }
    </style>
    </div>


