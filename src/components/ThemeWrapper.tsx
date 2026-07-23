"use client";

import React, { useEffect } from 'react';
import { useStore } from '../store/useStore';

export default function ThemeWrapper({ children }: { children: React.ReactNode }) {
  const { theme } = useStore();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <>
      {children}
    </>
  );
}
