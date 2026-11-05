'use client';

import React, { useState, useEffect } from 'react';

interface DelayedSkeletonProps {
  delayMs?: number;
  children: React.ReactNode;
}

/**
 * N'affiche le squelette de chargement que si le temps d'attente
 * dépasse le délai spécifié (par défaut ~300ms, selon la recommandation UX Apple).
 */
export const DelayedSkeleton: React.FC<DelayedSkeletonProps> = ({
  delayMs = 300,
  children,
}) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(true);
    }, delayMs);

    return () => clearTimeout(timer);
  }, [delayMs]);

  if (!show) {
    return null;
  }

  return <>{children}</>;
};

