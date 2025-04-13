import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import CassetteTape from "@/components/CassetteTape";

const Index = () => {
  const containerRef = useRef(null);
  const [fadeOpacity, setFadeOpacity] = useState(1);

  const { scrollY } = useScroll();
  const translateY = useTransform(scrollY, [0, 200], [0, -150]); // 👈 Changed from -250 to -150
  const opacity = useTransform(scrollY, [0, 200], [1, 0]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = 200;
      const newOpacity = Math.max(1 - scrollY / maxScroll, 0);
      setFadeOpacity(newOpacity);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#1E1E2F] to-[#121218] overflow-x-hidden">
      <header className="container mx-auto py-6 px-4 flex justify-between items-center relative z-10">
        {/* Header content */}
      </header>

      <main
        className="flex-1 container mx-auto px-4 py-12 md:py-20 flex flex-col items-center relative z-10"
        ref={containerRef}
      >
        <div className="relative w-full flex flex-col items-center overflow-visible">
          {/* Hero Text */}
          <motion.div className="text-center mb-12 max-w-3xl" style={{ opacity }}>
            <h1 className="text-4xl md:text-6xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-gray-300">
              Sound Confident. Speak with Power.
            </h1>
            <p className="text-xl text-red-100 mb-8 max-w-2xl mx-auto">
              Get real-time analysis of your speech patterns and actionable feedback to improve your delivery and tone.
            </p>
            <div className="flex justify-center gap-4 mb-8">
              <span className="px-4 py-1 bg-red-800/30 text-red-200 border border-red-600/30 rounded-full text-sm">
                Voice Analysis
              </span>
              <span className="px-4 py-1 bg-gray-800/30 text-gray-200 border border-gray-700/30 rounded-full text-sm">
                Speech Coaching
              </span>
              <span className="px-4 py-1 bg-gray-800/30 text-gray-200 border border-gray-700/30 rounded-full text-sm">
                Instant Feedback
              </span>
            </div>
          </motion.div>

          {/* Cassette Recorder */}
          <motion.div
            className="w-full px-4 z-20"
            style={{ translateY }}
          >
            <CassetteTape vizColor={"dark"}  />
          </motion.div>
        </div>

        {/* CTA */}
        <p className="mt-32 text-center text-red-200 bg-slate-800/50 px-6 py-3 rounded-full backdrop-blur-sm shadow-inner max-w-lg mx-auto border border-red-500/20">
          Record your voice and get instant feedback on your confidence level.
        </p>
      </main>
    </div>
  );
};

export default Index;
