"use client";

import Link from "next/link";
import { useId } from "react";

// ── Annotation bubble ─────────────────────────────────────────────────────────

/**
 * Defines a two-segment bent elbow connector from the bubble.
 *
 * attachPoint: CSS value for where path origin (0,0) sits on the bubble.
 *   Use percentage strings ('50%', '100%') or pixel numbers.
 * pivot: [x, y] the elbow/bend point relative to the attachment.
 * dot:   [x, y] the terminal filled circle relative to the attachment.
 */
interface ConnectorConfig {
  attachPoint: { left: string | number; top: string | number };
  pivot: [number, number];
  dot: [number, number];
}

interface AnnotationBubbleProps {
  text: string;
  className?: string;
  connector: ConnectorConfig;
}

/**
 * Renders a glassmorphism card with a bent two-segment SVG connector line
 * and a filled terminal circle.
 *
 * The SVG canvas is computed from the bounding box of the path so it is
 * always exactly large enough, and positioned via calc() so the logical
 * attachment point 0,0 lands on the correct spot of the bubble.
 */
function AnnotationBubble({
  text,
  className = "",
  connector,
}: Readonly<AnnotationBubbleProps>) {
  // useId ensures each bubble instance gets a unique SVG filter ID.
  // Duplicate IDs across multiple SVGs cause all-but-first to lose their filter.
  const uid = useId();
  const filterId = `dotGlow-${uid}`;

  const [px, py] = connector.pivot;
  const [dx, dy] = connector.dot;
  // Extra padding so the outer glow ring (r=16) is never clipped at canvas edge
  const PAD = 24;

  // Bounding box of all three path points (attachment=0,0 / pivot / dot)
  const minX = Math.min(0, px, dx) - PAD;
  const maxX = Math.max(0, px, dx) + PAD;
  const minY = Math.min(0, py, dy) - PAD;
  const maxY = Math.max(0, py, dy) + PAD;

  const svgW = maxX - minX;
  const svgH = maxY - minY;

  // Shift so all coords are non-negative inside the SVG canvas
  const ox = -minX;
  const oy = -minY;

  // CSS position: SVG top-left = attachPoint − (ox, oy)
  const { left: aLeft, top: aTop } = connector.attachPoint;
  const toCss = (val: string | number, offset: number): string =>
    typeof val === "number"
      ? `${val - offset}px`
      : `calc(${val} - ${offset}px)`;

  const cx = ox + dx;
  const cy = oy + dy;

  return (
    <div className={`absolute ${className}`} aria-hidden='true'>
      {/* Glass bubble */}
      <div className='max-w-52.5 rounded-2xl border border-white/20 bg-white/12 px-3.5 py-2.5 text-[11px] leading-snug text-white/90 shadow-lg backdrop-blur-md'>
        {text}
      </div>

      <svg
        width={svgW}
        height={svgH}
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
        className='pointer-events-none absolute'
        style={{ left: toCss(aLeft, ox), top: toCss(aTop, oy) }}
      >
        {/* Unique filter per instance — avoids the duplicate-ID bug */}
        <defs>
          <filter id={filterId} x='-100%' y='-100%' width='300%' height='300%'>
            <feGaussianBlur in='SourceGraphic' stdDeviation='4' result='blur' />
            <feMerge>
              <feMergeNode in='blur' />
              <feMergeNode in='SourceGraphic' />
            </feMerge>
          </filter>
        </defs>

        {/* Bent elbow connector line */}
        <path
          d={`M ${ox} ${oy} L ${ox + px} ${oy + py} L ${cx} ${cy}`}
          stroke='white'
          strokeWidth='1'
          strokeOpacity='0.75'
          strokeLinecap='round'
          strokeLinejoin='round'
        />

        {/*
          Ring / halo terminal marker (three layers):
          1. Outer glow ring   — large, faint, blurred for halo effect
          2. Hard outer ring   — crisp white stroke ring, clearly visible
          3. Center bright dot — solid white, marks the exact annotation point
        */}

        {/* 2. Crisp outer ring */}
        <circle
          cx={cx}
          cy={cy}
          r={14}
          fill='rgba(255,255,255,0.07)'
          stroke='white'
          strokeWidth='1'
          strokeOpacity='0.85'
        />
        {/* 3. Center dot */}
        <circle cx={cx} cy={cy} r={6} fill='white' fillOpacity='0.95' />
      </svg>
    </div>
  );
}

