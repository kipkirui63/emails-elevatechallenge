import { useState, useEffect } from "react";

interface CountdownTimerProps {
  compact?: boolean;
}

export default function CountdownTimer({ compact = false }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const targetDate = new Date('2025-09-13T17:00:00Z').getTime(); // 1 PM EST (5 PM UTC)

    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance > 0) {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, []);

  if (compact) {
    return (
      <span className="font-mono">
        {String(timeLeft.days).padStart(2, '0')} {String(timeLeft.hours).padStart(2, '0')} {String(timeLeft.minutes).padStart(2, '0')} {String(timeLeft.seconds).padStart(2, '0')}
      </span>
    );
  }

  return (
    <div className="flex justify-center space-x-6 text-2xl font-bold text-gray-900">
      <div className="text-center">
        <div>{String(timeLeft.days).padStart(2, '0')}</div>
        <div className="text-xs text-gray-500 uppercase">Days</div>
      </div>
      <div className="text-center">
        <div>{String(timeLeft.hours).padStart(2, '0')}</div>
        <div className="text-xs text-gray-500 uppercase">Hours</div>
      </div>
      <div className="text-center">
        <div>{String(timeLeft.minutes).padStart(2, '0')}</div>
        <div className="text-xs text-gray-500 uppercase">Mins</div>
      </div>
      <div className="text-center">
        <div>{String(timeLeft.seconds).padStart(2, '0')}</div>
        <div className="text-xs text-gray-500 uppercase">Secs</div>
      </div>
    </div>
  );
}
