// ─── CREATED: extracted from test.jsx ────────────────────────
import { styles } from "../../styles/appStyles.js";

export default function NumInput({
  label,
  value,
  onChange,
  min  = 0.1,
  max  = 500,
  step = 0.5,
  unit = "cm",
}) {
  return (
    <label style={styles.inputGroup}>
      <span style={styles.inputLabel}>{label}</span>
      <div style={styles.inputRow}>
        <input
          type="number"
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={(e) => onChange(parseFloat(e.target.value) || min)}
          style={styles.input}
        />
        <span style={styles.unit}>{unit}</span>
      </div>
    </label>
  );
}
