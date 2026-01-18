import { useEffect } from 'react';

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'area[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])'
].join(',');

const getFocusableElements = (container) => (
  Array.from(container.querySelectorAll(FOCUSABLE_SELECTOR))
);

export const useModalFocus = ({ containerRef, initialFocusRef, onClose }) => {
  useEffect(() => {
    const container = containerRef?.current;
    if (!container) {
      return undefined;
    }

    const previouslyFocused = document.activeElement;
    const focusableElements = getFocusableElements(container);
    const initialFocus = initialFocusRef?.current || focusableElements[0] || container;

    if (initialFocus && typeof initialFocus.focus === 'function') {
      initialFocus.focus();
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        if (typeof onClose === 'function') {
          onClose();
        }
        return;
      }

      if (event.key !== 'Tab') {
        return;
      }

      const focusable = getFocusableElements(container);
      if (focusable.length === 0) {
        event.preventDefault();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    container.addEventListener('keydown', handleKeyDown);

    return () => {
      container.removeEventListener('keydown', handleKeyDown);
      if (previouslyFocused && typeof previouslyFocused.focus === 'function') {
        previouslyFocused.focus();
      }
    };
  }, [containerRef, initialFocusRef, onClose]);
};
