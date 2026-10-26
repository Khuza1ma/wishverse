import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, Calendar, Clock, Sparkles } from 'lucide-react';

interface DaysCounterSectionProps {
  togetherSince: string;
  label?: string;
  herName: string;
  primaryColor?: string;
}

export const DaysCounterSection: React.FC<DaysCounterSectionProps> = ({
  togetherSince,
  label = "Days of Loving You",
  herName,
  primaryColor = "#e11d48",
}) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTime = () => {
      const startDate = new Date(togetherSince).getTime();
      const now = new Date().getTime();
      const diff = Math.max(0, now - startDate);

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [togetherSince]);

  const units = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hours', value: timeLeft.hours },
    { label: 'Minutes', value: timeLeft.minutes },
    { label: 'Seconds', value: timeLeft.seconds },
  ];

  return (
    <section className="relative py-20 px-4 sm:px-6 max-w-5xl mx-auto text-center">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center mb-10"
      >
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-rose-400 font-semibold mb-2">
          <Calendar className="w-4 h-4" />
          <span>Our Journey Together</span>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white mb-3">
          {label}
        </h2>
        <p className="text-sm sm:text-base text-rose-200/80 max-w-lg mx-auto">
          Every single second since <span className="text-rose-300 font-medium">{togetherSince}</span> has been an absolute gift.
        </p>
      </motion.div>

      {/* Counter Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6 max-w-4xl mx-auto mb-10">
        {units.map((unit, index) => (
          <motion.div
            key={unit.label}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="glass-panel-glow rounded-3xl p-5 sm:p-6 flex flex-col items-center justify-center border border-rose-500/30 hover:border-rose-400 transition-colors shadow-xl"
          >
            <span
              className="text-4xl sm:text-5xl md:text-6xl font-serif font-extrabold text-glow tracking-tight mb-1"
              style={{ color: primaryColor }}
            >
              {unit.value.toLocaleString()}
            </span>
            <span className="text-xs sm:text-sm uppercase tracking-wider text-rose-200/70 font-medium">
              {unit.label}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Romantic takeaway badge */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="inline-flex items-center gap-2.5 px-6 py-2.5 rounded-full glass-panel border border-rose-500/20 text-rose-200 text-sm shadow-lg"
      >
        <Heart className="w-4 h-4 text-rose-500 fill-rose-500 animate-pulse" />
        <span>And I would choose you all over again, {herName}.</span>
      </motion.div>
    </section>
  );
};
