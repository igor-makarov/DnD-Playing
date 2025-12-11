import React from "react";

import { rehydrate } from "./rehydratable";
// Must import registry before rehydrate to ensure classes are registered
import "./rehydratableRegistry";

interface Props<P extends object> {
  Component: React.FC<P>;
  serializedProps: P;
}

export default function ClientWrapper<P extends object>({ Component, serializedProps }: Props<P>) {
  const rehydratedProps = rehydrate(serializedProps);
  return <Component {...rehydratedProps} />;
}
