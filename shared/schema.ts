import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const walletVerifications = pgTable("wallet_verifications", {
  id: serial("id").primaryKey(),
  walletAddress: text("wallet_address").notNull(),
  walletType: text("wallet_type").notNull(),
  signature: text("signature").notNull(),
  message: text("message").notNull(),
  verified: boolean("verified").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertWalletVerificationSchema = createInsertSchema(walletVerifications).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertWalletVerification = z.infer<typeof insertWalletVerificationSchema>;
export type WalletVerification = typeof walletVerifications.$inferSelect;
