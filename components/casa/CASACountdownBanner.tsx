import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function CASACountdownBanner() {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeRemaining = () => {
      // EU AI Act full compliance deadline: August 2, 2026
      const targetDate = new Date('2026-08-02T00:00:00Z').getTime();
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);

        setTimeRemaining({ days, hours, minutes, seconds });
      }
    };

    calculateTimeRemaining();
    const interval = setInterval(calculateTimeRemaining, 1000);

    return () => clearInterval(interval);
  }, []);

  const CountdownUnit = ({ value, label }: { value: number; label: string }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center"
    >
      <div className="bg-emerald-600 text-white rounded-lg px-4 py-3 min-w-20 text-center">
        <div className="text-3xl md:text-4xl font-bold font-mono">
          {String(value).padStart(2, '0')}
        </div>
      </div>
      <div className="text-sm font-semibold text-gray-700 mt-2 uppercase tracking-wide">
        {label}
      </div>
    </motion.div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="text-center mb-12 px-4"
    >
      {/* Red Title */}
      <motion.h2
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-4xl md:text-5xl font-black text-red-600 mb-8 leading-tight tracking-tight"
      >
        WE NEED 250,000 CASA TRAINED WORKERS WITHIN!
      </motion.h2>

      {/* Countdown Timer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="flex justify-center gap-4 md:gap-6 mb-8 flex-wrap"
      >
        <CountdownUnit value={timeRemaining.days} label="Days" />
        <CountdownUnit value={timeRemaining.hours} label="Hours" />
        <CountdownUnit value={timeRemaining.minutes} label="Minutes" />
        <CountdownUnit value={timeRemaining.seconds} label="Seconds" />
      </motion.div>

      {/* Subtext */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto font-semibold"
      >
        Join the global movement to train certified AI safety analysts before the August 2, 2026 EU AI Act compliance deadline
      </motion.p>

      {/* CTA Button */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        className="mt-8"
      >
        <a
          href="/signup-casa"
          className="inline-block bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          Start Your FREE CASA Training Now
        </a>
      </motion.div>
    </motion.div>
  );
}
