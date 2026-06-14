// ─── CREATED: extracted from test.jsx ────────────────────────

export const xStyles = {
  toolbar: {
    position: "absolute",
    top: 12,
    right: 12,
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: 6,
    zIndex: 10,
  },
  mainBtn: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "7px 14px",
    background: "rgba(15,23,42,0.82)",
    backdropFilter: "blur(8px)",
    border: "1px solid #334155",
    borderRadius: 8,
    color: "#e2e8f0",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    letterSpacing: "0.02em",
    transition: "border-color 0.15s, background 0.15s",
    whiteSpace: "nowrap",
  },
  mainBtnOpen: {
    borderColor: "#4f8ef7",
    background: "rgba(15,23,42,0.95)",
  },
  formatList: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
    alignItems: "stretch",
    animation: "fadeDown 0.15s ease",
  },
  fmtBtn: {
    padding: "6px 14px",
    background: "rgba(15,23,42,0.82)",
    backdropFilter: "blur(8px)",
    border: "1px solid #334155",
    borderRadius: 7,
    color: "#94a3b8",
    fontSize: 12,
    fontWeight: 700,
    cursor: "pointer",
    letterSpacing: "0.08em",
    textAlign: "center",
    transition: "border-color 0.12s, color 0.12s, background 0.12s",
  },
  loadingLabel: {
    display: "flex",
    alignItems: "center",
    gap: 7,
  },
  spinner: {
    display: "inline-block",
    width: 11,
    height: 11,
    border: "2px solid #334155",
    borderTop: "2px solid #4f8ef7",
    borderRadius: "50%",
    animation: "spin 0.7s linear infinite",
  },
  toast: {
    position: "fixed",
    bottom: 28,
    right: 28,
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "10px 16px",
    background: "rgba(15,23,42,0.96)",
    border: "1px solid #22c55e",
    borderRadius: 10,
    color: "#e2e8f0",
    fontSize: 13,
    fontWeight: 500,
    boxShadow: "0 4px 24px rgba(0,0,0,0.5)",
    zIndex: 9999,
    backdropFilter: "blur(8px)",
    animation: "fadeUp 0.2s ease",
  },
  toastCheck: {
    color: "#22c55e",
    fontWeight: 700,
    fontSize: 15,
  },
};

// ─── keyframe injection — runs once on import ─────────────────
if (typeof document !== "undefined" && !document.getElementById("export-toolbar-styles")) {
  const style = document.createElement("style");
  style.id    = "export-toolbar-styles";
  style.textContent = `
    @keyframes spin      { to { transform: rotate(360deg); } }
    @keyframes fadeDown  { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes fadeUp    { from { opacity: 0; transform: translateY(8px);  } to { opacity: 1; transform: translateY(0); } }
    #export-toolbar button:hover:not(:disabled) { border-color: #4f8ef7 !important; color: #e2e8f0 !important; background: rgba(79,142,247,0.12) !important; }
    #export-toolbar button:disabled { opacity: 0.55; cursor: not-allowed; }
  `;
  document.head.appendChild(style);
}
