import { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { useCart } from '@/context/CartContext';

const bg   = '#f0e8dc';
const ink  = '#1c1410';
const mute = 'rgba(28,20,16,0.42)';
const rule = 'rgba(28,20,16,0.08)';
const rust = '#c4603a';

export default function CartPage() {
  const navigate = useNavigate();
  const { items, remove, count, total } = useCart();
  const headRef  = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!headRef.current) return;
    gsap.fromTo(headRef.current.querySelectorAll('.h'),
      { clipPath: 'inset(0 0 100% 0)' },
      { clipPath: 'inset(0 0 0% 0)', stagger: 0.08, duration: 0.9, ease: 'expo.out', delay: 0.1 }
    );
  }, []);

  return (
    <div className="min-h-screen" style={{ background: bg, color: ink }}>

      <button
        onClick={() => navigate(-1)}
        className="fixed top-6 left-8 z-50 font-mono text-[9px] tracking-[0.28em] uppercase transition-colors duration-200"
        style={{ color: mute }}
        onMouseEnter={e => (e.currentTarget.style.color = ink)}
        onMouseLeave={e => (e.currentTarget.style.color = mute)}
      >
        ← Back
      </button>

      <div ref={headRef} className="pt-28 pb-10 px-8 md:px-16" style={{ borderBottom: `1px solid ${rule}` }}>
        <p className="h font-mono text-[8px] tracking-[0.3em] uppercase mb-4" style={{ color: mute, clipPath: 'inset(0 0 100% 0)' }}>
          {count} {count === 1 ? 'item' : 'items'}
        </p>
        <h1
          className="h font-black leading-[0.86] tracking-[-0.03em]"
          style={{ fontSize: 'clamp(48px, 10vw, 130px)', clipPath: 'inset(0 0 100% 0)' }}
        >
          Your Bag
        </h1>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[55vh] gap-8">
          <p className="text-center leading-relaxed" style={{ fontSize: 'clamp(13px, 1.2vw, 16px)', color: mute }}>
            Your bag is empty.<br />Take your time.
          </p>
          <button
            onClick={() => navigate('/catalog')}
            className="font-mono text-[8px] tracking-[0.28em] uppercase transition-colors duration-200 pb-1"
            style={{ color: rust, borderBottom: `1px solid ${rust}` }}
          >
            Browse the collection →
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-[1fr_360px] min-h-[60vh]">

          <div style={{ borderRight: `1px solid ${rule}` }}>
            {items.map(item => (
              <div
                key={`${item.product.slug}-${item.size}`}
                className="grid grid-cols-[80px_1fr_auto] gap-5 px-8 md:px-16 py-7 items-center"
                style={{ borderBottom: `1px solid ${rule}` }}
              >
                <div className="overflow-hidden aspect-[2/3]" style={{ background: '#e8dcd0' }}>
                  <img src={item.product.img} alt={item.product.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="font-mono text-[7px] tracking-[0.22em] uppercase mb-2" style={{ color: 'rgba(28,20,16,0.3)' }}>{item.product.category}</p>
                  <p className="font-bold mb-2 leading-snug" style={{ fontSize: '16px', letterSpacing: '0.02em' }}>{item.product.name}</p>
                  <p className="font-mono text-[8px] tracking-[0.2em]" style={{ color: mute }}>Size: {item.size} · Qty: {item.qty}</p>
                </div>
                <div className="flex flex-col items-end gap-4">
                  <p className="font-mono text-[10px] tracking-[0.1em]" style={{ color: mute }}>{item.product.price}</p>
                  <button
                    onClick={() => remove(item.product.slug, item.size)}
                    className="font-mono text-[7px] tracking-[0.22em] uppercase transition-colors duration-200"
                    style={{ color: 'rgba(28,20,16,0.2)' }}
                    onMouseEnter={e => (e.currentTarget.style.color = rust)}
                    onMouseLeave={e => (e.currentTarget.style.color = 'rgba(28,20,16,0.2)')}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="px-8 md:px-10 py-10 sticky top-0 h-fit">
            <p className="font-mono text-[8px] tracking-[0.28em] uppercase mb-8" style={{ color: mute }}>Summary</p>
            <div className="space-y-3 mb-8">
              {items.map(i => (
                <div key={`${i.product.slug}-${i.size}`} className="flex justify-between gap-4">
                  <p className="truncate flex-1" style={{ fontSize: '15px', color: mute }}>{i.product.name} × {i.qty}</p>
                  <p className="font-mono text-[9px] shrink-0" style={{ color: 'rgba(28,20,16,0.3)' }}>{i.product.price}</p>
                </div>
              ))}
            </div>
            <div className="pt-5 mb-8 flex justify-between" style={{ borderTop: `1px solid ${rule}` }}>
              <p className="font-mono text-[8px] tracking-[0.22em] uppercase" style={{ color: mute }}>Total</p>
              <p className="font-mono text-sm tracking-[0.08em]">{total}</p>
            </div>
            <button className="w-full h-14 font-mono text-[9px] tracking-[0.3em] uppercase transition-colors duration-200" style={{ background: ink, color: bg }}>
              Checkout
            </button>
            <p className="font-mono text-[7px] tracking-[0.2em] uppercase text-center mt-4" style={{ color: 'rgba(28,20,16,0.2)' }}>
              Free delivery on all orders
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
