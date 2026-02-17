/**
 * Hook pour le redimensionnement des colonnes de tableau par glissement
 * Persiste les largeurs dans localStorage
 */

import { useState, useCallback, useRef, useEffect } from 'react';

const STORAGE_PREFIX = 'hospifinance_colwidths_';

export const useColumnResize = (tableId, defaultWidths = {}) => {
  const [columnWidths, setColumnWidths] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_PREFIX + tableId);
      return stored ? { ...defaultWidths, ...JSON.parse(stored) } : defaultWidths;
    } catch {
      return defaultWidths;
    }
  });

  const dragState = useRef(null);

  const persist = useCallback((widths) => {
    try {
      localStorage.setItem(STORAGE_PREFIX + tableId, JSON.stringify(widths));
    } catch { /* ignore */ }
  }, [tableId]);

  const onResizeStart = useCallback((columnKey, e) => {
    e.preventDefault();
    e.stopPropagation();
    const startX = e.clientX;
    const startWidth = columnWidths[columnKey] || 120;

    dragState.current = { columnKey, startX, startWidth };

    const onMouseMove = (moveEvent) => {
      if (!dragState.current) return;
      const diff = moveEvent.clientX - dragState.current.startX;
      const newWidth = Math.max(50, dragState.current.startWidth + diff);

      setColumnWidths(prev => {
        const updated = { ...prev, [dragState.current.columnKey]: newWidth };
        return updated;
      });
    };

    const onMouseUp = () => {
      if (dragState.current) {
        setColumnWidths(prev => {
          persist(prev);
          return prev;
        });
      }
      dragState.current = null;
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }, [columnWidths, persist]);

  const onDoubleClick = useCallback((columnKey) => {
    setColumnWidths(prev => {
      const updated = { ...prev };
      delete updated[columnKey];
      if (defaultWidths[columnKey]) {
        updated[columnKey] = defaultWidths[columnKey];
      }
      persist(updated);
      return updated;
    });
  }, [defaultWidths, persist]);

  const resetAll = useCallback(() => {
    setColumnWidths(defaultWidths);
    persist(defaultWidths);
  }, [defaultWidths, persist]);

  const getHeaderProps = useCallback((columnKey) => ({
    style: columnWidths[columnKey] ? {
      width: columnWidths[columnKey],
      minWidth: columnWidths[columnKey],
      maxWidth: columnWidths[columnKey],
    } : {},
  }), [columnWidths]);

  const getCellProps = useCallback((columnKey) => ({
    style: columnWidths[columnKey] ? {
      width: columnWidths[columnKey],
      minWidth: columnWidths[columnKey],
      maxWidth: columnWidths[columnKey],
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    } : {},
  }), [columnWidths]);

  const ResizeHandle = useCallback(({ columnKey }) => (
    <div
      onMouseDown={(e) => onResizeStart(columnKey, e)}
      onDoubleClick={() => onDoubleClick(columnKey)}
      className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-blue-400 active:bg-blue-500 z-10"
      title="Glisser pour redimensionner, double-clic pour réinitialiser"
    />
  ), [onResizeStart, onDoubleClick]);

  return {
    columnWidths,
    getHeaderProps,
    getCellProps,
    ResizeHandle,
    resetAll,
  };
};
