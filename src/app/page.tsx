"use client";

import { useEffect, useState } from 'react';
import { useStore } from '@/store/useStore';
import ZenDashboard from '@/components/ZenDashboard';
import Onboarding from '@/components/Onboarding';

export default function Page() {
  const [isHydrated, setIsHydrated] = useState(false);
  const { selectedDomain } = useStore();

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) return null;

  if (!selectedDomain) {
    return <Onboarding />;
  }

  return <ZenDashboard />;
}
