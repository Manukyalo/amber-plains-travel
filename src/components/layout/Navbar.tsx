"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Compass, Phone, MessageSquare, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/Button";

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const isHomepage = pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { label: "Safaris & Packages", href: "/safaris" },
    { label: "Destinations", href: "/destinations" },
    { label: "Experiences", href: "/experiences" },
    { label: "Gallery", href: "/gallery" },
    { label: "Travel Journal", href: "/journal" },
    { label: "About", href: "/about" },
    { label: "Guest App", href: "/app", badge: "New" },
  ];

  const headerBgClass = isScrolled
    ? "bg-safari-night/95 backdrop-blur-md border-b border-safari-border shadow-luxury py-4"
    : isHomepage
    ? "bg-gradient-to-b from-black/80 via-black/40 to-transparent py-6"
    : "bg-safari-night py-5 border-b border-safari-border";

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 ${headerBgClass}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Identity */}
          <Link
            href="/"
            className="group flex flex-col items-start focus:outline-none focus:ring-1 focus:ring-gold-400"
          >
            <span className="font-serif text-2xl sm:text-3xl text-white font-normal tracking-wide group-hover:text-gold-300 transition-colors">
              Amber Plains
            </span>
            <span className="text-[10px] uppercase tracking-widest text-gold-400/90 font-mono -mt-1">
              Travel · Mombasa
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-7">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-xs uppercase tracking-widest transition-colors font-medium relative py-1 ${
                    isActive
                      ? "text-gold-400 font-semibold"
                      : "text-safari-sand/80 hover:text-white"
                  }`}
                >
                  {link.label}
                  {link.badge && (
                    <span className="ml-1.5 px-1.5 py-0.5 text-[9px] font-mono tracking-normal bg-gold-400/20 text-gold-300 rounded border border-gold-400/40">
                      {link.badge}
                    </span>
                  )}
                  {isActive && (
                    <span className="absolute bottom-0 inset-x-0 h-0.5 bg-gold-400" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Area */}
          <div className="hidden sm:flex items-center space-x-4">
            <Link
              href="https://wa.me/254700123456"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Direct WhatsApp Safari Concierge"
              className="text-safari-sand/70 hover:text-gold-400 transition-colors p-2"
              title="Chat with Safari Concierge on WhatsApp"
            >
              <MessageSquare className="w-4 h-4" />
            </Link>

            <Button
              href="/contact"
              variant="primary"
              size="sm"
              className="shadow-sm"
            >
              Plan Your Trip
            </Button>
          </div>

          {/* Mobile Menu Hamburger */}
          <div className="flex sm:hidden items-center space-x-2">
            <Button href="/contact" variant="primary" size="sm" className="py-2 px-3 text-[10px]">
              Plan
            </Button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              className="text-white p-2 focus:outline-none focus:ring-2 focus:ring-gold-400"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex flex-col bg-safari-night text-white animate-fadeIn">
          <div className="flex items-center justify-between p-6 border-b border-safari-border">
            <div className="flex flex-col">
              <span className="font-serif text-2xl text-white">Amber Plains</span>
              <span className="text-[10px] uppercase tracking-widest text-gold-400 font-mono">
                Mombasa, Kenya
              </span>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close navigation"
              className="p-2 text-safari-sand hover:text-white"
            >
              <X className="w-7 h-7" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-8 space-y-6">
            <nav className="space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center justify-between py-2 text-lg font-serif tracking-wide border-b border-safari-border/40 text-safari-sand hover:text-gold-400 transition-colors"
                >
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="text-xs font-mono uppercase bg-gold-400/20 text-gold-300 px-2 py-0.5 rounded border border-gold-400/40">
                      {link.badge}
                    </span>
                  )}
                </Link>
              ))}
            </nav>

            <div className="pt-6 space-y-4 border-t border-safari-border">
              <Button href="/contact" variant="primary" size="lg" className="w-full">
                Plan Your Tailor-Made Safari
              </Button>

              <Link
                href="/app"
                className="flex items-center justify-center gap-2 w-full py-3 text-xs uppercase tracking-wider text-safari-sand border border-safari-border hover:border-gold-400 transition-colors"
              >
                <Smartphone className="w-4 h-4 text-gold-400" />
                Get the Guest Companion App
              </Link>
            </div>

            <div className="pt-4 text-xs text-safari-sand/60 space-y-2">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-gold-400" />
                <span>+254 700 123 456 (Mombasa Ops)</span>
              </div>
              <div className="flex items-center gap-2">
                <Compass className="w-3.5 h-3.5 text-gold-400" />
                <span>Bamburi Beach Ridge · Mombasa, Kenya</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
