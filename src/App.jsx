// ─── CREATED: renamed from test.jsx ──────────────────────────
// ─── EDITED: added tab nav + Viewer view switching ────────────
import { useState, useRef, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import Konva from "konva";

import { CANVAS_W, CANVAS_H, CM_TO_PX } from "./constants.js";
import { cmToPx, pxToCm }               from "./canvasUtils.js";
import { styles }                        from "./styles/appStyles.js";

import NumInput      from "./components/shared/NumInput.jsx";
import CylinderScene from "./components/3d/CylinderScene.jsx";
import ExportToolbar from "./components/export/ExportToolbar.jsx";
import ModelViewer   from "./components/viewer/ModelViewer.jsx";

export default function App() {
  // ── tab state ─────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState("generator"); // "generator" | "viewer"

  // ── generator state ───────────────────────────────────────
  const [diameter, setDiameter] = useState(10);
  const [posX,     setPosX]     = useState(20);
  const [posY,     setPosY]     = useState(20);
  const [height,   setHeight]   = useState(15);
  const [show3D,   setShow3D]   = useState(false);

  const stageRef  = useRef(null);
  const circleRef = useRef(null);
  const layerRef  = useRef(null);
  const meshRef   = useRef(null); // passed into CylinderScene for export

  // ── tab switch — full reset on leave ──────────────────────
  const handleTabSwitch = (tab) => {
    if (tab === activeTab) return;
    // reset generator state when leaving it
    if (activeTab === "generator") {
      setDiameter(10);
      setPosX(20);
      setPosY(20);
      setHeight(15);
      setShow3D(false);
    }
    setActiveTab(tab);
  };

  // ── bootstrap Konva — only when generator tab is active ──
  useEffect(() => {
    if (activeTab !== "generator") return;
    if (!document.getElementById("konva-container")) return;
    const stage = new Konva.Stage({
      container: "konva-container",
      width:  CANVAS_W,
      height: CANVAS_H,
    });
    stageRef.current = stage;

    const layer = new Konva.Layer();
    stage.add(layer);
    layerRef.current = layer;

    // grid background
    const gridGroup = new Konva.Group();
    const step = CM_TO_PX * 5;
    for (let x = 0; x <= CANVAS_W; x += step) {
      gridGroup.add(new Konva.Line({
        points: [x, 0, x, CANVAS_H],
        stroke: "#334155",
        strokeWidth: x % (step * 2) === 0 ? 0.8 : 0.4,
      }));
    }
    for (let y = 0; y <= CANVAS_H; y += step) {
      gridGroup.add(new Konva.Line({
        points: [0, y, CANVAS_W, y],
        stroke: "#334155",
        strokeWidth: y % (step * 2) === 0 ? 0.8 : 0.4,
      }));
    }
    layer.add(gridGroup);

    layer.add(new Konva.Text({
      x: 4, y: 4,
      text: "0,0",
      fontSize: 10,
      fill: "#64748b",
      fontFamily: "monospace",
    }));

    const ring = new Konva.Circle({
      x: cmToPx(20), y: cmToPx(20),
      radius: cmToPx(5),
      stroke: "transparent", strokeWidth: 0, fill: "transparent",
    });
    layer.add(ring);

    const crossV = new Konva.Line({ points: [0, -6, 0, 6],  stroke: "#93c5fd", strokeWidth: 1 });
    const crossH = new Konva.Line({ points: [-6, 0, 6, 0],  stroke: "#93c5fd", strokeWidth: 1 });
    const crossGroup = new Konva.Group({ x: cmToPx(20), y: cmToPx(20) });
    crossGroup.add(crossV, crossH);
    layer.add(crossGroup);

    const circle = new Konva.Circle({
      x: cmToPx(20), y: cmToPx(20),
      radius: cmToPx(5),
      fill: "rgba(79,142,247,0.35)",
      stroke: "#4f8ef7",
      strokeWidth: 2,
      draggable: true,
    });
    circleRef.current = circle;
    layer.add(circle);

    circle.on("dragmove", () => {
      const nx = pxToCm(circle.x());
      const ny = pxToCm(circle.y());
      setPosX(parseFloat(nx.toFixed(1)));
      setPosY(parseFloat(ny.toFixed(1)));
      crossGroup.position({ x: circle.x(), y: circle.y() });
      layer.batchDraw();
    });

    layer.draw();
    return () => stage.destroy();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  // ── sync inputs → Konva ───────────────────────────────────
  useEffect(() => {
    const circle = circleRef.current;
    const layer  = layerRef.current;
    if (!circle || !layer) return;
    circle.radius(cmToPx(diameter / 2));
    circle.x(cmToPx(posX));
    circle.y(cmToPx(posY));
    const children   = layer.getChildren();
    const crossGroup = children[children.length - 1];
    if (crossGroup && crossGroup.getClassName() === "Group") {
      crossGroup.position({ x: cmToPx(posX), y: cmToPx(posY) });
    }
    layer.batchDraw();
  }, [diameter, posX, posY]);

  const handleGenerate = () => setShow3D(true);
  const handleBack     = () => setShow3D(false);

  return (
    <div style={styles.root}>
      {/* ── header ── */}
      <header style={styles.header}>
        <div style={styles.headerInner}>
          <div style={styles.logo}>
            <span style={styles.logoIcon}>◎</span>
            <span style={styles.logoText}>Cylinder 3D Generator</span>
          </div>
          <p style={styles.tagline}>2D → 3D in one click</p>

          {/* ── nav tabs ── */}
          <nav style={styles.nav}>
            {["generator", "viewer"].map((tab) => (
              <button
                key={tab}
                style={{
                  ...styles.navTab,
                  ...(activeTab === tab ? styles.navTabActive : {}),
                }}
                onClick={() => handleTabSwitch(tab)}
              >
                {tab === "generator" ? "Generator" : "Viewer"}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* ── Generator view ── */}
      {activeTab === "generator" && (
        <main style={styles.main}>
          {/* controls sidebar */}
          <aside style={styles.sidebar}>
            <h2 style={styles.sidebarTitle}>Shape Controls</h2>

            <section style={styles.section}>
              <h3 style={styles.sectionTitle}>Geometry</h3>
              <NumInput label="Diameter"    value={diameter} onChange={setDiameter} min={1} max={200} />
              <NumInput label="Height (3D)" value={height}   onChange={setHeight}   min={1} max={200} />
            </section>

            <section style={styles.section}>
              <h3 style={styles.sectionTitle}>Position</h3>
              <NumInput label="Position X" value={posX} onChange={setPosX} min={0} max={pxToCm(CANVAS_W)} />
              <NumInput label="Position Y" value={posY} onChange={setPosY} min={0} max={pxToCm(CANVAS_H)} />
              <p style={styles.hint}>Or drag the circle on the canvas.</p>
            </section>

            <div style={styles.summary}>
              <div style={styles.summaryRow}><span>Diameter</span><strong>{diameter} cm</strong></div>
              <div style={styles.summaryRow}><span>Height</span>  <strong>{height}   cm</strong></div>
              <div style={styles.summaryRow}><span>Pos X</span>   <strong>{posX}     cm</strong></div>
              <div style={styles.summaryRow}><span>Pos Y</span>   <strong>{posY}     cm</strong></div>
            </div>

            <button style={styles.generateBtn} onClick={handleGenerate}>
              Generate 3D ↗
            </button>

            {show3D && (
              <button style={styles.backBtn} onClick={handleBack}>
                ← Hide 3D
              </button>
            )}
          </aside>

          {/* canvases */}
          <div style={styles.canvasArea}>
            {/* 2D panel */}
            <div style={styles.panel}>
              <div style={styles.panelHeader}>
                <span style={styles.panelBadge}>2D</span>
                <span style={styles.panelTitle}>Konva Canvas</span>
                <span style={styles.panelSub}>Top-down view · cm grid (5 cm)</span>
              </div>
              <div
                id="konva-container"
                style={{
                  width:        CANVAS_W,
                  height:       CANVAS_H,
                  background:   "#0f172a",
                  borderRadius: "0 0 10px 10px",
                  overflow:     "hidden",
                }}
              />
            </div>

            {/* 3D panel */}
            {show3D && (
              <div style={{ ...styles.panel, position: "relative" }}>
                <div style={styles.panelHeader}>
                  <span style={{ ...styles.panelBadge, background: "#7c3aed" }}>3D</span>
                  <span style={styles.panelTitle}>R3F Viewport</span>
                  <span style={styles.panelSub}>Orbit · Zoom · Pan</span>
                </div>
                {/* position:relative so ExportToolbar anchors inside */}
                <div style={{
                  width:        CANVAS_W,
                  height:       CANVAS_H,
                  borderRadius: "0 0 10px 10px",
                  overflow:     "hidden",
                  position:     "relative",
                }}>
                  <Canvas
                    camera={{ position: [0, 0.5, 1.5], fov: 50 }}
                    shadows
                    style={{ background: "#0f172a" }}
                  >
                    <CylinderScene diameter={diameter} height={height} meshRef={meshRef} />
                  </Canvas>

                  <ExportToolbar meshRef={meshRef} diameter={diameter} height={height} />
                </div>
              </div>
            )}
          </div>
        </main>
      )}

      {/* ── Viewer view ── */}
      {activeTab === "viewer" && <ModelViewer />}
    </div>
  );
}