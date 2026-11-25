import { Link, useLocation } from 'react-router-dom'
import logoImage from '../assets/images/logo_svg.svg'
// Same artwork with a white "Since 2005", for the dark heroes on inner pages
import logoImageWhite from '../assets/images/logo_svg_white.svg'

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

/** Brand plaque — the original logo artwork, on a transparent background. */
export function Logo() {
  const { pathname } = useLocation()
  const isHome = pathname === '/'

  return (
    <Link to="/" aria-label="Dynamic Delta — home" className="group block h-17 md:h-21">
      <img
        src={isHome ? logoImage : logoImageWhite}
        alt="Dynamic Delta — since 2005"
        className="h-full w-auto object-contain transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:scale-105"
      />
    </Link>
  )
}
