import React from "react";
import Link from "next/link";
import { CosmoLogo } from "./CosmoLogo";

export function Footer() {
  return (
    <footer id="manifesto" className="bg-[#141312] text-[#FAF8F5] border-t border-[#272522]">
      {/* Editorial Manifesto Section */}
      <div className="max-w-[1520px] mx-auto px-6 md:px-12 py-20 border-b border-[#272522]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-4">
            <span className="text-[10px] font-mono-data uppercase tracking-[0.3em] text-[#059669] block mb-4">
              OUR PROMISE
            </span>
            <h3 className="font-serif-editorial text-4xl sm:text-5xl font-normal leading-tight text-[#FAF8F5]">
              The Best of <span className="italic font-light">Apple Design</span>.
            </h3>
          </div>
          <div className="lg:col-span-8 text-neutral-400 text-sm md:text-base leading-relaxed space-y-4 font-light max-w-2xl">
            <p>
              COSMO is dedicated to bringing you the finest Apple devices with premium service and guaranteed authenticity. Every product in our store is 100% genuine and factory-sealed.
            </p>
            <p>
              From the latest iPhone 16 Pro in Grade 5 Titanium to high-performance MacBooks, AirPods, and Apple Watches, we deliver original Apple technology directly to your door with free insured delivery and official warranty coverage.
            </p>
          </div>
        </div>
      </div>

      {/* Directory & Salons */}
      <div className="max-w-[1520px] mx-auto px-6 md:px-12 py-16 grid grid-cols-2 md:grid-cols-4 gap-10 text-xs font-mono-data">
        <div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-neutral-400 block mb-4">
            PRODUCTS
          </span>
          <ul className="space-y-2.5 text-neutral-300">
            <li><Link href="/?category=iphones" className="hover:text-white transition-colors">iPhone Models</Link></li>
            <li><Link href="/?category=macbooks" className="hover:text-white transition-colors">MacBook & Mac</Link></li>
            <li><Link href="/?category=airpods" className="hover:text-white transition-colors">AirPods & Audio</Link></li>
            <li><Link href="/?category=watches" className="hover:text-white transition-colors">Apple Watch & Accessories</Link></li>
          </ul>
        </div>

        <div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-neutral-400 block mb-4">
            OUR SERVICE
          </span>
          <ul className="space-y-2.5 text-neutral-300">
            <li><Link href="/coverage" className="hover:text-emerald-400 text-[#059669] transition-colors flex items-center gap-1 font-semibold"><span>Check Serial & Warranty</span><span>→</span></Link></li>
            <li><Link href="/coverage" className="hover:text-white transition-colors">100% Genuine Apple Guarantee</Link></li>
            <li><Link href="/coverage" className="hover:text-white transition-colors">Official 1-Year Warranty</Link></li>
            <li><Link href="/checkout" className="hover:text-white transition-colors">Free Insured Courier Delivery</Link></li>
            <li><Link href="/account" className="hover:text-white transition-colors">24/7 Client Concierge Support</Link></li>
          </ul>
        </div>

        <div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-neutral-400 block mb-4">
            LOCATIONS
          </span>
          <ul className="space-y-2.5 text-neutral-400">
            <li>London // New Bond Street</li>
            <li>New York // 5th Avenue</li>
            <li>Dubai // Mall of the Emirates</li>
            <li>Tokyo // Ginza</li>
          </ul>
        </div>

        <div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-neutral-400 block mb-4">
            NEWSLETTER
          </span>
          <p className="text-neutral-400 mb-3 text-[11px] leading-relaxed">
            Subscribe to receive updates on new Apple releases, special offers, and restocks.
          </p>
          <div className="flex bg-neutral-900 rounded-full p-1 border border-neutral-800 focus-within:border-neutral-600">
            <input
              type="email"
              placeholder="Email address"
              className="bg-transparent px-4 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none flex-1"
            />
            <button className="bg-white text-black px-4 py-1.5 rounded-full text-xs font-semibold hover:bg-neutral-200 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Colophon */}
      <div className="max-w-[1520px] mx-auto px-6 md:px-12 py-8 border-t border-neutral-900 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-neutral-500">
        <div className="flex items-center gap-4">
          <CosmoLogo size="sm" showSubtitle={false} inverted={true} />
          <span className="text-neutral-500 font-mono-data text-[10px] tracking-wider">
            © 2026 COSMO. ALL RIGHTS RESERVED. OFFICIAL APPLE RESELLER.
          </span>
        </div>
        <div className="flex gap-6 font-mono-data text-[10px] uppercase tracking-wider">
          <span className="hover:text-neutral-300 cursor-pointer transition-colors">Privacy Policy</span>
          <span className="hover:text-neutral-300 cursor-pointer transition-colors">Terms of Sale</span>
          <span className="hover:text-neutral-300 cursor-pointer transition-colors">Warranty & Returns</span>
        </div>
      </div>
    </footer>
  );
}
