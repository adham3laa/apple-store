"use client";

import React from "react";

interface CosmoLogoProps {
  size?: "sm" | "md" | "lg";
  showSubtitle?: boolean;
  inverted?: boolean;
}

export function CosmoLogo({
  size = "md",
  showSubtitle = true,
  inverted = false
}: CosmoLogoProps) {
  const isSm = size === "sm";
  const isLg = size === "lg";

  const emblemDimension = isSm ? 34 : isLg ? 52 : 42;

  return (
    <div className="flex items-center gap-3.5 select-none group cursor-pointer">
      {/* Signature Cosmo Astronomical Orbital Emblem */}
      <div 
        className="relative flex-shrink-0 transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-105"
        style={{ width: emblemDimension, height: emblemDimension }}
      >
        <svg 
          viewBox="0 0 120 120" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-[0_4px_12px_rgba(0,0,0,0.12)]"
        >
          <defs>
            {/* Obsidian Metallic Finish */}
            <linearGradient id="logoObsidian" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={inverted ? "#262320" : "#1C1A18"} />
              <stop offset="100%" stopColor={inverted ? "#141312" : "#0C0B0A"} />
            </linearGradient>

            {/* Champagne Gold / Warm Titanium Bevel */}
            <linearGradient id="logoGold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FAF8F5" />
              <stop offset="35%" stopColor="#E5DFD5" />
              <stop offset="70%" stopColor="#C5A880" />
              <stop offset="100%" stopColor="#967D59" />
            </linearGradient>

            {/* Radiant Emerald Optical Lens */}
            <radialGradient id="logoEmerald" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#34D399" />
              <stop offset="45%" stopColor="#059669" />
              <stop offset="100%" stopColor="#047857" />
            </radialGradient>

            {/* Emerald Optical Glow */}
            <filter id="logoGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Base Chassis Disc */}
          <rect 
            width="120" 
            height="120" 
            rx="28" 
            fill="url(#logoObsidian)" 
            stroke={inverted ? "rgba(255,255,255,0.15)" : "rgba(229,223,213,0.35)"}
            strokeWidth="1.5"
          />
          
          {/* Outer Precision Dial Ring */}
          <circle 
            cx="60" 
            cy="60" 
            r="48" 
            stroke="url(#logoGold)" 
            strokeWidth="1.5" 
            strokeOpacity="0.85" 
          />
          
          {/* Reticle Dial Markers (N, S, W, E) */}
          <line x1="60" y1="8" x2="60" y2="15" stroke="url(#logoGold)" strokeWidth="1.5" strokeOpacity="0.8" />
          <line x1="60" y1="105" x2="60" y2="112" stroke="url(#logoGold)" strokeWidth="1.5" strokeOpacity="0.8" />
          <line x1="8" y1="60" x2="15" y2="60" stroke="url(#logoGold)" strokeWidth="1.5" strokeOpacity="0.8" />
          <line x1="105" y1="60" x2="112" y2="60" stroke="url(#logoGold)" strokeWidth="1.5" strokeOpacity="0.8" />

          {/* Inner Dashed Orbital Ring */}
          <circle 
            cx="60" 
            cy="60" 
            r="38" 
            stroke={inverted ? "#4A4642" : "#36322E"} 
            strokeWidth="1" 
            strokeDasharray="2 3" 
          />

          {/* Architectural 'C' Orbital Arc */}
          <path
            d="M 82 40 
               A 30 30 0 1 0 82 80 
               L 73 72 
               A 20 20 0 1 1 73 48 
               Z"
            fill="url(#logoGold)"
          />

          {/* Emerald Jewel Focal Core */}
          <circle 
            cx="60" 
            cy="60" 
            r="11" 
            fill="url(#logoEmerald)" 
            filter="url(#logoGlow)"
            className="transition-transform duration-500 group-hover:scale-110 origin-center"
          />
          
          {/* Center 4-Point Celestial Star Ray */}
          <path
            d="M 60 52 
               Q 60 60 68 60 
               Q 60 60 60 68 
               Q 60 60 52 60 
               Q 60 60 60 52 Z"
            fill="#FAF8F5"
          />
          <circle cx="60" cy="60" r="1.8" fill="#FFFFFF" />
        </svg>

        {/* Emerald Active Verification Dot */}
        <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#059669] ring-2 ring-white/90 animate-pulse" />
      </div>

      {/* Brand Wordmark & Editorial Typography */}
      <div className="flex flex-col text-left">
        <div className="flex items-baseline gap-2">
          <span 
            className={`font-serif-editorial tracking-[0.22em] font-medium uppercase transition-colors duration-300 ${
              isSm ? 'text-lg' : isLg ? 'text-3xl' : 'text-2xl'
            } ${inverted ? 'text-white' : 'text-[#161514] group-hover:text-black'}`}
          >
            C O S M O
          </span>
        </div>
        {showSubtitle && (
          <div className="flex items-center gap-1.5 -mt-0.5">
            <span 
              className={`text-[9px] font-mono-data tracking-[0.24em] uppercase font-semibold ${
                inverted ? 'text-neutral-400' : 'text-neutral-500'
              }`}
            >
              ATELIER
            </span>
            <span className="text-neutral-300 text-[8px]">•</span>
            <span className="text-[9px] font-mono-data tracking-[0.2em] uppercase font-semibold text-[#059669]">
              APPLE BOUTIQUE
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

