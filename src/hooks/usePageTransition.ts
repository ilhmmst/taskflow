import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';

/**
 * usePageTransition
 *
 * Provides a `pageRef` to attach to the page root element and a `navigateTo`
 * helper that plays a fade-out animation before navigating to the target path.
 */
export const usePageTransition = () => {
  const pageRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const navigateTo = (path: string) => {
    try {
      gsap.to(pageRef.current, {
        opacity: 0,
        y: -15,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => navigate(path),
      });
    } catch {
      // GSAP unavailable or ref not attached — navigate immediately
      navigate(path);
    }
  };

  return { pageRef, navigateTo };
};
