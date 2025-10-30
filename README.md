# Wallpaper-Cutter

A beautiful, client-side tool for cutting wallpapers into individual monitor-sized pieces. Perfect for multi-monitor setups where you want a seamless wallpaper experience across your displays, especially useful for KDE Plasma Wayland users.

## Features

- 🎨 **Parse Monitor Configuration**: Paste your `kscreen-doctor` output to automatically detect your monitor layout
- 🖼️ **Image Loading**: Load images from your local filesystem or via URL
- 📐 **Visual Overlay**: See your monitor frames overlaid on your wallpaper with real-time positioning
- 🔧 **Per-Monitor Bezel Settings**: Configure individual bezel offsets for each monitor (in pixels or millimeters) to account for physical bezels
- 🎯 **Intelligent Positioning**: 
  - Monitors with 2+ adjacencies push their neighbors away
  - Monitors with a single adjacency move themselves to create proper spacing
- ⌨️ **Intuitive Controls**:
  - Drag monitor frames to reposition them as a group
  - Arrow keys for precise pixel-perfect adjustments
  - Mouse wheel + Ctrl for zoom
  - Space + drag for panning
- 💾 **Export Options**: Export individual wallpapers in PNG or JPEG format with customizable quality settings
- 🌐 **100% Client-Side**: All processing happens in your browser - no data is sent to any server

## Installation

```bash
# Clone the repository
git clone https://github.com/renantonheiro/wallpaper-cutter.git
cd wallpaper-cutter

# Install dependencies
npm install
```

## Development

Start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building for Production

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Usage

### 1. Configure Your Monitors

1. Run `kscreen-doctor -o` in your terminal to get your monitor configuration
2. Copy the entire output
3. Paste it into the "Configuration" section of the app
4. Click "Parse" to load your monitor layout

Example output:
```
Output: 1 DP-1 a1e96a12-e1f6-485e-b2d0-0cff97e515a3
        Geometry: 3640,0 1080x1920

Output: 2 DP-2 41247c2d-48a9-4743-8ab6-9038d04b21bc
        Geometry: 0,0 1080x1920

Output: 3 DP-3 3720961a-791c-4c64-beb6-f5eeba5d5ba9
        Geometry: 1080,176 2560x1440
```

### 2. Load Your Wallpaper

- Click "Choose image" to select a file from your computer, or
- Paste an image URL and click "Load"

### 3. Adjust Bezel Settings (Optional)

For each monitor, set the bezel offset if needed:
- Use pixels (px) or millimeters (mm) units
- The bezel offset accounts for physical monitor bezels
- Monitors with bezels will push adjacent monitors away to create proper spacing

### 4. Position Your Wallpaper

- **Drag** the monitor frames as a group to position your wallpaper
- Use **Arrow keys** for precise adjustments (Shift + Arrow for 10px steps)
- **Ctrl + Mouse Wheel** to zoom in/out
- **Space + Drag** to pan the view

### 5. Export Your Wallpapers

1. Click the "Export" button
2. Choose your preferred format (PNG or JPEG)
3. Adjust quality settings if using JPEG
4. Select background handling (transparent or black)
5. Click "Export" to download individual wallpapers for each monitor

Files are automatically named: `{index}-{monitor-name}-{width}x{height}.{format}`

## How It Works

### Bezel Logic

The tool intelligently handles bezel offsets:

- **Multiple adjacencies (2+)**: When a monitor has bezels and is adjacent to multiple monitors, those adjacent monitors are pushed away to create spacing around the bezeled monitor.

- **Single adjacency**: When a monitor has bezels and only one adjacent monitor, the monitor itself moves away to create proper spacing.

This ensures that physical bezels are properly accounted for when cutting wallpapers, creating a seamless visual experience across your display setup.

### Coordinate System

The tool uses the same coordinate system as your display configuration:
- Origin (0,0) is at the top-left
- Positions are in pixels
- Monitor frames show exactly where the wallpaper will be cropped

## Technology Stack

- **SvelteKit** - Full-stack framework
- **TypeScript** - Type safety
- **Canvas API** - Image rendering and manipulation
- **100% Client-Side** - No backend required

## Browser Support

Works in all modern browsers that support:
- Canvas API
- File API
- ES6+ JavaScript features

## License

MIT License - see LICENSE file for details

## Author

Renan Tonheiro

---

Made with ❤️ for multi-monitor enthusiasts
