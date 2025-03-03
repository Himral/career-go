import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./utils/schema.js",
  dbCredentials: {
    url : 'postgresql://neondb_owner:O6EiFtq2AQVX@ep-bitter-silence-a89cabq7-pooler.eastus2.azure.neon.tech/ai?sslmode=require'
  }
});
