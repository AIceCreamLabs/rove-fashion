import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const ROVE = ['R', 'O', 'V', 'E'];

export default function Preloader({ onDone }: { onDone: () => void }) {
  const wrapRef   = useRef<HTMLDivElement>(null);
  const lineRef   = useRef<HTMLDivElement>(null);
  const subRef    = useRef<HTMLParagraphElement>(null);
  const studioRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!wrapRef.current) return;

    const roveLetters = wrapRef.current.querySelectorAll('.lr');

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.to(wrapRef.current, {
          opacity: 0, duration: 0.55, ease: 'power2.inOut',
          onComplete: onDone,
        });
      },
    });

    // ROVE letters clip in
    tl.fromTo(roveLetters,
      { clipPath: 'inset(0 0 100% 0)', y: 14 },
      { clipPath: 'inset(0 0 0% 0)', y: 0, duration: 0.7, ease: 'expo.out', stagger: 0.08 },
      0
    )
    // "Studio" fades in
    .fromTo(studioRef.current,
      { opacity: 0, y: 6 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'expo.out' },
      0.4
    )
    // Rule draws
    .fromTo(lineRef.current,
      { scaleX: 0 },
      { scaleX: 1, duration: 0.8, ease: 'expo.out', transformOrigin: 'left' },
      0.55
    )
    // Subline appears
    .fromTo(subRef.current,
      { opacity: 0, y: 5 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'expo.out' },
      0.85
    )
    // Hold
    .to({}, { duration: 0.85 })
    // Exit upward
    .to([roveLetters, studioRef.current], {
      clipPath: 'inset(100% 0 0% 0)',
      y: -10,
      duration: 0.45,
      ease: 'power3.in',
      stagger: 0.02,
    })
    .to([lineRef.current, subRef.current], {
      opacity: 0, duration: 0.25,
    }, '<');

    return () => { tl.kill(); };
  }, []);

  return (
    <div
      ref={wrapRef}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
      style={{ background: '#f0e8dc' }}
    >
      {/* ROVE + Studio */}
      <div className="flex items-baseline gap-[0.06em]">
        {ROVE.map((l, i) => (
          <span key={i} style={{ overflow: 'hidden', display: 'inline-block' }}>
            <span
              className="lr block"
              style={{
                fontFamily:    "'DM Serif Display', Georgia, serif",
                fontWeight:    400,
                fontSize:      'clamp(52px, 10vw, 120px)',
                color:         '#1c1410',
                letterSpacing: '-0.02em',
                clipPath:      'inset(0 0 100% 0)',
                lineHeight:    0.92,
              }}
            >
              {l}
            </span>
          </span>
        ))}

        {/* Gap then Studio */}
        <span style={{ width: 'clamp(10px, 1.5vw, 20px)', display: 'inline-block' }} />
        <span
          ref={studioRef}
          style={{
            fontFamily:    "'DM Serif Display', Georgia, serif",
            fontStyle:     'italic',
            fontWeight:    400,
            fontSize:      'clamp(18px, 3vw, 40px)',
            color:         'rgba(28,20,16,0.4)',
            letterSpacing: '0.01em',
            opacity:       0,
            paddingBottom: '0.12em',
          }}
        >
          Studio
        </span>
      </div>

      {/* Thin rule */}
      <div
        ref={lineRef}
        style={{
          marginTop:       'clamp(20px, 2.5vw, 36px)',
          width:           'clamp(100px, 16vw, 200px)',
          height:          '1px',
          background:      'rgba(196, 96, 58, 0.4)',
          transform:       'scaleX(0)',
          transformOrigin: 'left',
        }}
      />

      {/* Sub line */}
      <p
        ref={subRef}
        style={{
          marginTop:     '14px',
          fontFamily:    "'IBM Plex Mono', monospace",
          fontSize:      '8px',
          letterSpacing: '0.28em',
          textTransform: 'uppercase',
          color:         'rgba(28, 20, 16, 0.32)',
          opacity:       0,
        }}
      >
        London — SS25
      </p>
    </div>
  );
}
