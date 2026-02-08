/**
 * Hook pour le raccourci clavier d'ouverture du panneau de paramétrage
 * Ctrl+Shift+P ou triple-clic sur le titre
 */

import { useEffect, useRef, useCallback } from 'react';
import { useSettings } from '../contexts/SettingsContext';

export const useSettingsShortcut = () => {
  const { setIsSettingsOpen } = useSettings();
  const clickCountRef = useRef(0);
  const clickTimerRef = useRef(null);

  // Raccourci clavier Ctrl+Shift+P
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'P') {
        e.preventDefault();
        setIsSettingsOpen(prev => !prev);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [setIsSettingsOpen]);

  // Triple-clic sur le titre
  const handleTitleClick = useCallback(() => {
    clickCountRef.current += 1;

    if (clickTimerRef.current) {
      clearTimeout(clickTimerRef.current);
    }

    if (clickCountRef.current >= 3) {
      clickCountRef.current = 0;
      setIsSettingsOpen(true);
    } else {
      clickTimerRef.current = setTimeout(() => {
        clickCountRef.current = 0;
      }, 500);
    }
  }, [setIsSettingsOpen]);

  return { handleTitleClick };
};
