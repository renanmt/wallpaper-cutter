<script lang="ts">
    import { editor, setViewZoom, setViewPan, setGroupOffset } from '$lib/store/editor';

    function zoomIn() {
        setViewZoom(Math.min(8, $editor.view.zoom * 1.25));
    }
    function zoomOut() {
        setViewZoom(Math.max(0.05, $editor.view.zoom / 1.25));
    }
    function resetView() {
        setViewZoom(0.5);
        setViewPan(0, 0);
    }
    function resetOffset() {
        setGroupOffset(0, 0);
    }
</script>

<div class="toolbar">
    <div class="group">
        <button on:click={zoomOut}>-</button>
        <span class="label">Zoom {(Math.round($editor.view.zoom * 100))}%</span>
        <button on:click={zoomIn}>+</button>
        <button on:click={resetView}>Reset view</button>
    </div>
    <div class="group">
        <button on:click={resetOffset}>Center frames</button>
    </div>
    <slot />
    <style>
        .toolbar { display: flex; gap: 0.75rem; align-items: center; flex-wrap: wrap; }
        .group { display: flex; gap: 0.5rem; align-items: center; }
        button { padding: 0.4rem 0.6rem; border: 1px solid #d1d5db; border-radius: 0.375rem; background: #fff; cursor: pointer; }
        .label { color: #374151; }
    </style>
</div>


