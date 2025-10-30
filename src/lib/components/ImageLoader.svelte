<script lang="ts">
    import { setImage } from '$lib/store/editor';

    let error: string | null = null;

    async function handleFiles(files: FileList | null) {
        error = null;
        if (!files || files.length === 0) return;
        const file = files[0];
        try {
            const blob = file.slice();
            const bitmap = await createImageBitmap(blob);
            setImage(bitmap, { w: bitmap.width, h: bitmap.height });
        } catch (e) {
            error = 'Failed to load image';
            console.error(e);
        }
    }

    async function handleUrlSubmit(e: SubmitEvent) {
        e.preventDefault();
        const form = e.currentTarget as HTMLFormElement;
        const data = new FormData(form);
        const url = String(data.get('url') || '').trim();
        if (!url) return;
        error = null;
        try {
            const res = await fetch(url);
            const blob = await res.blob();
            const bitmap = await createImageBitmap(blob);
            setImage(bitmap, { w: bitmap.width, h: bitmap.height });
        } catch (e) {
            error = 'Failed to load image from URL';
            console.error(e);
        }
    }
</script>

<div class="image-loader">
    <label class="file-input">
        <span>Choose image</span>
        <input type="file" accept="image/*" on:change={(e) => handleFiles((e.currentTarget as HTMLInputElement).files)} />
    </label>

    <form class="url-input" on:submit={handleUrlSubmit}>
        <input name="url" type="url" placeholder="or paste image URL" />
        <button type="submit">Load</button>
    </form>

    {#if error}
        <p class="error">{error}</p>
    {/if}
    <style>
        .image-loader { display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap; }
        .file-input span { padding: 0.5rem 0.75rem; border: 1px solid #d1d5db; border-radius: 0.375rem; background: #fff; cursor: pointer; display: inline-block; }
        .file-input input { display: none; }
        .url-input { display: flex; gap: 0.5rem; }
        .url-input input { flex: 1; min-width: 240px; padding: 0.5rem 0.75rem; border: 1px solid #d1d5db; border-radius: 0.375rem; }
        .url-input button { padding: 0.5rem 0.75rem; border: 1px solid #d1d5db; border-radius: 0.375rem; background: #f9fafb; }
        .error { color: #b91c1c; }
    </style>
</div>


