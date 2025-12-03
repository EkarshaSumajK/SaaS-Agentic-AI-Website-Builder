/**
 * Rate limiting utility
 * Simple in-memory rate limiter for API routes
 * For production with multiple instances, consider using Upstash Redis
 */

interface RateLimitConfig {
  interval: number; // Time window in milliseconds
  uniqueTokenPerInterval: number; // Max requests per interval
}

interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

class RateLimiter {
  private cache = new Map<string, { count: number; resetTime: number }>();

  /**
   * Check if request should be rate limited
   * @param identifier - Unique identifier (e.g., user ID, IP address)
   * @param config - Rate limit configuration
   */
  check(identifier: string, config: RateLimitConfig): RateLimitResult {
    const now = Date.now();
    const cached = this.cache.get(identifier);

    // Clean up expired entries
    if (cached && cached.resetTime < now) {
      this.cache.delete(identifier);
    }

    const current = this.cache.get(identifier);

    if (!current) {
      // First request in the window
      this.cache.set(identifier, {
        count: 1,
        resetTime: now + config.interval,
      });

      return {
        success: true,
        limit: config.uniqueTokenPerInterval,
        remaining: config.uniqueTokenPerInterval - 1,
        reset: now + config.interval,
      };
    }

    // Check if limit exceeded
    if (current.count >= config.uniqueTokenPerInterval) {
      return {
        success: false,
        limit: config.uniqueTokenPerInterval,
        remaining: 0,
        reset: current.resetTime,
      };
    }

    // Increment count
    current.count++;
    this.cache.set(identifier, current);

    return {
      success: true,
      limit: config.uniqueTokenPerInterval,
      remaining: config.uniqueTokenPerInterval - current.count,
      reset: current.resetTime,
    };
  }

  /**
   * Clear rate limit for identifier
   */
  clear(identifier: string): void {
    this.cache.delete(identifier);
  }

  /**
   * Clean up expired entries (call periodically)
   */
  cleanup(): void {
    const now = Date.now();
    for (const [key, value] of this.cache.entries()) {
      if (value.resetTime < now) {
        this.cache.delete(key);
      }
    }
  }
}

// Export singleton instance
export const rateLimiter = new RateLimiter();

// Cleanup expired entries every 60 seconds
if (typeof window === "undefined") {
  setInterval(() => rateLimiter.cleanup(), 60000);
}

/**
 * Rate limit configurations
 */
export const RATE_LIMITS = {
  // Project creation: 5 projects per hour
  PROJECT_CREATE: {
    interval: 60 * 60 * 1000, // 1 hour
    uniqueTokenPerInterval: 5,
  },
  // Message sending: 30 messages per minute
  MESSAGE_SEND: {
    interval: 60 * 1000, // 1 minute
    uniqueTokenPerInterval: 30,
  },
  // API requests: 100 requests per minute
  API_REQUEST: {
    interval: 60 * 1000, // 1 minute
    uniqueTokenPerInterval: 100,
  },
} as const;
