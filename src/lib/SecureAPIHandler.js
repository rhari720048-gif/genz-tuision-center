import { rateLimit } from './rateLimiter';

export class SecureAPIHandler {
  // Private fields for strict encapsulation
  #routeType;
  #limit;
  #windowMs;

  constructor(routeType, limit = 5, windowMs = 60000) {
    this.#routeType = routeType;
    this.#limit = limit;
    this.#windowMs = windowMs;
  }

  // Private method: Validate payload generically
  #validatePayload(payload, requiredKeys = []) {
    if (!payload || typeof payload !== 'object') {
      throw new Error("Invalid payload structure.");
    }
    for (const key of requiredKeys) {
      if (!payload[key]) {
        throw new Error(`Missing required field: ${key}`);
      }
    }
  }

  // Private method: Enforce rate limit
  #enforceRateLimit(req) {
    // Attempt to extract IP from common Next.js/Vercel headers, or fallback to generic
    const forwardedFor = req.headers.get('x-forwarded-for');
    const ip = forwardedFor ? forwardedFor.split(',')[0] : '127.0.0.1';
    
    const status = rateLimit(`${this.#routeType}_${ip}`, this.#limit, this.#windowMs);
    if (!status.success) {
      throw new Error("429: Too Many Requests");
    }
  }

  // Public wrapper method that utilizes the private internal validations securely
  async execute(req, requiredKeys, executionCallback) {
    try {
      // 1. Rate Limiting Check (Private)
      this.#enforceRateLimit(req);

      // 2. Extract Data
      const payload = await req.json();

      // 3. Strict Payload Validation (Private)
      this.#validatePayload(payload, requiredKeys);

      // 4. Execute the actual controller logic passed in securely
      const result = await executionCallback(payload);

      return new Response(JSON.stringify({ success: true, ...result }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });

    } catch (error) {
      console.error(`[SecureAPIHandler:${this.#routeType}] Security/Execution Error:`, error.message);
      
      const isRateLimit = error.message.includes("429");
      const statusCode = isRateLimit ? 429 : 400;

      return new Response(JSON.stringify({ 
        success: false, 
        error: isRateLimit ? "Too Many Requests. Please try again later." : error.message 
      }), {
        status: statusCode,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }
}
