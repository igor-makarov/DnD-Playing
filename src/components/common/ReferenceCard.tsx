import React from "react";

interface Props {
  children: React.ReactNode;
}

export default function ReferenceCard({ children }: Props) {
  return <article className="reference-card">{children}</article>;
}
