/**
 * Simple plugin to clean up database records before returning them.
 */
function toJSON(doc) {
  if (!doc) return doc;
  // Convert dates to ISO strings or strip internal properties if needed
  if (doc.createdAt instanceof Date) doc.createdAt = doc.createdAt.toISOString();
  if (doc.updatedAt instanceof Date) doc.updatedAt = doc.updatedAt.toISOString();
  if (doc.expires instanceof Date) doc.expires = doc.expires.toISOString();
  return doc;
}

module.exports = { toJSON };
