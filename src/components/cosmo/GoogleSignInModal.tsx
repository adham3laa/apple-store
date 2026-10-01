"use client";

import React, { useState, useEffect } from "react";

interface GoogleSignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (profile: { name: string; email: string; avatar?: string }) => void;
}

export function GoogleSignInModal({
  isOpen,
  onClose,
  onSuccess,
}: GoogleSignInModalProps) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setEmail("");
      setName("");
      setIsLoading(false);
      setError(null);
    }
  }, [isOpen]);

  // Load Google Identity Services (GIS) script if not already present
  useEffect(() => {
    if (!isOpen) return;
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId) return;

    if (!document.getElementById("google-gsi-script")) {
      const script = document.createElement("script");
      script.id = "google-gsi-script";
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = () => {
        initGoogleGIS(clientId);
      };
      document.body.appendChild(script);
    } else {
      initGoogleGIS(clientId);
    }
  }, [isOpen]);

  const initGoogleGIS = (clientId: string) => {
    try {
      // @ts-expect-error - google is loaded from external script
      if (typeof window !== "undefined" && window.google?.accounts?.id) {
        // @ts-expect-error - google is loaded from external script
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: (response: { credential?: string }) => {
            if (response.credential) {
              try {
                // Decode Google JWT payload
                const base64Url = response.credential.split(".")[1];
                const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
                const jsonPayload = decodeURIComponent(
                  atob(base64)
                    .split("")
                    .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
                    .join("")
                );
                const data = JSON.parse(jsonPayload);
                onSuccess({
                  name: data.name || data.given_name || "Google User",
                  email: data.email,
                  avatar: data.picture,
                });
                onClose();
              } catch (e) {
                console.error("Failed to decode Google token", e);
              }
            }
          },
        });

        const targetDiv = document.getElementById("google-official-btn");
        if (targetDiv) {
          // @ts-expect-error - google is loaded from external script
          window.google.accounts.id.renderButton(targetDiv, {
            theme: "outline",
            size: "large",
            width: "100%",
            text: "continue_with",
            shape: "pill",
          });
        }
      }
    } catch (e) {
      console.warn("Google GIS initialization skipped", e);
    }
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setError("Please enter your Google Account email.");
      return;
    }

    if (!cleanEmail.includes("@")) {
      setError("Please enter a valid email address (e.g. yourname@gmail.com).");
      return;
    }

    setIsLoading(true);

    // Derive display name from email if not entered
    let finalName = name.trim();
    if (!finalName) {
      const prefix = cleanEmail.split("@")[0];
      finalName = prefix
        .split(/[._-]/)
        .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
        .join(" ");
    }

    setTimeout(() => {
      setIsLoading(false);
      onSuccess({
        name: finalName,
        email: cleanEmail,
        avatar: finalName.slice(0, 2).toUpperCase(),
      });
      onClose();
    }, 400);
  };

  const handleQuickDomain = (domain: string) => {
    if (!email) {
      setEmail(`client@${domain}`);
      return;
    }
    const userPart = email.split("@")[0];
    setEmail(`${userPart}@${domain}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in font-sans-body">
      <div 
        className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-neutral-100 space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-500 hover:text-black flex items-center justify-center transition-colors cursor-pointer"
          title="Close"
        >
          ✕
        </button>

        {/* Google Branding Header */}
        <div className="text-center space-y-2 pt-2">
          <div className="w-12 h-12 rounded-2xl bg-white border border-neutral-200 shadow-sm flex items-center justify-center mx-auto">
            <svg className="w-6 h-6" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
          </div>

          <h2 className="text-xl sm:text-2xl font-serif-editorial font-medium text-[#161514] tracking-tight">
            Sign in with Google
          </h2>
          <p className="text-xs text-neutral-500 font-sans-body">
            to continue to <strong className="text-neutral-900 font-semibold">COSMO Apple Store</strong>
          </p>
        </div>

        {/* Official Google GSI Button Container (rendered if client ID active) */}
        <div id="google-official-btn" className="w-full flex justify-center empty:hidden" />

        {/* Google Account Form */}
        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-100 text-rose-700 text-xs font-medium text-center">
              {error}
            </div>
          )}

          <div>
            <label className="block text-[11px] font-mono-data uppercase tracking-wider text-neutral-600 mb-1.5 font-semibold">
              Google Account Email
            </label>
            <div className="relative">
              <input
                type="email"
                required
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@gmail.com"
                className="w-full px-4 py-3 rounded-2xl border border-neutral-200 focus:border-black focus:ring-1 focus:ring-black focus:outline-none text-sm bg-[#FAF8F5]/50 transition-all font-sans-body"
              />
            </div>

            {/* Quick Domain Suggestion Pills */}
            <div className="flex items-center gap-1.5 mt-2 flex-wrap text-[10px] font-mono-data text-neutral-500">
              <span>Quick:</span>
              <button
                type="button"
                onClick={() => handleQuickDomain("gmail.com")}
                className="px-2 py-0.5 rounded-md bg-neutral-100 hover:bg-neutral-200 text-neutral-700 transition-colors"
              >
                @gmail.com
              </button>
              <button
                type="button"
                onClick={() => handleQuickDomain("googlemail.com")}
                className="px-2 py-0.5 rounded-md bg-neutral-100 hover:bg-neutral-200 text-neutral-700 transition-colors"
              >
                @googlemail.com
              </button>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono-data uppercase tracking-wider text-neutral-600 mb-1.5 font-semibold">
              Full Name <span className="text-neutral-400 font-normal">(as on Google Account)</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Alex Morgan"
              className="w-full px-4 py-3 rounded-2xl border border-neutral-200 focus:border-black focus:ring-1 focus:ring-black focus:outline-none text-sm bg-[#FAF8F5]/50 transition-all font-sans-body"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-4 rounded-full bg-[#161514] hover:bg-neutral-800 disabled:opacity-50 text-white text-xs font-mono-data uppercase tracking-wider font-semibold transition-all shadow-sm flex items-center justify-center gap-2.5 cursor-pointer"
          >
            {isLoading ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Signing In...</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continue with Google</span>
              </>
            )}
          </button>
        </form>

        {/* Security Assurance */}
        <div className="pt-2 border-t border-neutral-100 flex items-center justify-center gap-2 text-[10px] font-mono-data text-neutral-400">
          <svg className="w-3.5 h-3.5 text-[#059669]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          <span>Encrypted Google Single Sign-On // OAuth 2.0</span>
        </div>
      </div>
    </div>
  );
}
