/**
 * Thank You Page for Contributors
 * Shows impact and encourages social sharing
 */

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Heart, Share2, Twitter, Linkedin, Facebook, Copy, Check, Sparkles, Users, BookOpen, Award, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Link, useSearch } from "wouter";
import DashboardLayout from "@/components/DashboardLayout";
import confetti from "canvas-confetti";

export default function ThankYou() {
  const searchParams = new URLSearchParams(window.location.search);
  const amount = searchParams.get("amount") || "0";
  const name = searchParams.get("name") || "Supporter";
  const [copied, setCopied] = useState(false);

  // Trigger confetti on page load
  useEffect(() => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  const shareUrl = "https://councilof.ai";
  const shareText = `I just contributed to CSOAI - helping make AI safety education accessible to everyone! Join me in supporting responsible AI governance. 🤖🛡️`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast.success("Link copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = (platform: string) => {
    const urls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`,
    };
    window.open(urls[platform], "_blank", "width=600,height=400");
  };

  // Impact statistics (these could be fetched from backend)
  const impactStats = [
    { icon: Users, label: "Community Members", value: "10,000+", color: "text-blue-500" },
    { icon: BookOpen, label: "Free Courses Provided", value: "5", color: "text-emerald-500" },
    { icon: Award, label: "Certifications Earned", value: "2,500+", color: "text-amber-500" },
  ];

  return (
    <DashboardLayout>
      <div className="min-h-screen p-6 md:p-12">
        <div className="max-w-3xl mx-auto">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-rose-500 to-pink-600 mb-6">
              <Heart className="w-10 h-10 text-white" fill="white" />
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">
              Thank You, {name}!
            </h1>
            
            <p className="text-xl text-muted-foreground mb-2">
              Your generous contribution of <span className="font-bold text-foreground">${amount}</span> makes a real difference.
            </p>
            
            <p className="text-muted-foreground">
              Together, we're making AI safety education accessible to everyone.
            </p>
          </motion.div>

          {/* Impact Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="mb-8 border-2 border-primary/20 bg-gradient-to-br from-background to-muted/30">
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  Your Impact
                </CardTitle>
                <CardDescription>
                  Here's how contributions like yours help the community
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {impactStats.map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                      className="text-center p-4 rounded-lg bg-background/50 border"
                    >
                      <stat.icon className={`w-8 h-8 mx-auto mb-2 ${stat.color}`} />
                      <p className="text-2xl font-bold">{stat.value}</p>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-6 p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800">
                  <p className="text-sm text-center text-emerald-700 dark:text-emerald-300">
                    <strong>100% of contributions</strong> go directly to maintaining free courses, 
                    developing new content, and supporting AI safety researchers.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Share Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="mb-8">
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2">
                  <Share2 className="w-5 h-5" />
                  Spread the Word
                </CardTitle>
                <CardDescription>
                  Help us reach more people by sharing your support
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap justify-center gap-3">
                  <Button
                    variant="outline"
                    className="gap-2 hover:bg-[#1DA1F2] hover:text-white hover:border-[#1DA1F2]"
                    onClick={() => handleShare("twitter")}
                  >
                    <Twitter className="w-4 h-4" />
                    Twitter
                  </Button>
                  <Button
                    variant="outline"
                    className="gap-2 hover:bg-[#0A66C2] hover:text-white hover:border-[#0A66C2]"
                    onClick={() => handleShare("linkedin")}
                  >
                    <Linkedin className="w-4 h-4" />
                    LinkedIn
                  </Button>
                  <Button
                    variant="outline"
                    className="gap-2 hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2]"
                    onClick={() => handleShare("facebook")}
                  >
                    <Facebook className="w-4 h-4" />
                    Facebook
                  </Button>
                  <Button
                    variant="outline"
                    className="gap-2"
                    onClick={handleCopyLink}
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copied ? "Copied!" : "Copy Link"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Next Steps */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-center"
          >
            <h3 className="text-lg font-semibold mb-4">What's Next?</h3>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/courses">
                <Button className="gap-2">
                  <BookOpen className="w-4 h-4" />
                  Explore Courses
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="outline" className="gap-2">
                  Go to Dashboard
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}
