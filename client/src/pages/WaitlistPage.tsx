import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { CheckCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { motion } from "framer-motion";

export default function WaitlistPage() {
  const [, setLocation] = useLocation();
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [userType, setUserType] = useState<"creator" | "brand">("creator");
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    companyOrHandle: "",
    message: "",
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const type = params.get("type") as "creator" | "brand";
    if (type) setUserType(type);
  }, []);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to join the waitlist",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
    }
  }, [isAuthenticated, isLoading, toast]);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: `${user.firstName || ""} ${user.lastName || ""}`.trim() || "",
        email: user.email || "",
      }));
    }
  }, [user]);

  const mutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      return await apiRequest("POST","/api/waitlist",{
        userType,
        name: data.name,
        email: data.email,
        companyOrHandle: data.companyOrHandle,
        message: data.message,
      });
    },
    onSuccess: () => {
      setSubmitted(true);
    },
    onError: (error: Error) => {

      
      if (isUnauthorizedError(error)) {
        toast({
          title: "Session Expired",
          description: "Please sign in again",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
        {/* Background blobs */}
        <div className="pointer-events-none absolute -left-32 top-10 h-64 w-64 rounded-full bg-primary/25 blur-3xl" />
        <div className="pointer-events-none absolute right-10 bottom-20 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin relative z-10" />
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
        {/* Background blobs */}
        <div className="pointer-events-none absolute -left-32 top-10 h-64 w-64 rounded-full bg-primary/25 blur-3xl" />
        <div className="pointer-events-none absolute right-10 bottom-20 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-md text-center relative z-10"
        >
          <Card className="backdrop-blur-md bg-card/80 border border-white/10 shadow-2xl" data-testid="card-success">
            <CardContent className="pt-12 pb-12 space-y-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto"
              >
                <CheckCircle className="w-8 h-8 text-primary" />
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="text-2xl font-display font-bold text-foreground tracking-tight"
              >
                You're on the list!
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="text-muted-foreground"
              >
                Thanks for joining the waitlist. We'll be in touch soon with early access to Collabifyy.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <Button
                  onClick={() => setLocation("/home")}
                  className="transition-transform duration-200 hover:scale-105 btn-shine"
                  data-testid="button-back-home"
                >
                  Go to Home
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background blobs */}
      <div className="pointer-events-none absolute -left-32 top-10 h-64 w-64 rounded-full bg-primary/25 blur-3xl" />
      <div className="pointer-events-none absolute right-10 bottom-20 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-2xl relative z-10"
      >
        <Card className="backdrop-blur-md bg-card/80 border border-white/10 shadow-2xl" data-testid="card-waitlist">
          <CardHeader className="space-y-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <Badge 
                variant="outline" 
                className="relative text-sm overflow-hidden py-1.5 px-4 border-none rounded-full bg-transparent mb-2"
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
                  Early Access
                </div>
              </Badge>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-3xl lg:text-4xl font-display font-bold text-foreground tracking-tight"
            >
              <span className="inline-block">
                Join the{" "}
                <span className="bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
                  Waitlist
                </span>
              </span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-muted-foreground text-lg"
            >
              {userType === "creator"
                ? "Be among the first creators to experience Collabifyy"
                : "Get early access to our platform for brands"}
            </motion.p>
          </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="John Doe"
                  data-testid="input-name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="john@example.com"
                  data-testid="input-email"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="companyOrHandle">
                {userType === "brand" ? "Company Name" : "Social Media Handle"}
              </Label>
              <Input
                id="companyOrHandle"
                value={formData.companyOrHandle}
                onChange={(e) =>
                  setFormData({ ...formData, companyOrHandle: e.target.value })
                }
                placeholder={
                  userType === "brand" ? "Acme Inc." : "@yourhandle"
                }
                data-testid="input-company-handle"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Tell us about yourself</Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder={
                  userType === "brand"
                    ? "What types of campaigns are you interested in?"
                    : "What's your content niche and audience size?"
                }
                rows={4}
                data-testid="textarea-message"
              />
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="flex gap-4"
            >
              <Button 
                type="submit" 
                className="flex-1 transition-transform duration-200 hover:scale-105 btn-shine" 
                disabled={mutation.isPending}
                data-testid="button-submit-waitlist"
              >
                {mutation.isPending ? "Submitting..." : "Join Waitlist"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setLocation("/dashboard")}
                className="transition-transform duration-200 hover:scale-105"
                data-testid="button-back"
              >
                Back
              </Button>
            </motion.div>
          </form>
        </CardContent>
      </Card>
      </motion.div>
    </div>
  );
}