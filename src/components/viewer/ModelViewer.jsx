// ─── CREATED: model viewer feature ───────────────────────────
import { useState, useRef, useCallback, useEffect } from "react";
import { Canvas, useThree }                         from "@react-three/fiber";
import { OrbitControls, Grid }                      from "@react-three/drei";
import * as THREE                                   from "three";
import { vStyles }                                  from "../../styles/viewerStyles.js";
import { CANVAS_W, CANVAS_H }                       from "../../constants.js";

// ─── supported formats ────────────────────────────────────────
const SUPPORTED = ["glb", "gltf", "stl", "obj"];

function formatBytes(bytes) {
  if (bytes < 1024)        return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function getExt(filename) {
  return filename.split(".").pop().toLowerCase();
}

// ─── Camera auto-fitter — mounts inside Canvas ───────────────
function CameraFitter({ object, onReady, triggerReset }) {
  const { camera, controls } = useThree();

  const fit = useCallback(() => {
    if (!object) return;
    const box    = new THREE.Box3().setFromObject(object);
    const center = new THREE.Vector3();
    const size   = new THREE.Vector3();
    box.getCenter(center);
    box.getSize(size);

    const maxDim  = Math.max(size.x, size.y, size.z);
    const fov     = camera.fov * (Math.PI / 180);
    let   camDist = Math.abs(maxDim / (2 * Math.tan(fov / 2)));
    camDist      *= 1.6; // padding factor

    camera.position.set(center.x, center.y + maxDim * 0.3, center.z + camDist);
    camera.near = camDist / 100;
    camera.far  = camDist * 10;
    camera.lookAt(center);
    camera.updateProjectionMatrix();

    if (controls) {
      controls.target.copy(center);
      controls.update();
    }
  }, [object, camera, controls]);

  // fit on first load
  useEffect(() => {
    if (object) { fit(); onReady?.(); }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [object]);

  // fit on external reset trigger
  useEffect(() => {
    if (triggerReset > 0) fit();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [triggerReset]);

  return null;
}

// ─── Scene — renders the loaded model + grid + lights ─────────
function ViewerScene({ object, onReady, triggerReset }) {
  const box  = new THREE.Box3().setFromObject(object);
  const size = new THREE.Vector3();
  box.getSize(size);
  const floorY = box.min.y;

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 10, 5]}   intensity={1.2} castShadow />
      <directionalLight position={[-5, -3, -5]} intensity={0.3} />

      <primitive object={object} castShadow receiveShadow />

      <Grid
        position={[0, floorY, 0]}
        args={[20, 20]}
        cellSize={0.1}
        cellColor="#94a3b8"
        sectionColor="#475569"
        fadeDistance={10}
        infiniteGrid
      />

      <OrbitControls makeDefault enablePan enableZoom enableRotate />
      <CameraFitter object={object} onReady={onReady} triggerReset={triggerReset} />
    </>
  );
}

