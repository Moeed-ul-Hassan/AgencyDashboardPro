import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { gsap } from "gsap";
import { Loader2 } from "lucide-react";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import StatCard from "@/components/dashboard/stat-card";
import ProjectCard from "@/components/dashboard/project-card";
import PerformanceChart from "@/components/dashboard/performance-chart";
import SocialMediaStats from "@/components/dashboard/social-media-stats";
import RecentActivity from "@/components/dashboard/recent-activity";
import { Project } from "@shared/schema";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const overviewRef = useRef<HTMLDivElement>(null);
  const projectsRef = useRef<HTMLDivElement>(null);
  const activityRef = useRef<HTMLDivElement>(null);

  const { data: projects, isLoading: isLoadingProjects } = useQuery<Project[]>({
    queryKey: ['/api/projects'],
  });

  const { data: activities, isLoading: isLoadingActivities } = useQuery({
    queryKey: ['/api/activities'],
  });

  const { data: teamPerformance, isLoading: isLoadingTeamPerformance } = useQuery({
    queryKey: ['/api/team-performance'],
  });

  const { data: socialMediaStats, isLoading: isLoadingSocialMedia } = useQuery({
    queryKey: ['/api/social-media-stats'],
  });

  useEffect(() => {
    if (!isLoadingProjects && !isLoadingActivities) {
      // Animate stats cards
      gsap.from("#overview-section .stat-card", {
        y: 20,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "power3.out"
      });

      // Animate project cards
      gsap.from("#projects-section .project-card", {
        x: -20,
        opacity: 0,
        duration: 0.5,
        stagger: 0.15,
        ease: "back.out(1.7)",
        delay: 0.3
      });

      // Animate activity section
      gsap.from("#activity-section > div", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power2.out",
        delay: 0.5
      });
    }
  }, [isLoadingProjects, isLoadingActivities]);

  return (
    <div className="flex min-h-screen bg-gray-50 text-dark">
      <Sidebar />
      
      <main className="main-content w-full lg:w-[calc(100%-260px)]">
        <Header title="Dashboard" />
        
        <div className="px-6 py-6">
          {/* Overview Cards */}
          <section className="mb-8" id="overview-section" ref={overviewRef}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard 
                title="Total Projects"
                value={projects?.length || 0}
                change="12% from last month"
                icon="folder"
                iconColor="primary"
                changeType="positive"
              />
              
              <StatCard 
                title="Active Developers"
                value={15}
                change="3 new this week"
                icon="users"
                iconColor="secondary"
                changeType="positive"
              />
              
              <StatCard 
                title="Completed Tasks"
                value={243}
                change="8% increase"
                icon="check-check"
                iconColor="accent"
                changeType="positive"
              />
              
              <StatCard 
                title="Client Satisfaction"
                value={94}
                change="2% from last month"
                icon="heart"
                iconColor="error"
                changeType="negative"
                suffix="%"
              />
            </div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Projects Section */}
            <section className="lg:col-span-2" id="projects-section" ref={projectsRef}>
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold">Active Projects</h3>
                  <Button size="sm" className="flex items-center">
                    <i className="ri-add-line mr-1"></i> New Project
                  </Button>
                </div>
                
                {isLoadingProjects ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    {projects?.slice(0, 3).map((project) => (
                      <ProjectCard key={project.id} project={project} />
                    ))}
                    
                    <div className="mt-6 text-center">
                      <Button variant="link" className="text-primary font-medium mx-auto">
                        View All Projects <i className="ri-arrow-right-line ml-1"></i>
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* Right Column - Social Media and Recent Activity */}
            <section className="space-y-6" id="activity-section" ref={activityRef}>
              {/* Team Performance */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-5">Team Performance</h3>
                
                {isLoadingTeamPerformance ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : (
                  <div className="flex justify-between items-center space-x-4">
                    {teamPerformance?.map((team, index) => (
                      <PerformanceChart 
                        key={team.id}
                        team={team.team}
                        percentage={team.performance}
                        index={index}
                      />
                    ))}
                  </div>
                )}
              </div>
              
              {/* Social Media */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex justify-between items-center mb-5">
                  <h3 className="text-lg font-semibold">Social Media</h3>
                  <select className="text-sm bg-gray-100 px-2 py-1 rounded-md">
                    <option>Last 7 days</option>
                    <option>Last 30 days</option>
                    <option>Last 90 days</option>
                  </select>
                </div>
                
                {isLoadingSocialMedia ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : (
                  <SocialMediaStats stats={socialMediaStats || []} />
                )}
                
                <Button variant="link" className="mt-4 text-sm w-full">
                  View Social Dashboard
                </Button>
              </div>
              
              {/* Recent Activity */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-5">Recent Activity</h3>
                
                {isLoadingActivities ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : (
                  <RecentActivity activities={activities || []} />
                )}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
