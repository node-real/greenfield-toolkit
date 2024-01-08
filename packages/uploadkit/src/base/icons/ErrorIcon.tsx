import { SVGIconProps } from '@/types';
import { cssVar } from '../utils/css';

export const ErrorIcon = (props: SVGIconProps) => {
  const errorColor = cssVar('error');
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 17 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g id="icon_colored_error">
        <path
          id="Vector 141"
          d="M1.13937 13.0331L7.1704 2.97023C7.54617 2.34325 8.45383 2.34326 8.8296 2.97023L14.8606 13.0331C15.2475 13.6787 14.783 14.5 14.031 14.5H1.96897C1.21695 14.5 0.75246 13.6787 1.13937 13.0331Z"
          fill={errorColor}
        />
        <path
          id="Ellipse 201"
          d="M9 12.223C9 12.7753 8.55228 13.223 8 13.223C7.44772 13.223 7 12.7753 7 12.223C7 11.6707 7.44772 11.223 8 11.223C8.55228 11.223 9 11.6707 9 12.223Z"
          fill="white"
        />
        <path
          id="Rectangle 7982"
          d="M7.16767 6.1587C7.13769 5.65166 7.51868 5.22302 7.99935 5.22302C8.48001 5.22302 8.86101 5.65166 8.83103 6.1587L8.62757 9.59924C8.60684 9.94987 8.33174 10.223 7.99935 10.223C7.66696 10.223 7.39186 9.94987 7.37112 9.59924L7.16767 6.1587Z"
          fill="white"
        />
      </g>
    </svg>
  );
};
