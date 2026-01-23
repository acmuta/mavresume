"use client";

import { HelpWidget } from "../home/HelpWidget";

/**
 * BuilderClientWrapper
 *
 * A client-side wrapper that provides the help widget
 * functionality for the builder page. This is separated from the layout
 * because the layout is a server component.
 */

const x: number = "hello"


export function BuilderClientWrapper() {
  return <HelpWidget />;
}
