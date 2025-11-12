/**
 * Mock for lib/watermark
 * Used in tests to avoid canvas operations
 */

const applyWatermark = jest.fn().mockResolvedValue('data:image/png;base64,watermarkedImageData');

module.exports = {
  applyWatermark,
};
