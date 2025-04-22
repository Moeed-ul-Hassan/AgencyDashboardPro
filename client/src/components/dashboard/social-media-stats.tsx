import { useEffect } from "react";
import { gsap } from "gsap";
import { SocialMediaStat } from "@shared/schema";
import { Button } from "@/components/ui/button";

interface SocialMediaStatsProps {
  stats: SocialMediaStat[];
}

export default function SocialMediaStats({ stats }: SocialMediaStatsProps) {
  // GSAP animations
  useEffect(() => {
    // Animate progress bars
    gsap.from(".social-progress-bar", {
      width: 0,
      duration: 1,
      stagger: 0.1,
      ease: "power2.inOut"
    });
  }, [stats]);

  // Social media platform icon and color mapping
  const getPlatformIcon = (platform: string): string => {
    switch (platform.toLowerCase()) {
      case "twitter": return "ri-twitter-fill text-blue-500";
      case "instagram": return "ri-instagram-fill text-red-500";
      case "facebook": return "ri-facebook-fill text-blue-600";
      case "linkedin": return "ri-linkedin-fill text-blue-700";
      default: return "ri-global-line text-gray-500";
    }
  };

  const getPlatformBgColor = (platform: string): string => {
    switch (platform.toLowerCase()) {
      case "twitter": return "bg-blue-100";
      case "instagram": return "bg-red-100";
      case "facebook": return "bg-blue-100";
      case "linkedin": return "bg-blue-100";
      default: return "bg-gray-100";
    }
  };

  const getProgressBarColor = (platform: string): string => {
    switch (platform.toLowerCase()) {
      case "twitter": return "bg-blue-500";
      case "instagram": return "bg-red-500";
      case "facebook": return "bg-blue-600";
      case "linkedin": return "bg-blue-700";
      default: return "bg-gray-500";
    }
  };

  return (
    <div className="space-y-4">
      {stats.map((platform) => (
        <div key={platform.id} className="platform-stat">
          <div className="flex items-center">
            <div className={`w-10 h-10 ${getPlatformBgColor(platform.platform)} rounded-lg flex items-center justify-center mr-4`}>
              <i className={`text-xl ${getPlatformIcon(platform.platform)}`}></i>
            </div>
            <div className="flex-1">
              <div className="flex justify-between">
                <span className="font-medium">{platform.platform}</span>
                <span className={`text-sm ${platform.growth.startsWith('+') ? 'text-success' : 'text-warning'}`}>
                  {platform.growth}
                </span>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>{platform.followers.toLocaleString()} followers</span>
                <span>{platform.engagement}% engagement</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                <div 
                  className={`social-progress-bar h-1.5 rounded-full ${getProgressBarColor(platform.platform)}`} 
                  style={{ width: `${platform.engagement}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      ))}
      
      <Button variant="link" className="mt-4 text-sm w-full">
        View Social Dashboard
      </Button>
    </div>
  );
}