// ─── Main ModelViewer component ───────────────────────────────
export default function ModelViewer() {
  const [fileInfo,      setFileInfo]      = useState(null);   // { name, ext, size, raw: File }
  const [loadedObject,  setLoadedObject]  = useState(null);   // THREE.Object3D
  const [loading,       setLoading]       = useState(false);
  const [errorToast,    setErrorToast]    = useState(null);   // string | null
  const [triggerReset,  setTriggerReset]  = useState(0);

  const fileInputRef  = useRef(null);
  const toastTimer    = useRef(null);

  // ── show error toast ────────────────────────────────────────
  const showError = useCallback((msg) => {
    clearTimeout(toastTimer.current);
    setErrorToast(msg);
    toastTimer.current = setTimeout(() => setErrorToast(null), 4000);
  }, []);

  // ── file selected ───────────────────────────────────────────
  const handleFileChange = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const ext = getExt(file.name);
    if (!SUPPORTED.includes(ext)) {
      showError(`Unsupported format ".${ext}". Use GLB, GLTF, STL, or OBJ.`);
      e.target.value = "";
      return;
    }
    setFileInfo({ name: file.name, ext, size: formatBytes(file.size), raw: file });
    setLoadedObject(null);
  }, [showError]);

  // ── load model into Three.js ────────────────────────────────
  const handleView = useCallback(async () => {
    if (!fileInfo) return;
    setLoading(true);
    try {
      const url    = URL.createObjectURL(fileInfo.raw);
      let   object = null;

      if (fileInfo.ext === "glb" || fileInfo.ext === "gltf") {
        const { GLTFLoader } = await import("three/examples/jsm/loaders/GLTFLoader.js");
        const gltf = await new Promise((res, rej) => {
          new GLTFLoader().load(url, res, undefined, rej);
        });
        object = gltf.scene;
      }

      if (fileInfo.ext === "stl") {
        const { STLLoader } = await import("three/examples/jsm/loaders/STLLoader.js");
        const geometry = await new Promise((res, rej) => {
          new STLLoader().load(url, res, undefined, rej);
        });
        geometry.computeVertexNormals();
        const mesh = new THREE.Mesh(
          geometry,
          new THREE.MeshStandardMaterial({ color: "#4f8ef7", metalness: 0.2, roughness: 0.5 })
        );
        object = mesh;
      }

      if (fileInfo.ext === "obj") {
        const { OBJLoader } = await import("three/examples/jsm/loaders/OBJLoader.js");
        object = await new Promise((res, rej) => {
          new OBJLoader().load(url, res, undefined, rej);
        });
        // apply default material to all meshes that have none
        object.traverse((child) => {
          if (child.isMesh && !child.material?.color) {
            child.material = new THREE.MeshStandardMaterial({
              color: "#4f8ef7", metalness: 0.2, roughness: 0.5,
            });
          }
        });
      }

      URL.revokeObjectURL(url);

      if (!object) throw new Error("Loader returned nothing.");
      setLoadedObject(object);
    } catch (err) {
      console.error("Load failed:", err);
      showError("Failed to load model. The file may be corrupted or unsupported.");
    } finally {
      setLoading(false);
    }
  }, [fileInfo, showError]);

  // ── clear / reset ───────────────────────────────────────────
  const handleClear = useCallback(() => {
    setFileInfo(null);
    setLoadedObject(null);
    setLoading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  // ── reset camera ────────────────────────────────────────────
  const handleResetCamera = useCallback(() => {
    setTriggerReset((n) => n + 1);
  }, []);

  // ── panel styles shared with App ────────────────────────────
  const panelStyle = {
    width:        1269,
    borderRadius: 10,
    border:       "1px solid #1e293b",
    overflow:     "hidden",
    flexShrink:   0,
  };
  const panelHeaderStyle = {
    display:         "flex",
    alignItems:      "center",
    gap:             8,
    padding:         "8px 14px",
    background:      "#1e293b",
    borderBottom:    "1px solid #0f172a",
  };

  return (
    <div style={{ padding: "24px 32px" }}>

      {/* ── file picker (no file chosen yet) ─────────────────── */}
      {!fileInfo && (
        <div
          style={vStyles.dropzone}
          onClick={() => fileInputRef.current?.click()}
        >
          <span style={vStyles.dropzoneIcon}>📂</span>
          <span style={vStyles.dropzoneLabel}>Choose a 3D model file</span>
          <span style={vStyles.dropzoneSub}>Supports GLB · GLTF · STL · OBJ</span>
          <button
            style={vStyles.browseBtn}
            onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
          >
            Browse Files
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".glb,.gltf,.stl,.obj"
            style={vStyles.fileInput}
            onChange={handleFileChange}
          />
        </div>
      )}

      {/* ── preview card + view button ────────────────────────── */}
      {fileInfo && !loadedObject && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={vStyles.previewCard}>
            <span style={vStyles.previewIcon}>🧊</span>
            <div style={vStyles.previewInfo}>
              <span style={vStyles.previewName}>{fileInfo.name}</span>
              <div style={vStyles.previewMeta}>
                <span style={vStyles.previewBadge}>{fileInfo.ext.toUpperCase()}</span>
                <span style={vStyles.previewSize}>{fileInfo.size}</span>
              </div>
            </div>
            <button
              style={vStyles.viewBtn}
              onClick={handleView}
              disabled={loading}
            >
              {loading ? "Loading…" : "View ↗"}
            </button>
          </div>

          {/* allow re-picking while on preview card */}
          <button
            style={vStyles.clearBtn}
            id="clear-btn"
            onClick={handleClear}
          >
            ✕ Choose different file
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".glb,.gltf,.stl,.obj"
            style={vStyles.fileInput}
            onChange={handleFileChange}
          />
        </div>
      )}

      {/* ── R3F viewer ────────────────────────────────────────── */}
      {loadedObject && (
        <div style={vStyles.viewerWrap}>
          <div style={panelStyle}>
            <div style={panelHeaderStyle}>
              <span style={{
                background:    "#7c3aed",
                color:         "#fff",
                fontSize:      10,
                fontWeight:    700,
                padding:       "2px 6px",
                borderRadius:  4,
                letterSpacing: "0.05em",
              }}>
                3D
              </span>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0" }}>
                Model Viewer
              </span>
              <span style={{ fontSize: 11, color: "#64748b", marginLeft: "auto" }}>
                {fileInfo.name}
              </span>
            </div>

            {/* canvas wrapper */}
            <div style={{
              width:    "100%",
              height:   CANVAS_H,
              position: "relative",
              overflow: "hidden",
            }}>
              <Canvas
                shadows
                style={{ background: "#0f172a" }}
              >
                <ViewerScene
                  object={loadedObject}
                  onReady={() => {}}
                  triggerReset={triggerReset}
                />
              </Canvas>

              {/* loading overlay */}
              {loading && (
                <div style={vStyles.loadingOverlay}>
                  <div style={vStyles.loadingSpinner} />
                  <span style={vStyles.loadingLabel}>Loading model…</span>
                </div>
              )}

              {/* reset camera — floating top-right */}
              <button
                id="reset-cam-btn"
                style={vStyles.resetCamBtn}
                onClick={handleResetCamera}
              >
                ⟳ Reset Camera
              </button>
            </div>
          </div>

          {/* clear / reset — below panel */}
          <button
            id="clear-btn"
            style={vStyles.clearBtn}
            onClick={handleClear}
          >
            ✕ Clear Model
          </button>
        </div>
      )}

      {/* ── error toast ───────────────────────────────────────── */}
      {errorToast && (
        <div style={vStyles.errorToast}>
          <span style={vStyles.errorToastIcon}>✗</span>
          {errorToast}
        </div>
      )}
    </div>
  );
}
