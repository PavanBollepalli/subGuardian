import arcjet, { shield, detectBot, tokenBucket } from "@arcjet/node";
import { ARCJET_KEY } from "./env.js";
const aj = arcjet({
  key: ARCJET_KEY,
  rules: [
    // Shield protects your app from common attacks e.g. SQL injection
    shield({ mode: "LIVE" }),
    // Create a bot detection rule
    detectBot({
      mode: "LIVE",
      allow: [
        "CATEGORY:SEARCH_ENGINE", 
        "CATEGORY:TOOL",
      ],
    }),
    // Create a token bucket rate limit. Other algorithms are supported.
    tokenBucket({
      mode: "LIVE",
      characteristics: ["ip.src"],
      refillRate: 1, // Refill 1 token per interval
      interval: 10, // Refill every 10 seconds
      capacity: 5, // Bucket capacity of 5 tokens
    }),
  ],
});
export default aj;