import React, { useState, useEffect } from 'react';
import { useReducedMotion } from '../lib/hooks/useReducedMotion';

interface TypewriterTextProps {
  text: string;
  speed?: number; // ms per character
  delay?: number; // ms delay before starting
  onComplete?: () => void;
  className?: string;
  cursorClassName?: string;
}

export const TypewriterText: React.FC<TypewriterTextProps> = ({
  text,
  speed = 28,
  delay = 300,
  onComplete,
  className = '',
  cursorClassName = 'text-rose-400',
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isDone, setIsDone] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    // If reduced motion is requested, render full text immediately
    if (prefersReducedMotion) {
      setDisplayedText(text);
      setIsDone(true);
      onComplete?.();
      return;
    }

    setDisplayedText('');
    setIsDone(false);

    let currentIndex = 0;
    let timer: ReturnType<typeof setInterval>;

    const timeout = setTimeout(() => {
      timer = setInterval(() => {
        if (currentIndex < text.length) {
          setDisplayedText(text.slice(0, currentIndex + 1));
          currentIndex++;
        } else {
          clearInterval(timer);
          setIsDone(true);
          onComplete?.();
        }
      }, speed);
    }, delay);

    return () => {
      clearTimeout(timeout);
      clearInterval(timer);
    };
  }, [text, speed, delay, prefersReducedMotion, onComplete]);

  return (
    <div className={`relative whitespace-pre-line leading-relaxed ${className}`}>
      {displayedText}
      {!isDone && (
        <span
          className={`inline-block ml-0.5 font-bold animate-pulse ${cursorClassName}`}
          aria-hidden="true"
        >
          |
        </span>
      )}
    </div>
  );
};
