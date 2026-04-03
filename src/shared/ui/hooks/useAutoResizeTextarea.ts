import { useRef, useEffect } from 'react';

export const useAutoResizeTextarea = (value: any, minHeight: number, maxHeight: number) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = `${minHeight}px`;
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, maxHeight)}px`;
    }
  }, [value, minHeight, maxHeight]);

  return { textareaRef };
};
