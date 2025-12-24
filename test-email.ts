import "dotenv/config";
import { sendWaitlistEmail } from "./server/email.ts";

console.log("Starting terminal email test...");

sendWaitlistEmail({
  email: "warinmystar@gmail.com",
  name: "Madhusudan Bhukta",
  userType: "creator",
})
  .then(() => console.log("Test script finished."))
  .catch((err) => console.error("Test script crashed:", err));
