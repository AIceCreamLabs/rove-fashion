import './App.css';
import { HashRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { CartProvider, useCart } from './context/CartContext';
import { CylinderCarousel } from './components/pages/variant-1/cylinder-carousel';
import ProductPage           from './components/pages/fashion/ProductPage';
import CatalogPage           from './components/pages/fashion/CatalogPage';
import AboutPage             from './components/pages/fashion/AboutPage';
import CartPage              from './components/pages/fashion/CartPage';
import ContactPage           from './components/pages/fashion/ContactPage';
import Preloader             from './components/Preloader';

function ScrollTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function SiteNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { count } = useCart();
  const isHome = location.pathname === '/';
  if (isHome) return null;

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-[200] flex items-center justify-between px-8 h-14"
      style={{
        background:    'rgba(240,232,220,0.92)',
        backdropFilter: 'blur(8px)',
        borderBottom:  '1px solid rgba(28,20,16,0.06)',
      }}
    >
      <button
        onClick={() => navigate('/')}
        style={{
          fontFamily:    "'DM Serif Display', Georgia, serif",
          fontWeight:    400,
          fontSize:      '18px',
          letterSpacing: '-0.01em',
          color:         '#1c1410',
        }}
      >
        Rove
      </button>
      <div className="flex items-center gap-6">
        <button onClick={() => navigate('/catalog')} className="font-mono text-[9px] tracking-[0.24em] uppercase transition-colors duration-300" style={{ color: 'rgba(28,20,16,0.4)' }}
          onMouseEnter={e => (e.currentTarget.style.color = '#1c1410')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(28,20,16,0.4)')}>Catalog</button>
        <button onClick={() => navigate('/about')}   className="font-mono text-[9px] tracking-[0.24em] uppercase transition-colors duration-300" style={{ color: 'rgba(28,20,16,0.4)' }}
          onMouseEnter={e => (e.currentTarget.style.color = '#1c1410')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(28,20,16,0.4)')}>About</button>
        <button onClick={() => navigate('/contact')} className="font-mono text-[9px] tracking-[0.24em] uppercase transition-colors duration-300" style={{ color: 'rgba(28,20,16,0.4)' }}
          onMouseEnter={e => (e.currentTarget.style.color = '#1c1410')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(28,20,16,0.4)')}>Contact</button>
        <button onClick={() => navigate('/cart')} className="font-mono text-[9px] tracking-[0.24em] uppercase transition-colors duration-300 relative" style={{ color: 'rgba(28,20,16,0.4)' }}
          onMouseEnter={e => (e.currentTarget.style.color = '#1c1410')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(28,20,16,0.4)')}>
          Cart
          {count > 0 && (
            <span className="absolute -top-2 -right-3 w-4 h-4 text-[7px] font-mono flex items-center justify-center rounded-full" style={{ background: '#c4603a', color: '#f0e8dc' }}>
              {count}
            </span>
          )}
        </button>
      </div>
    </nav>
  );
}

function App() {
  const [preloaderDone, setPreloaderDone] = useState(
    () => sessionStorage.getItem('rove-v1') === '1'
  );

  function handlePreloaderDone() {
    sessionStorage.setItem('rove-v1', '1');
    setPreloaderDone(true);
  }

  return (
    <Router>
      {!preloaderDone && <Preloader onDone={handlePreloaderDone} />}
      <CartProvider>
        <ScrollTop />
        <SiteNav />
        <Routes>
          <Route path="/"               element={<CylinderCarousel />} />
          <Route path="/product/:slug"  element={<ProductPage />} />
          <Route path="/catalog"        element={<CatalogPage />} />
          <Route path="/about"          element={<AboutPage />} />
          <Route path="/cart"           element={<CartPage />} />
          <Route path="/contact"        element={<ContactPage />} />
        </Routes>
      </CartProvider>
    </Router>
  );
}

export default App;
