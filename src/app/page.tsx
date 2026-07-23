"use client";

import { useStore } from '../store/useStore';
import ZenDashboard from '../components/ZenDashboard';
import Onboarding from '../components/Onboarding';

export default function Page() {
  const { selectedDomain } = useStore();

  if (!selectedDomain) {
    return <Onboarding />;
  }

  return <ZenDashboard />;
}
