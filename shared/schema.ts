import { sql } from "drizzle-orm";
import {
    index,
    jsonb,
    pgTable,
    text,
    timestamp,
    varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table - required for express-session
export const sessions = pgTable(
    "sessions",
    {
        sid: varchar("sid").primaryKey(),
        sess: jsonb("sess").notNull(),
        expire: timestamp("expire").notNull(),
    },
    (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table
export const users = pgTable("users", {
    // Google IDs are long strings, so we use text. 
    // We removed the default UUID generator because Google provides the ID.
    id: text("id").primaryKey(),
    email: text("email").unique(),
    firstName: text("first_name"),
    lastName: text("last_name"),
    profileImageUrl: text("profile_image_url"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

export const upsertUserSchema = createInsertSchema(users).pick({
    id: true,
    email: true,
    firstName: true,
    lastName: true,
    profileImageUrl: true,
});

export type UpsertUser = z.infer<typeof upsertUserSchema>;
export type User = typeof users.$inferSelect;

// Waitlist table for storing creator and brand signups
export const waitlist = pgTable("waitlist", {
    id: text("id").primaryKey().default(sql`gen_random_uuid()`),
    // Critical fix: userId must be text to match users.id, and notNull
    userId: text("user_id").notNull().references(() => users.id),
    userType: text("user_type").notNull(), // "creator" or "brand"
    name: text("name").notNull(),
    email: text("email").notNull(),
    companyOrHandle: text("company_or_handle"),
    message: text("message"),
    createdAt: timestamp("created_at").defaultNow(),
});

export const insertWaitlistSchema = createInsertSchema(waitlist).omit({
    id: true,
    createdAt: true,
});

export type InsertWaitlist = z.infer<typeof insertWaitlistSchema>;
export type Waitlist = typeof waitlist.$inferSelect;