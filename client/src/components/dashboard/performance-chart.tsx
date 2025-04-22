import { useEffect, useRef } from "react";
import { gsap } from "gsap";

interface PerformanceChartProps {
  team: string;
  percentage: number;
  index: number;
}

export default function PerformanceChart({ team, percentage, index }: PerformanceChartProps) {
  const circleRef = useRef<SVGCircleElement>(null);
  const textRef = useRef<SVGTextElement>(null);
  
  // Calculate circle properties
  const radius = 40;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;
  
  // Determine color based on index
  const getColor = () => {
    switch(index) {
      case 0: return "primary";
      case 1: return "secondary";
      case 2: return "accent";
      default: return "primary";
    }
  };
  const color = getColor();
  
  // GSAP animation for circle progress and percentage text
  useEffect(() => {
    if (circleRef.current && textRef.current) {
      // Set initial state - full circle
      gsap.set(circleRef.current, {
        strokeDasharray: circumference,
        strokeDashoffset: circumference
      });
      
      gsap.set(textRef.current, {
        textContent: "0%"
      });
      
      // Animate the progress circle and percentage text
      gsap.to(circleRef.current, {
        strokeDashoffset: offset,
        duration: 1.5,
        delay: 0.2 * index,
        ease: "power3.out"
      });
      
      gsap.to(textRef.current, {
        textContent: `${percentage}%`,
        duration: 1.5,
        delay: 0.2 * index,
        ease: "power3.out",
        snap: { textContent: 1 },
        onUpdate: function() {
          if (textRef.current) {
            const current = Math.round(Number(this.targets()[0].textContent.replace('%', '')));
            textRef.current.textContent = `${current}%`;
          }
        }
      });
    }
  }, [percentage, circumference, offset, index]);

  return (
    <div className="text-center">
      <svg className="w-24 h-24 mx-auto" viewBox="0 0 100 100">
        <circle 
          className="text-gray-200" 
          strokeWidth="8" 
          stroke="currentColor" 
          fill="transparent" 
          r={radius} 
          cx="50" 
          cy="50" 
        />
        <circle 
          ref={circleRef}
          className={`text-${color}`} 
          strokeWidth="8" 
          stroke="currentColor" 
          fill="transparent" 
          r={radius} 
          cx="50" 
          cy="50" 
          style={{
            transformOrigin: "center",
            transform: "rotate(-90deg)"
          }}
        />
        <text 
          ref={textRef}
          x="50" 
          y="50" 
          fontFamily="Inter" 
          fontSize="16" 
          fontWeight="600" 
          textAnchor="middle" 
          dominantBaseline="middle"
        >
          {percentage}%
        </text>
      </svg>
      <p className="text-sm font-medium mt-2">{team}</p>
    </div>
  );
}
