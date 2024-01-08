import { CircleProgressBar } from '@/base/components/CircleProgress';
import { LineProgressBar } from '@/base/components/LineProgress';
import { UploadProgress } from '@/components/UploadProgress';
import { useState, useEffect } from 'react';

export default function ProgressBarExample() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prevProgress + 1;
      });
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);
  return (
    <>
      <h3>Progress Bar</h3>
      <LineProgressBar progress={progress} />
      <CircleProgressBar percentage={progress} circleWidth={48} />
      <UploadProgress progress={progress} />
    </>
  );
}
