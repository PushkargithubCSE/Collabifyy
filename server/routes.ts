import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertWaitlistSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
    // Waitlist endpoints
    app.post("/api/waitlist", async (req, res) => {
        if (!req.isAuthenticated()) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        try {
            const user = req.user as any;
            const data = insertWaitlistSchema.parse({
                ...req.body,
                userId: user.id,
            });

            const existing = await storage.getWaitlistEntryByEmail(data.email);
            if (existing) {
                return res.status(409).json({ message: "Email already exists on waitlist" });
            }

            const entry = await storage.createWaitlistEntry(data);
            res.status(201).json(entry);
        } catch (error) {
            if (error instanceof z.ZodError) {
                return res.status(400).json({ message: "Invalid input", errors: error.errors });
            }
            res.status(500).json({ message: "Internal server error" });
        }
    });

    app.get("/api/waitlist/user", async (req, res) => {
        if (!req.isAuthenticated()) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        // Assuming auth middleware populates req.user.id
        // This part depends on how auth is set up, typically req.user would be User object
        const userId = (req.user as any).id;
        const entry = await storage.getWaitlistEntryByUserId(userId);

        if (!entry) {
            return res.status(404).json({ message: "User not found on waitlist" });
        }

        res.json(entry);
    });

    app.get("/api/user/:id/stats", async (req, res) => {
        // Mock stats for now as requested in HomePage
        res.json({ followers: 0, collabs: 0 });
    });

    app.get("/api/login", (req, res) => {
        const type = req.query.type || "creator";
        const FRONTEND_URL =
          process.env.FRONTEND_URL || "https://collabifyy-connect.vercel.app";
      
        res.redirect(`${FRONTEND_URL}/waitlist?type=${type}`);
      });

    const httpServer = createServer(app);
    return httpServer }; 
