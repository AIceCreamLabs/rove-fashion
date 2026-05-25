import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Flip } from 'gsap/Flip';
import { PRODUCTS } from '@/lib/products';

gsap.registerPlugin(ScrollTrigger, Flip);

const bg   = '#f0e8dc';
const ink  = '#1c1410';
const mute = 'rgba(28,20,16,0.38)';
const rule = 'rgba(28,20,16,0.08)';
const rust = '#c4603a';

type Gender = 'all' | 'men' | 'women';
const CATS = ['All', 'Outerwear', 'Trousers', 'Tops', 'Knitwear', 'Tailoring'];

function Card({ product, delay }: { product: typeof PRODUCTS[0]; delay: number }) {
  const ref      = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!ref.current) return;
    const st = ScrollTrigger.create({
      trigger: ref.current, start: 'top 92%',
      onEnter: () => gsap.fromTo(ref.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', delay }
      ),
    });
    return () => st.kill();
  }, [delay]);

  return (
    <div
      ref={ref}
      data-id={product.id}
      onClick={() => navigate(`/product/${product.slug}`)}
      className="prod-card group cursor-pointer opacity-0"
    >
      <div className="overflow-hidden aspect-[2/3] mb-4" style={{ background: '#e8dcd0' }}>
        <img
          src={product.img}
          alt={product.name}
          className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-[1.04]"
          style={{ filter: 'saturate(0.9)' }}
        />
      </div>
      <div className="flex justify-between items-start gap-2">
        <div>
          <p className="font-mono text-[7px] tracking-[0.24em] uppercase mb-1" style={{ color: 'rgba(28,20,16,0.3)' }}>{product.category}</p>
          <p className="font-bold leading-snug" style={{ fontSize: '17px', letterSpacing: '0.01em', color: ink }}>{product.name}</p>
        </div>
        <p className="font-mono text-[10px] tracking-[0.1em] shrink-0 pt-6" style={{ color: mute }}>{product.price}</p>
      </div>
      <p className="font-mono text-[7px] tracking-[0.2em] uppercase mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ color: rust }}>
        {product.material}
      </p>
    </div>
  );
}

