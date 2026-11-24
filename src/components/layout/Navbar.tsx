"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Search, Menu as MenuIcon, X, ArrowRight, Smartphone, MessageSquare } from "lucide-react";

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  const pathname = usePathname();
  const router = useRouter();
  const isHomepage = pathname === "/";

  // Handle scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close overlays on navigation
  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  // Handle Escape key to close overlays
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        setSearchOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Lock body scroll when any overlay is active
  useEffect(() => {
    if (menuOpen || searchOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen, searchOpen]);

  // Focus search input when search opens
  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [searchOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/safaris?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  const navLinks = [
    { label: "Safaris & Packages", href: "/safaris", description: "Bespoke guided expeditions across East Africa" },
    { label: "Destinations", href: "/destinations", description: "Tsavo, Amboseli, Maasai Mara & Swahili Coast" },
    { label: "Experiences", href: "/experiences", description: "Bush to beach, private cruisers & balloon flights" },
    { label: "Gallery", href: "/gallery", description: "Visual archives from the untamed wild" },
    { label: "Travel Journal", href: "/journal", description: "Field notes, migration timings & naturalist essays" },
    { label: "About", href: "/about", description: "Our Mombasa heritage, fellowship & guiding ethos" },
    { label: "Guest App", href: "/app", badge: "New", description: "Offline manifests, guide tracking & digital briefing" },
  ];

  const popularSearches = [
    { label: "Tsavo National Parks", href: "/destinations/tsavo-national-parks" },
    { label: "Amboseli & Kilimanjaro", href: "/destinations/amboseli-and-kilimanjaro" },
    { label: "Maasai Mara Conservancies", href: "/destinations/maasai-mara-conservancies" },
    { label: "Coastal & Great Savanna Odyssey", href: "/safaris/coastal-and-great-savanna-odyssey" },
    { label: "Bush to Beach Odyssey", href: "/experiences/bush-to-beach-odyssey" },
  ];

  const headerBgClass = isScrolled
    ? "bg-[#1C1614]/90 backdrop-blur-md border-b border-white/5 py-4 shadow-sm"
    : isHomepage
      ? "bg-transparent border-none py-6 sm:py-7"
      : "bg-[#1C1614]/95 backdrop-blur-md border-b border-white/5 py-4 sm:py-5";

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 ${headerBgClass}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Left: Official Company Website Logo */}
          <Link
            href="/"
            className="group flex items-center focus:outline-none focus-visible:ring-1 focus-visible:ring-terracotta py-1"
            aria-label="Amber Plains Safaris Homepage"
          >
            <Image
              src="/images/amber-plains-website-logo-transparent.png"
              alt="Amber Plains Safaris"
              width={160}
              height={90}
              priority
              className="h-9 sm:h-11 w-auto object-contain hover:opacity-95 transition-opacity drop-shadow-sm"
            />
          </Link>

          {/* Right Side Only: Plan your trip -> Search -> Menu */}
          <div className="flex items-center space-x-3 sm:space-x-6">
            {/* 1. Flat Terracotta Button "Plan your trip" */}
            <Link
              href="/contact"
              className="inline-flex items-center justify-center bg-terracotta hover:bg-terracotta-hover text-white text-xs sm:text-sm font-sans font-medium px-3.5 py-2 sm:px-5 sm:py-2.5 rounded-[3px] transition-colors shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta"
            >
              Plan your trip
            </Link>

            {/* 2. Search Icon with the Word "Search" */}
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-1.5 sm:gap-2 text-white/90 hover:text-white text-xs sm:text-sm font-sans font-normal transition-colors py-1.5 px-1 focus:outline-none focus-visible:ring-1 focus-visible:ring-white/40"
              aria-label="Open search dialog"
            >
              <Search className="w-4 h-4 text-white/90" />
              <span className="hidden xs:inline sm:inline">Search</span>
            </button>

            {/* 3. "Menu" with Hamburger Icon */}
            <button
              onClick={() => setMenuOpen(true)}
              className="flex items-center gap-1.5 sm:gap-2 text-white/90 hover:text-white text-xs sm:text-sm font-sans font-normal transition-colors py-1.5 px-1 focus:outline-none focus-visible:ring-1 focus-visible:ring-white/40"
              aria-label="Open navigation menu"
            >
              <span>Menu</span>
              <MenuIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white/90" />
            </button>
          </div>
        </div>
      </header>

      {/* FULL-SCREEN MENU OVERLAY */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-50 bg-[#1A1412]/98 backdrop-blur-2xl flex flex-col justify-between p-6 sm:p-12 text-white animate-fadeIn overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-label="Site Navigation"
        >
          {/* Top Bar inside Menu */}
          <div className="max-w-7xl mx-auto w-full flex items-center justify-between pb-8 border-b border-white/10">
            <Link
              href="/"
              onClick={() => setMenuOpen(false)}
              className="flex items-center focus:outline-none"
            >
              <Image
                src="/images/amber-plains-website-logo-transparent.png"
                alt="Amber Plains Safaris"
                width={150}
                height={85}
                className="h-8 sm:h-10 w-auto object-contain"
              />
            </Link>

            <button
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 text-white/80 hover:text-white text-xs sm:text-sm font-sans transition-colors p-2 focus:outline-none focus-visible:ring-1 focus-visible:ring-white/40"
              aria-label="Close menu"
            >
              <span>Close</span>
              <X className="w-5 h-5 text-white/90" />
            </button>
          </div>

          {/* Central Links Grid */}
          <div className="max-w-7xl mx-auto w-full my-auto py-10 sm:py-16 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
            {/* Primary Large Serif Navigation Links */}
            <nav className="lg:col-span-8 space-y-4 sm:space-y-6" aria-label="Main menu">
              {navLinks.map((link) => (
                <div key={link.href} className="group">
                  <Link
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="inline-flex items-center font-serif text-3xl sm:text-4xl md:text-5xl font-light text-white hover:text-terracotta transition-colors py-1"
                  >
                    <span>{link.label}</span>
                    {link.badge && (
                      <span className="ml-3 px-2 py-0.5 text-[10px] font-mono tracking-wider uppercase bg-terracotta/20 text-[#E5B5A2] border border-terracotta/30 rounded">
                        {link.badge}
                      </span>
                    )}
                  </Link>
                  <p className="hidden sm:block text-xs text-white/40 font-light mt-0.5 pl-0.5">
                    {link.description}
                  </p>
                </div>
              ))}
            </nav>

            {/* Quiet Context & Direct Actions Panel */}
            <div className="lg:col-span-4 space-y-8 pt-4 lg:pt-2 border-t lg:border-t-0 lg:border-l border-white/10 lg:pl-10">
              <div className="space-y-3">
                <span className="text-[11px] font-sans tracking-widest uppercase text-white/40">
                  Begin Your Expedition
                </span>
                <p className="text-xs sm:text-sm text-white/70 font-light leading-relaxed">
                  Tailor-made itineraries bridging Kenya’s Swahili coastline with Tsavo, Amboseli, and the Maasai Mara.
                </p>
                <div className="pt-2">
                  <Link
                    href="/contact"
                    onClick={() => setMenuOpen(false)}
                    className="inline-flex items-center justify-center w-full bg-terracotta hover:bg-terracotta-hover text-white text-sm font-sans font-medium px-5 py-3 rounded-[3px] transition-colors"
                  >
                    Plan your trip
                  </Link>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 space-y-3">
                <span className="text-[11px] font-sans tracking-widest uppercase text-white/40">
                  Safari Concierge
                </span>
                <div className="space-y-1.5 text-xs text-white/70 font-light">
                  <p>Mombasa Headquarters: Bamburi Beach Ridge</p>
                  <p>Direct: +254 700 123 456</p>
                  <p className="text-white/40">Hours: 07:00 – 21:00 EAT</p>
                </div>
                <div className="pt-1 flex items-center gap-3">
                  <Link
                    href="https://wa.me/254700123456"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-terracotta hover:text-white transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp Concierge</span>
                  </Link>
                  <span className="text-white/20">·</span>
                  <Link
                    href="/app"
                    onClick={() => setMenuOpen(false)}
                    className="inline-flex items-center gap-1.5 text-xs text-white/60 hover:text-white transition-colors"
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>Guest App</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar inside Menu */}
          <div className="max-w-7xl mx-auto w-full pt-6 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-white/40 gap-2">
            <span>© {new Date().getFullYear()} Amber Plains Travel Ltd · Mombasa, Kenya</span>
            <span>KATO Bonded · EcoTourism Kenya Certified</span>
          </div>
        </div>
      )}

      {/* SEARCH OVERLAY */}
      {searchOpen && (
        <div
          className="fixed inset-0 z-50 bg-[#1A1412]/98 backdrop-blur-2xl flex flex-col items-center justify-start pt-20 sm:pt-28 px-4 sm:px-8 text-white animate-fadeIn"
          role="dialog"
          aria-modal="true"
          aria-label="Search Amber Plains"
        >
          {/* Close Search Button */}
          <div className="w-full max-w-3xl flex justify-end mb-6">
            <button
              onClick={() => setSearchOpen(false)}
              className="flex items-center gap-2 text-white/70 hover:text-white text-xs sm:text-sm font-sans transition-colors p-2 focus:outline-none focus-visible:ring-1 focus-visible:ring-white/40"
              aria-label="Close search"
            >
              <span>Close</span>
              <X className="w-5 h-5 text-white/90" />
            </button>
          </div>

          {/* Search Input Box */}
          <div className="w-full max-w-3xl space-y-8">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search safaris, destinations, wildlife..."
                className="w-full bg-transparent border-b border-white/20 pb-4 pr-12 font-serif text-2xl sm:text-4xl text-white placeholder:text-white/30 focus:outline-none focus:border-terracotta transition-colors"
              />
              <button
                type="submit"
                className="absolute right-0 bottom-4 text-white/70 hover:text-terracotta transition-colors p-1"
                aria-label="Submit search"
              >
                <ArrowRight className="w-6 h-6" />
              </button>
            </form>

            {/* Curated Suggested Searches */}
            <div className="space-y-4">
              <span className="text-[11px] font-sans tracking-widest uppercase text-white/40">
                Popular Expeditions
              </span>
              <div className="flex flex-wrap gap-2.5">
                {popularSearches.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSearchOpen(false)}
                    className="inline-flex items-center text-xs sm:text-sm font-sans text-white/80 hover:text-white bg-white/5 hover:bg-white/10 px-3.5 py-1.5 rounded-[3px] border border-white/10 transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
