<script lang="ts">
    import { editor, setLayout, setBezelOffset } from '$lib/store/editor';
    import { loadPresets, savePreset, deletePreset, getPreset, type LayoutPreset } from '$lib/utils/presets';

    let presets = loadPresets();
    let showSaveDialog = false;
    let presetName = '';

    function refreshPresets() {
        presets = loadPresets();
    }

    function handleSave() {
        if (!$editor.layout || !presetName.trim()) return;
        
        savePreset(presetName.trim(), $editor.layout, $editor.bezelOffsets);
        refreshPresets();
        presetName = '';
        showSaveDialog = false;
    }

    function handleLoad(preset: LayoutPreset) {
        setLayout(preset.layout);
        // Restore bezel offsets
        for (const [monitorId, bezel] of Object.entries(preset.bezelOffsets)) {
            setBezelOffset(monitorId, bezel.value, bezel.unit);
        }
    }

    function handleDelete(id: string, e: MouseEvent) {
        e.stopPropagation();
        if (confirm('Delete this preset?')) {
            deletePreset(id);
            refreshPresets();
        }
    }

    function formatDate(timestamp: number): string {
        return new Date(timestamp).toLocaleDateString();
    }
</script>

<div class="preset-manager">
    <div class="header">
        <label>Presets</label>
        <button on:click={() => (showSaveDialog = true)} disabled={!$editor.layout}>
            Save
        </button>
    </div>

    {#if showSaveDialog}
        <div class="save-dialog">
            <input
                type="text"
                bind:value={presetName}
                placeholder="Preset name"
                on:keydown={(e) => {
                    if (e.key === 'Enter') handleSave();
                    if (e.key === 'Escape') {
                        showSaveDialog = false;
                        presetName = '';
                    }
                }}
                autofocus
            />
            <div class="dialog-actions">
                <button on:click={() => { showSaveDialog = false; presetName = ''; }}>Cancel</button>
                <button on:click={handleSave} disabled={!presetName.trim()}>Save</button>
            </div>
        </div>
    {/if}

    {#if presets.length > 0}
        <div class="preset-list">
            {#each presets as preset (preset.id)}
                <div class="preset-item" on:click={() => handleLoad(preset)}>
                    <div class="preset-info">
                        <div class="preset-name">{preset.name}</div>
                        <div class="preset-date">{formatDate(preset.createdAt)}</div>
                    </div>
                    <button
                        class="delete-btn"
                        on:click={(e) => handleDelete(preset.id, e)}
                        title="Delete preset"
                    >
                        ×
                    </button>
                </div>
            {/each}
        </div>
    {:else}
        <p class="empty">No presets saved yet</p>
    {/if}

    <style>
        .preset-manager { display: grid; gap: 0.5rem; }
        .header { display: flex; justify-content: space-between; align-items: center; }
        label { font-size: 0.875rem; font-weight: 500; color: #374151; }
        button { padding: 0.4rem 0.6rem; border: 1px solid #d1d5db; border-radius: 0.375rem; background: #fff; cursor: pointer; font-size: 0.875rem; }
        button:disabled { opacity: 0.5; cursor: not-allowed; }
        .save-dialog { display: grid; gap: 0.5rem; padding: 0.5rem; border: 1px solid #e5e7eb; border-radius: 0.375rem; background: #f9fafb; }
        .save-dialog input { padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 0.375rem; }
        .dialog-actions { display: flex; gap: 0.5rem; justify-content: flex-end; }
        .preset-list { display: grid; gap: 0.25rem; max-height: 200px; overflow-y: auto; }
        .preset-item { display: flex; justify-content: space-between; align-items: center; padding: 0.5rem; border: 1px solid #e5e7eb; border-radius: 0.375rem; background: #f9fafb; cursor: pointer; transition: background 0.2s; }
        .preset-item:hover { background: #f3f4f6; }
        .preset-info { flex: 1; }
        .preset-name { font-size: 0.875rem; font-weight: 500; color: #111827; }
        .preset-date { font-size: 0.75rem; color: #6b7280; }
        .delete-btn { padding: 0.25rem 0.5rem; border: none; background: transparent; color: #ef4444; font-size: 1.25rem; line-height: 1; }
        .delete-btn:hover { background: #fee2e2; }
        .empty { font-size: 0.75rem; color: #9ca3af; text-align: center; padding: 0.5rem; }
    </style>
</div>

