/**
 * Create a page URL for navigation (Base44 convention)
 */
export function createPageUrl(path) {
  const base = path.startsWith('/') ? '' : '/'
  return `${base}${path}`
}
