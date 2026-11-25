import { useId } from 'react'
import { Link } from 'react-router-dom'

/**
 * The Dynamic Delta spiral, hand-authored from the brand mark.
 * Inherits `currentColor`, so it takes the accent of whatever it sits in.
 */
export function DeltaMark({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 300 240" className={className} aria-hidden="true">
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M14 216 C45 205 75 178 99 145 A97 97 0 1 1 232 199 C170 218 85 224 14 216 Z
           M235 118 A52 52 0 1 0 131 118 A52 52 0 1 0 235 118 Z"
      />
    </svg>
  )
}

/** Logo red, exactly as in the source artwork (src/assets/images/logo_svg.svg). */
const LOGO_RED = '#A62B1F'

/* Shapes from src/assets/images/logo_svg.svg (viewBox 0 0 1200 450).
   The ring's hole (centre 226,171, r 69) sits low and slightly left inside
   the outer circle (centre 235,150, r 112) — thick at the top, thin at the
   bottom — matching the brand mark. */
const RING_PATH =
  'M 235,38 A 112,112 0 1,0 235,262 A 112,112 0 1,0 235,38 Z M 226,102 A 69,69 0 1,1 226,240 A 69,69 0 1,1 226,102 Z'
const BAND_PATH =
  'M 55,212 C 145,295 315,295 352,178 C 356,164 358,150 356,134 L 1140,134 L 1140,292 C 820,276 540,326 305,322 C 175,318 98,272 55,212 Z'

/**
 * Brand plaque — the logo artwork drawn inline, so its parts can animate
 * on hover (styles under "logo hover" in index.css):
 *  - the ring spins one full turn (its hole orbits) and settles back with
 *    the hole low inside it, as in the brand mark
 *  - a light streak sweeps along the red band
 *  - the wordmark and "Since 2005" open up their letter-spacing
 *
 * `onDark` makes "Since 2005" white so it stays legible over dark hero
 * imagery; everywhere else it's logo red.
 */
export function Logo({ onDark = false }: { onDark?: boolean }) {
  // Unique ids so two logos on one page never share a clip path/gradient
  const uid = useId().replace(/:/g, '')
  const clipId = `logo-band-${uid}`
  const shineId = `logo-shine-${uid}`

  return (
    <Link to="/" aria-label="Dynamic Delta — home" className="logo group block h-17 md:h-21">
      <svg
        viewBox="0 0 1200 450"
        className="h-full w-auto aspect-[1200/450]"
        role="img"
        aria-label="Dynamic Delta — since 2005"
      >
        <defs>
          <clipPath id={clipId}>
            <path d={BAND_PATH} />
          </clipPath>
          <linearGradient id={shineId} x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor="#fff" stopOpacity="0" />
            <stop offset="0.5" stopColor="#fff" stopOpacity="0.55" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
        </defs>

        <path className="logo-ring" d={RING_PATH} fill={LOGO_RED} fillRule="evenodd" />
        <path d={BAND_PATH} fill={LOGO_RED} />

        {/* Light streak, clipped to the band so it never spills outside it */}
        <g clipPath={`url(#${clipId})`}>
          <rect className="logo-shine" x="-260" y="120" width="220" height="220" fill={`url(#${shineId})`} />
        </g>

        <text
          className="logo-word"
          x="398"
          y="250"
          fill="#FFFFFF"
          style={{ fontFamily: 'Georgia, "Times New Roman", Times, serif', fontSize: 98, fontWeight: 500 }}
        >
          Dynamic Delta
        </text>
        <text
          className="logo-tagline"
          x="892"
          y="346"
          fill={onDark ? '#FFFFFF' : LOGO_RED}
          style={{
            fontFamily: '"Trebuchet MS", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
            fontSize: 36,
            fontWeight: 500,
          }}
        >
          Since 2005
        </text>
      </svg>
    </Link>
  )
}
