import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Lock, Sparkles, Volume2 } from 'lucide-react';

interface IntroGateProps {
  herName: string;
  title?: string;
  subtitle?: string;
  buttonText: string;
  passcode?: string;
  onOpen: () => void;
  primaryColor?: string;
}

export const IntroGate: React.FC<IntroGateProps> = ({
  herName,
  title = "A Special Surprise For You",
  subtitle = "Turn on your volume, find a quiet spot, and step inside...",
  buttonText = "Tap to open",
  passcode,
  onOpen,
  primaryColor = "#e11d48",
}) => {
  const [inputCode, setInputCode] = useState('');
  const [errorMsg, setErrorMsg] = useState(false);
  const [isOpening, setIsOpening] = useState(false);

  const handleUnlock = () => {
    if (passcode && passcode.trim().length > 0) {
      if (inputCode.trim().toLowerCase() !== passcode.trim().toLowerCase()) {
        setErrorMsg(true);
        setTimeout(() => setErrorMsg(false), 2000);
        return;
      }
    }

    setIsOpening(true);
    setTimeout(() => {
      onOpen();
    }, 700);
  };

  return (
    <AnimatePresence>
      {!isOpening && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-6 bg-[#0b0b14] overflow-hidden select-none"
        >
          {/* Ambient Romantic Background Glows */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] rounded-full blur-[140px] opacity-25 pointer-events-none"
            style={{ backgroundColor: primaryColor }}
          />
          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full blur-[100px] bg-rose-600/15 pointer-events-none" />

          {/* Sealed Romantic Card Container */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative max-w-md w-full glass-panel-glow rounded-3xl p-8 sm:p-10 flex flex-col items-center text-center shadow-2xl border border-rose-500/30"
          >
            {/* Pulsing Wax Heart Seal Icon */}
            <div className="relative mb-6">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center shadow-lg shadow-rose-900/50 animate-heartbeat"
                style={{ backgroundColor: primaryColor }}
              >
                <Heart className="w-10 h-10 text-white fill-white" />
              </div>
              <div className="absolute -top-1 -right-1 text-amber-300 animate-spin" style={{ animationDuration: '8s' }}>
                <Sparkles className="w-5 h-5 fill-amber-300" />
              </div>
            </div>

            {/* Recipient name greeting */}
            <span className="text-xs uppercase tracking-widest text-rose-300 font-semibold mb-2">
              For {herName}
            </span>

            {/* Title & Subtitle */}
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white mb-3 leading-snug">
              {title}
            </h1>
            <p className="text-sm text-rose-200/80 mb-6 font-light leading-relaxed">
              {subtitle}
            </p>

            {/* Sound advisory note */}
            <div className="flex items-center gap-2 text-xs text-rose-300/70 mb-6 px-3 py-1.5 rounded-full bg-rose-950/40 border border-rose-500/20">
              <Volume2 className="w-3.5 h-3.5 text-rose-400" />
              <span>Music will play on open</span>
            </div>

            {/* Optional Passcode Protected Input */}
            {passcode && passcode.trim().length > 0 && (
              <div className="w-full mb-6">
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-rose-400" />
                  <input
                    type="password"
                    placeholder="Enter special date or passcode..."
                    value={inputCode}
                    onChange={(e) => setInputCode(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleUnlock()}
                    className={`w-full bg-black/40 border ${
                      errorMsg ? 'border-red-500' : 'border-rose-500/30'
                    } rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-rose-300/40 focus:outline-none focus:border-rose-400 transition-colors`}
                  />
                </div>
                {errorMsg && (
                  <p className="text-xs text-rose-400 mt-1.5 animate-bounce">
                    Incorrect code, try again!
                  </p>
                )}
              </div>
            )}

            {/* Open Surprise Button */}
            <button
              onClick={handleUnlock}
              className="w-full py-3.5 px-8 rounded-full text-white font-medium text-base shadow-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 group"
              style={{
                background: `linear-gradient(135deg, ${primaryColor}, #f43f5e)`,
                boxShadow: `0 0 25px ${primaryColor}66`,
              }}
            >
              <span>{buttonText}</span>
              <Heart className="w-4 h-4 fill-white group-hover:scale-110 transition-transform" />
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
