import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, Handshake, Mail, Building2, MessageSquare } from "lucide-react";
import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import type { Waitlist } from "@shared/schema";

interface UserStats {
  followers: number;
  collabs: number;
}

export default function HomePage() {
  const [, setLocation] = useLocation();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();

  // Fetch waitlist data
  const { data: waitlistData, isLoading: waitlistLoading } = useQuery({
    queryKey: ["waitlist", "user"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/waitlist/user");
      return response as Waitlist;
    },
    enabled: isAuthenticated,
  });

  // Fetch user stats (followers & collabs)
  const { data: stats, isLoading: statsLoading } = useQuery<UserStats>({
    queryKey: ["user", "stats", user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error("User not found");
      const response = await apiRequest("GET", `/api/user/${user.id}/stats`);
      return response as UserStats;
    },
    enabled: !!user?.id && isAuthenticated,
  });

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to view your profile",
        variant: "destructive",
      });
      setTimeout(() => {
        setLocation("/auth");
      }, 500);
    }
  }, [isAuthenticated, authLoading, toast, setLocation]);

  if (authLoading || waitlistLoading || statsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
        <div className="pointer-events-none absolute -left-32 top-10 h-64 w-64 rounded-full bg-primary/25 blur-3xl" />
        <div className="pointer-events-none absolute right-10 bottom-20 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin relative z-10" />
      </div>
    );
  }

  if (!waitlistData) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
        <div className="pointer-events-none absolute -left-32 top-10 h-64 w-64 rounded-full bg-primary/25 blur-3xl" />
        <div className="pointer-events-none absolute right-10 bottom-20 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
        <Card className="backdrop-blur-md bg-card/80 border border-white/10 shadow-2xl max-w-md relative z-10">
          <CardContent className="pt-12 pb-12 text-center">
            <p className="text-muted-foreground">
              No profile found. Please join the waitlist first.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const initials = waitlistData.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="min-h-screen p-6 relative overflow-hidden">
      {/* Background blobs */}
      <div className="pointer-events-none absolute -left-32 top-10 h-64 w-64 rounded-full bg-primary/25 blur-3xl" />
      <div className="pointer-events-none absolute right-10 bottom-20 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />

      <div className="max-w-4xl mx-auto space-y-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-4"
        >
          <Badge
            variant="outline"
            className="relative text-sm overflow-hidden py-1.5 px-4 border-none rounded-full bg-transparent"
          >
            <div className="absolute inset-0 z-0">
              <div className="absolute inset-[-150%] animate-[spin_5s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_0deg,transparent_320deg,#1e40af_360deg)] dark:bg-[conic-gradient(from_0deg,transparent_0deg,transparent_280deg,#ffffff_360deg)] blur-md" />
            </div>
            <div className="absolute inset-[1.5px] rounded-full z-10 bg-white/95 dark:bg-slate-950/90 backdrop-blur-xl" />
            <div className="absolute inset-0 rounded-full border border-slate-200/50 dark:border-white/10 z-20 pointer-events-none" />
            <div className="relative z-30 flex items-center gap-2 font-bold tracking-tight text-slate-900 dark:text-white">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-800 dark:bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-600 dark:bg-slate-200"></span>
              </span>
              Your Profile
            </div>
          </Badge>
          <h1 className="text-4xl lg:text-5xl font-display font-bold text-foreground tracking-tight">
            Welcome back,{" "}
            <span className="bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
              {waitlistData.name.split(" ")[0]}
            </span>
          </h1>
        </motion.div>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <Card className="backdrop-blur-md bg-card/80 border border-white/10 shadow-2xl">
            <CardHeader className="space-y-6">
              <div className="flex items-center gap-6">
                <Avatar className="w-24 h-24 border-4 border-primary/20">
                  <AvatarImage src={user?.profileImageUrl} alt={waitlistData.name} />
                  <AvatarFallback className="text-2xl font-display bg-primary/10 text-primary">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h2 className="text-3xl font-display font-bold text-foreground mb-2">
                    {waitlistData.name}
                  </h2>
                  <Badge
                    variant={waitlistData.userType === "creator" ? "default" : "secondary"}
                    className="text-sm"
                  >
                    {waitlistData.userType === "creator" ? "Creator" : "Brand"}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Stats Grid - Dynamic data from API */}
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="backdrop-blur-md bg-card/60 border border-white/5">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Users className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Followers</p>
                        <p className="text-2xl font-display font-bold text-foreground">
                          {stats?.followers || 0}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="backdrop-blur-md bg-card/60 border border-white/5">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Handshake className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Collabs</p>
                        <p className="text-2xl font-display font-bold text-foreground">
                          {stats?.collabs || 0}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Details */}
              <div className="space-y-4 pt-4 border-t border-border">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="text-foreground">{waitlistData.email}</p>
                  </div>
                </div>

                {waitlistData.companyOrHandle && (
                  <div className="flex items-start gap-3">
                    {waitlistData.userType === "creator" ? (
                      <Users className="w-5 h-5 text-muted-foreground mt-0.5" />
                    ) : (
                      <Building2 className="w-5 h-5 text-muted-foreground mt-0.5" />
                    )}
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {waitlistData.userType === "creator" ? "Social Handle" : "Company"}
                      </p>
                      <p className="text-foreground">{waitlistData.companyOrHandle}</p>
                    </div>
                  </div>
                )}

                {waitlistData.message && (
                  <div className="flex items-start gap-3">
                    <MessageSquare className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">About</p>
                      <p className="text-foreground">{waitlistData.message}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

