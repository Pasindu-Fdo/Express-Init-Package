import request from "supertest";
import app from "../src/app.js";

export async function getAuthToken(email: string, password: string) {
  const res = await request(app).post("/api/auth/login").send({ email, password });
  return res.body.token;
}
