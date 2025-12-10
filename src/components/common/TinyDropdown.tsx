"use client";
import React from "react";

interface Props {
  value: string | number;
  onChange: (value: string) => void;
  displayText: string;
  children: React.ReactNode;
}

export default function TinyDropdown({ value, onChange, displayText, children }: Props) {
  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <div
        style={{
          padding: "0px 14px 0px 2px",
          pointerEvents: "none",
          userSelect: "none",
          border: "1px solid #ccc",
          borderRadius: "2px",
          backgroundColor: "white",
          minWidth: "45px",
          fontSize: "0.85em",
          lineHeight: "1.15",
        }}
      >
        {displayText}
      </div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          opacity: 0,
          cursor: "pointer",
        }}
      >
        {children}
      </select>
      <div
        style={{
          position: "absolute",
          right: "2px",
          top: "50%",
          transform: "translateY(-50%)",
          pointerEvents: "none",
          fontSize: "0.6em",
        }}
      >
        ▼
      </div>
    </div>
  );
}
