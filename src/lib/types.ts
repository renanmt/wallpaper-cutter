export type Monitor = {
    id: string;
    name: string;
    x: number;
    y: number;
    width: number;
    height: number;
};

export type LayoutBounds = {
    x: number;
    y: number;
    width: number;
    height: number;
};

export type Layout = {
    monitors: Monitor[];
    bounds: LayoutBounds;
};

export type ImageNatural = { w: number; h: number };

export type EditorView = {
    zoom: number; // canvas pixels per image pixel
    panX: number; // canvas pixels
    panY: number; // canvas pixels
};

export type BezelOffset = {
    value: number;
    unit: 'px' | 'mm';
};

export type EditorState = {
    imageBitmap: ImageBitmap | null;
    imageNatural: ImageNatural | null;
    layout: Layout | null;
    groupOffset: { x: number; y: number }; // image-space pixels
    bezelOffsets: Record<string, BezelOffset>; // monitor ID -> bezel offset
    view: EditorView;
};

export type ExportOptions = {
    format: 'png' | 'jpeg';
    quality?: number; // 0..1 (jpeg only)
    background?: 'transparent' | 'black';
};


