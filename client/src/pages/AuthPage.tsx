import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function AuthPage() {
  const [, setLocation] = useLocation();
  const [userType, setUserType] = useState<"creator" | "brand" | null>(null);

  // ✅ read user type from query
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const type = params.get("type") as "creator" | "brand" | null;
    setUserType(type);
  }, []);

  // ✅ OAuth MUST be full page redirect
  const handleGoogleSignIn = () => {
    const backend =
      import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

    const params = userType ? `?type=${userType}` : "";

    // 🔥 THIS IS THE MOST IMPORTANT LINE
    window.location.href = `${backend}/api/login${params}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <Card className="bg-card/80 backdrop-blur shadow-2xl">
          <CardHeader className="text-center space-y-4">
            <Badge variant="outline" className="mx-auto">
              Welcome
            </Badge>

            <h1 className="text-4xl font-bold">
              Join <span className="text-primary">Collabifyy</span>
            </h1>

            <p className="text-muted-foreground">
              {userType === "creator"
                ? "Join as a creator"
                : userType === "brand"
                ? "Join as a brand"
                : "Sign in to continue"}
            </p>
          </CardHeader>

          <CardContent className="space-y-4">
            <Button
              className="w-full h-12"
              variant="outline"
              onClick={handleGoogleSignIn}
            >
              Continue with Google
            </Button>

            <Button
              variant="ghost"
              className="w-full"
              onClick={() => setLocation("/")}
            >
              Back to Home
            </Button>
          </CardContent>

          <CardFooter className="text-xs text-center text-muted-foreground">
            By continuing, you agree to our Terms & Privacy Policy
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
