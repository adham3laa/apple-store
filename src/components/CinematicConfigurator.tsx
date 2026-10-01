"use client";
import { useState, useRef, useEffect } from 'react';

export default function CinematicConfigurator({ product }: { product: any }) {
  const [scene, setScene] = useState<'base' | 'color' | 'storage' | 'caseState' | 'lighting'>('base');
  const [isLocked, setIsLocked] = useState(false);
  const [activeButton, setActiveButton] = useState<string | null>(null);
  const [glassX, setGlassX] = useState('24%');
  const [glassY, setGlassY] = useState('8%');
  const [capLeft, setCapLeft] = useState('-5px');
  const [capWidth, setCapWidth] = useState('calc(20% + 5px)');
  
  const controllerRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});
  const activeToken = useRef(0);

  const getMedia = (type: string) => product.media.find((m: any) => m.type === type)?.url;

  const CAPSULE_POSITIONS: Record<number, { left: string; width: string }> = {
    0: { left: '-5px', width: 'calc(20% + 5px)' },
    1: { left: '20%',  width: '20%' },
    2: { left: '40%',  width: '20%' },
    3: { left: '60%',  width: '20%' },
    4: { left: '80%',  width: 'calc(20% + 5px)' }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!controllerRef.current) return;
    const rect = controllerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setGlassX(`${x.toFixed(1)}%`);
    setGlassY(`${y.toFixed(1)}%`);
  };

  const handleMouseEnterButton = (index: number) => {
    if (scene === 'base' && !isLocked) {
      setCapLeft(CAPSULE_POSITIONS[index].left);
      setCapWidth(CAPSULE_POSITIONS[index].width);
      controllerRef.current?.classList.add('hovering-button');
    }
  };

  const handleMouseLeaveController = (e: React.MouseEvent) => {
    if (scene === 'base' && !isLocked) {
      // Small timeout to allow activeElement to settle
      setTimeout(() => {
        const isFocus = ['btn-1', 'btn-2', 'btn-3', 'btn-4'].includes(document.activeElement?.id || '');
        if (!isFocus) {
          setCapLeft(CAPSULE_POSITIONS[0].left);
          setCapWidth(CAPSULE_POSITIONS[0].width);
          controllerRef.current?.classList.remove('hovering-button');
        }
      }, 10);
    }
  };

  const playVideoTransition = (vid: HTMLVideoElement | null, onHold: () => void) => {
    if (!vid) return onHold();
    
    activeToken.current++;
    const token = activeToken.current;
    
    vid.currentTime = 0;
    vid.play().then(() => {
      if (token !== activeToken.current) return;
      
      Object.values(videoRefs.current).forEach(v => {
        if (v && v !== vid) v.classList.remove('active');
      });
      vid.classList.add('active');

      const checkHold = () => {
        if (token !== activeToken.current) return;
        const duration = vid.duration || 6;
        const guardTime = Math.max(0.08, duration - 0.12);
        
        if (vid.currentTime >= guardTime || vid.ended) {
          vid.pause();
          onHold();
        } else {
          requestAnimationFrame(checkHold);
        }
      };
      requestAnimationFrame(checkHold);
    }).catch(onHold);
  };

  const playReverseTransition = (vid: HTMLVideoElement | null, onComplete: () => void) => {
    if (!vid) return onComplete();
    
    activeToken.current++;
    const token = activeToken.current;
    
    const duration = vid.duration || 5;
    vid.currentTime = Math.max(0.5, duration - 0.2);
    
    const step = () => {
      if (token !== activeToken.current) return;
      if (vid.currentTime > 0.08) {
        vid.currentTime = Math.max(0, vid.currentTime - 0.09);
        requestAnimationFrame(step);
      } else {
        vid.pause();
        vid.currentTime = 0;
        onComplete();
      }
    };
    requestAnimationFrame(step);
  };

  const triggerBranch = (branch: any, btnId: string) => {
    if (isLocked || scene !== 'base') return;
    setIsLocked(true);
    setScene(branch);
    setActiveButton(btnId);
    
    const fwdKey = `Video${branch.charAt(0).toUpperCase() + branch.slice(1)}Fwd`;
    playVideoTransition(videoRefs.current[fwdKey], () => {
      setIsLocked(false);
    });
  };

  const triggerReset = () => {
    if (isLocked || scene === 'base') return;
    setIsLocked(true);
    
    const branch = scene;
    const revKey = `Video${branch.charAt(0).toUpperCase() + branch.slice(1)}Rev`;
    
    playReverseTransition(videoRefs.current[revKey], () => {
      setScene('base');
      setActiveButton(null);
      setIsLocked(false);
      setCapLeft(CAPSULE_POSITIONS[0].left);
      setCapWidth(CAPSULE_POSITIONS[0].width);
      
      Object.values(videoRefs.current).forEach(v => {
        if (v) {
          v.classList.remove('active');
          v.pause();
          v.currentTime = 0;
        }
      });
    });
  };

  const getVariants = (type: string) => product.variants.filter((v: any) => v.type === type);

  const renderSpecDrawer = () => {
    if (scene === 'base') return null;
    
    let options: any[] = [];
    let selected: any = null;
    let onSelect = (opt: any) => {};

    if (scene === 'color') {
      options = getVariants('Color');
      // For now, mock hex colors based on name or add a helper map
      const colorMap: Record<string, string> = {
        'Desert Titanium': '#C5A582',
        'Natural Titanium': '#99948D',
        'White Titanium': '#F2F1ED',
        'Black Titanium': '#3C3B37'
      };
      return options.map(opt => (
        <button key={opt.id} className="spec-pill active" onClick={() => {}}>
          <span className="color-swatch-dot" style={{ background: colorMap[opt.name] || '#fff' }}></span>
          {opt.name}
        </button>
      ));
    } else if (scene === 'storage') {
      options = getVariants('Storage');
      return options.map(opt => (
        <button key={opt.id} className="spec-pill active" onClick={() => {}}>
          {opt.name} (+${opt.priceModifier})
        </button>
      ));
    } else if (scene === 'caseState') {
      options = getVariants('Case');
      return options.map(opt => (
        <button key={opt.id} className="spec-pill active" onClick={() => {}}>
          {opt.name}
        </button>
      ));
    } else if (scene === 'lighting') {
      options = getVariants('Lighting');
      return options.map(opt => (
        <button key={opt.id} className="spec-pill active" onClick={() => {}}>
          {opt.name}
        </button>
      ));
    }
    return null;
  };

  return (
    <div className={`stage ${scene !== 'base' ? 'branch-active title-hidden' : ''}`} id="stage">
      <div className="media-layer">
        <img className={`poster-layer ${scene === 'base' ? 'active' : ''}`} src={getMedia('PosterBase')} alt="Base" />
        <img className={`poster-layer ${scene === 'color' ? 'active' : ''}`} src={getMedia('PosterColor')} alt="Color" />
        <img className={`poster-layer ${scene === 'storage' ? 'active' : ''}`} src={getMedia('PosterStorage')} alt="Storage" />
        <img className={`poster-layer ${scene === 'caseState' ? 'active' : ''}`} src={getMedia('PosterCaseState')} alt="Case" />
        <img className={`poster-layer ${scene === 'lighting' ? 'active' : ''}`} src={getMedia('PosterLighting')} alt="Lighting" />
        
        {['Color', 'Storage', 'CaseState', 'Lighting'].map(branch => (
          <div key={branch} style={{ display: 'contents' }}>
            <video 
              ref={el => { videoRefs.current[`Video${branch}Fwd`] = el }} 
              className="media" muted playsInline preload="auto" 
              src={getMedia(`Video${branch}Fwd`)} 
            />
            <video 
              ref={el => { videoRefs.current[`Video${branch}Rev`] = el }} 
              className="media" muted playsInline preload="auto" 
              src={getMedia(`Video${branch}Rev`)} 
            />
          </div>
        ))}
      </div>

      <div className="hero">
        <h1><span>Make</span> <span>it</span> <span>yours</span></h1>
        <p>Pick a finish, choose your storage, and see exactly how it looks before you buy.</p>
        <div className="spec-drawer">
          {renderSpecDrawer()}
        </div>
      </div>

      <div 
        className={`controller ${scene !== 'base' ? 'collapsed' : ''}`} 
        id="controller"
        ref={controllerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeaveController}
        style={{ '--glass-x': glassX, '--glass-y': glassY, '--cap-left': capLeft, '--cap-width': capWidth } as React.CSSProperties}
      >
        <div className="track glass"></div>
        <div className="capsule glass"></div>
        
        <div className="cells">
          <div 
            className="cell label-cell" 
            onMouseEnter={() => handleMouseEnterButton(0)}
            style={{ pointerEvents: 'auto' }}
          >
            Configure &rarr;
          </div>
          
          {[
            { id: 'btn-1', label: 'Color', branch: 'color' },
            { id: 'btn-2', label: 'Storage', branch: 'storage' },
            { id: 'btn-3', label: 'Case', branch: 'caseState' },
            { id: 'btn-4', label: 'Lighting', branch: 'lighting' }
          ].map((btn, i) => {
            const isChosen = activeButton === btn.id;
            return (
              <button 
                key={btn.id}
                id={btn.id}
                className={`cell ${isChosen ? 'chosen is-reset' : ''}`}
                onMouseEnter={() => handleMouseEnterButton(i + 1)}
                onFocus={() => handleMouseEnterButton(i + 1)}
                onClick={() => isChosen ? triggerReset() : triggerBranch(btn.branch, btn.id)}
                disabled={isLocked || (scene !== 'base' && !isChosen)}
              >
                {isChosen ? 'Reset' : btn.label}
              </button>
            )
          })}
        </div>
      </div>

      <header>
        <div className="header-left">
          <a href="/" className="logo-wrap">
            <svg className="logo-svg" viewBox="0 0 170 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14h-2v-4H7v-2h4V6h2v4h4v2h-4v4z" fill="#fff" opacity="0.9"/>
              <text x="32" y="17" fill="#fff" fontFamily="'Manrope', sans-serif" fontWeight="700" fontSize="16" letterSpacing="-0.02em">TITANIUM STUDIO</text>
            </svg>
          </a>
          <div className="meta">
            <span>{product.name}</span>
            <span>{product.category}</span>
          </div>
        </div>
        <div className="header-right">
          <span className="live-price-tag">${product.basePrice}</span>
          <button className="shop-btn">Add to Cart</button>
        </div>
      </header>
    </div>
  );
}
