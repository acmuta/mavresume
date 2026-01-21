"use client";

import { createContext } from "react";

export const PreviewContext = createContext<{ openPreview: () => void } | null>(null);
