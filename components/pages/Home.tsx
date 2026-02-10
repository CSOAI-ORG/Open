/*
 * CSOAI Landing Page - Strategic Partnership Announcement
 * Showcasing the alliance between CSOAI, Terranova, and CSGA
 * "The FAA for AI — Defense-Grade AI Safety Infrastructure"
 */

import { useState } from "react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { 
  ArrowRight,
  Shield,
  Globe,
  Users,
  Zap,
  CheckCircle,
  ExternalLink,
  Menu,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigationItems = [
    { label: "About", href: "/about" },
    { label: "Founding Council", href: "/council" },
    { label: "Partnership", href: "/partnership" },
    { label: "Frameworks", href: "/frameworks" },
    { label: "News", href: "/news" },
  ];

  const features = [
    {
      icon: Shield,
      title: "Defense-Grade Infrastructure",
      description: "$161M institutional scale with NATO-friendly operations across 21 countries"
    },
    {
      icon: Globe,
      title: "Global Governance Standards",
      description: "52-article Charter establishing enforceable, transparent AI safety standards"
    },
    {
      icon: Users,
      title: "Expert Council",
      description: "24 Founding Members from IEEE, Fortune 100, OWASP, and academia"
    },
    {
      icon: Zap,
      title: "Cognitive Operating System",
      description: "4MQ Protocol for advanced AI analysis and safety assessment"
    },
  ];

  const partners = [
    {
      name: "Terranova Aerospace and Defense Group",
      role: "The Armor",
      description: "Defense-grade infrastructure and security capabilities",
      link: "terranova-secdef.com"
    },
    {
      name: "Cyber Security Global Alliance (CSGA)",
      role: "The Global Reach",
      description: "Operations across 20+ countries and 6 continents",
      link: "csga-global.org"
    },
    {
      name: "4MQ Protocol",
      role: "The Brain",
      description: "Cognitive operating system for AI analysts",
      link: "4mq.org"
    },
  ];

  const councilMembers = [
    {
      name: "Dr. Richard Y Kim",
      title: "Architect of Financial Identity",
      credentials: ["Creator of 4MQ Protocol", "PhD Ethics Attorney (US Supreme Court cited)"],
    },
    {
      name: "Dr. Cari Miller",
      title: "Vice Chair, IEEE P3119",
      credentials: ["Board Chair, AI Procurement Lab", "100 Brilliant Women in AI Ethics"],
    },
    {
      name: "Stephen J. Tonna",
      title: "Head of Risk, Modeling & AI Governance",
      credentials: ["Training Bureau Director, CSOAI", "Harvard Medical School Research Fellow"],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-slate-900/95 backdrop-blur-sm border-b border-slate-700 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center font-bold text-sm">
                CSOAI
              </div>
              <span className="hidden sm:inline text-sm font-semibold">Council for AI Safety</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navigationItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => setLocation(item.href)}
                  className="text-sm text-slate-300 hover:text-white transition"
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center gap-4">
              {isAuthenticated ? (
                <Button
                  onClick={() => setLocation("/dashboard")}
                  className="bg-blue-500 hover:bg-blue-600"
                >
                  Dashboard
                </Button>
              ) : (
                <Button
                  onClick={() => setLocation('/login')}
                  className="bg-blue-500 hover:bg-blue-600"
                >
                  Sign In
                </Button>
              )}

              {/* Mobile Menu Toggle */}
              <button
                className="md:hidden p-2"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden pb-4 space-y-2">
              {navigationItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => {
                    setLocation(item.href);
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-700 rounded transition"
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* Strategic Alliance Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-16 bg-gradient-to-r from-blue-600 to-cyan-600 border-b-2 border-blue-400"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-lg">🏛️ STRATEGIC ALLIANCE ANNOUNCED</h3>
              <p className="text-sm text-blue-100">Terranova Aerospace and Defense Group + CSOAI + CSGA</p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setLocation("/partnership")}
              className="whitespace-nowrap"
            >
              Learn More <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              The FAA for AI
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                Defense-Grade Infrastructure
              </span>
            </h1>
            <p className="text-xl text-slate-300 mb-8">
              Establishing enforceable, transparent, and globally accessible standards for Artificial Intelligence safety, ethics, and governance.
            </p>
            <div className="flex gap-4">
              <Button
                size="lg"
                className="bg-blue-500 hover:bg-blue-600"
                onClick={() => setLocation("/about")}
              >
                Explore CSOAI <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-slate-400 text-white hover:bg-slate-700"
                onClick={() => setLocation('/signup')}
              >
                Get Started
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="relative"
          >
            <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl p-8 border border-blue-400/30">
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-slate-800/50 rounded-lg">
                  <Shield className="h-6 w-6 text-blue-400" />
                  <div>
                    <p className="font-semibold">$161M Institutional Scale</p>
                    <p className="text-sm text-slate-400">Defense-grade infrastructure</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-slate-800/50 rounded-lg">
                  <Globe className="h-6 w-6 text-cyan-400" />
                  <div>
                    <p className="font-semibold">21 NATO-Friendly Countries</p>
                    <p className="text-sm text-slate-400">Global operational reach</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-slate-800/50 rounded-lg">
                  <Users className="h-6 w-6 text-blue-400" />
                  <div>
                    <p className="font-semibold">24 Founding Council Members</p>
                    <p className="text-sm text-slate-400">From IEEE, Fortune 100, OWASP</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-slate-800/50 border-y border-slate-700 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">The CSOAI Alliance</h2>
            <p className="text-xl text-slate-300">Four pillars of AI safety excellence</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-slate-700/50 border border-slate-600 rounded-xl p-6 hover:border-blue-400 transition"
                >
                  <Icon className="h-8 w-8 text-blue-400 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-slate-300">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Strategic Partners */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">Our Strategic Partners</h2>
          <p className="text-xl text-slate-300">Building the future of AI safety together</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {partners.map((partner, index) => (
            <motion.div
              key={partner.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-gradient-to-br from-slate-700 to-slate-800 border border-slate-600 rounded-xl p-8 hover:border-blue-400 transition"
            >
              <div className="mb-4 h-12 bg-slate-600 rounded-lg flex items-center justify-center">
                <span className="text-sm font-semibold text-slate-300">{partner.role}</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">{partner.name}</h3>
              <p className="text-slate-300 mb-6">{partner.description}</p>
              <a
                href={`https://${partner.link}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-blue-400 hover:text-blue-300 transition"
              >
                Visit <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Founding Council Preview */}
      <section className="bg-slate-800/50 border-y border-slate-700 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Founding Council Leaders</h2>
            <p className="text-xl text-slate-300">Visionary experts shaping AI safety</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {councilMembers.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-slate-700/50 border border-slate-600 rounded-xl p-6"
              >
                <h3 className="text-lg font-semibold mb-1">{member.name}</h3>
                <p className="text-blue-400 text-sm mb-4">{member.title}</p>
                <ul className="space-y-2">
                  {member.credentials.map((cred) => (
                    <li key={cred} className="flex items-start gap-2 text-sm text-slate-300">
                      <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                      {cred}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <Button
              onClick={() => setLocation("/council")}
              className="bg-blue-500 hover:bg-blue-600"
            >
              View Full Founding Council <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-12 text-center"
        >
          <h2 className="text-4xl font-bold mb-4">Join the AI Safety Revolution</h2>
          <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
            Be part of establishing the global standard for AI safety, ethics, and governance. From defense-grade infrastructure to expert certification, we're building the future together.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button
              size="lg"
              className="bg-white text-blue-600 hover:bg-slate-100"
              onClick={() => window.location.href = getLoginUrl()}
            >
              Get Started Now
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-blue-700"
              onClick={() => setLocation("/partnership")}
            >
              Learn About Partnership
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-700 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center font-bold text-xs">
                  CSOAI
                </div>
                <span className="font-semibold">Council for AI Safety</span>
              </div>
              <p className="text-sm text-slate-400">The FAA for AI — Defense-Grade Infrastructure</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Navigation</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                {navigationItems.map((item) => (
                  <li key={item.label}>
                    <button
                      onClick={() => setLocation(item.href)}
                      className="hover:text-white transition"
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Partners</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="https://terranova-secdef.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">Terranova</a></li>
                <li><a href="https://csga-global.org" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">CSGA</a></li>
                <li><a href="https://4mq.org" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">4MQ Protocol</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-700 pt-8 text-center text-sm text-slate-400">
            <p>&copy; 2026 Council for the Safety of Artificial Intelligence. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
