/** Roles permitted to access admin.coverscart.com */
export const ADMIN_PORTAL_ROLES = [
  'SUPER_ADMIN',
  'ADMIN',
  'MANAGER',
  'SUPPORT',
  'DESIGNER',
];

export function normalizeRole(role) {
  return (role || '').toString().trim().toUpperCase();
}

export function isAdminPortalRole(role) {
  return ADMIN_PORTAL_ROLES.includes(normalizeRole(role));
}
