import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [textIndex, setTextIndex] = useState(0);

  const texts = [
    "[ HARISH SABARI OS v2.0.5 ]",
    "Initializing Neural Systems...",
    "Loading AI Interface...",
    "Synchronizing Digital Consciousness...",
    "System Ready."
  ];

  useEffect(() => {
    const duration = 1800;
    const interval = 40;
    const steps = duration / interval;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      setProgress(Math.min((currentStep / steps) * 100, 100));
      
      if (currentStep >= steps) {
        clearInterval(timer);
        setTimeout(onComplete, 350);
      }
    }, interval);

    const textTimer = setInterval(() => {
      setTextIndex((prev) => Math.min(prev + 1, texts.length - 1));
    }, 380);

    return () => {
      clearInterval(timer);
      clearInterval(textTimer);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        className="fixed inset-0 z-[100] bg-background flex flex-col items-center justify-center font-mono"
      >
        <div className="w-full max-w-md px-6">
          <motion.div 
            key={textIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-primary text-sm mb-4 h-6 glitch-text"
          >
            {texts[textIndex]}
          </motion.div>
          
          <div className="h-1 w-full bg-secondary rounded-full overflow-hidden relative">
            <motion.div
              className="absolute top-0 left-0 h-full bg-primary shadow-[0_0_10px_#00d4ff]"
              style={{ width: `${progress}%` }}
              layout
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <span>SYS.BOOT</span>
            <span>{Math.floor(progress)}%</span>
          </div>
        </div>
        
        <div className="absolute inset-0 pointer-events-none w-full h-full bg-[linear-gradient(rgba(0,212,255,0.05)_1px,transparent_1px)] bg-[size:100%_4px] opacity-20" />
        <div className="absolute inset-0 pointer-events-none animate-scanline bg-gradient-to-b from-transparent via-primary/10 to-transparent h-32" />
      </motion.div>
    </AnimatePresence>
  );
}
