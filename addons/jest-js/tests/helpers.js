import app from "../src/app.js";
import request from "supertest";

export async function getAuthToken(email, password) {
  const res = await request(app).post("/api/auth/login").send({ email, password });
  return res.body.token;
}