export default function CatalogPage() {
  const navigate    = useNavigate();
  const heroRef     = useRef<HTMLDivElement>(null);
  const gridRef     = useRef<HTMLDivElement>(null);
  const barRef      = useRef<HTMLDivElement>(null);
  const menBtnRef   = useRef<HTMLButtonElement>(null);
  const womenBtnRef = useRef<HTMLButtonElement>(null);

  const [gender, setGender] = useState<Gender>('all');
  const [cat,    setCat]    = useState('All');

  const flipStateRef = useRef<ReturnType<typeof Flip.getState> | null>(null);

  useEffect(() => {
    if (!heroRef.current) return;
    gsap.fromTo(heroRef.current.querySelectorAll('.h'),
      { clipPath: 'inset(0 0 100% 0)', y: 20 },
      { clipPath: 'inset(0 0 0% 0)', y: 0, stagger: 0.1, duration: 1.0, ease: 'expo.out', delay: 0.1 }
    );
  }, []);

  useEffect(() => {
    if (!barRef.current || !menBtnRef.current || !womenBtnRef.current) return;
    const target = gender === 'men' ? menBtnRef.current : gender === 'women' ? womenBtnRef.current : null;
    if (!target) {
      gsap.to(barRef.current, { opacity: 0, duration: 0.3 });
    } else {
      const rect   = target.getBoundingClientRect();
      const parent = target.parentElement!.getBoundingClientRect();
      gsap.to(barRef.current, { x: rect.left - parent.left, width: rect.width, opacity: 1, duration: 0.55, ease: 'power3.inOut' });
    }
  }, [gender]);

  function changeGender(g: Gender) {
    if (gridRef.current) flipStateRef.current = Flip.getState(gridRef.current.querySelectorAll('.prod-card'));
    setGender(g);
  }
  function changeCat(c: string) {
    if (gridRef.current) flipStateRef.current = Flip.getState(gridRef.current.querySelectorAll('.prod-card'));
    setCat(c);
  }

  useLayoutEffect(() => {
    if (!flipStateRef.current || !gridRef.current) return;
    Flip.from(flipStateRef.current, {
      duration: 0.75, ease: 'power4.inOut',
      stagger: { each: 0.035, from: 'center' }, absolute: true,
      onLeave: (els) => gsap.to(els, { opacity: 0, scale: 0.86, y: -12, duration: 0.3 }),
      onEnter: (els) => gsap.fromTo(els, { opacity: 0, scale: 0.94, y: 16 }, { opacity: 1, scale: 1, y: 0, duration: 0.45, stagger: 0.04 }),
    });
    flipStateRef.current = null;
  }, [gender, cat]);

  const list = PRODUCTS.filter(p => {
    const matchG = gender === 'all' || p.gender === gender;
    const matchC = cat === 'All'    || p.category === cat;
    return matchG && matchC;
  });

  const headingText = gender === 'men' ? 'Men' : gender === 'women' ? 'Women' : 'Catalog';

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

      <div ref={heroRef} className="pt-28 pb-10 px-8 md:px-16" style={{ borderBottom: `1px solid ${rule}` }}>
        <p className="h font-mono text-[8px] tracking-[0.3em] uppercase mb-5" style={{ color: mute, clipPath: 'inset(0 0 100% 0)' }}>
          SS25 Collection
        </p>
        <h1
          className="h font-black leading-[0.88] tracking-[-0.02em] mb-6"
          style={{ fontSize: 'clamp(56px, 12vw, 160px)', clipPath: 'inset(0 0 100% 0)' }}
        >
          {headingText}
        </h1>

        <div className="h relative flex items-center gap-0 mb-0" style={{ clipPath: 'inset(0 0 100% 0)' }}>
          <div ref={barRef} className="absolute bottom-0 h-px pointer-events-none" style={{ opacity: 0, width: 40, background: rust }} />
          {(['all', 'men', 'women'] as Gender[]).map(g => (
            <button
              key={g}
              ref={g === 'men' ? menBtnRef : g === 'women' ? womenBtnRef : undefined}
              onClick={() => changeGender(g)}
              className="px-5 py-3 font-mono text-[9px] tracking-[0.28em] uppercase transition-colors duration-300"
              style={{ color: gender === g ? ink : mute }}
            >
              {g === 'all' ? 'All' : g.charAt(0).toUpperCase() + g.slice(1)}
            </button>
          ))}
          <span className="ml-4 font-mono text-[8px] tracking-[0.22em] uppercase" style={{ color: 'rgba(28,20,16,0.2)' }}>
            {list.length} pieces
          </span>
        </div>
      </div>

      <div className="flex overflow-x-auto px-8 md:px-16" style={{ borderBottom: `1px solid ${rule}` }}>
        {CATS.map(c => (
          <button
            key={c}
            onClick={() => changeCat(c)}
            className="shrink-0 py-4 px-4 font-mono text-[8px] tracking-[0.22em] uppercase transition-colors duration-200 -mb-px"
            style={{
              color:        cat === c ? ink : mute,
              borderBottom: cat === c ? `1px solid ${rust}` : '1px solid transparent',
            }}
          >
            {c}
          </button>
        ))}
      </div>

      <div
        ref={gridRef}
        className="grid gap-x-4 gap-y-14 p-8 md:p-16"
        style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(clamp(180px, 24vw, 300px), 1fr))' }}
      >
        {list.map((p, i) => (
          <Card key={p.id} product={p} delay={(i % 4) * 0.07} />
        ))}
      </div>

      {list.length === 0 && (
        <div className="flex items-center justify-center py-32">
          <p className="font-mono text-[8px] tracking-[0.3em] uppercase" style={{ color: 'rgba(28,20,16,0.25)' }}>No pieces match this selection</p>
        </div>
      )}

      <div className="px-8 md:px-16 py-8 flex justify-between items-center" style={{ borderTop: `1px solid ${rule}` }}>
        <p className="font-mono text-[8px] tracking-[0.24em] uppercase" style={{ color: 'rgba(28,20,16,0.2)' }}>Rove © SS25</p>
        <p className="font-mono text-[8px] tracking-[0.24em] uppercase" style={{ color: 'rgba(28,20,16,0.15)' }}>Made in England / Italy / Portugal</p>
      </div>
    </div>
  );
}
