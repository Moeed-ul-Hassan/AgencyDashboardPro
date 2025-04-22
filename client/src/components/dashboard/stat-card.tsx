import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: number;
  change: string;
  icon: string;
  iconColor: "primary" | "secondary" | "accent" | "error" | string;
  changeType: "positive" | "negative";
  suffix?: string;
}

export default function StatCard({ 
  title, 
  value, 
  change, 
  icon, 
  iconColor, 
  changeType,
  suffix = "" 
}: StatCardProps) {
  const valueRef = useRef<HTMLHeadingElement>(null);
  
  // GSAP animation for counter
  useEffect(() => {
    if (valueRef.current) {
      gsap.fromTo(
        valueRef.current,
        { textContent: 0 },
        {
          textContent: value,
          duration: 2,
          ease: "power2.out",
          snap: { textContent: 1 },
          onUpdate: function() {
            if (valueRef.current) {
              valueRef.current.textContent = Math.round(Number(this.targets()[0].textContent)) + suffix;
            }
          }
        }
      );
    }
  }, [value, suffix]);

  return (
    <Card className="stat-card">
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <h3 
              ref={valueRef} 
              className="text-2xl font-semibold font-poppins mt-1"
            >
              {value}{suffix}
            </h3>
            <p className={`text-xs flex items-center mt-1 ${
              changeType === "positive" ? "text-success" : "text-warning"
            }`}>
              {changeType === "positive" ? (
                <ArrowUpIcon className="h-3 w-3 mr-1" />
              ) : (
                <ArrowDownIcon className="h-3 w-3 mr-1" />
              )}
              <span>{change}</span>
            </p>
          </div>
          <div className={`w-12 h-12 bg-${iconColor}/10 flex items-center justify-center rounded-full`}>
            <i className={`ri-${icon}-line text-${iconColor} text-xl`}></i>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
