// ─── CREATED: extracted from test.jsx ────────────────────────

export function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a   = document.createElement("a");
  a.href     = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export async function exportMesh(format, mesh, diameter, height) {
  const filename = `cylinder_d${diameter}_h${height}`;

  if (format === "glb" || format === "gltf") {
    const { GLTFExporter } = await import("three/examples/jsm/exporters/GLTFExporter.js");
    const exporter = new GLTFExporter();
    const binary   = format === "glb";
    const result   = await new Promise((resolve, reject) =>
      exporter.parse(mesh, resolve, reject, { binary })
    );
    const blob = binary
      ? new Blob([result], { type: "application/octet-stream" })
      : new Blob([JSON.stringify(result)], { type: "application/json" });
    triggerDownload(blob, `${filename}.${format}`);
    return `${filename}.${format}`;
  }

  if (format === "stl") {
    const { STLExporter } = await import("three/examples/jsm/exporters/STLExporter.js");
    const exporter = new STLExporter();
    const str      = exporter.parse(mesh, { binary: false });
    const blob     = new Blob([str], { type: "text/plain" });
    triggerDownload(blob, `${filename}.stl`);
    return `${filename}.stl`;
  }

  if (format === "obj") {
    const { OBJExporter } = await import("three/examples/jsm/exporters/OBJExporter.js");
    const exporter = new OBJExporter();
    const str      = exporter.parse(mesh);
    const blob     = new Blob([str], { type: "text/plain" });
    triggerDownload(blob, `${filename}.obj`);
    return `${filename}.obj`;
  }
}
