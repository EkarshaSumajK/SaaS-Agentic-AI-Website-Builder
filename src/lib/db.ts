import { PrismaClient } from '../generated/prisma'
import { logger } from './logger'

const globalForPrisma = global as unknown as { 
    prisma: PrismaClient | undefined
}

/**
 * Prisma client with logging and error handling
 */
export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' 
    ? ['query', 'error', 'warn']
    : ['error'],
  errorFormat: 'pretty',
})

// Log slow queries in development
if (process.env.NODE_ENV === 'development') {
  prisma.$use(async (params, next) => {
    const before = Date.now()
    const result = await next(params)
    const after = Date.now()
    const duration = after - before

    if (duration > 1000) {
      logger.warn('Slow database query detected', {
        model: params.model,
        action: params.action,
        duration: `${duration}ms`,
      })
    }

    return result
  })
}

// Handle connection errors
prisma.$connect().catch((error) => {
  logger.error('Failed to connect to database', error)
  process.exit(1)
})

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
