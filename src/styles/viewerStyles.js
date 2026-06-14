// ─── CREATED: viewer feature styles ──────────────────────────

export const vStyles = {

  // ── file picker (empty state) ───────────────────────────────
  dropzone: {
    display:        "flex",
    flexDirection:  "column",
    alignItems:     "center",
    justifyContent: "center",
    gap:            16,
    // width:          640,
    height:         400,
    border:         "2px dashed #334155",
    borderRadius:   12,
    background:     "#0f172a",
    cursor:         "pointer",
    transition:     "border-color 0.2s",
  },
  dropzoneIcon: {
    fontSize: 40,
    color:    "#334155",
  },
  dropzoneLabel: {
    fontSize:   14,
    color:      "#64748b",
    fontWeight: 500,
  },
  dropzoneSub: {
    fontSize: 12,
    color:    "#475569",
  },
  fileInput: {
    display: "none",
  },
  browseBtn: {
    padding:      "8px 20px",
    background:   "linear-gradient(135deg, #4f8ef7 0%, #7c3aed 100%)",
    border:       "none",
    borderRadius: 8,
    color:        "#fff",
    fontWeight:   700,
    fontSize:     13,
    cursor:       "pointer",
    letterSpacing:"0.02em",
  },

  // ── preview card ────────────────────────────────────────────
  previewCard: {
    display:       "flex",
    alignItems:    "center",
    gap:           16,
    padding:       "14px 18px",
    background:    "#1e293b",
    border:        "1px solid #334155",
    borderRadius:  10,
    // width:         580,
  },
  previewIcon: {
    fontSize: 28,
    flexShrink: 0,
  },
  previewInfo: {
    display:       "flex",
    flexDirection: "column",
    gap:           4,
    flex:          1,
    minWidth:      0,
  },
  previewName: {
    fontSize:     13,
    fontWeight:   600,
    color:        "#f1f5f9",
    whiteSpace:   "nowrap",
    overflow:     "hidden",
    textOverflow: "ellipsis",
  },
  previewMeta: {
    display:    "flex",
    alignItems: "center",
    gap:        8,
  },
  previewBadge: {
    fontSize:     10,
    fontWeight:   700,
    padding:      "2px 7px",
    borderRadius: 4,
    background:   "#7c3aed",
    color:        "#fff",
    letterSpacing:"0.06em",
  },
  previewSize: {
    fontSize: 11,
    color:    "#64748b",
  },

  // ── view button ─────────────────────────────────────────────
  viewBtn: {
    padding:      "9px 24px",
    background:   "linear-gradient(135deg, #4f8ef7 0%, #7c3aed 100%)",
    border:       "none",
    borderRadius: 8,
    color:        "#fff",
    fontWeight:   700,
    fontSize:     14,
    cursor:       "pointer",
    letterSpacing:"0.02em",
    flexShrink:   0,
  },

  // ── viewer panel wrapper ─────────────────────────────────────
  viewerWrap: {
    display:       "flex",
    flexDirection: "column",
    alignItems:    "flex-start",
    gap:           12,
  },

  // ── reset camera button (floating top-right inside canvas) ──
  resetCamBtn: {
    position:       "absolute",
    top:            12,
    right:          12,
    zIndex:         10,
    display:        "flex",
    alignItems:     "center",
    gap:            6,
    padding:        "7px 14px",
    background:     "rgba(15,23,42,0.82)",
    backdropFilter: "blur(8px)",
    border:         "1px solid #334155",
    borderRadius:   8,
    color:          "#e2e8f0",
    fontSize:       13,
    fontWeight:     600,
    cursor:         "pointer",
    letterSpacing:  "0.02em",
    transition:     "border-color 0.15s, background 0.15s",
    whiteSpace:     "nowrap",
  },

  // ── clear/reset model button (below panel) ───────────────────
  clearBtn: {
    padding:      "8px 20px",
    background:   "transparent",
    border:       "1px solid #334155",
    borderRadius: 8,
    color:        "#94a3b8",
    fontSize:     13,
    fontWeight:   600,
    cursor:       "pointer",
    transition:   "border-color 0.15s, color 0.15s",
  },

  // ── error toast ─────────────────────────────────────────────
  errorToast: {
    position:       "fixed",
    bottom:         28,
    right:          28,
    display:        "flex",
    alignItems:     "center",
    gap:            8,
    padding:        "10px 16px",
    background:     "rgba(15,23,42,0.96)",
    border:         "1px solid #ef4444",
    borderRadius:   10,
    color:          "#e2e8f0",
    fontSize:       13,
    fontWeight:     500,
    boxShadow:      "0 4px 24px rgba(0,0,0,0.5)",
    zIndex:         9999,
    backdropFilter: "blur(8px)",
    animation:      "fadeUp 0.2s ease",
  },
  errorToastIcon: {
    color:      "#ef4444",
    fontWeight: 700,
    fontSize:   15,
  },

  // ── loading overlay inside canvas ───────────────────────────
  loadingOverlay: {
    position:       "absolute",
    inset:          0,
    display:        "flex",
    flexDirection:  "column",
    alignItems:     "center",
    justifyContent: "center",
    gap:            12,
    background:     "rgba(15,23,42,0.75)",
    zIndex:         5,
  },
  loadingSpinner: {
    width:        32,
    height:       32,
    border:       "3px solid #334155",
    borderTop:    "3px solid #4f8ef7",
    borderRadius: "50%",
    animation:    "spin 0.7s linear infinite",
  },
  loadingLabel: {
    fontSize:   13,
    color:      "#94a3b8",
    fontWeight: 500,
  },
};

// reuse the same keyframes already injected by exportStyles —
// but guard separately so viewerStyles is independently usable
if (typeof document !== "undefined" && !document.getElementById("viewer-styles")) {
  const style = document.createElement("style");
  style.id    = "viewer-styles";
  style.textContent = `
    #reset-cam-btn:hover { border-color: #4f8ef7 !important; background: rgba(79,142,247,0.12) !important; }
    #clear-btn:hover     { border-color: #94a3b8 !important; color: #f1f5f9 !important; }
  `;
  document.head.appendChild(style);
}
