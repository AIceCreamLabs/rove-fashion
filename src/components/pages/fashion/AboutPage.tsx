import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const bg   = '#f0e8dc';
const ink  = '#1c1410';
const mute = 'rgba(28,20,16,0.42)';
const rule = 'rgba(28,20,16,0.08)';

const PILLARS = [
  { n: '01', t: 'Earth', b: 'Every cloth begins as a field. Linen from Belgium, wool from Yorkshire, cotton from Peru. We choose what we can trace — from the soil to the seam.' },
  { n: '02', t: 'Hand', b: 'A pattern cutter\'s hand is the first tool. Before the machine, before the factory — there is someone in a room with fabric and scissors, making a decision.' },
  { n: '03', t: 'Time', b: 'A coat should age better than its wearer. We design for the decade, not the season. Good clothes remember where they have been.' },
  { n: '04', t: 'Less', b: 'We make what we cannot find elsewhere. Then we remove everything that is not necessary. The finished piece is ninety percent editing.' },
];

export default function AboutPage() {
  const navigate   = useNavigate();
  const heroRef    = useRef<HTMLDivElement>(null);
  const pillarRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (heroRef.current) {
      gsap.fromTo(heroRef.current.querySelectorAll('.h'),
        { clipPath: 'inset(0 0 100% 0)', y: 20 },
        { clipPath: 'inset(0 0 0% 0)', y: 0, stagger: 0.1, duration: 1.0, ease: 'expo.out', delay: 0.1 }
      );
    }
    pillarRefs.current.forEach((el, i) => {
      if (!el) return;
      ScrollTrigger.create({
        trigger: el, start: 'top 85%',
        onEnter: () => gsap.fromTo(el,
          { opacity: 0, y: 32 },
          { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', delay: i * 0.08 }
        ),
      });
    });
    return () => ScrollTrigger.getAll().forEach(t => t.kill());
  }, []);

  return (
    <div className="min-h-screen" style={{ background: bg, color: ink }}>

      <button
        onClick={() => navigate('/')}
        className="fixed top-6 left-8 z-50 font-mono text-[9px] tracking-[0.28em] uppercase transition-colors duration-200"
        style={{ color: mute }}
        onMouseEnter={e => (e.currentTarget.style.color = ink)}
        onMouseLeave={e => (e.currentTarget.style.color = mute)}
      >
        ← Home
      </button>

      {/* ── Hero split ── */}
      <div ref={heroRef} className="grid grid-cols-1 md:grid-cols-2 min-h-screen">
        <div className="flex flex-col justify-end px-8 md:px-16 pt-32 pb-16 border-b md:border-b-0 md:border-r" style={{ borderColor: rule }}>
          <p className="h font-mono text-[8px] tracking-[0.3em] uppercase mb-6" style={{ color: mute, clipPath: 'inset(0 0 100% 0)' }}>
            Est. 2019 — London
          </p>
          <h1
            className="h font-black leading-[0.9] tracking-[-0.02em] mb-8"
            style={{ fontSize: 'clamp(44px, 7vw, 100px)', clipPath: 'inset(0 0 100% 0)' }}
          >
            Clothing<br />built for<br />the long run.
          </h1>
          <p
            className="h leading-relaxed max-w-sm"
            style={{ fontSize: 'clamp(17px, 1.4vw, 19px)', color: mute, clipPath: 'inset(0 0 100% 0)' }}
          >
            Rove was founded on a single premise: that good cloth outlasts every trend. We make menswear and womenswear for people who buy slowly and wear for years.
          </p>
        </div>
        <div className="hidden md:block overflow-hidden" style={{ background: '#e8dcd0' }}>
          <img
            src="./img/img5.webp"
            alt=""
            className="w-full h-full object-cover scale-[1.02]"
            style={{ filter: 'saturate(0.85) brightness(1.04)' }}
          />
        </div>
      </div>

      {/* ── Manifesto ── */}
      <div className="px-8 md:px-16 py-24" style={{ borderTop: `1px solid ${rule}` }}>
        <p className="font-mono text-[8px] tracking-[0.3em] uppercase mb-16" style={{ color: mute }}>How we work</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-16">
          {PILLARS.map((p, i) => (
            <div key={p.n} ref={el => { pillarRefs.current[i] = el; }} className="opacity-0">
              <p className="font-mono text-[7px] tracking-[0.24em] uppercase mb-5" style={{ color: 'rgba(28,20,16,0.25)' }}>{p.n}</p>
              <h3 className="font-black tracking-[-0.02em] leading-[0.9] mb-5" style={{ fontSize: 'clamp(28px, 3.5vw, 52px)' }}>
                {p.t}
              </h3>
              <p className="leading-relaxed" style={{ fontSize: 'clamp(16px, 1.2vw, 18px)', color: mute }}>{p.b}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 md:grid-cols-4" style={{ borderTop: `1px solid ${rule}` }}>
        {[['12', 'Pieces SS25'], ['8', 'Countries sourced'], ['1', 'Collection per year'], ['100%', 'European made']].map(([n, l]) => (
          <div key={n} className="py-10 px-8" style={{ borderRight: `1px solid ${rule}` }}>
            <p className="font-black leading-[0.86] tracking-[-0.04em] mb-2" style={{ fontSize: 'clamp(36px, 5vw, 72px)' }}>{n}</p>
            <p className="font-mono text-[7px] tracking-[0.24em] uppercase" style={{ color: mute }}>{l}</p>
          </div>
        ))}
      </div>

      {/* ── Stockists ── */}
      <div className="px-8 md:px-16 py-20" style={{ borderTop: `1px solid ${rule}` }}>
        <p className="font-mono text-[8px] tracking-[0.3em] uppercase mb-10" style={{ color: mute }}>Stockists</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-px" style={{ background: rule }}>
          {['Dover Street Market — London', 'Ssense — Montreal', 'H. Lorenzo — Los Angeles', 'Browns — London', 'Isetan — Tokyo', 'Antonioli — Milan'].map(s => (
            <div key={s} className="p-6" style={{ background: bg }}>
              <p className="leading-relaxed" style={{ fontSize: '17px', color: mute }}>{s}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
