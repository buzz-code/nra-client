// Routes registered as noLayout CustomRoutes (see CommonRoutes.jsx) - reachable
// without authentication, and rendered without the admin shell (no sidebar).
// Shared between authProvider (isPublicRoute) and the resource-discovery test
// util (createResourceTests), so the two never drift apart.
export const PUBLIC_ROUTE_PATHS = new Set(['/register', '/maintenance', '/contact']);
