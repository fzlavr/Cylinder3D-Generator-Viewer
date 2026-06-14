# Cylinder 3D Generator

A browser-based tool for designing cylinders in 2D and previewing them in 3D, with support for exporting models and viewing external 3D files directly in the browser.

![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react&logoColor=white)
![Three.js](https://img.shields.io/badge/Three.js-R3F-black?style=flat&logo=three.js&logoColor=white)
![Konva.js](https://img.shields.io/badge/Konva.js-2D_Canvas-FF6B6B?style=flat)

---

## Overview

Cylinder 3D Generator is a React-based web application with two main features:

- **Generator** — design a cylinder on a 2D canvas by setting its diameter, height, and position, then generate a live 3D preview with one click and export it to GLB, GLTF, STL, or OBJ format.
- **Viewer** — load and inspect any existing 3D model file (GLB, GLTF, STL, OBJ) directly in the browser with an auto-fitting camera, orbit controls, and a reset camera button.

Both features share the same dark-themed R3F (React Three Fiber) viewport and are accessible via a tab navigation in the header.

---

## Tech Stack

| Library | Role |
|---|---|
| [React 18](https://react.dev) | UI framework, state management |
| [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) | Declarative Three.js renderer |
| [@react-three/drei](https://github.com/pmndrs/drei) | R3F helpers (OrbitControls, Grid) |
| [Three.js](https://threejs.org) | 3D engine, loaders, exporters |
| [Konva.js](https://konvajs.org) | 2D canvas for the top-down cylinder editor |

---

## Features

### Generator

The Generator is the default view. It provides a 2D Konva canvas on the left and an optional 3D R3F viewport on the right.

**Step-by-step usage:**

1. Open the app — the Generator tab is active by default.
2. Use the **Diameter** input in the sidebar to set the cylinder's diameter in centimetres.
3. Use the **Height (3D)** input to set how tall the cylinder will appear in the 3D view.
4. Use the **Position X** and **Position Y** inputs to place the cylinder on the 2D canvas, or drag the blue circle directly on the canvas.
5. The **summary panel** in the sidebar always reflects the current values.
6. Click **Generate 3D ↗** to open the 3D viewport on the right. The cylinder renders immediately using your current settings.
7. Any change to the sidebar inputs updates both the 2D circle and the 3D cylinder in real time.
8. In the 3D viewport, use the **Export ↓** button (top-right of the canvas) to export the model. Click it to expand the format list, then choose one of: **GLB**, **GLTF**, **STL**, or **OBJ**. The file downloads automatically and a confirmation toast appears.
9. Click **← Hide 3D** in the sidebar to collapse the 3D viewport.

---

### Viewer

The Viewer lets you load and inspect existing 3D model files without leaving the browser.

**Step-by-step usage:**

1. Click the **Viewer** tab in the header.
2. The file picker screen appears. Click anywhere on the dashed area or click **Browse Files** to open your system file picker.
3. Supported formats: **GLB**, **GLTF**, **STL**, **OBJ**. Selecting an unsupported format shows a red error toast.
4. After selecting a valid file, a **preview card** appears showing the filename, format badge, and file size.
5. Click **View ↗** on the preview card to load the model into the 3D viewport.
6. The camera automatically fits to the model's bounding box on load — no manual adjustment needed.
7. Use **orbit** (left-click drag), **zoom** (scroll), and **pan** (right-click drag) to inspect the model.
8. Click **⟳ Reset Camera** (floating top-right of the canvas) to snap the camera back to the auto-fit position at any time.
9. Click **✕ Clear Model** (below the viewport) to unload the model and return to the file picker.
10. To load a different file without clearing, click **✕ Choose different file** on the preview card before clicking View.

---

## File Structure

```
project-root/
├── main.jsx                          # React root — mounts <App />, untouched after init
└── src/
    ├── constants.js                  # Shared constants: CANVAS_W, CANVAS_H, CM_TO_PX
    ├── canvasUtils.js                # Pure helpers: cmToPx(), pxToCm()
    ├── exportUtils.js                # Export logic: triggerDownload(), exportMesh()
    ├── App.jsx                       # Root component: tab state, Konva bootstrap, layout
    │
    ├── styles/
    │   ├── appStyles.js              # Layout styles for App, sidebar, panels, nav tabs
    │   ├── exportStyles.js           # Export toolbar styles + keyframe injection
    │   └── viewerStyles.js           # Viewer styles: dropzone, preview card, toasts
    │
    └── components/
        ├── shared/
        │   └── NumInput.jsx          # Reusable labelled number input
        ├── 3d/
        │   └── CylinderScene.jsx     # R3F scene: cylinder mesh, grid, lights, controls
        ├── export/
        │   └── ExportToolbar.jsx     # Floating export dropdown with loading + toast state
        └── viewer/
            ├── ModelViewer.jsx       # File picker → preview card → R3F viewer flow
```

---

## Architecture

The project is split into four clear layers:

### 1. Configuration (`constants.js`)
A single source of truth for the canvas dimensions and the cm-to-px scale factor. Both the Konva canvas and the R3F export filename logic import from here, ensuring consistency.

### 2. Logic (`canvasUtils.js`, `exportUtils.js`)
Pure functions with no React or JSX dependency.

- `canvasUtils.js` — coordinate conversion math used by both the Konva drag handler and the sidebar inputs.
- `exportUtils.js` — handles Blob creation and file download for all four export formats. This is the closest layer to a "backend" in a client-only app: it could be moved to a Node.js server with minimal changes.

### 3. Styles (`src/styles/`)
All styles are fully separated from components and live in their own files. Each style file covers one feature area — `appStyles.js` for the main layout, `exportStyles.js` for the export toolbar (including keyframe injection, which runs at module level on import), and `viewerStyles.js` for the viewer feature.

### 4. Components (`src/components/`)
Organised into feature-based folders:

- `shared/` — generic, reusable UI (NumInput).
- `3d/` — the R3F cylinder scene. Stateless; receives all values as props.
- `export/` — the export toolbar. Manages its own open/loading/toast state internally.
- `viewer/` — the full model viewer flow. Contains three sub-components defined in the same file: `CameraFitter` (auto-fits the camera to a loaded model's bounding box and responds to external reset triggers), `ViewerScene` (R3F scene with lights, grid, and the loaded model), and `ModelViewer` (the orchestrator managing file picker → preview card → viewport state).

### Tab switching
`App.jsx` manages a single `activeTab` state (`"generator"` or `"viewer"`). Switching tabs triggers a full reset of the leaving view. The Konva bootstrap `useEffect` depends on `activeTab` and guards against running when the `konva-container` div is absent (i.e. when the Viewer tab is active).

---

## Setup & Installation

**Prerequisites:** Node.js 18 or higher, npm.

```bash
# 1. Clone the repository
git clone https://github.com/your-username/cylinder-3d-generator.git
cd cylinder-3d-generator

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

The app will be available at `http://localhost:5173` by default (Vite).

**Build for production:**

```bash
npm run build
```

Output is placed in the `dist/` folder, ready to be served as a static site.

---

## Contributing

Contributions are welcome. If you find a bug or have a feature idea, feel free to open an issue or submit a pull request. Please keep PRs focused on a single change and include a clear description of what was changed and why.

---

## License

License to be determined. All rights reserved until a license is specified.