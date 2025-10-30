<script lang="ts">
    import { parseKscreenDoctor } from '$lib/parse/kscreen';
    import { setLayout } from '$lib/store/editor';

    let text = '';
    let error: string | null = null;

    function parse() {
        error = null;
        try {
            const layout = parseKscreenDoctor(text);
            setLayout(layout);
        } catch (e) {
            error = 'Could not parse configuration';
            console.error(e);
        }
    }
</script>

<div class="paste-config">
    <textarea bind:value={text} rows={8} placeholder="Paste kscreen-doctor output here..."></textarea>
    <div class="actions">
        <button on:click={parse}>Parse</button>
    </div>
    {#if error}
        <p class="error">{error}</p>
    {/if}
    <style>
        .paste-config { display: grid; gap: 0.5rem; }
        textarea { width: 100%; padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 0.375rem; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; }
        .actions { display: flex; justify-content: flex-end; }
        button { padding: 0.5rem 0.75rem; border: 1px solid #d1d5db; border-radius: 0.375rem; background: #fff; }
        .error { color: #b91c1c; }
    </style>
</div>


