import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Users, Clock, Award, Zap } from 'lucide-react';

export default function CASAHeroSection() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      // August 2, 2026 - EU AI Act Full Compliance Deadline
      const targetDate = new Date('2026-08-02').getTime();
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-emerald-600 via-emerald-700 to-slate-900 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-20 right-20 w-72 h-72 bg-emerald-400/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-20 left-20 w-96 h-96 bg-emerald-300/10 rounded-full blur-3xl"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2"
            >
              <Zap className="w-4 h-4 text-emerald-300" />
              <span className="text-sm font-semibold text-white">EU AI Act Compliance Required</span>
            </motion.div>

            {/* Main Headline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-4"
            >
              <h1 className="text-5xl lg:text-6xl font-bold text-white leading-tight">
                Become a CASA
                <br />
                <span className="text-emerald-300">Certified Augmented Safety Analyst</span>
              </h1>
              <p className="text-xl text-emerald-100 max-w-xl">
                Join 250,000 AI safety professionals trained to meet the EU AI Act compliance deadline. Get certified in 7 weeks with our comprehensive, free MOOK training program.
              </p>
            </motion.div>

            {/* Key Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-3 gap-4"
            >
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4">
                <div className="text-2xl font-bold text-emerald-300">7</div>
                <div className="text-sm text-emerald-100">Weeks to Certify</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4">
                <div className="text-2xl font-bold text-emerald-300">250K+</div>
                <div className="text-sm text-emerald-100">Target Analysts</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4">
                <div className="text-2xl font-bold text-emerald-300">100%</div>
                <div className="text-sm text-emerald-100">Free Training</div>
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button
                size="lg"
                className="bg-white text-emerald-700 hover:bg-emerald-50 font-bold text-lg px-8"
                onClick={() => window.location.href = '/signup'}
              >
                <Users className="w-5 h-5 mr-2" />
                Start Free Training
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10 font-bold text-lg px-8"
                onClick={() => window.location.href = '/about-casa'}
              >
                Learn More
              </Button>
            </motion.div>

            {/* Urgency Message */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="bg-emerald-500/20 border border-emerald-400/50 rounded-lg p-4"
            >
              <p className="text-sm text-emerald-100">
                <strong>⚠️ Critical Timeline:</strong> Organizations must have trained AI safety analysts by August 2, 2026 to comply with EU AI Act requirements. Start your certification today.
              </p>
            </motion.div>
          </motion.div>

          {/* Right Column - Countdown */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-8"
          >
            {/* Countdown Timer */}
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-12 shadow-2xl">
              <div className="text-center space-y-6">
                <h2 className="text-2xl font-bold text-white">Time Until Full Compliance</h2>
                <p className="text-emerald-100">EU AI Act Enforcement: August 2, 2026</p>

                {/* Countdown Numbers */}
                <div className="grid grid-cols-4 gap-4">
                  {[
                    { value: timeLeft.days, label: 'Days' },
                    { value: timeLeft.hours, label: 'Hours' },
                    { value: timeLeft.minutes, label: 'Minutes' },
                    { value: timeLeft.seconds, label: 'Seconds' }
                  ].map((item, idx) => (
                    <motion.div
                      key={item.label}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.3 + idx * 0.1 }}
                      className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg p-4 shadow-lg"
                    >
                      <div className="text-3xl font-bold text-white">
                        {String(item.value).padStart(2, '0')}
                      </div>
                      <div className="text-xs text-emerald-100 mt-2">{item.label}</div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Program Benefits */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-white">What You'll Get</h3>
              {[
                { icon: Award, text: 'CASA Certification recognized globally' },
                { icon: Users, text: 'Join a community of 250,000+ analysts' },
                { icon: Zap, text: 'Hands-on AI safety training' },
                { icon: Clock, text: 'Complete in 7 weeks, learn at your pace' }
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.text}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + idx * 0.1 }}
                    className="flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4"
                  >
                    <Icon className="w-5 h-5 text-emerald-300 flex-shrink-0" />
                    <span className="text-white">{item.text}</span>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Bottom CTA Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-20 bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 backdrop-blur-sm border border-emerald-400/30 rounded-xl p-8 text-center"
        >
          <h3 className="text-2xl font-bold text-white mb-4">
            Don't Wait - Start Your Certification Today
          </h3>
          <p className="text-emerald-100 mb-6 max-w-2xl mx-auto">
            The EU AI Act compliance deadline is approaching. Organizations worldwide are racing to train their teams. Be part of the 250,000 certified analysts shaping the future of AI safety.
          </p>
          <Button
            size="lg"
            className="bg-emerald-400 text-slate-900 hover:bg-emerald-300 font-bold text-lg px-10"
            onClick={() => window.location.href = '/signup'}
          >
            Enroll Now - Free Training
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
