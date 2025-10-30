<script lang="ts">
    import { editor, setBezelOffset, getBezelOffset } from '$lib/store/editor';

    function updateMonitor(monitorId: string, value: number, unit: 'px' | 'mm') {
        setBezelOffset(monitorId, value, unit);
    }
</script>

<div class="bezel-settings">
    <label>Bezel offset per monitor</label>
    {#if $editor.layout && $editor.layout.monitors.length > 0}
        <div class="monitor-list">
            {#each $editor.layout.monitors as monitor (monitor.id)}
                {@const bezel = getBezelOffset(monitor.id, $editor)}
                {@const value = bezel.value}
                {@const unit = bezel.unit}
                <div class="monitor-item">
                    <div class="monitor-name">{monitor.name}</div>
                    <div class="input-group">
                        <input
                            type="number"
                            value={value}
                            min="0"
                            step={unit === 'mm' ? '0.1' : '1'}
                            on:input={(e) => {
                                const num = Number((e.currentTarget as HTMLInputElement).value);
                                if (!isNaN(num) && num >= 0) {
                                    updateMonitor(monitor.id, num, unit);
                                }
                            }}
                        />
                        <select
                            value={unit}
                            on:change={(e) => {
                                const newUnit = (e.currentTarget as HTMLSelectElement).value as 'px' | 'mm';
                                updateMonitor(monitor.id, value, newUnit);
                            }}
                        >
                            <option value="px">px</option>
                            <option value="mm">mm</option>
                        </select>
                    </div>
                </div>
            {/each}
        </div>
    {:else}
        <p class="hint">Parse your monitor configuration first</p>
    {/if}
    <p class="hint">Adjust spacing for each monitor to account for physical bezels</p>
    <style>
        .bezel-settings { display: grid; gap: 0.5rem; }
        label { font-size: 0.875rem; font-weight: 500; color: #374151; }
        .monitor-list { display: grid; gap: 0.5rem; }
        .monitor-item { display: grid; gap: 0.25rem; padding: 0.5rem; border: 1px solid #e5e7eb; border-radius: 0.375rem; background: #f9fafb; }
        .monitor-name { font-size: 0.75rem; font-weight: 500; color: #6b7280; }
        .input-group { display: flex; gap: 0.5rem; align-items: center; }
        input { flex: 1; padding: 0.4rem 0.6rem; border: 1px solid #d1d5db; border-radius: 0.375rem; background: #fff; font-size: 0.875rem; }
        select { padding: 0.4rem 0.6rem; border: 1px solid #d1d5db; border-radius: 0.375rem; background: #fff; font-size: 0.875rem; }
        .hint { font-size: 0.75rem; color: #6b7280; margin: 0; }
    </style>
</div>
