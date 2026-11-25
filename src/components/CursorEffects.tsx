import { useEffect, useRef } from 'react'

/** Anything the viewfinder should lock on to. */
const INTERACTIVE = 'a, button, [role="button"], input, select, textarea, label, summary'

/** Size of the resting viewfinder around the pointer, in px. */
const REST_SIZE = 26
/** Breathing room between a locked element and the brackets, in px. */
const LOCK_PAD = 8
/** Elements bigger than this (e.g. whole-card links) aren't framed — too large to read as a target. */
const MAX_LOCK_W = 420
const MAX_LOCK_H = 160

/**
 * Follow speed: the fraction of the remaining distance covered each frame.
 * Lower = the brackets lag further behind the mouse.
 */
const FOLLOW_ROAM = 0.09
const FOLLOW_LOCK = 0.16
/** Tilt (deg) per px of lag while roaming, and its cap — the "dragged along" lean. */
const TILT_PER_PX = 0.35
const MAX_TILT = 28

/** How far a [data-magnetic] element leans toward the cursor (fraction of offset). */
const MAGNET_PULL = 0.3

/**
 * Site-wide mouse-hover effects, driven by a single pointer listener:
 *  - a "viewfinder" of four corner brackets trails the cursor; over a button
 *    or link it snaps out to frame that element, like a camera locking focus
 *  - `[data-magnetic]` elements lean toward the cursor while hovered
 *  - `.card` elements get `--mx`/`--my` so their CSS spotlight tracks the cursor
 *
 * Only runs on devices with a precise hovering pointer (not touch), and not
 * at all when the visitor prefers reduced motion. The native cursor stays.
 */
function CursorEffects() {
  const finderRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const finder = finderRef.current
    const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!finder || !canHover || reduced) return

    let pointerX = -100
    let pointerY = -100
    let x = pointerX
    let y = pointerY
    let w = REST_SIZE
    let h = REST_SIZE
    let tilt = 0
    let frame = 0
    let locked: HTMLElement | null = null
    let magnet: HTMLElement | null = null

    const releaseMagnet = () => {
      if (!magnet) return
      magnet.style.transform = ''
      magnet = null
    }

    // Each frame, ease toward either the pointer or the locked element's box.
    // Re-reading the box every frame keeps the frame glued on while scrolling.
    const tick = () => {
      let tx = pointerX
      let ty = pointerY
      let tw = REST_SIZE
      let th = REST_SIZE
      if (locked) {
        const r = locked.getBoundingClientRect()
        tx = r.left + r.width / 2
        ty = r.top + r.height / 2
        tw = r.width + LOCK_PAD * 2
        th = r.height + LOCK_PAD * 2
      }
      const ease = locked ? FOLLOW_LOCK : FOLLOW_ROAM
      const lagX = tx - x
      x += lagX * ease
      y += (ty - y) * ease
      w += (tw - w) * ease
      h += (th - h) * ease

      // Lean into horizontal movement while roaming; straighten up when locked or at rest
      const targetTilt = locked ? 0 : Math.max(-MAX_TILT, Math.min(MAX_TILT, lagX * TILT_PER_PX))
      tilt += (targetTilt - tilt) * 0.15

      finder.style.transform = `translate3d(${x - w / 2}px, ${y - h / 2}px, 0) rotate(${tilt}deg)`
      finder.style.width = `${w}px`
      finder.style.height = `${h}px`
      frame = requestAnimationFrame(tick)
    }

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      pointerX = e.clientX
      pointerY = e.clientY
      finder.classList.add('is-visible')

      const el = e.target instanceof Element ? e.target : null

      // Lock on to small interactive targets; big ones just tint the brackets
      const hit = el?.closest<HTMLElement>(INTERACTIVE) ?? null
      const r = hit?.getBoundingClientRect()
      locked = hit && r && r.width <= MAX_LOCK_W && r.height <= MAX_LOCK_H ? hit : null
      finder.classList.toggle('is-locked', !!locked)
      finder.classList.toggle('is-hovering', !!hit && !locked)

      // Card spotlight: position is relative to the card's own box
      const card = el?.closest<HTMLElement>('.card')
      if (card) {
        const cr = card.getBoundingClientRect()
        card.style.setProperty('--mx', `${e.clientX - cr.left}px`)
        card.style.setProperty('--my', `${e.clientY - cr.top}px`)
      }

      // Magnetic pull toward the cursor, measured from the element's centre
      const next = el?.closest<HTMLElement>('[data-magnetic]') ?? null
      if (next !== magnet) releaseMagnet()
      if (next) {
        magnet = next
        const mr = next.getBoundingClientRect()
        const dx = (e.clientX - (mr.left + mr.width / 2)) * MAGNET_PULL
        const dy = (e.clientY - (mr.top + mr.height / 2)) * MAGNET_PULL
        next.style.transform = `translate(${dx}px, ${dy}px)`
      }
    }

    const onLeaveWindow = () => {
      finder.classList.remove('is-visible', 'is-locked', 'is-hovering')
      locked = null
      releaseMagnet()
    }
    const onDown = () => finder.classList.add('is-pressed')
    const onUp = () => finder.classList.remove('is-pressed')

    frame = requestAnimationFrame(tick)
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerdown', onDown)
    window.addEventListener('pointerup', onUp)
    document.documentElement.addEventListener('mouseleave', onLeaveWindow)

    return () => {
      cancelAnimationFrame(frame)
      releaseMagnet()
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
      document.documentElement.removeEventListener('mouseleave', onLeaveWindow)
    }
  }, [])

  return (
    <div ref={finderRef} className="cursor-finder" aria-hidden="true">
      <span className="cursor-finder-corner" />
      <span className="cursor-finder-corner" />
      <span className="cursor-finder-corner" />
      <span className="cursor-finder-corner" />
      <span className="cursor-finder-dot" />
    </div>
  )
}

export default CursorEffects
