"use client";

import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { motion } from "motion/react";
import type { HTMLMotionProps } from "motion/react";

interface DecryptedTextProps extends HTMLMotionProps<'span'> {
  text: string;
  hoverText?: string;
  speed?: number;
  maxIterations?: number;
  sequential?: boolean;
  revealDirection?: 'start' | 'end' | 'center';
  useOriginalCharsOnly?: boolean;
  characters?: string;
  className?: string;
  encryptedClassName?: string;
  parentClassName?: string;
  animateOn?: 'view' | 'hover' | 'inViewHover' | 'click';
  clickMode?: 'once' | 'toggle';
}

type Direction = 'forward' | 'reverse';

export default function DecryptedText({
  text,
  hoverText,
  speed = 50,
  maxIterations = 10,
  sequential = false,
  revealDirection = 'start',
  useOriginalCharsOnly = false,
  characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+',
  className = '',
  parentClassName = '',
  encryptedClassName = '',
  animateOn = 'hover',
  clickMode = 'once',
  ...props
}: DecryptedTextProps) {
  // Compute active base text context depending on state directions
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [direction, setDirection] = useState<Direction>('forward');
  const [isDecrypted, setIsDecrypted] = useState<boolean>(animateOn !== 'click');

  const activeTargetText = useMemo(() => {
    if (animateOn === 'hover' && hoverText) {
      return isAnimating || !isDecrypted ? hoverText : text;
    }
    return text;
  }, [animateOn, hoverText, isAnimating, isDecrypted, text]);

  const [displayText, setDisplayText] = useState<string>(activeTargetText);
  const [revealedIndices, setRevealedIndices] = useState<Set<number>>(new Set());
  const [hasAnimated, setHasAnimated] = useState<boolean>(false);

  const containerRef = useRef<HTMLSpanElement>(null);
  const orderRef = useRef<number[]>([]);
  const pointerRef = useRef<number>(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Tracks prop changes dynamically across renders to avoid cascading layout effects
  const [prevText, setPrevText] = useState(text);
  const [prevAnimateOn, setPrevAnimateOn] = useState(animateOn);

  const availableChars = useMemo<string[]>(() => {
    return useOriginalCharsOnly
      ? Array.from(new Set(activeTargetText.split(''))).filter((char) => char !== ' ')
      : characters.split('');
  }, [useOriginalCharsOnly, activeTargetText, characters]);

  const shuffleText = useCallback(
    (originalText: string, currentRevealed: Set<number>) => {
      return originalText
        .split('')
        .map((char, i) => {
          if (char === ' ') return ' ';
          if (currentRevealed.has(i)) return originalText[i];
          return availableChars[Math.floor(Math.random() * availableChars.length)];
        })
        .join('');
    },
    [availableChars]
  );

  // Render interception: Handles dynamic prop adjustments instantly during calculations
  if (text !== prevText || animateOn !== prevAnimateOn) {
    setPrevText(text);
    setPrevAnimateOn(animateOn);
    setRevealedIndices(new Set());
    setDirection('forward');

    if (animateOn === 'click') {
      setIsDecrypted(false);
      const emptySet = new Set<number>();
      setDisplayText(shuffleText(text, emptySet));
    } else {
      setDisplayText(text);
      setIsDecrypted(true);
    }
  }

  const computeOrder = useCallback(
    (len: number): number[] => {
      const order: number[] = [];
      if (len <= 0) return order;
      if (revealDirection === 'start') {
        for (let i = 0; i < len; i++) order.push(i);
        return order;
      }
      if (revealDirection === 'end') {
        for (let i = len - 1; i >= 0; i--) order.push(i);
        return order;
      }

      const middle = Math.floor(len / 2);
      let offset = 0;
      while (order.length < len) {
        if (offset % 2 === 0) {
          const idx = middle + offset / 2;
          if (idx >= 0 && idx < len) order.push(idx);
        } else {
          const idx = middle - Math.ceil(offset / 2);
          if (idx >= 0 && idx < len) order.push(idx);
        }
        offset++;
      }
      return order.slice(0, len);
    },
    [revealDirection]
  );

  const fillAllIndices = useCallback((): Set<number> => {
    const s = new Set<number>();
    for (let i = 0; i < activeTargetText.length; i++) s.add(i);
    return s;
  }, [activeTargetText]);

  const removeRandomIndices = useCallback((set: Set<number>, count: number): Set<number> => {
    const arr = Array.from(set);
    for (let i = 0; i < count && arr.length > 0; i++) {
      const idx = Math.floor(Math.random() * arr.length);
      arr.splice(idx, 1);
    }
    return new Set(arr);
  }, []);

  const triggerDecrypt = useCallback(() => {
    const targetStr = animateOn === 'hover' && hoverText ? hoverText : text;
    if (sequential) {
      orderRef.current = computeOrder(targetStr.length);
      pointerRef.current = 0;
    }
    setRevealedIndices(new Set());
    setDirection('forward');
    setIsAnimating(true);
  }, [sequential, computeOrder, animateOn, hoverText, text]);

  const triggerReverse = useCallback(() => {
    const allIndices = fillAllIndices();
    if (sequential) {
      orderRef.current = computeOrder(activeTargetText.length).slice().reverse();
      pointerRef.current = 0;
    }
    setRevealedIndices(allIndices);
    setDisplayText(shuffleText(activeTargetText, allIndices));
    setDirection('reverse');
    setIsAnimating(true);
  }, [sequential, computeOrder, fillAllIndices, shuffleText, activeTargetText]);

  useEffect(() => {
    if (!isAnimating) return;

    let currentIteration = 0;

    const getNextIndex = (revealedSet: Set<number>): number => {
      const textLength = activeTargetText.length;
      switch (revealDirection) {
        case 'start':
          return revealedSet.size;
        case 'end':
          return textLength - 1 - revealedSet.size;
        case 'center': {
          const middle = Math.floor(textLength / 2);
          const offset = Math.floor(revealedSet.size / 2);
          const nextIndex = revealedSet.size % 2 === 0 ? middle + offset : middle - offset - 1;

          if (nextIndex >= 0 && nextIndex < textLength && !revealedSet.has(nextIndex)) {
            return nextIndex;
          }
          for (let i = 0; i < textLength; i++) {
            if (!revealedSet.has(i)) return i;
          }
          return 0;
        }
        default:
          return revealedSet.size;
      }
    };

    intervalRef.current = setInterval(() => {
      setRevealedIndices((prevRevealed) => {
        if (sequential) {
          if (direction === 'forward') {
            if (prevRevealed.size < activeTargetText.length) {
              const nextIndex = getNextIndex(prevRevealed);
              const newRevealed = new Set(prevRevealed);
              newRevealed.add(nextIndex);
              setDisplayText(shuffleText(activeTargetText, newRevealed));
              return newRevealed;
            } else {
              clearInterval(intervalRef.current ?? undefined);
              setIsAnimating(false);
              setIsDecrypted(true);
              return prevRevealed;
            }
          }

          if (direction === 'reverse') {
            if (pointerRef.current < orderRef.current.length) {
              const idxToRemove = orderRef.current[pointerRef.current++];
              const newRevealed = new Set(prevRevealed);
              newRevealed.delete(idxToRemove);
              setDisplayText(shuffleText(activeTargetText, newRevealed));
              if (newRevealed.size === 0) {
                clearInterval(intervalRef.current ?? undefined);
                setIsAnimating(false);
                setIsDecrypted(false);
              }
              return newRevealed;
            }
            clearInterval(intervalRef.current ?? undefined);
            setIsAnimating(false);
            setIsDecrypted(false);
            return prevRevealed;
          }
        } else {
          if (direction === 'forward') {
            setDisplayText(shuffleText(activeTargetText, prevRevealed));
            currentIteration++;
            if (currentIteration >= maxIterations) {
              clearInterval(intervalRef.current ?? undefined);
              setIsAnimating(false);
              setDisplayText(activeTargetText);
              setIsDecrypted(true);
            }
            return prevRevealed;
          }

          if (direction === 'reverse') {
            let currentSet = prevRevealed;
            if (currentSet.size === 0) {
              currentSet = fillAllIndices();
            }
            const removeCount = Math.max(1, Math.ceil(activeTargetText.length / Math.max(1, maxIterations)));
            const nextSet = removeRandomIndices(currentSet, removeCount);
            setDisplayText(shuffleText(activeTargetText, nextSet));
            currentIteration++;
            if (nextSet.size === 0 || currentIteration >= maxIterations) {
              clearInterval(intervalRef.current ?? undefined);
              setIsAnimating(false);
              setIsDecrypted(false);
              setDisplayText(shuffleText(activeTargetText, new Set()));
              return new Set();
            }
            return nextSet;
          }
        }
        return prevRevealed;
      });
    }, speed);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [
    isAnimating,
    activeTargetText,
    speed,
    maxIterations,
    sequential,
    revealDirection,
    shuffleText,
    direction,
    fillAllIndices,
    removeRandomIndices,
  ]);

  const handleClick = useCallback(() => {
    if (animateOn !== 'click') return;

    if (clickMode === 'once') {
      if (isDecrypted) return;
      triggerDecrypt();
    }

    if (clickMode === 'toggle') {
      if (isDecrypted) {
        triggerReverse();
      } else {
        triggerDecrypt();
      }
    }
  }, [animateOn, clickMode, isDecrypted, triggerDecrypt, triggerReverse]);

  const triggerHoverDecrypt = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setRevealedIndices(new Set());
    setIsDecrypted(false);
    const targetStr = hoverText ? hoverText : text;
    setDisplayText(shuffleText(targetStr, new Set()));
    setDirection('forward');
    setIsAnimating(true);
  }, [hoverText, text, shuffleText]);

  const resetToPlainText = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsAnimating(false);
    setRevealedIndices(new Set());
    setDisplayText(text);
    setIsDecrypted(true);
    setDirection('forward');
  }, [text]);

  useEffect(() => {
    if (animateOn !== 'view' && animateOn !== 'inViewHover') return;

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !hasAnimated) {
          triggerDecrypt();
          setHasAnimated(true);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, { threshold: 0.1 });
    const currentRef = containerRef.current;
    if (currentRef) observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [animateOn, hasAnimated, triggerDecrypt]);

  const animateProps = useMemo(() => {
    if (animateOn === 'hover' || animateOn === 'inViewHover') {
      return {
        onMouseEnter: triggerHoverDecrypt,
        onMouseLeave: resetToPlainText,
      };
    }
    if (animateOn === 'click') {
      return {
        onClick: handleClick,
      };
    }
    return {};
  }, [animateOn, triggerHoverDecrypt, resetToPlainText, handleClick]);

  const renderTokens = useMemo(() => {
    const isFullyClear = !isAnimating && isDecrypted;
    
    if (isFullyClear && !className && !encryptedClassName) {
      return activeTargetText;
    }

    return activeTargetText.split("").map((char, index) => {
      const isRevealed = revealedIndices.has(index) || isFullyClear;
      return (
        <span key={index} className={isRevealed ? className : encryptedClassName}>
          {displayText[index] ?? char}
        </span>
      );
    });
  }, [activeTargetText, displayText, isAnimating, isDecrypted, revealedIndices, className, encryptedClassName]);

  return (
    <motion.span
      ref={containerRef}
      className={`inline-block whitespace-pre-wrap ${parentClassName}`}
      {...animateProps}
      {...props}
    >
      <span className="sr-only">{isDecrypted ? activeTargetText : text}</span>
      <span aria-hidden="true">{renderTokens}</span>
    </motion.span>
  );
}