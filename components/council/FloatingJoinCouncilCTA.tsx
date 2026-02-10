/**
 * Floating Join the Council CTA Component
 * Appears after user scrolls down the page
 * Provides persistent call-to-action for council membership
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { Users, ArrowRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { cn } from "@/lib/utils";

interface FloatingJoinCouncilCTAProps {
  scrollThreshold?: number;
  className?: string;
}

export function FloatingJoinCouncilCTA({ 
  scrollThreshold = 400, 
  className 
}: FloatingJoinCouncilCTAProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  
  const { data: countData } = trpc.applications.getCount.useQuery();
  const analystCount = countData?.count || 312;

  useEffect(() => {
    // Check if user has dismissed the CTA in this session
    const dismissed = sessionStorage.getItem("council_cta_dismissed");
    if (dismissed) {
      setIsDismissed(true);
      return;
    }

    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsVisible(scrollY > scrollThreshold);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Check initial position

    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrollThreshold]);

  const handleDismiss = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDismissed(true);
    sessionStorage.setItem("council_cta_dismissed", "true");
  };

  if (isDismissed) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 100, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 100, scale: 0.8 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className={cn(
            "fixed bottom-6 right-6 z-50",
            className
          )}
        >
          <Link href="/watchdog-signup">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative group"
            >
              {/* Dismiss button */}
              <button
                onClick={handleDismiss}
                className="absolute -top-2 -right-2 z-10 w-6 h-6 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center text-white/80 hover:text-white transition-colors shadow-lg"
                aria-label="Dismiss"
              >
                <X className="h-3 w-3" />
              </button>

              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-emerald-500 rounded-2xl blur-lg opacity-60 group-hover:opacity-80 transition-opacity" />
              
              {/* Button content */}
              <div className="relative flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-purple-600 to-emerald-500 rounded-2xl text-white shadow-2xl">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                    <Users className="h-5 w-5" />
                  </div>
                  <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full animate-pulse border-2 border-purple-600" />
                </div>
                <div className="hidden sm:block pr-2">
                  <p className="font-bold text-sm">Join the Council</p>
                  <p className="text-xs text-white/80">{analystCount}+ analysts worldwide</p>
                </div>
                <ArrowRight className="h-5 w-5 hidden sm:block group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.div>
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default FloatingJoinCouncilCTA;
