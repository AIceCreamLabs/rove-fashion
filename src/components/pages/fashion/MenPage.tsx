import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PRODUCTS } from '@/lib/products';

gsap.registerPlugin(ScrollTrigger);

const CATS = ['All', 'Outerwear', 'Trousers', 'Tops', 'Knitwear', 'Tailoring'];

function Card({ product, delay }: { product: typeof PRODUCTS[0]; delay: number }) {
  const ref    = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!ref.current) return;
    const st = ScrollTrigger.create({
      trigger: ref.current, start: 'top 90%',
      onEnter: () => gsap.fromTo(ref.current,
        { opacity: 0, y: 44 },
        { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', delay }
      ),
    });
    return () => st.kill();
  }, [delay]);

  return (
    <div
      ref={ref}
      onClick={() => navigate(`/product/${product.slug}`)}
      className="group cursor-pointer opacity-0"
    >
      <div className="overflow-hidden aspect-[2/3] bg-[#111] mb-4">
        <img
          ref={imgRef}
          src={product.img}
          alt={product.name}
          className="w-full h-full object-cover transition-all duration-700 ease-out grayscale-[0.5] group-hover:grayscale-0 group-hover:scale-[1.04]"
        />
      </div>
      <div className="flex justify-between items-start gap-2">
        <div>
          <p className="font-mono text-[7px] tracking-[0.24em] uppercase text-white/25 mb-1">{product.category}</p>
          <p className="font-bold text-sm tracking-[-0.02em] uppercase leading-tight">{product.name}</p>
        </div>
        <p className="font-mono text-[10px] tracking-[0.1em] text-white/35 shrink-0 pt-5">{product.price}</p>
      </div>
      <p
        className="font-mono text-[7px] tracking-[0.2em] uppercase text-white/15 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      >
        {product.material}
      </p>
    </div>
  );
}

export default function MenPage() {
  const navigate = useNavigate();
  const heroRef  = useRef<HTMLDivElement>(null);
  const [cat, setCat] = useState('All');

  useEffect(() => {
    if (!heroRef.current) return;
    gsap.fromTo(heroRef.current.querySelectorAll('.h'),
      { clipPath: 'inset(0 0 100% 0)', y: 20 },
      { clipPath: 'inset(0 0 0% 0)', y: 0, stagger: 0.1, duration: 1.0, ease: 'expo.out', delay: 0.1 }
    );
  }, []);

  const list = cat === 'All' ? PRODUCTS : PRODUCTS.filter(p => p.category === cat);

  return (
    <div className="min-h-screen bg-black text-white">

      {/* ── Back ── */}
      <button
        onClick={() => navigate('/')}
        className="fixed top-6 left-8 z-50 font-mono text-[9px] tracking-[0.28em] uppercase text-white/30 hover:text-white transition-colors duration-200"
      >
        ← Home
      </button>

      {/* ── Header ── */}
      <div
        ref={heroRef}
        className="pt-28 pb-14 px-8 md:px-16 border-b border-white/[0.06]"
      >
        <p className="h font-mono text-[8px] tracking-[0.3em] uppercase text-white/30 mb-5" style={{ clipPath: 'inset(0 0 100% 0)' }}>
          AW25 Collection
        </p>
        <h1
          className="h font-black uppercase leading-[0.86] tracking-[-0.07em] mb-6"
          style={{ fontSize: 'clamp(56px, 12vw, 160px)', clipPath: 'inset(0 0 100% 0)' }}
        >
          Men
        </h1>
        <div className="h flex justify-between items-end flex-wrap gap-4" style={{ clipPath: 'inset(0 0 100% 0)' }}>
          <p className="text-white/35 font-light leading-relaxed max-w-md" style={{ fontSize: 'clamp(12px, 1.1vw, 14px)' }}>
            12 pieces. Each garment a position taken.
          </p>
          <p className="font-mono text-[8px] tracking-[0.24em] uppercase text-white/20">{PRODUCTS.length} pieces</p>
        </div>
      </div>

      {/* ── Filter ── */}
      <div className="flex overflow-x-auto border-b border-white/[0.06] px-8 md:px-16">
        {CATS.map(c => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className="shrink-0 py-4 px-4 font-mono text-[8px] tracking-[0.22em] uppercase transition-colors duration-200 -mb-px"
            style={{
              color:        cat === c ? '#fff' : 'rgba(255,255,255,0.25)',
              borderBottom: cat === c ? '1px solid #fff' : '1px solid transparent',
            }}
          >
            {c}
          </button>
        ))}
      </div>

      {/* ── Grid ── */}
      <div
        className="grid gap-x-4 gap-y-14 p-8 md:p-16"
        style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(clamp(180px, 24vw, 300px), 1fr))' }}
      >
        {list.map((p, i) => (
          <Card key={p.id} product={p} delay={(i % 4) * 0.07} />
        ))}
      </div>

      {/* ── Footer strip ── */}
      <div className="border-t border-white/[0.06] px-8 md:px-16 py-8 flex justify-between items-center">
        <p className="font-mono text-[8px] tracking-[0.24em] uppercase text-white/20">Noir House © AW25</p>
        <p className="font-mono text-[8px] tracking-[0.24em] uppercase text-white/10">Made in England / Italy / Portugal</p>
      </div>
    </div>
  );
}
