import { ThemeAnimationType } from '../types';

const isBrowser = typeof window !== 'undefined';

// Inject base CSS for view transitions
export const injectBaseStyles = (): void => {
  if (isBrowser) {
    const styleId = 'spaceman-theme-base-style';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      const isHighResolution = window.innerWidth >= 3000 || window.innerHeight >= 2000;

      style.textContent = `
        ::view-transition-old(root),
        ::view-transition-new(root) {
          animation: none;
          mix-blend-mode: normal;
          ${isHighResolution ? 'transform: translateZ(0);' : ''}
        }
        
        ${
          isHighResolution
            ? `
        ::view-transition-group(root),
        ::view-transition-image-pair(root),
        ::view-transition-old(root),
        ::view-transition-new(root) {
          backface-visibility: hidden;
          perspective: 1000px;
          transform: translate3d(0, 0, 0);
        }
        `
            : ''
        }
      `;
      document.head.appendChild(style);
    }
  }
};

export const createBlurCircleMask = (blur: number): string => {
  const isHighResolution = isBrowser && (window.innerWidth >= 3000 || window.innerHeight >= 2000);

  const blurFilter = `<filter id="blur"><feGaussianBlur stdDeviation="${blur}" /></filter>`;
  const circleRadius = isHighResolution ? 20 : 25;

  return `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="-50 -50 100 100"><defs>${blurFilter}</defs><circle cx="0" cy="0" r="${circleRadius}" fill="white" filter="url(%23blur)"/></svg>')`;
};

export const getSystemTheme = (): 'light' | 'dark' => {
  if (!isBrowser) return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export const resolveTheme = (theme: string): 'light' | 'dark' => {
  if (theme === 'system') {
    return getSystemTheme();
  }
  return theme === 'dark' ? 'dark' : 'light';
};

export const supportsViewTransitions = (): boolean => {
  return isBrowser && 'startViewTransition' in document;
};

export const prefersReducedMotion = (): boolean => {
  return isBrowser && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

export interface AnimationConfig {
  x: number;
  y: number;
  duration: number;
  easing: string;
  animationType: ThemeAnimationType;
  blurAmount: number;
  styleId: string;
}

export const createCircleAnimation = (config: AnimationConfig): void => {
  const { x, y, duration, easing } = config;

  // Calculate the distance to each corner of the viewport
  const topLeft = Math.hypot(x, y);
  const topRight = Math.hypot(window.innerWidth - x, y);
  const bottomLeft = Math.hypot(x, window.innerHeight - y);
  const bottomRight = Math.hypot(window.innerWidth - x, window.innerHeight - y);

  // Find the maximum distance to ensure animation covers the entire viewport
  const maxRadius = Math.max(topLeft, topRight, bottomLeft, bottomRight);

  document.documentElement.animate(
    {
      clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${maxRadius}px at ${x}px ${y}px)`],
    },
    {
      duration,
      easing,
      pseudoElement: '::view-transition-new(root)',
    }
  );
};

export const createBlurCircleAnimation = (config: AnimationConfig): void => {
  const { x, y, duration, easing, blurAmount, styleId } = config;

  // Remove existing style if present
  const existingStyle = document.getElementById(styleId);
  if (existingStyle) {
    existingStyle.remove();
  }

  const viewportSize = Math.max(window.innerWidth, window.innerHeight) + 200;
  const isHighResolution = window.innerWidth >= 3000 || window.innerHeight >= 2000;
  const scaleFactor = isHighResolution ? 2.5 : 4;
  const optimalMaskSize = isHighResolution
    ? Math.min(viewportSize * scaleFactor, 5000)
    : viewportSize * scaleFactor;

  // Calculate maximum radius for corner positions
  const topLeft = Math.hypot(x, y);
  const topRight = Math.hypot(window.innerWidth - x, y);
  const bottomLeft = Math.hypot(x, window.innerHeight - y);
  const bottomRight = Math.hypot(window.innerWidth - x, window.innerHeight - y);
  const maxRadius = Math.max(topLeft, topRight, bottomLeft, bottomRight);

  const styleElement = document.createElement('style');
  styleElement.id = styleId;

  const blurFactor = isHighResolution ? 1.5 : 1.2;
  const finalMaskSize = Math.max(optimalMaskSize, maxRadius * 2.5);

  styleElement.textContent = `
    ::view-transition-group(root) {
      animation-duration: ${duration}ms;
      animation-timing-function: ${
        isHighResolution
          ? 'cubic-bezier(0.2, 0, 0.2, 1)'
          : 'linear(' +
            '0 0%, 0.2342 12.49%, 0.4374 24.99%,' +
            '0.6093 37.49%, 0.6835 43.74%,' +
            '0.7499 49.99%, 0.8086 56.25%,' +
            '0.8593 62.5%, 0.9023 68.75%, 0.9375 75%,' +
            '0.9648 81.25%, 0.9844 87.5%,' +
            '0.9961 93.75%, 1 100%' +
            ')'
      };
      will-change: transform;
    }
    
    ::view-transition-new(root) {
      mask: ${createBlurCircleMask(blurAmount * blurFactor)} 0 0 / 100% 100% no-repeat;
      mask-position: ${x}px ${y}px;
      animation: spaceman-mask-scale ${duration}ms ${easing};
      transform-origin: ${x}px ${y}px;
      will-change: mask-size, mask-position;
    }
    
    ::view-transition-old(root),
    .dark::view-transition-old(root) {
      animation: spaceman-mask-scale ${duration}ms ${easing};
      transform-origin: ${x}px ${y}px;
      z-index: -1;
      will-change: mask-size, mask-position;
    }
    
    @keyframes spaceman-mask-scale {
      0% {
        mask-size: 0px;
        mask-position: ${x}px ${y}px;
      }
      100% {
        mask-size: ${finalMaskSize}px;
        mask-position: ${x - finalMaskSize / 2}px ${y - finalMaskSize / 2}px;
      }
    }
  `;

  document.head.appendChild(styleElement);

  // Clean up after animation
  setTimeout(() => {
    const styleElement = document.getElementById(styleId);
    if (styleElement) {
      styleElement.remove();
    }
  }, duration);
};
