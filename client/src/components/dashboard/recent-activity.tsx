import { useEffect } from "react";
import { gsap } from "gsap";
import { formatRelativeTime } from "@/lib/utils";
import { CheckIcon, UserPlusIcon, FolderPlusIcon } from "lucide-react";

interface Activity {
  id: number;
  title: string;
  description: string;
  type: string;
  timestamp: string;
  user?: {
    id: number;
    name: string;
    avatar?: string;
  } | null;
  project?: {
    id: number;
    title: string;
  } | null;
}

interface RecentActivityProps {
  activities: Activity[];
}

export default function RecentActivity({ activities }: RecentActivityProps) {
  // GSAP animations
  useEffect(() => {
    gsap.from(".activity-item", {
      y: 15,
      opacity: 0,
      duration: 0.5,
      stagger: 0.1,
      ease: "power2.out"
    });
  }, [activities]);

  // Get icon based on activity type
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "project_completed":
        return <CheckIcon className="text-green-500" />;
      case "user_assigned":
      case "user_joined":
        return <UserPlusIcon className="text-blue-500" />;
      case "project_created":
        return <FolderPlusIcon className="text-yellow-500" />;
      default:
        return <CheckIcon className="text-green-500" />;
    }
  };

  // Get background color based on activity type
  const getActivityBgColor = (type: string) => {
    switch (type) {
      case "project_completed":
        return "bg-green-100";
      case "user_assigned":
      case "user_joined":
        return "bg-blue-100";
      case "project_created":
        return "bg-yellow-100";
      default:
        return "bg-gray-100";
    }
  };

  return (
    <div className="space-y-4">
      {activities.map((activity, index) => (
        <div key={activity.id} className="activity-item flex">
          <div className="relative mr-4">
            <div className={`w-10 h-10 ${getActivityBgColor(activity.type)} rounded-full flex items-center justify-center`}>
              {getActivityIcon(activity.type)}
            </div>
            {index < activities.length - 1 && (
              <div className="absolute top-10 left-1/2 w-px h-full -ml-px bg-gray-200"></div>
            )}
          </div>
          
          <div className={index < activities.length - 1 ? "pb-4" : ""}>
            <p className="text-sm font-medium">{activity.title}</p>
            <p className="text-xs text-gray-500 mt-0.5">{activity.description}</p>
            <p className="text-xs text-gray-400 mt-1">{formatRelativeTime(activity.timestamp)}</p>
          </div>
        </div>
      ))}
      
      {activities.length === 0 && (
        <div className="text-center py-4">
          <p className="text-sm text-gray-500">No recent activities</p>
        </div>
      )}
    </div>
  );
}
