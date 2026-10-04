import { mountTransitionLogo, type TransitionLogo } from './logo'
import type { AnimationConfig } from './types'
import { ThemeAnimationType } from './types'
import {
  injectBaseStyles,
  supportsViewTransitions,
  prefersReducedMotion,
  createCircleAnimation,
  createBlurCircleAnimation,
  createSlideAnimation,
  createClipPathAnimation,
  createPolygonGradientAnimation,
  createTriangleAnimation,
  createSvgLogoAnimation,
} from './utils/animations'

interface TransitionRequest {
  transition?: ViewTransition
  animation?: Animation
  logo?: TransitionLogo
  updateDone: Promise<void>
}

// View transitions belong to the document, even when triggers use different hooks.
const requests = new WeakMap<Document, TransitionRequest>()

/** Latest request wins visually; every requested state update still runs once. */
export const runThemeTransition = async (
  update: () => void,
  config: AnimationConfig | null,
): Promise<void> => {
  if (typeof document === 'undefined') {
    update()

    return
  }

  const previous = requests.get(document)
  previous?.transition?.skipTransition()
  previous?.animation?.cancel()
  previous?.logo?.element.remove()
  previous?.logo?.style.remove()

  const request: TransitionRequest = { updateDone: Promise.resolve() }
  requests.set(document, request)

  const cleanup = () => {
    request.animation?.cancel()
    request.logo?.element.remove()
    request.logo?.style.remove()

    if (requests.get(document) === request) {
      requests.delete(document)
      document.documentElement.removeAttribute('data-spaceman-theme-transition')
    }
  }

  request.updateDone = (async () => {
    // A skipped native transition still calls its update callback. Wait for it
    // before capturing another state, including requests made before ready.
    if (previous) await previous.updateDone.catch(() => {})

    if (
      requests.get(document) !== request ||
      !config ||
      !supportsViewTransitions() ||
      prefersReducedMotion() ||
      document.visibilityState === 'hidden'
    ) {
      update()

      return
    }

    injectBaseStyles()
    document.documentElement.setAttribute('data-spaceman-theme-transition', '')

    if (config.animationType === ThemeAnimationType.SVG_LOGO) {
      request.logo = mountTransitionLogo(config)
    }

    let transition: ViewTransition

    try {
      transition = document.startViewTransition(update)
    } catch {
      update()

      return
    }

    request.transition = transition
    // Install rejection handlers immediately; ready may reject when interrupted.
    void transition.ready.catch(() => {})
    void transition.finished.then(cleanup, cleanup)
    await transition.updateCallbackDone
  })()

  try {
    await request.updateDone
    const transition = request.transition

    if (!transition) {
      cleanup()

      return
    }

    try {
      await transition.ready
    } catch {
      cleanup()

      return
    } // Skipped capture; updateCallbackDone already succeeded.

    if (requests.get(document) !== request) {
      transition.skipTransition()

      return
    }

    if (!config) return

    try {
      request.animation =
        config.animationType === ThemeAnimationType.SLIDE
          ? createSlideAnimation(config)
          : config.animationType === ThemeAnimationType.BLUR_CIRCLE
            ? createBlurCircleAnimation(config)
            : config.animationType === ThemeAnimationType.CLIP_PATH
              ? createClipPathAnimation(config)
              : config.animationType === ThemeAnimationType.POLYGON_GRADIENT
                ? createPolygonGradientAnimation(config)
                : config.animationType === ThemeAnimationType.TRIANGLE
                  ? createTriangleAnimation(config)
                  : config.animationType === ThemeAnimationType.SVG_LOGO
                    ? createSvgLogoAnimation(config)
                    : createCircleAnimation(config)
      // A skipped transition cancels its animations; cancellation is expected.
      void request.animation.finished.catch(() => {})

      const effect = request.animation.effect

      if (
        !(request.animation instanceof CSSAnimation) &&
        (!(effect instanceof KeyframeEffect) ||
          effect.pseudoElement !== '::view-transition-new(root)')
      ) {
        transition.skipTransition()
        cleanup()
      }
    } catch {
      // Engines can implement startViewTransition without WAAPI pseudo targeting.
      transition.skipTransition()
      cleanup()
    }
  } catch (error) {
    cleanup()
    throw error
  }
}