// ── Social icon ───────────────────────────────────────────────────────────────

function SocialCircle({
  href,
  label,
  children,
}: Readonly<{
  href: string;
  label: string;
  children: React.ReactNode;
}>) {
  return (
    <a
      href={href}
      target='_blank'
      rel='noopener noreferrer'
      aria-label={label}
      className='flex h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white/85 backdrop-blur-sm transition-all duration-200 hover:bg-white/25'
    >
      {children}
    </a>
  );
}

// ── Hero component ────────────────────────────────────────────────────────────

export function HousenHero() {
  return (
    <section className='relative h-screen min-h-150 w-full overflow-hidden'>
      {/* ── Background: single image, full bleed ── */}
      <img
        src='/hero-section.jpg'
        alt='Modern Kigali architecture'
        className='absolute inset-0 h-full w-full object-cover object-center'
      />

      {/* ── Subtle darkening gradient so text stays readable ── */}
      <div className='absolute inset-0 bg-linear-to-b from-[#0f2d62]/35 via-[#0f2d62]/10 to-[#0f2d62]/45' />
      <div className='absolute inset-0 bg-linear-to-r from-[#0f2d62]/20 via-transparent to-[#0f2d62]/10' />

      {/* ══════════════════════════════════════════════════════════════════════
          GHOST BRAND TEXT  —  mirrors "HOUSEN" in the reference image.
          Spans the full width, sits behind everything else.
         ══════════════════════════════════════════════════════════════════════ */}
      {/*
        GHOST BRAND TEXT — gradient fade left→right, matching the HOUSEN effect:
        left portion is clearly visible white (~30% opacity), right portion fades
        to near-invisible (~3% opacity), so the image shows through on the right.
        Achieved with background-clip:text + a horizontal gradient mask.
      */}
      <div
        className='pointer-events-none absolute inset-x-0 flex items-start justify-start overflow-hidden'
        style={{ top: "72px" }}
        aria-hidden='true'
      >
        <span
          className='select-none whitespace-nowrap font-serif font-bold uppercase'
          style={{
            fontSize: "clamp(6rem, 20vw, 24rem)",
            lineHeight: 1,
            letterSpacing: "-0.02em",
            paddingLeft: "2vw",
            /* HOUSEN effect: solid white left → fully transparent right */
            background:
              "linear-gradient(to right, rgba(255,255,255,1) 0%, rgba(255,255,255,0.9) 25%, rgba(255,255,255,0.4) 55%, rgba(255,255,255,0.0) 80%)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            WebkitTextFillColor: "transparent",
            color: "transparent",
          }}
        >
          KIGALI HOME
        </span>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          EXPLORE PROPERTIES link  —  mid-left, same position as reference
         ══════════════════════════════════════════════════════════════════════ */}
      <Link
        href='/listings'
        className='group absolute left-10 flex items-center gap-2 text-white transition-opacity hover:opacity-75 md:left-14'
        style={{ top: "52%" }}
      >
        <span className='border-b border-white/60 pb-0.5 text-base font-medium tracking-wide'>
          Explore Properties
        </span>
        <span className='text-lg'>↗</span>
      </Link>

      {/* ══════════════════════════════════════════════════════════════════════
          ANNOTATION BUBBLES  —  3 bubbles like the reference image
         ══════════════════════════════════════════════════════════════════════ */}

      {/*
        LEFT BUBBLE — attach line at right-side, middle of bubble.
        Segment 1: goes right ~45px (horizontal).
        Segment 2: bends down-right ~75px more + 70px down → visible elbow.
      */}
      <AnnotationBubble
        text="Built with steel-framed glass walls and natural wood accents, the design blends into Kigali's lush hillside landscape."
        className='left-[5%] top-[57%]'
        connector={{
          attachPoint: { left: "100%", top: "50%" },
          pivot: [45, 0],
          dot: [120, 70],
        }}
      />

      {/*
        CENTRE-BOTTOM BUBBLE — attach line at bottom-right of bubble.
        Segment 1: goes right ~30px + down 15px (diagonal).
        Segment 2: continues to dot further right-down → clear bend.
      */}
      <AnnotationBubble
        text="Using locally sourced materials and green-building standards, the design echoes Rwanda's commitment to sustainability."
        className='left-[33%] bottom-[14%]'
        connector={{
          attachPoint: { left: "85%", top: "100%" },
          pivot: [30, 60],
          dot: [150, 60],
        }}
      />

      {/*
        RIGHT BUBBLE — attach line at left-side, lower area of bubble.
        Segment 1: goes left ~45px (horizontal, negative direction).
        Segment 2: bends down-left ~50px more + 60px down → visible elbow.
      */}
      <AnnotationBubble
        text='Open-plan layouts with panoramic views make every room feel connected to the city beyond.'
        className='right-[6%] top-[37%]'
        connector={{
          attachPoint: { left: "0%", top: "60%" },
          pivot: [-45, 0],
          dot: [-100, 65],
        }}
      />

      {/* ══════════════════════════════════════════════════════════════════════
          BOTTOM-LEFT TAGLINE  —  "WE BUILD MODERN HOUSES IN USA" → adapted
         ══════════════════════════════════════════════════════════════════════ */}
      <p
        className='pointer-events-none absolute left-10 bottom-10 font-sans text-xs font-semibold uppercase leading-relaxed tracking-[0.2em] text-white/70 md:left-14'
        aria-hidden='true'
      >
        WE CONNECT
        <br />
        BUYERS &amp; RENTERS
        <br />
        IN KIGALI
      </p>

      {/* ══════════════════════════════════════════════════════════════════════
          BOTTOM-RIGHT SOCIAL ICONS  —  Facebook · Instagram · X · LinkedIn
         ══════════════════════════════════════════════════════════════════════ */}
      <div className='absolute right-6 bottom-8 flex items-center gap-2.5 md:right-10'>
        <SocialCircle href='https://facebook.com' label='Facebook'>
          <svg
            width='15'
            height='15'
            viewBox='0 0 24 24'
            fill='currentColor'
            aria-hidden='true'
          >
            <path d='M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z' />
          </svg>
        </SocialCircle>

        <SocialCircle href='https://instagram.com' label='Instagram'>
          <svg
            width='15'
            height='15'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
            aria-hidden='true'
          >
            <rect x='2' y='2' width='20' height='20' rx='5' ry='5' />
            <path d='M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z' />
            <line x1='17.5' y1='6.5' x2='17.51' y2='6.5' />
          </svg>
        </SocialCircle>

        <SocialCircle href='https://x.com' label='X (Twitter)'>
          <svg
            width='15'
            height='15'
            viewBox='0 0 24 24'
            fill='currentColor'
            aria-hidden='true'
          >
            <path d='M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' />
          </svg>
        </SocialCircle>

        <SocialCircle href='https://linkedin.com' label='LinkedIn'>
          <svg
            width='15'
            height='15'
            viewBox='0 0 24 24'
            fill='currentColor'
            aria-hidden='true'
          >
            <path d='M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z' />
            <rect x='2' y='9' width='4' height='12' />
            <circle cx='4' cy='4' r='2' />
          </svg>
        </SocialCircle>
      </div>
    </section>
  );
}
