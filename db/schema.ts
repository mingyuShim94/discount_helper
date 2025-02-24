import { pgTable, text, boolean, timestamp } from "drizzle-orm/pg-core";
import { StoreCategory } from "@/types/store";

export const stores = pgTable("stores", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").$type<StoreCategory>().notNull(),
  thumbnail: text("thumbnail").notNull(),
  description: text("description"),
  isFavorite: boolean("is_favorite").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type Store = typeof stores.$inferSelect;
export type NewStore = typeof stores.$inferInsert;
