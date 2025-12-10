import React from "react";

import ServerWrapper from "./ServerWrapper";

/**
 * React HOC that automatically rehydrates decorated class instances in props.
 */
export function withAutoRehydration<P extends object>(Component: React.FC<P>): React.FC<P> {
  return (props: P) => {
    return React.createElement(ServerWrapper, { Component, props } as any);
  };
}
