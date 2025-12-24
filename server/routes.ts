import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertWaitlistSchema } from "@shared/schema";
import { z } from "zod";
import { sendWaitlistEmail } from "./email";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup Passport + Sessions + Google OAuth
  await setupAuth(app);

  // -------------------------------
  //  AUTH USER INFO
  // -------------------------------
  app.get("/api/auth/user", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id; // <-- Google OAuth puts ID here
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // -------------------------------
  //  WAITLIST CREATE
  // -------------------------------
  app.post("/api/waitlist", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id; // <-- updated for Google OAuth

      // Validate the request body using Zod
      const validatedData = insertWaitlistSchema.parse({
        ...req.body,
        userId,
      });

      const waitlistEntry = await storage.createWaitlistEntry(validatedData);

      // Sending waitlist acknowledgement mail
      console.log("Attempting to send emil to: ", waitlistEntry.email);
      sendWaitlistEmail({
        email: waitlistEntry.email,
        name: waitlistEntry.name,
        userType: waitlistEntry.userType,
      }).catch((err) => {
        console.error("Failed to send waitlist email:", err);
      });

      res.status(201).json(waitlistEntry);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: "Validation error",
          errors: error.errors,
        });
      }
      console.error("Waitlist POST error:", error);
      res.status(500).json({ message: "Failed to create waitlist entry" });
    }
  });

  // -------------------------------
  //  WAITLIST GET ALL
  // -------------------------------
  app.get("/api/waitlist", isAuthenticated, async (req, res) => {
    try {
      const entries = await storage.getWaitlistEntries();
      res.json(entries);
    } catch (error) {
      console.error("Error fetching waitlist:", error);
      res.status(500).json({ message: "Failed to fetch waitlist" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
