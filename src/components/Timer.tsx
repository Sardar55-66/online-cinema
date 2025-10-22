'use client';

import { useEffect, useState } from 'react';

interface TimerProps {
  bookedAt: string;
  timeLimitSeconds: number;
  onExpired?: () => void;
}

export function Timer({ bookedAt, timeLimitSeconds, onExpired }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const limit = timeLimitSeconds || 180;

      if (limit <= 0) {
        return 0;
      }

      const bookedTime = new Date(bookedAt).getTime();
      const currentTime = new Date().getTime();
      const elapsedSeconds = Math.floor((currentTime - bookedTime) / 1000);
      const remainingSeconds = Math.max(0, limit - elapsedSeconds);

      return remainingSeconds;
    };

    const updateTimer = () => {
      const remaining = calculateTimeLeft();
      setTimeLeft(remaining);

      if (remaining === 0 && onExpired) {
        onExpired();
      }
    };

    // Обновляем сразу
    updateTimer();

    // Обновляем каждую секунду
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [bookedAt, timeLimitSeconds, onExpired]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const isExpired = timeLeft === 0;
  const isWarning = timeLeft <= 60 && timeLeft > 0; // Предупреждение за минуту до истечения

  return (
    <div
      className={`text-sm font-semibold ${isExpired ? 'text-red-500' : isWarning ? 'text-yellow-500' : 'text-green-500'}`}
    >
      {isExpired ? 'Время истекло' : `Осталось: ${formatTime(timeLeft)}`}
    </div>
  );
}
