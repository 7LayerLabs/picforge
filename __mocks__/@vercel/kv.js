/**
 * Mock for @vercel/kv
 * Used in tests to avoid ESM import issues and real KV connections
 */

// Mock KV client
const mockKv = {
  get: jest.fn().mockResolvedValue(null),
  set: jest.fn().mockResolvedValue('OK'),
  del: jest.fn().mockResolvedValue(1),
  incr: jest.fn().mockResolvedValue(1),
  expire: jest.fn().mockResolvedValue(1),
  ttl: jest.fn().mockResolvedValue(-1),
  exists: jest.fn().mockResolvedValue(0),
  setex: jest.fn().mockResolvedValue('OK'),
}

// Export both default and named exports
module.exports = {
  kv: mockKv,
  default: mockKv,
}
