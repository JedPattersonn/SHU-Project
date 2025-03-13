import {
  mysqlTable,
  varchar,
  text,
  timestamp,
  float,
  boolean,
  int
} from "drizzle-orm/mysql-core";

export const user = mysqlTable("user", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: text("name").notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  emailVerified: boolean("email_verified").notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  twoFactorEnabled: boolean("two_factor_enabled"),
  role: text("role"),
  banned: boolean("banned"),
  banReason: text("ban_reason"),
  banExpires: timestamp("ban_expires"),
});

export const session = mysqlTable("session", {
  id: varchar("id", { length: 36 }).primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: varchar("token", { length: 255 }).notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: varchar("user_id", { length: 36 })
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  impersonatedBy: text("impersonated_by"),
});

export const account = mysqlTable("account", {
  id: varchar("id", { length: 36 }).primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: varchar("user_id", { length: 36 })
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const verification = mysqlTable("verification", {
  id: varchar("id", { length: 36 }).primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});

export const twoFactor = mysqlTable("two_factor", {
  id: varchar("id", { length: 36 }).primaryKey(),
  secret: text("secret").notNull(),
  backupCodes: text("backup_codes").notNull(),
  userId: varchar("user_id", { length: 36 })
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const city = mysqlTable("city", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const networkManager = mysqlTable("network_manager", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const energyData = mysqlTable("energy_data", {
  id: varchar("id", { length: 36 }).primaryKey(),
  cityId: varchar("city_id", { length: 36 })
    .notNull()
    .references(() => city.id, { onDelete: "cascade" }),
  networkManagerId: varchar("network_manager_id", { length: 36 })
    .notNull()
    .references(() => networkManager.id, { onDelete: "cascade" }),
  purchaseArea: text("purchase_area").notNull(),
  street: text("street").notNull(),
  zipCodeFrom: varchar("zip_code_from", { length: 6 }).notNull(),
  zipCodeTo: varchar("zip_code_to", { length: 6 }).notNull(),
  numConnections: float("num_connections").notNull(),
  deliveryPerc: float("delivery_perc").notNull(),
  percOfActiveConnections: float("perc_of_active_connections").notNull(),
  typeOfConnection: text("type_of_connection").notNull(),
  typeConnPerc: float("type_conn_perc").notNull(),
  annualConsume: float("annual_consume").notNull(),
  annualConsumeLowTarifPerc: float("annual_consume_lowtarif_perc").notNull(),
  smartmeterPerc: float("smartmeter_perc").notNull(),
  type: text("type", { enum: ["gas", "electricity"] }).notNull(),
  year: int("year").notNull(),
});