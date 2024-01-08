import { cssVar } from '@/utils/css';

export const CircleProgressBar = ({
  percentage,
  circleWidth,
}: {
  percentage: number;
  circleWidth: number;
}) => {
  const strokeWidth = 4;
  const radius = circleWidth / 2 - strokeWidth;

  const dashArray = radius * Math.PI * 2;
  const dashOffset = dashArray - (dashArray * percentage) / 100;

  return (
    <div>
      <svg width={circleWidth} height={circleWidth} viewBox={`0 0 ${circleWidth} ${circleWidth}`}>
        <circle
          cx={circleWidth / 2}
          cy={circleWidth / 2}
          strokeWidth={4}
          r={radius}
          className="circle-background"
          fill="none"
          stroke="#ddd"
        />

        <circle
          cx={circleWidth / 2}
          cy={circleWidth / 2}
          strokeWidth={4}
          r={radius}
          className="circle-progress"
          fill="none"
          stroke={cssVar('error')}
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            strokeDasharray: dashArray,
            strokeDashoffset: dashOffset,
          }}
          transform={`rotate(-90 ${circleWidth / 2} ${circleWidth / 2})`}
        />
      </svg>
    </div>
  );
};
