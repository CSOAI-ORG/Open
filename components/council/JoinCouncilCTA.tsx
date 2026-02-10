/**
 * Join the Council CTA Component
 * Prominent call-to-action for joining the Byzantine Council as an analyst
 * Multiple variants for different placements throughout the site
 */

import { motion } from "framer-motion";
import { Link } from "wouter";
import {
  Users,
  ArrowRight,
  Shield,
  Award,
  Zap,
  Sparkles,
  CheckCircle2,
  Vote,
  Brain,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { cn } from "@/lib/utils";

interface JoinCouncilCTAProps {
  variant?: "hero" | "banner" | "sidebar" | "footer" | "inline" | "nav" | "floating";
  className?: string;
}

export function JoinCouncilCTA({ variant = "banner", className }: JoinCouncilCTAProps) {
  const { data: countData } = trpc.applications.getCount.useQuery();
  const analystCount = countData?.count || 312;

  // Floating scroll variant - appears after scrolling
  if (variant === "floating") {
    return (
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
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-emerald-500 rounded-full blur-lg opacity-60 group-hover:opacity-80 transition-opacity" />
            
            {/* Button */}
            <div className="relative flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-purple-600 to-emerald-500 rounded-full text-white shadow-2xl">
              <div className="relative">
                <Users className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full animate-ping" />
              </div>
              <div className="hidden sm:block">
                <p className="font-semibold text-sm">Join the Council</p>
                <p className="text-xs text-white/80">{analystCount}+ analysts</p>
              </div>
              <ArrowRight className="h-4 w-4 hidden sm:block" />
            </div>
          </motion.div>
        </Link>
      </motion.div>
    );
  }

  // Navigation button variant - for header/nav
  if (variant === "nav") {
    return (
      <Link href="/watchdog-signup">
        <Button 
          size="sm" 
          className="gap-2 bg-gradient-to-r from-purple-600 to-emerald-500 hover:from-purple-700 hover:to-emerald-600 text-white shadow-md"
        >
          <Users className="h-4 w-4" />
          Join the Council
        </Button>
      </Link>
    );
  }

  // Inline variant - compact for within content
  if (variant === "inline") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn("inline-flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-purple-500/10 to-emerald-500/10 border border-purple-500/20", className)}
      >
        <div className="p-2 rounded-full bg-purple-500/20">
          <Users className="h-4 w-4 text-purple-600" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium">Join {analystCount}+ analysts in the Byzantine Council</p>
        </div>
        <Link href="/watchdog-signup">
          <Button size="sm" variant="ghost" className="gap-1 text-purple-600 hover:text-purple-700">
            Join Now
            <ArrowRight className="h-3 w-3" />
          </Button>
        </Link>
      </motion.div>
    );
  }

  // Sidebar variant - vertical compact
  if (variant === "sidebar") {
    return (
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className={cn("p-4 rounded-xl bg-gradient-to-br from-purple-500/10 via-transparent to-emerald-500/10 border border-purple-500/20", className)}
      >
        <div className="flex items-center gap-2 mb-3">
          <div className="p-2 rounded-lg bg-purple-500/20">
            <Vote className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <p className="font-semibold text-sm">Join the Council</p>
            <p className="text-xs text-muted-foreground">{analystCount}+ analysts</p>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mb-3">
          Vote on AI safety decisions with the 33-Agent Byzantine Council
        </p>
        <Link href="/watchdog-signup">
          <Button size="sm" className="w-full gap-2 bg-gradient-to-r from-purple-600 to-emerald-500 hover:from-purple-700 hover:to-emerald-600">
            <Users className="h-3 w-3" />
            Apply Now
          </Button>
        </Link>
      </motion.div>
    );
  }

  // Footer variant - horizontal compact
  if (variant === "footer") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn("flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-purple-600/10 to-emerald-600/10 border border-purple-500/20", className)}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-white/80 dark:bg-gray-800/80">
            <Users className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <p className="font-semibold text-sm">Join the Byzantine Council</p>
            <p className="text-xs text-muted-foreground">Help govern AI safety decisions</p>
          </div>
        </div>
        <Link href="/watchdog-signup">
          <Button size="sm" className="gap-2 bg-gradient-to-r from-purple-600 to-emerald-500 hover:from-purple-700 hover:to-emerald-600">
            Join Now
            <ArrowRight className="h-3 w-3" />
          </Button>
        </Link>
      </motion.div>
    );
  }

  // Hero variant - large prominent CTA for hero sections
  if (variant === "hero") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={cn("relative overflow-hidden rounded-3xl", className)}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-violet-600 to-emerald-500" />
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10" />
        
        {/* Animated orbs */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-emerald-400/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        
        <div className="relative p-8 md:p-12 text-white">
          <div className="max-w-3xl mx-auto text-center">
            <Badge className="mb-6 bg-white/20 text-white border-white/30 backdrop-blur-sm">
              <Sparkles className="h-3 w-3 mr-1" />
              Now Accepting Applications
            </Badge>
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Join the Byzantine Council
            </h2>
            
            <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Be part of the world's first decentralized AI safety governance system. 
              Vote on critical decisions alongside {analystCount}+ certified analysts.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              {[
                { icon: Shield, text: "Protect AI Safety" },
                { icon: Vote, text: "Democratic Voting" },
                { icon: Award, text: "Get Certified" },
                { icon: Globe, text: "Global Impact" },
              ].map((item: any) => {
                const Icon = item.icon;
                return (
                  <div key={item.text} className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm">
                    <Icon className="h-4 w-4" />
                    <span className="text-sm font-medium">{item.text}</span>
                  </div>
                );
              })}
            </div>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/watchdog-signup">
                <Button 
                  size="lg" 
                  className="gap-2 bg-white text-purple-700 hover:bg-white/90 shadow-xl shadow-purple-900/30 px-8"
                >
                  <Users className="h-5 w-5" />
                  Apply to Join
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/byzantine-consensus">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="gap-2 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm"
                >
                  <Brain className="h-5 w-5" />
                  Learn How It Works
                </Button>
              </Link>
            </div>
            
            <p className="mt-6 text-sm text-white/70">
              Free training • Work from anywhere • Earn rewards for your expertise
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  // Default banner variant - horizontal prominent banner
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-600 via-violet-600 to-emerald-500 p-6 md:p-8 text-white",
        className
      )}
    >
      {/* Background effects */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-60 h-60 bg-emerald-300 rounded-full blur-3xl" />
      </div>

      <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-4 rounded-2xl bg-white/20 backdrop-blur-sm">
            <Users className="h-10 w-10" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-2xl font-bold">Join the Byzantine Council</h3>
              <Badge className="bg-white/20 text-white border-white/30">
                <Zap className="h-3 w-3 mr-1" />
                Hiring
              </Badge>
            </div>
            <p className="text-white/90 max-w-md">
              Vote on AI safety decisions with {analystCount}+ analysts worldwide. 
              Free training, flexible hours, and real impact.
            </p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <Link href="/watchdog-signup">
            <Button 
              size="lg" 
              className="gap-2 bg-white text-purple-700 hover:bg-white/90 shadow-lg"
            >
              <Users className="h-4 w-4" />
              Apply Now
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/agent-council">
            <Button 
              size="lg" 
              variant="outline" 
              className="gap-2 border-white/30 text-white hover:bg-white/10"
            >
              View Council
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export default JoinCouncilCTA;
