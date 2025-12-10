import React from "react";

import ClientWrapper from "./ClientWrapper";
import { dehydrate } from "./rehydratable";
import "./rehydratableRegistry";

interface Props<P extends object> {
  Component: React.FC<P>;
  props: P;
}

/**
 * Server Component that handles serialization across server/client boundaries.
 *
 * 1. Accepts rich props (class instances, etc.)
 * 2. Dehydrates them to plain objects for serialization
 * 3. Renders ClientWrapper which rehydrates and renders the actual Component
 */
export default function ServerWrapper<P extends object>({ Component, props }: Props<P>) {
  const serializedProps = dehydrate(props);
  return <ClientWrapper Component={Component} serializedProps={serializedProps} />;
}
