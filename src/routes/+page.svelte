<script lang="ts">
    import PasteConfig from '$lib/components/PasteConfig.svelte';
    import ImageLoader from '$lib/components/ImageLoader.svelte';
    import BezelSettings from '$lib/components/BezelSettings.svelte';
    import PresetManager from '$lib/components/PresetManager.svelte';
    import Toolbar from '$lib/components/Toolbar.svelte';
    import OverlayCanvas from '$lib/components/OverlayCanvas.svelte';
    import ExportDialog from '$lib/components/ExportDialog.svelte';
    import { hasImage, hasLayout } from '$lib/store/editor';
</script>

<section class="controls">
    <div class="left">
        <h2>Configuration</h2>
        <PasteConfig />
        <h2>Image</h2>
        <ImageLoader />
        <h2>Settings</h2>
        <BezelSettings />
        <h2>Presets</h2>
        <PresetManager />
    </div>
    <div class="right">
        <Toolbar>
            <ExportDialog />
        </Toolbar>
        <OverlayCanvas />
        <p class="hint">
            {#if !($hasLayout)} Paste your kscreen-doctor output and click Parse. {/if}
            {#if !($hasImage)} Load an image to start. {/if}
        </p>
    </div>
    <style>
        .controls { display: grid; grid-template-columns: 360px 1fr; gap: 1rem; align-items: start; }
        .left { display: grid; gap: 0.75rem; margin-right: 1rem; }
        .right { display: grid; gap: 0.75rem; }
        h2 { margin: 0.25rem 0; font-size: 1rem; }
        .hint { color: #6b7280; }
        @media (max-width: 900px) { .controls { grid-template-columns: 1fr; } }
    </style>
</section>
