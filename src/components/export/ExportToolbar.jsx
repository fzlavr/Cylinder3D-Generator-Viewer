// ─── CREATED: extracted from test.jsx ────────────────────────
import { useState, useRef, useEffect, useCallback } from "react";
import { exportMesh } from "../../exportUtils.js";
import { xStyles }    from "../../styles/exportStyles.js";

const FORMATS = ["glb", "gltf", "stl", "obj"];

export default function ExportToolbar({ meshRef, diameter, height }) {
  const [open, setOpen]       = useState(false);
  const [loading, setLoading] = useState(null); // format string | null
  const [toast, setToast]     = useState(null); // filename string | null
  const toastTimer            = useRef(null);

  const handleToggle = () => setOpen((v) => !v);

  const handleExport = useCallback(async (fmt) => {
    if (!meshRef.current || loading) return;
    setLoading(fmt);
    setOpen(false);
    try {
      const name = await exportMesh(fmt, meshRef.current, diameter, height);
      clearTimeout(toastTimer.current);
      setToast(name);
      toastTimer.current = setTimeout(() => setToast(null), 3000);
    } catch (err) {
      console.error("Export failed:", err);
    } finally {
      setLoading(null);
    }
  }, [meshRef, diameter, height, loading]);

  // close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (!e.target.closest("#export-toolbar")) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <>
      {/* floating toolbar */}
      <div id="export-toolbar" style={xStyles.toolbar}>
        {/* format buttons — expand downward */}
        {open && (
          <div style={xStyles.formatList}>
            {FORMATS.map((fmt) => (
              <button
                key={fmt}
                style={xStyles.fmtBtn}
                onClick={() => handleExport(fmt)}
                disabled={!!loading}
              >
                {loading === fmt ? "Exporting…" : fmt.toUpperCase()}
              </button>
            ))}
          </div>
        )}

        {/* main toggle */}
        <button
          style={{
            ...xStyles.mainBtn,
            ...(open ? xStyles.mainBtnOpen : {}),
          }}
          onClick={handleToggle}
          disabled={!!loading}
        >
          {loading ? (
            <span style={xStyles.loadingLabel}>
              <span style={xStyles.spinner} />
              Exporting…
            </span>
          ) : (
            <>Export ↓</>
          )}
        </button>
      </div>

      {/* toast */}
      {toast && (
        <div style={xStyles.toast}>
          <span style={xStyles.toastCheck}>✓</span>
          {toast} downloaded
        </div>
      )}
    </>
  );
}
