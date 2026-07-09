import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface ScrollAnimOptions {
  y?: number;
  x?: number;
  opacity?: number;
  duration?: number;
  delay?: number;
  stagger?: number;
  ease?: string;
  start?: string;
  childSelector?: string;
}

export function useScrollAnimation<T extends HTMLElement>(
  options: ScrollAnimOptions = {},
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const {
      y = 30,
      x = 0,
      opacity = 0,
      duration = 0.5,
      delay = 0,
      stagger = 0,
      ease = "power2.out",
      start = "top 90%",
      childSelector,
    } = options;

    const animationProps: gsap.TweenVars = {
      scrollTrigger: {
        trigger: el,
        start,
        once: true, // KUNCI UTAMA: Animasi jalan 1x dan tidak me-reset elemen
        invalidateOnRefresh: false,
      },
      duration,
      delay,
      ease,
      y: 0,
      x: 0,
      opacity: 1,
      stagger,
    };

    const ctx = gsap.context(() => {
      if (childSelector) {
        gsap.fromTo(
          gsap.utils.toArray(childSelector, el),
          { y, x, opacity },
          animationProps,
        );
      } else {
        gsap.fromTo(el, { y, x, opacity }, animationProps);
      }
    }, el);

    return () => {
      ctx.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return ref;
}
