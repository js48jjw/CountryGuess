import React from "react";
import { Button } from "@/components/ui/button";

interface StartScreenProps {
  onStart: () => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => (
  <section className="flex flex-col items-center justify-center min-h-[60vh] gap-8">
    <p className="text-[2.5rem] sm:text-[3.5rem] text-gray-700 dark:text-gray-200 font-medium mb-2 animate-fade-in">
      게임을 시작하지~ 
    </p>
    <Button
      onClick={onStart}
      className="px-10 py-4 rounded-full bg-gradient-to-r from-emerald-400 to-green-500 dark:from-emerald-700 dark:to-green-700 text-white text-xl sm:text-2xl font-bold shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-emerald-300 dark:focus:ring-emerald-800 animate-bounce"
    >
      Start
    </Button>
  </section>
);

export default StartScreen; 