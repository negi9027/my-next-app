"use client";

export default function DiseaseSearch({ onSearch }) {
  return (
    <div style={{ maxWidth: 320 }}>
      <input
        className="form-control form-control-sm"
        placeholder="Search diseases..."
        onChange={(e) => onSearch(e.target.value)}
      />
    </div>
  );
}
