'use client';

import React, { useState, useEffect, useRef } from "react";
import TitleHeader from "../components/TitleHeader";
import StartScreen from "../components/StartScreen";
import GameResult from "../components/GameResult";
import FlagImage from "../components/FlagImage";
import { CountryRecord, isCorrectGuess, loadCountryData, pickRandom } from "../lib/countryData";

// step: 'ready' | 'admin' | 'play' | 'result'
export default function HomePage() {
  const [step, setStep] = useState<'ready' | 'play' | 'result'>('ready');
  const [countries, setCountries] = useState<CountryRecord[]>([]);
  const [targetCountry, setTargetCountry] = useState<CountryRecord | null>(null);
  const [guessValue, setGuessValue] = useState("");
  const [hintCount, setHintCount] = useState(0);
  const [showWrongPopup, setShowWrongPopup] = useState(false); // 오답 팝업
  const [showCorrectPopup, setShowCorrectPopup] = useState(false); // 정답 팝업
  const wrongPopupTimerRef = useRef<NodeJS.Timeout | null>(null); // 오답 팝업 타이머
  const correctPopupTimerRef = useRef<NodeJS.Timeout | null>(null); // 정답 팝업 타이머
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const wrongAudioRef = useRef<HTMLAudioElement | null>(null);
  const [usedHints, setUsedHints] = useState<string[]>([]);
  const [hintLimitError, setHintLimitError] = useState("");

  // 준비화면 → 게임 시작 (국기 랜덤)
  const handleStart = () => {
    // CSV가 아직 로드 전이면 로딩 후 시작
    if (countries.length === 0) {
      loadCountryData().then((data) => {
        setCountries(data);
        const chosen = pickRandom(data);
        setTargetCountry(chosen);
        setStep("play");
      }).catch(() => {
        // 실패 시에도 최소한 시작 가능하도록
        setStep("play");
      });
    } else {
      const chosen = pickRandom(countries);
      setTargetCountry(chosen);
      setStep("play");
    }
    setGuessValue("");
    setHintCount(0);
    setUsedHints([]);
  };

  // 사용자 입력 제출
  const handleGuess = () => {
    if (!targetCountry) return;
    if (guessValue.trim().length === 0) return;
    if (isCorrectGuess(guessValue.trim(), targetCountry)) {
      // 기존 타이머가 있다면 취소
      if (correctPopupTimerRef.current) {
        clearTimeout(correctPopupTimerRef.current);
      }
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
      setShowCorrectPopup(true);
      correctPopupTimerRef.current = setTimeout(() => setShowCorrectPopup(false), 3000);
      setStep("result");
    } else {
      // 기존 타이머가 있다면 취소
      if (wrongPopupTimerRef.current) {
        clearTimeout(wrongPopupTimerRef.current);
      }
      setShowWrongPopup(true);
      if (wrongAudioRef.current) {
        wrongAudioRef.current.currentTime = 0;
        wrongAudioRef.current.play();
      }
      wrongPopupTimerRef.current = setTimeout(() => setShowWrongPopup(false), 3000);
    }
    setGuessValue("");
  };

  // 정답공개
  const handleRevealAnswer = () => {
    if (!targetCountry) return;
    setStep("result");
  };

  // 다시하기
  const handleRestart = () => {
    // 새로운 랜덤 국기로 시작
    if (countries.length === 0) {
      loadCountryData().then((data) => {
        setCountries(data);
        const chosen = pickRandom(data);
        setTargetCountry(chosen);
        setStep("play");
      }).catch(() => {
        setTargetCountry(null);
        setStep("ready");
      });
    } else {
      const chosen = pickRandom(countries);
      setTargetCountry(chosen);
      setStep("play");
    }
    setGuessValue("");
    setHintCount(0);
    setUsedHints([]);
  };

  // 힌트 요청
  const handleHint = async () => {
    if (hintCount >= 2) {
      setHintLimitError("힌트는 2개가 최대입니다.");
      setTimeout(() => setHintLimitError(""), 2000);
      return;
    }
    if (!targetCountry) return;
    // Country 힌트 규칙:
    // 1회차: 수도명, 2회차: 대표, 이후엔 반복 노출
    const next = hintCount + 1;
    if (next === 1) {
      const cap = targetCountry.capital || "수도 정보 없음";
      setUsedHints(prev => [...prev, `수도명: ${cap}`]);
    } else if (next === 2) {
      const rep = targetCountry.representative || "대표 정보 없음";
      setUsedHints(prev => [...prev, `대표: ${rep}`]);
    } else {
      // 추가 요청 시 최근 힌트를 다시 보여줌
      const rep = targetCountry.representative || "대표 정보 없음";
      setUsedHints(prev => [...prev, `대표: ${rep}`]);
    }
    setHintCount(next);
  };

  // 초기 로드시 CSV 캐시 로드
  useEffect(() => {
    let cancelled = false;
    loadCountryData().then(data => {
      if (cancelled) return;
      setCountries(data);
    }).catch(() => {});
    return () => { cancelled = true; };
  }, []);

  // 결과 진입 시 자동 재생 제거: 정답 제출 시에만 재생

  // 컴포넌트 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (wrongPopupTimerRef.current) {
        clearTimeout(wrongPopupTimerRef.current);
      }
      if (correctPopupTimerRef.current) {
        clearTimeout(correctPopupTimerRef.current);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-green-50 to-teal-50 dark:from-emerald-900 dark:via-green-900 dark:to-emerald-950 transition-colors duration-500">
      <TitleHeader />
      <main className="flex flex-col items-center justify-center px-2 py-8">
        {step === "ready" && <StartScreen onStart={handleStart} />}
        {(step === "play" || step === "result") && targetCountry && (
          <div className="mb-6">
            <FlagImage iso2={targetCountry.iso2} />
          </div>
        )}
        {step === "play" && (
          <>
            <div className="mb-4 text-2xl font-bold text-center">나라를 맞춰주세요</div>
            <div className="flex gap-2 mb-4">
              <button
                type="button"
                onClick={handleHint}
                disabled={false}
                className="flex-1 py-4 rounded-lg bg-gradient-to-r from-emerald-400 to-green-500 dark:from-emerald-700 dark:to-green-700 text-white text-xl font-bold shadow hover:scale-105 active:scale-95 transition-all disabled:opacity-60"
                style={{ minWidth: 180, maxWidth: 320, width: '100%' }}
              >
                힌트
              </button>
              <button
                type="button"
                onClick={handleRevealAnswer}
                className="px-4 py-4 rounded-lg bg-gradient-to-r from-violet-300 to-purple-500 dark:from-violet-700 dark:to-purple-800 text-white text-sm font-bold shadow hover:scale-105 active:scale-95 transition-all disabled:opacity-60 ml-2"
              >정답공개</button>
            </div>
            <form
              className="flex flex-col items-center gap-4 w-full max-w-xs mx-auto py-8"
              onSubmit={e => {
                e.preventDefault();
                handleGuess();
              }}
            >
              <div className="flex gap-2">
                <input
                  type="text"
                  value={guessValue}
                  onChange={e => setGuessValue(e.target.value)}
                  className="w-56 px-4 py-2 rounded-lg border border-emerald-300 dark:border-emerald-600 bg-white dark:bg-gray-800 text-2xl text-center tracking-widest font-mono focus:outline-none focus:ring-2 focus:ring-emerald-400 dark:focus:ring-emerald-700 transition-all"
                  placeholder="국가명/영문"
                  autoFocus
                />
                <button
                  type="submit"
                  disabled={guessValue.length === 0}
                  className="px-6 py-2 rounded-full bg-gradient-to-r from-emerald-400 to-green-500 dark:from-emerald-700 dark:to-green-700 text-black font-bold shadow hover:scale-105 active:scale-95 transition-all disabled:opacity-60"
                >제출</button>
              </div>
            </form>
          </>
        )}
        {step === "result" && (
          <GameResult onRestart={handleRestart} answerAnimal={targetCountry ? targetCountry.koreanName : ''} />
        )}
        {/* 힌트 박스는 플레이/정답 화면 모두에서 한 번만 렌더링 */}
        {(step === "play" || step === "result") && usedHints.length > 0 && (
          <div className="my-0 w-[98vw] sm:w-[800px] flex flex-col gap-2">
            {usedHints.map((h, i) => (
              <div key={i} className="text-lg sm:text-xl text-yellow-600 dark:text-yellow-300 bg-yellow-50 dark:bg-gray-900 rounded px-3 py-2 shadow animate-fade-in w-fit min-w-full whitespace-nowrap">
                힌트 {i + 1}. {h}
              </div>
            ))}
          </div>
        )}
        {hintLimitError && (
          <div className="fixed top-1/3 left-1/2 -translate-x-1/2 bg-pink-500 text-white px-8 py-4 rounded-xl shadow-lg text-3xl font-bold z-50 animate-fade-in">
            {hintLimitError}
          </div>
        )}
        {showWrongPopup && (
          <div className="fixed top-1/3 left-1/2 -translate-x-1/2 bg-red-500 text-white px-8 py-4 rounded-xl shadow-lg text-3xl font-bold z-50 animate-fade-in">
            ❌ 오답입니다!
          </div>
        )}
        {showCorrectPopup && (
          <div className="fixed top-1/3 left-1/2 -translate-x-1/2 bg-green-500 text-white px-8 py-4 rounded-xl shadow-lg text-3xl font-bold z-50 animate-fade-in">
            ⭕ 정답입니다!
          </div>
        )}
        <audio ref={audioRef} src="/sound/Clap BGM.mp3" preload="auto" />
        <audio ref={wrongAudioRef} src="/sound/x BGM.mp3" preload="auto" />
      </main>
    </div>
  );
}
