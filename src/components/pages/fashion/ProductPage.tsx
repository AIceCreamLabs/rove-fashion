import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PRODUCTS } from '@/lib/products';
import { useCart } from '@/context/CartContext';

gsap.registerPlugin(ScrollTrigger);

export default function ProductPage() {
  const { slug }  = useParams<{ slug: string }>();
  const navigate  = useNavigate();
  const { add }   = useCart();

  const product = PRODUCTS.find(p => p.slug === slug);

  // outer tall container — gives scroll room
  const outerRef    = useRef<HTMLDivElement>(null);
  const headRef     = useRef<HTMLHeadingElement>(null);
  const metaRef     = useRef<HTMLDivElement>(null);
  const descRef     = useRef<HTMLParagraphElement>(null);
  const detailsRef  = useRef<HTMLUListElement>(null);
  const layerRefs   = useRef<(HTMLDivElement | null)[]>([]);

  const [size,  setSize]  = useState('');
  const [added, setAdded] = useState(false);

  // ── Entrance ────────────────────────────────────────────
  useEffect(() => {
    if (!product) return;
    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
    tl.fromTo(layerRefs.current[0],
      { clipPath: 'inset(0 100% 0 0)' },
      { clipPath: 'inset(0 0% 0 0)', duration: 1.1 }, 0)
     .fromTo(headRef.current,
      { clipPath: 'inset(0 0 100% 0)', y: 24 },
      { clipPath: 'inset(0 0 0% 0)',   y: 0,  duration: 1.0 }, 0.3)
     .fromTo([metaRef.current, descRef.current, detailsRef.current],
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0,  duration: 0.7, stagger: 0.1 }, 0.5);
    return () => { tl.kill(); };
  }, [slug]);

  // ── Scroll-driven image reveals ─────────────────────────
  useEffect(() => {
    if (!product || !outerRef.current) return;

    const layers = layerRefs.current.filter((_, i) => i > 0);
    if (layers.length === 0) return;
    const n = layers.length;

    const trigger = ScrollTrigger.create({
      trigger: outerRef.current,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.8,
      onUpdate: (self) => {
        const progress = self.progress;
        const segSize = 1 / n;
        layers.forEach((layer, i) => {
          if (!layer) return;
          const s = i * segSize;
          const e = (i + 1) * segSize;
          let pct: number;
          if (progress <= s)      pct = 100;
          else if (progress >= e) pct = 0;
          else                    pct = (1 - (progress - s) / (e - s)) * 100;
          layer.style.clipPath = `inset(${pct}% 0 0 0)`;
        });
      },
    });

    ScrollTrigger.refresh();
    return () => { trigger.kill(); };
  }, [slug, product]);

  const bg   = '#f0e8dc';
  const ink  = '#1c1410';
  const mute = 'rgba(28,20,16,0.42)';
  const rule = 'rgba(28,20,16,0.08)';
  const rust = '#c4603a';

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: bg }}>
        <div className="text-center">
          <p className="font-mono text-xs tracking-widest uppercase mb-6" style={{ color: mute }}>Product not found</p>
          <button onClick={() => navigate('/catalog')} className="font-mono text-xs tracking-widest uppercase underline" style={{ color: ink }}>
            Back to collection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: bg, color: ink }}>

      {/* ── Back ── */}
      <button
        onClick={() => navigate(-1)}
        className="fixed top-6 left-8 z-50 font-mono text-[9px] tracking-[0.28em] uppercase transition-colors duration-200"
        style={{ color: mute }}
        onMouseEnter={e => (e.currentTarget.style.color = ink)}
        onMouseLeave={e => (e.currentTarget.style.color = mute)}
      >
        ← Back
      </button>

      <div
        ref={outerRef}
        style={{ height: `${100 + (product.imgs.length - 1) * 120}vh` }}
      >
        <div className="sticky top-0 h-screen grid grid-cols-1 md:grid-cols-2">

          {/* Left — stacked image layers */}
          <div className="relative overflow-hidden" style={{ background: '#e8dcd0' }}>
            {product.imgs.map((src, i) => (
              <div
                key={i}
                ref={el => { layerRefs.current[i] = el; }}
                className="absolute inset-0"
                style={{
                  zIndex: i + 1,
                  clipPath: i === 0 ? 'inset(0 100% 0 0)' : 'inset(100% 0 0 0)',
                }}
              >
                <img
                  src={src}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  style={{ filter: 'saturate(0.9)' }}
                />
              </div>
            ))}

            {/* Image counter */}
            <div className="absolute bottom-6 left-6 z-20 flex gap-3">
              {product.imgs.map((_, i) => (
                <span key={i} className="font-mono text-[8px] tracking-[0.22em] uppercase" style={{ color: 'rgba(28,20,16,0.35)' }}>
                  0{i + 1}
                </span>
              ))}
            </div>
          </div>

          {/* Right — product info */}
          <div className="overflow-y-auto flex flex-col px-8 md:px-14 pt-24 pb-16 md:border-l" style={{ background: bg, borderColor: rule }}>

            <div ref={metaRef} className="flex flex-wrap gap-5 mb-7">
              {[product.category, product.season, product.material].map(m => (
                <span key={m} className="font-mono text-[8px] tracking-[0.26em] uppercase" style={{ color: mute }}>{m}</span>
              ))}
            </div>

            <h1
              ref={headRef}
              className="font-black leading-[0.88] tracking-[-0.02em] mb-3"
              style={{ fontSize: 'clamp(32px, 4.5vw, 68px)', clipPath: 'inset(0 0 100% 0)' }}
            >
              {product.name}
            </h1>

            <p className="mb-10" style={{ fontSize: 'clamp(18px, 1.6vw, 24px)', color: rust, fontFamily: "'IBM Plex Mono', monospace" }}>
              {product.price}
            </p>

            <p
              ref={descRef}
              className="mb-10 leading-[1.9] max-w-sm"
              style={{ fontSize: 'clamp(17px, 1.4vw, 19px)', color: mute }}
            >
              {product.desc}
            </p>

            <div className="grid grid-cols-2 gap-4 py-7 mb-7" style={{ borderTop: `1px solid ${rule}`, borderBottom: `1px solid ${rule}` }}>
              {([['Cut', product.cut], ['Fit', product.fit]] as [string, string][]).map(([l, v]) => (
                <div key={l}>
                  <p className="font-mono text-[7px] tracking-[0.26em] uppercase mb-1" style={{ color: 'rgba(28,20,16,0.3)' }}>{l}</p>
                  <p className="leading-relaxed" style={{ fontSize: '15px', color: mute }}>{v}</p>
                </div>
              ))}
            </div>

            <ul ref={detailsRef} className="mb-10 space-y-0">
              {product.details.map((d, i) => (
                <li key={i} className="flex items-center gap-3 py-2" style={{ borderBottom: `1px solid ${rule}`, fontSize: '15px', color: mute }}>
                  <span className="w-1 h-1 rounded-full shrink-0" style={{ background: 'rgba(196,96,58,0.4)' }} />
                  {d}
                </li>
              ))}
            </ul>

            <div className="mb-7">
              <p className="font-mono text-[8px] tracking-[0.26em] uppercase mb-3" style={{ color: mute }}>Select size</p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map(s => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className="w-12 h-12 font-mono text-[9px] tracking-wide transition-all duration-200"
                    style={{
                      border:     `1px solid ${size === s ? rust : rule}`,
                      background: size === s ? rust : 'transparent',
                      color:      size === s ? bg   : mute,
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                if (!size) return;
                add(product, size);
                setAdded(true);
                setTimeout(() => setAdded(false), 2400);
              }}
              className="h-14 font-mono text-[9px] tracking-[0.3em] uppercase transition-all duration-300"
              style={{
                background: size ? ink : rule,
                color:      size ? bg  : mute,
                cursor:     size ? 'pointer' : 'default',
              }}
            >
              {added ? '— Added —' : size ? 'Add to bag' : 'Select a size'}
            </button>

            <button
              onClick={() => navigate('/catalog')}
              className="mt-5 font-mono text-[8px] tracking-[0.24em] uppercase transition-colors duration-200 text-center"
              style={{ color: 'rgba(28,20,16,0.25)' }}
              onMouseEnter={e => (e.currentTarget.style.color = mute)}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(28,20,16,0.25)')}
            >
              View full collection
            </button>
          </div>

        </div>
      </div>

      {/* ── Next product ── */}
      {(() => {
        const idx  = PRODUCTS.findIndex(p => p.slug === slug);
        const next = PRODUCTS[(idx + 1) % PRODUCTS.length];
        return (
          <div
            className="group relative overflow-hidden cursor-pointer"
            style={{ height: '50vh', borderTop: `1px solid ${rule}` }}
            onClick={() => navigate(`/product/${next.slug}`)}
          >
            <img
              src={next.img}
              alt={next.name}
              className="absolute inset-0 w-full h-full object-cover transition-all duration-700 scale-[1.04] group-hover:scale-100"
              style={{ filter: 'saturate(0.85)', opacity: 0.85 }}
            />
            <div className="absolute inset-0 transition-opacity duration-500" style={{ background: `${bg}cc` }} />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
              <p className="font-mono text-[7px] tracking-[0.3em] uppercase" style={{ color: mute }}>Next piece</p>
              <p className="font-black tracking-[-0.02em]" style={{ fontSize: 'clamp(24px, 4vw, 56px)', color: ink }}>
                {next.name}
              </p>
              <p className="font-mono text-[8px] tracking-[0.2em] mt-1" style={{ color: rust }}>{next.price}</p>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
