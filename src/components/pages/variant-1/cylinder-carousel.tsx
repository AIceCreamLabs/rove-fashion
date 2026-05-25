'use client';

import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Renderer, Camera, Transform, Texture, Program, Mesh } from 'ogl';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CustomEase } from 'gsap/CustomEase';
import { ScrollSmoother } from 'gsap/ScrollSmoother';

import type { CameraAnimation, ParticleMesh } from '@/lib/variant-1/types';
import { images, perspectives, cylinderConfig, particleConfig, imageConfig } from '@/lib/variant-1/data';
import {
  drawImageCover,
  getPositionClasses,
  createCylinderGeometry,
  createParticleGeometry,
} from '@/lib/variant-1/utils';
import { cylinderVertex, cylinderFragment, particleVertex, particleFragment } from '@/lib/variant-1/shaders';
import Loader from '@/components/loader';
import { useCart } from '@/context/CartContext';
import { PRODUCTS } from '@/lib/products';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, CustomEase, ScrollSmoother);
  CustomEase.create('cinematicSilk',   '0.45, 0.05, 0.55, 0.95');
  CustomEase.create('cinematicSmooth', '0.25, 0.1, 0.25, 1');
  CustomEase.create('cinematicFlow',   '0.33, 0, 0.2, 1');
  CustomEase.create('cinematicLinear', '0.4, 0, 0.6, 1');
}

// Map canvas click → product index (0-based, 0..11)
function getProductIndex(canvasEl: HTMLCanvasElement, clientX: number, rotY: number): number {
  const rect = canvasEl.getBoundingClientRect();
  const nx   = (clientX - rect.left) / rect.width; // 0..1
  const cx   = nx - 0.5; // -0.5..0.5 (left→right)
  // Rough angular offset: ±55° across the canvas width
  const angleOffset = cx * (Math.PI * 0.6);
  // Front of cylinder sits at angle π/2 from camera (+z axis), adjusted by rotation
  const frontAngle  = Math.PI / 2 - rotY + angleOffset;
  const twoPi       = Math.PI * 2;
  const n           = images.length; // 12
  const normalised  = ((frontAngle % twoPi) + twoPi) % twoPi; // 0..2π
  return Math.floor(normalised / twoPi * n) % n;
}

