<script lang="ts">
    import { editor, nudgeGroupOffset, setViewPan, setViewZoom } from '$lib/store/editor';
    import { getAdjustedMonitorPosition } from '$lib/utils/positions';
    import type { Layout } from '$lib/types';

    let canvasEl: HTMLCanvasElement;
    let containerEl: HTMLDivElement;
    let width = 1280;
    let height = 720; // 16:9 aspect ratio
    let draggingGroup = false;
    let panning = false;
    let lastX = 0;
    let lastY = 0;

    $effect(() => {
        if (!containerEl || !canvasEl) return;
        
        // Calculate container width and maintain 16:9 aspect ratio
        const containerWidth = containerEl.clientWidth || 1280;
        width = containerWidth;
        height = Math.floor(containerWidth * (9 / 16));
        
        const dpr = window.devicePixelRatio || 1;
        canvasEl.width = Math.floor(width * dpr);
        canvasEl.height = Math.floor(height * dpr);
        const ctx = canvasEl.getContext('2d');
        if (!ctx) return;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        draw(ctx);
    });
    
    // Resize handler for window resize
    $effect(() => {
        function handleResize() {
            if (!containerEl || !canvasEl) return;
            const containerWidth = containerEl.clientWidth || 1280;
            width = containerWidth;
            height = Math.floor(containerWidth * (9 / 16));
            
            const dpr = window.devicePixelRatio || 1;
            canvasEl.width = Math.floor(width * dpr);
            canvasEl.height = Math.floor(height * dpr);
            const ctx = canvasEl.getContext('2d');
            if (!ctx) return;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            draw(ctx);
        }
        
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    });

    $effect(() => {
        const ctx = canvasEl?.getContext('2d');
        if (!ctx) return;
        draw(ctx);
    });

    function draw(ctx: CanvasRenderingContext2D) {
        const state = $editor;
        ctx.clearRect(0, 0, width, height);

        // background
        ctx.fillStyle = '#f3f4f6';
        ctx.fillRect(0, 0, width, height);

        if (!state.imageBitmap) return;

        // view
        ctx.save();
        ctx.translate(state.view.panX, state.view.panY);
        ctx.scale(state.view.zoom, state.view.zoom);

        // draw image at 0,0
        ctx.drawImage(state.imageBitmap, 0, 0);

        if (state.layout) {
            drawOverlay(ctx, state.layout, state.groupOffset);
        }

        ctx.restore();
    }

    function drawOverlay(ctx: CanvasRenderingContext2D, layout: Layout, offset: { x: number; y: number }) {
        ctx.save();
        ctx.globalAlpha = 0.5;
        ctx.fillStyle = '#10b981';
        ctx.strokeStyle = '#065f46';
        ctx.lineWidth = 2 / ($editor.view.zoom || 1);
        
        for (const m of layout.monitors) {
            // Get adjusted position accounting for bezel offsets
            const adjusted = getAdjustedMonitorPosition(m, layout, $editor);
            
            // Draw monitor frame at adjusted position
            const x = adjusted.x + offset.x;
            const y = adjusted.y + offset.y;
            ctx.fillRect(x, y, m.width, m.height);
            ctx.strokeRect(x, y, m.width, m.height);
        }
        ctx.restore();
    }

    function onPointerDown(e: PointerEvent) {
        const state = $editor;
        lastX = e.clientX;
        lastY = e.clientY;
        if (e.buttons === 1 && state.layout) {
            // left click drags overlay group
            draggingGroup = true;
        }
    }

    function onPointerMove(e: PointerEvent) {
        const dx = e.clientX - lastX;
        const dy = e.clientY - lastY;
        lastX = e.clientX;
        lastY = e.clientY;

        if (panning) {
            setViewPan($editor.view.panX + dx, $editor.view.panY + dy);
            return;
        }
        if (draggingGroup) {
            const invZoom = 1 / ($editor.view.zoom || 1);
            nudgeGroupOffset(dx * invZoom, dy * invZoom);
        }
    }

    function onPointerUp() {
        draggingGroup = false;
        panning = false;
    }

    function onWheel(e: WheelEvent) {
        if (e.ctrlKey) {
            e.preventDefault();
            const zoom = Math.min(8, Math.max(0.05, $editor.view.zoom * (e.deltaY < 0 ? 1.1 : 0.9)));
            setViewZoom(zoom);
        }
    }

    function onKeyDown(e: KeyboardEvent) {
        const step = e.shiftKey ? 10 : 1;
        if (e.key === 'ArrowLeft') nudgeGroupOffset(-step, 0);
        if (e.key === 'ArrowRight') nudgeGroupOffset(step, 0);
        if (e.key === 'ArrowUp') nudgeGroupOffset(0, -step);
        if (e.key === 'ArrowDown') nudgeGroupOffset(0, step);
        if (e.code === 'Space') panning = true;
    }
    function onKeyUp(e: KeyboardEvent) {
        if (e.code === 'Space') panning = false;
    }
</script>

<div class="overlay-canvas" bind:this={containerEl}>
    <canvas
        bind:this={canvasEl}
        width={width}
        height={height}
        tabindex="0"
        on:pointerdown={onPointerDown}
        on:pointermove={onPointerMove}
        on:pointerup={onPointerUp}
        on:mouseleave={onPointerUp}
        on:wheel={onWheel}
        on:keydown={onKeyDown}
        on:keyup={onKeyUp}
    />
    <style>
        .overlay-canvas { 
            border: 1px solid #e5e7eb; 
            border-radius: 0.5rem; 
            overflow: hidden; 
            background: #fff;
            aspect-ratio: 16 / 9;
            width: 100%;
            position: relative;
        }
        canvas { 
            width: 100%; 
            height: 100%;
            outline: none; 
            display: block; 
            object-fit: contain;
        }
    </style>
</div>


