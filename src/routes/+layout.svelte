<script lang="ts">
    import favicon from '$lib/assets/favicon.svg';

    let { children } = $props();
</script>

<svelte:head>
    <link rel="icon" href={favicon} />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Wallpaper-Cutter</title>
</svelte:head>

<div class="app-root">
    <header class="app-header">
        <h1>Wallpaper-Cutter</h1>
    </header>
    <main class="app-content">
        {@render children?.()}
    </main>
    <footer class="app-footer">Client-only image processing • SvelteKit</footer>
    <style>
        :global(html, body, #svelte) { 
            height: 100%; 
            margin: 0; 
            padding: 0; 
            overflow-x: hidden;
        }
        .app-root { 
            min-height: 100dvh; 
            display: flex; 
            flex-direction: column; 
        }
        .app-header { 
            padding: 1rem 1.5rem; 
            border-bottom: 1px solid #e5e7eb; 
            background: linear-gradient(to right, #ffffff, #f9fafb);
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        }
        .app-header h1 { 
            margin: 0; 
            font-size: 1.25rem; 
            font-weight: 600; 
            color: #111827;
            letter-spacing: -0.025em;
        }
        .app-content { 
            flex: 1; 
            padding: 1.5rem; 
            max-width: 1400px; 
            margin: 0 auto; 
            width: 100%; 
            box-sizing: border-box;
        }
        .app-footer { 
            padding: 1rem 1.5rem; 
            color: #9ca3af; 
            font-size: 0.8125rem; 
            border-top: 1px solid #e5e7eb; 
            background: linear-gradient(to right, #fafafa, #ffffff);
            text-align: center;
            margin-top: auto;
        }
    </style>
</div>
