import { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';

const bg   = '#f0e8dc';
const ink  = '#1c1410';
const mute = 'rgba(28,20,16,0.42)';
const rule = 'rgba(28,20,16,0.1)';
const rust = '#c4603a';

const TYPES = ['General', 'Press / Media', 'Wholesale', 'Stockists', 'Repairs', 'Other'];

export default function ContactPage() {
  const navigate = useNavigate();
  const heroRef  = useRef<HTMLDivElement>(null);
  const [type, setType]           = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!heroRef.current) return;
    gsap.fromTo(heroRef.current.querySelectorAll('.h'),
      { clipPath: 'inset(0 0 100% 0)', y: 18 },
      { clipPath: 'inset(0 0 0% 0)', y: 0, stagger: 0.1, duration: 1.0, ease: 'expo.out', delay: 0.1 }
    );
  }, []);

  const iStyle: React.CSSProperties = {
    width: '100%', background: 'transparent', border: 'none',
    borderBottom: `1px solid ${rule}`,
    color: ink, fontFamily: "'Lora', Georgia, serif",
    fontSize: '15px', fontWeight: 400, padding: '12px 0', outline: 'none',
  };
  const lStyle: React.CSSProperties = {
    fontFamily: "'IBM Plex Mono', monospace", fontSize: '7px',
    letterSpacing: '0.28em', textTransform: 'uppercase',
    color: mute, display: 'block', marginBottom: '5px',
  };

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

      <div ref={heroRef} className="pt-28 pb-14 px-8 md:px-16" style={{ borderBottom: `1px solid ${rule}` }}>
        <p className="h font-mono text-[8px] tracking-[0.3em] uppercase mb-4" style={{ color: mute, clipPath: 'inset(0 0 100% 0)' }}>
          Get in touch
        </p>
        <h1
          className="h font-black leading-[0.86] tracking-[-0.02em] mb-6"
          style={{ fontSize: 'clamp(48px, 10vw, 130px)', clipPath: 'inset(0 0 100% 0)' }}
        >
          Contact
        </h1>
        <p className="h max-w-md leading-relaxed" style={{ fontSize: 'clamp(15px, 1.1vw, 17px)', color: mute, clipPath: 'inset(0 0 100% 0)' }}>
          For press, wholesale, or a conversation about cloth — we are here. Response within two working days.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 px-8 md:px-16 py-20 gap-16 md:gap-24">

        {submitted ? (
          <div className="pt-4">
            <h2 className="font-black leading-[0.88] tracking-[-0.02em] mb-6" style={{ fontSize: 'clamp(32px, 4vw, 56px)' }}>
              Received.
            </h2>
            <p className="leading-relaxed" style={{ fontSize: '15px', color: mute }}>We will be in touch shortly.</p>
          </div>
        ) : (
          <form
            onSubmit={e => { e.preventDefault(); setSubmitted(true); }}
            className="flex flex-col gap-8"
          >
            <div>
              <label style={lStyle}>Enquiry type</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {TYPES.map(t => (
                  <button
                    key={t} type="button" onClick={() => setType(t)}
                    className="px-3 py-2 font-mono text-[7px] tracking-[0.2em] uppercase transition-all duration-200"
                    style={{
                      border:     `1px solid ${type === t ? rust : rule}`,
                      color:       type === t ? rust : mute,
                      background: 'transparent',
                    }}
                  >{t}</button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div><label style={lStyle}>First name</label><input type="text" required style={iStyle} placeholder="—" /></div>
              <div><label style={lStyle}>Last name</label><input type="text" required style={iStyle} placeholder="—" /></div>
            </div>
            <div><label style={lStyle}>Email</label><input type="email" required style={iStyle} placeholder="—" /></div>
            <div>
              <label style={lStyle}>Message</label>
              <textarea required rows={5} style={{ ...iStyle, border: `1px solid ${rule}`, padding: '12px', resize: 'none' }} placeholder="—" />
            </div>

            <button
              type="submit"
              className="self-start px-10 font-mono text-[9px] tracking-[0.3em] uppercase transition-colors duration-200"
              style={{ height: '52px', background: ink, color: bg }}
            >
              Send
            </button>
          </form>
        )}

        <div className="flex flex-col gap-12">
          {[
            { label: 'Studio', lines: ['Rove Studio Ltd.', '14 Beak Street', 'London W1F 9RG'] },
            { label: 'Press',  lines: ['press@rove.studio'] },
            { label: 'Trade',  lines: ['trade@rove.studio'] },
            { label: 'Hours',  lines: ['Monday — Friday', '10:00 — 18:00 GMT'] },
          ].map(s => (
            <div key={s.label}>
              <p className="font-mono text-[7px] tracking-[0.28em] uppercase mb-3" style={{ color: 'rgba(28,20,16,0.25)' }}>{s.label}</p>
              {s.lines.map(l => (
                <p key={l} className="leading-relaxed" style={{ fontSize: '15px', color: mute }}>{l}</p>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
