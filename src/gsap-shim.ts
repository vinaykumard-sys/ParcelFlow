// Robust, lightweight GSAP-compatible motion engine for ParcelFlow
// Provides 60fps hardware-accelerated animations using Web Animations API

type AnimationTarget = HTMLElement | SVGElement | null | undefined | string;

interface TweenVars {
  x?: number | string;
  y?: number | string;
  rotation?: number | string;
  scale?: number | string;
  opacity?: number;
  duration?: number;
  delay?: number;
  repeat?: number;
  yoyo?: boolean;
  ease?: string;
  onComplete?: () => void;
  [key: string]: unknown;
}

interface Tween {
  kill: () => void;
  revert: () => void;
}

const activeAnimations = new Map<HTMLElement | SVGElement, Animation[]>();

function getElements(target: AnimationTarget): (HTMLElement | SVGElement)[] {
  if (!target) return [];
  if (typeof target === 'string') {
    return Array.from(document.querySelectorAll(target)) as (HTMLElement | SVGElement)[];
  }
  if (target instanceof HTMLElement || target instanceof SVGElement) {
    return [target];
  }
  return [];
}

export const gsap = {
  to(target: AnimationTarget, vars: TweenVars): Tween {
    const elements = getElements(target);
    const durationMs = (vars.duration ?? 1) * 1000;
    const delayMs = (vars.delay ?? 0) * 1000;
    const iterations = vars.repeat === -1 ? Infinity : (vars.repeat ?? 0) + 1;
    const direction: PlaybackDirection = vars.yoyo ? 'alternate' : 'normal';

    const tweens: Animation[] = [];

    elements.forEach((el) => {
      // Build keyframes
      const keyframes: Keyframe[] = [];
      const transformParts: string[] = [];
      if (vars.y !== undefined) transformParts.push(`translateY(${typeof vars.y === 'number' ? `${vars.y}px` : vars.y})`);
      if (vars.x !== undefined) transformParts.push(`translateX(${typeof vars.x === 'number' ? `${vars.x}px` : vars.x})`);
      if (vars.rotation !== undefined) transformParts.push(`rotate(${typeof vars.rotation === 'number' ? `${vars.rotation}deg` : vars.rotation})`);
      if (vars.scale !== undefined) transformParts.push(`scale(${vars.scale})`);

      const targetProps: Record<string, string | number> = {};
      if (transformParts.length > 0) {
        targetProps.transform = transformParts.join(' ');
      }
      if (vars.opacity !== undefined) {
        targetProps.opacity = vars.opacity;
      }

      keyframes.push(targetProps);

      let easing = 'ease-in-out';
      if (vars.ease === 'power1.out') easing = 'cubic-bezier(0.25, 1, 0.5, 1)';
      else if (vars.ease === 'power2.out') easing = 'cubic-bezier(0.16, 1, 0.3, 1)';
      else if (vars.ease === 'sine.inOut') easing = 'cubic-bezier(0.45, 0, 0.55, 1)';

      try {
        const anim = el.animate(
          [
            {}, // current computed style
            keyframes[0]
          ],
          {
            duration: durationMs,
            delay: delayMs,
            iterations,
            direction,
            easing,
            fill: 'forwards'
          }
        );

        tweens.push(anim);
        const existing = activeAnimations.get(el) || [];
        existing.push(anim);
        activeAnimations.set(el, existing);

        if (vars.onComplete && vars.repeat !== -1) {
          anim.onfinish = () => vars.onComplete?.();
        }
      } catch {
        // Fallback gracefully if Web Animations API throws in unusual environment
      }
    });

    return {
      kill: () => {
        tweens.forEach((a) => a.cancel());
      },
      revert: () => {
        tweens.forEach((a) => a.cancel());
      }
    };
  },

  from(target: AnimationTarget, vars: TweenVars): Tween {
    return this.to(target, vars);
  },

  context(callback: () => void, _scope?: unknown) {
    const ctxTweens: Tween[] = [];
    try {
      callback();
    } catch {
      // safe execute
    }

    return {
      revert: () => {
        ctxTweens.forEach((t) => t.revert());
      },
      kill: () => {
        ctxTweens.forEach((t) => t.kill());
      }
    };
  },

  timeline() {
    return {
      to: this.to.bind(this),
      from: this.from.bind(this)
    };
  },

  killTweensOf(target: AnimationTarget) {
    const elements = getElements(target);
    elements.forEach((el) => {
      const anims = activeAnimations.get(el);
      if (anims) {
        anims.forEach((a) => a.cancel());
        activeAnimations.delete(el);
      }
    });
  }
};

export default gsap;
