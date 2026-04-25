import React from "react";

import { useStore } from "@/js/hooks/useStore";
import type { Store } from "@/js/stores/primitives/createStore";

interface Props {
  title: React.ReactNode;
  store: Store<string>;
  rows?: number;
  placeholder?: string;
  "data-testid"?: string;
  className?: string;
}

export default function TextBox({ title, store, rows = 4, placeholder, "data-testid": testId, className }: Props) {
  const value = useStore(store);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    store.set(event.target.value);
  };

  return (
    <table className={className}>
      <tbody>
        <tr>
          <th style={{ textAlign: "center" }}>{title}</th>
        </tr>
        <tr>
          <td>
            <textarea
              value={value}
              onChange={handleChange}
              rows={rows}
              placeholder={placeholder}
              data-testid={testId}
              aria-label={typeof title === "string" ? title : undefined}
              style={{ width: "100%", resize: "vertical" }}
            />
          </td>
        </tr>
      </tbody>
    </table>
  );
}