export function CylinderCarousel() {
  const navigate   = useNavigate();
  const { count }  = useCart();

  const [isLoading,  setIsLoading]  = useState(true);
  const [hintHidden, setHintHidden] = useState(false);

  const canvasRef         = useRef<HTMLCanvasElement>(null);
  const containerRef      = useRef<HTMLDivElement>(null);
  const smoothWrapperRef  = useRef<HTMLDivElement>(null);
  const smoothContentRef  = useRef<HTMLDivElement>(null);
  const textRefs          = useRef<(HTMLDivElement | null)[]>([]);

  const rendererRef       = useRef<Renderer | null>(null);
  const cameraRef         = useRef<Camera | null>(null);
  const cylinderRef       = useRef<Mesh | null>(null);
  const cameraAnimRef     = useRef<CameraAnimation>({ x: 0, y: 0, z: 8, rotY: 0 });
  const particlesRef      = useRef<ParticleMesh[]>([]);

  const lastRotationRef   = useRef(0);
  const velocityRef       = useRef(0);
  const momentumRef       = useRef(0);

  // Manual timeline progress control (so hover can slow it down)
  const tlRef             = useRef<gsap.core.Timeline | null>(null);
  const rawProgressRef    = useRef(0);   // scroll target (0..1)
  const appliedProgressRef= useRef(0);   // what we feed tl.progress()
  const speedRef          = useRef(1);   // 1=full 0=frozen

  // Touch tracking for mobile slow-down
  const touchActiveRef    = useRef(false);
  const touchStartXRef    = useRef(0);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current || !smoothWrapperRef.current || !smoothContentRef.current) return;

    // ── ScrollSmoother ────────────────────────────────────────────────────
    const smoother = ScrollSmoother.create({
      wrapper:      smoothWrapperRef.current!,
      content:      smoothContentRef.current!,
      smooth:       4,
      effects:      false,
      smoothTouch:  0.1,
    });

    // ── OGL Renderer ──────────────────────────────────────────────────────
    const renderer = new Renderer({
      canvas:    canvasRef.current,
      width:     window.innerWidth,
      height:    window.innerHeight,
      dpr:       Math.min(window.devicePixelRatio, 2),
      alpha:     true,
      antialias: true,
    });
    const gl = renderer.gl;
    gl.clearColor(0.941, 0.910, 0.863, 1); // #f0e8dc ecru
    gl.disable(gl.CULL_FACE);
    rendererRef.current = renderer;

    const getResponsiveDimensions = () => {
      const w        = window.innerWidth;
      const isMobile = w < 768;
      const isTablet = w >= 768 && w < 1024;
      return {
        cylinderScale: (isMobile ? 1.8 : isTablet ? 2.2 : 2.5) / cylinderConfig.radius,
        cylinderHeight: isMobile ? 0.8 : isTablet ? 1.0 : 1.2,
        cameraZ:        isMobile ? 6   : isTablet ? 7   : 8,
        fov:            isMobile ? 50  : 45,
        isMobile,
      };
    };

    const dims = getResponsiveDimensions();

    const camera = new Camera(gl as any, { fov: dims.fov });
    camera.position.set(0, 0, dims.cameraZ);
    cameraRef.current = camera;

    const scene = new Transform();

    const geometry = createCylinderGeometry(gl, cylinderConfig);

    const hwLimit  = gl.getParameter(gl.MAX_TEXTURE_SIZE);
    const isMob    = window.innerWidth < 768;
    const safeLimit= isMob ? 2048 : Math.min(hwLimit, 8192);

    const atlasCanvas = document.createElement('canvas');
    const ctx2d       = atlasCanvas.getContext('2d', { willReadFrequently: false, alpha: false })!;
    const N           = images.length;
    const scale       = Math.min(1, safeLimit / (imageConfig.width * N));
    atlasCanvas.width  = Math.floor(imageConfig.width  * N * scale);
    atlasCanvas.height = Math.floor(imageConfig.height * scale);

    let loaded = 0;
    const imgEls: HTMLImageElement[] = [];
    let lastWidth = window.innerWidth;

    const handleResize = () => {
      if (!rendererRef.current || !cameraRef.current || !cylinderRef.current) return;
      const cw = window.innerWidth;
      const nd = getResponsiveDimensions();
      if (nd.isMobile && cw === lastWidth) return;
      lastWidth = cw;
      rendererRef.current.setSize(cw, window.innerHeight);
      cameraRef.current.perspective({ fov: nd.fov, aspect: cw / window.innerHeight });
      const s = nd.cylinderScale;
      const h = nd.isMobile
        ? (2 * Math.PI * cylinderConfig.radius * imageConfig.height / (imageConfig.width * N)) / cylinderConfig.height
        : 1;
      cylinderRef.current.scale.set(s, nd.isMobile ? s * h : s, s);
      if ([6,7,8].includes(cameraAnimRef.current.z)) cameraAnimRef.current.z = nd.cameraZ;
    };

    // ── Interactions on the scroll wrapper (z-20, sits on top of canvas) ───
    const canvas     = canvasRef.current!;
    const interactEl = smoothWrapperRef.current!;

    // Hover → slow
    const onEnter = () => {
      gsap.to(speedRef, { current: 0, duration: 1.0, ease: 'power2.out' });
    };
    const onLeave = () => {
      if (touchActiveRef.current) return;
      gsap.to(speedRef, { current: 1, duration: 1.6, ease: 'power2.inOut' });
    };

    // Click → navigate to product
    const onClick = (e: MouseEvent) => {
      if (!cylinderRef.current) return;
      // Use canvas rect (same size as viewport) for coordinate mapping
      const idx = getProductIndex(canvas, e.clientX, cylinderRef.current.rotation.y);
      navigate(`/product/${PRODUCTS[idx].slug}`);
    };

    // Touch start → slow (mobile)
    const onTouchStart = (e: TouchEvent) => {
      touchActiveRef.current = true;
      touchStartXRef.current = e.touches[0].clientX;
      gsap.to(speedRef, { current: 0, duration: 0.7, ease: 'power2.out' });
    };
    // Touch end → resume; short tap = navigate
    const onTouchEnd = (e: TouchEvent) => {
      touchActiveRef.current = false;
      gsap.to(speedRef, { current: 1, duration: 1.8, ease: 'power2.inOut' });
      if (!cylinderRef.current) return;
      const dx = Math.abs((e.changedTouches[0]?.clientX ?? touchStartXRef.current) - touchStartXRef.current);
      if (dx < 12) {
        const idx = getProductIndex(canvas, e.changedTouches[0]?.clientX ?? window.innerWidth / 2, cylinderRef.current.rotation.y);
        navigate(`/product/${PRODUCTS[idx].slug}`);
      }
    };

    interactEl.addEventListener('mouseenter', onEnter,      { passive: true });
    interactEl.addEventListener('mouseleave', onLeave,      { passive: true });
    interactEl.addEventListener('click',      onClick);
    interactEl.addEventListener('touchstart', onTouchStart, { passive: true });
    interactEl.addEventListener('touchend',   onTouchEnd,   { passive: true });

    // ── Image loading → texture → scene ──────────────────────────────────
    const circumference     = 2 * Math.PI * cylinderConfig.radius;
    const textureAspectRatio= imageConfig.height / (imageConfig.width * N);
    const heightCorrection  = (circumference * textureAspectRatio) / cylinderConfig.height;

    images.forEach((src, i) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        imgEls[i] = img;
        if (++loaded < N) return;

        // Draw atlas
        imgEls.forEach((im, j) => {
          const tw = atlasCanvas.width / N;
          const th = atlasCanvas.height;
          const x0 = Math.floor(j * tw);
          const x1 = Math.floor((j + 1) * tw);
          drawImageCover(ctx2d, im, x0, 0, x1 - x0, th);
        });

        const tex = new Texture(gl as any, {
          wrapS: gl.CLAMP_TO_EDGE, wrapT: gl.CLAMP_TO_EDGE,
          minFilter: gl.LINEAR, magFilter: gl.LINEAR,
          generateMipmaps: false,
        });
        tex.image       = atlasCanvas;
        tex.needsUpdate = true;

        const prog = new Program(gl as any, {
          vertex: cylinderVertex, fragment: cylinderFragment,
          uniforms: { tMap: { value: tex }, uDarkness: { value: 0.0 } },
          cullFace: null,
        });

        const cylinder = new Mesh(gl as any, { geometry, program: prog });
        cylinder.setParent(scene);
        cylinder.rotation.y = 0.5;
        cylinder.scale.set(dims.cylinderScale, dims.cylinderScale, dims.cylinderScale);
        cylinderRef.current = cylinder;

        setIsLoading(false);

        // ── GSAP timeline — PAUSED, we drive .progress() from RAF ─────────
        const tl = gsap.timeline({ paused: true });

        tl.to(cameraAnimRef.current, { x: 0,    y: 0,  z: dims.cameraZ, duration: 1,   ease: 'cinematicSilk' })
          .to(cameraAnimRef.current, { x: 0,    y: 5,  z: 5,            duration: 1,   ease: 'cinematicFlow' })
          .to(cameraAnimRef.current, { x: 1.5,  y: 2,  z: 2,            duration: 2,   ease: 'cinematicLinear' })
          .to(cameraAnimRef.current, { x: 0.5,  y: 0,  z: 0.8,          duration: 3.5, ease: 'power1.inOut' })
          .to(cameraAnimRef.current, { x: -6,   y: -1, z: dims.cameraZ, duration: 1,   ease: 'cinematicSmooth' });

        tl.to(cylinder.rotation, { y: '+=17', duration: 8.5, ease: 'none' }, 0);

        tlRef.current = tl;

        // Raw scroll progress (target) — ScrollTrigger watches scroll, stores progress
        ScrollTrigger.create({
          trigger:    containerRef.current,
          start:      'top top',
          end:        'bottom bottom',
          onUpdate:   (self) => { rawProgressRef.current = self.progress; },
          onLeave:    ()     => setHintHidden(true),
          onEnterBack:()     => setHintHidden(false),
        });

        // ── Text overlays per scroll section ─────────────────────────────
        textRefs.current.forEach((textEl, idx) => {
          if (!textEl) return;
          const dur   = 100 / perspectives.length;
          const start = idx * dur;
          const end   = (idx + 1) * dur;

          const textTl = gsap.timeline({
            scrollTrigger: {
              trigger: containerRef.current,
              start:   `${start}% top`,
              end:     `${end}% top`,
              scrub:   0.8,
            },
          });

          textTl
            .fromTo(textEl, { opacity: 0 }, { opacity: 1, duration: 0.2, ease: 'cinematicSmooth' })
            .to(textEl,     { opacity: 1, duration: 0.6, ease: 'none' })
            .to(textEl,     { opacity: 0, duration: 0.2, ease: 'cinematicSmooth' });
        });

        // ── Particles ─────────────────────────────────────────────────────
        for (let i = 0; i < particleConfig.numParticles; i++) {
          const { geometry: lineGeo, userData } = createParticleGeometry(gl, particleConfig, i, cylinderConfig.height);
          const lProg = new Program(gl as any, {
            vertex: particleVertex, fragment: particleFragment,
            uniforms: { uColor: { value: [0.769, 0.376, 0.227] }, uOpacity: { value: 0 } }, // terracotta #c4603a
            transparent: true, depthTest: true,
          });
          const p = new Mesh(gl as any, { geometry: lineGeo, program: lProg, mode: gl.LINE_STRIP }) as ParticleMesh;
          p.userData = userData;
          p.setParent(scene);
          particlesRef.current.push(p);
        }

        window.addEventListener('resize', handleResize);

        // ── RAF loop ──────────────────────────────────────────────────────
        const animate = () => {
          requestAnimationFrame(animate);

          // ── Drive timeline progress manually (enables hover slow-down) ──
          // Lerp applied progress toward raw scroll progress, scaled by speedRef
          const lerpRate = speedRef.current * 0.038 + 0.003; // deliberate pace — ~40% slower catch-up
          appliedProgressRef.current += (rawProgressRef.current - appliedProgressRef.current) * lerpRate;
          tl.progress(Math.min(appliedProgressRef.current, 0.9999));

          camera.position.set(cameraAnimRef.current.x, cameraAnimRef.current.y, cameraAnimRef.current.z);
          camera.lookAt([0, 0, 0]);

          if (cylinderRef.current) {
            const cur  = cylinderRef.current.rotation.y;
            velocityRef.current   = cur - lastRotationRef.current;
            lastRotationRef.current = cur;
            momentumRef.current   = momentumRef.current * 0.92 + velocityRef.current * 0.15;

            const speed      = Math.abs(velocityRef.current) * 100;
            const isRotating = Math.abs(velocityRef.current) > 0.0001;

            particlesRef.current.forEach(p => {
              const ud          = p.userData;
              const targetOp    = isRotating ? Math.min(speed * 3, 0.95) : 0;
              const curOp       = p.program.uniforms.uOpacity.value as number;
              p.program.uniforms.uOpacity.value = curOp + (targetOp - curOp) * 0.15;

              if (isRotating) {
                ud.baseAngle += velocityRef.current * ud.speed * 1.5;
                const positions = p.geometry.attributes.position.data as Float32Array;
                for (let j = 0; j <= particleConfig.segments; j++) {
                  const t = j / particleConfig.segments;
                  const a = ud.baseAngle + ud.angleSpan * t;
                  positions[j*3]   = Math.cos(a) * ud.radius;
                  positions[j*3+1] = ud.baseY;
                  positions[j*3+2] = Math.sin(a) * ud.radius;
                }
                p.geometry.attributes.position.needsUpdate = true;
              }
            });
          }

          renderer.render({ scene, camera });
        };
        animate();
      };

      img.onerror = () => { console.error('Failed to load image:', src); setIsLoading(false); };
      img.src = src;
    });

    return () => {
      window.removeEventListener('resize', handleResize);
      interactEl.removeEventListener('mouseenter', onEnter);
      interactEl.removeEventListener('mouseleave', onLeave);
      interactEl.removeEventListener('click',      onClick);
      interactEl.removeEventListener('touchstart', onTouchStart);
      interactEl.removeEventListener('touchend',   onTouchEnd);
      ScrollTrigger.getAll().forEach(t => t.kill());
      smoother.kill();
    };
  }, [navigate]);

  return (
    <>
      <Loader isLoading={isLoading} className="bg-[#f0e8dc]" classNameLoader="bg-[#1c1410]" />

      {/* ── Fixed canvas ── */}
      <div className="fixed inset-0 w-full h-svh z-0" style={{ background: '#f0e8dc' }}>
        <canvas
          ref={canvasRef}
          className="w-full h-full block"
          style={{ cursor: 'crosshair' }}
        />
      </div>

      {/* ── Brand wordmark ── */}
      <div className="fixed top-7 left-8 z-30 pointer-events-none select-none">
        <span style={{
          fontFamily:    "'DM Serif Display', Georgia, serif",
          fontWeight:    400,
          fontSize:      'clamp(15px, 1.1vw, 18px)',
          letterSpacing: '-0.01em',
          color:         'rgba(28,20,16,0.85)',
        }}>
          Rove
        </span>
      </div>

      {/* ── Minimal home nav ── */}
      <div className="fixed top-7 right-8 z-30 pointer-events-auto flex items-center gap-5">
        <button onClick={() => navigate('/catalog')} className="font-mono text-[8px] tracking-[0.24em] uppercase transition-colors duration-300" style={{ color: 'rgba(28,20,16,0.35)' }}
          onMouseEnter={e => (e.currentTarget.style.color = '#1c1410')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(28,20,16,0.35)')}>Catalog</button>
        <button onClick={() => navigate('/about')} className="font-mono text-[8px] tracking-[0.24em] uppercase transition-colors duration-300" style={{ color: 'rgba(28,20,16,0.35)' }}
          onMouseEnter={e => (e.currentTarget.style.color = '#1c1410')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(28,20,16,0.35)')}>About</button>
        {count > 0 && (
          <button onClick={() => navigate('/cart')} className="w-8 h-8 text-[8px] font-mono flex items-center justify-center" style={{ background: '#c4603a', color: '#f0e8dc' }}>
            {count}
          </button>
        )}
      </div>

      {/* ── Text overlays ── */}
      <div className="fixed inset-0 pointer-events-none z-10" style={{ color: '#1c1410' }}>
        {perspectives.map((p, i) => (
          <div
            key={i}
            ref={el => { textRefs.current[i] = el; }}
            className={`absolute opacity-0 max-md:w-full ${getPositionClasses(p.position)}`}
          >
            <h2 className="text-7xl max-md:text-3xl leading-[0.88] tracking-[-0.04em]" style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontWeight: 400 }}>{p.title}</h2>
            {p.description && (
              <p className="text-2xl max-md:text-base mt-3 tracking-[0.01em] font-mono" style={{ fontSize: '11px', color: 'rgba(28,20,16,0.45)', letterSpacing: '0.18em' }}>{p.description}</p>
            )}
          </div>
        ))}
      </div>

      {/* ── Hover / tap hint ── */}
      {!hintHidden && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-20 pointer-events-none flex flex-col items-center gap-2">
          <svg width="18" height="26" viewBox="0 0 18 26" fill="none" style={{ opacity: 0.25 }}>
            <path d="M9 2L9 20M9 20L4 15M9 20L14 15" stroke="#1c1410" strokeWidth="0.8"/>
          </svg>
          <span className="font-mono text-[9px] tracking-[0.28em] uppercase" style={{ color: 'rgba(28,20,16,0.3)' }}>Scroll</span>
        </div>
      )}

      {/* ── Click to discover badge (appears after first scroll) ── */}
      {hintHidden && (
        <div className="fixed bottom-8 right-8 z-20 pointer-events-none">
          <p className="font-mono text-[8px] tracking-[0.26em] uppercase" style={{ color: 'rgba(28,20,16,0.25)' }}>
            Click to discover
          </p>
        </div>
      )}

      {/* ── Scroll spacer (500svh) ── */}
      <div ref={smoothWrapperRef} id="smooth-wrapper" className="relative z-20" style={{ cursor: 'crosshair' }}>
        <div ref={smoothContentRef} id="smooth-content">
          <div ref={containerRef} style={{ height: '500svh' }} />
        </div>
      </div>
    </>
  );
}
