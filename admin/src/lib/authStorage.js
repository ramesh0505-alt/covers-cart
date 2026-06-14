/** Admin portal session — isolated from customer storefront storage */
const TOKEN_KEY = 'admin_portal_token';
const USER_KEY = 'admin_portal_user';

export function getAdminToken() {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function getAdminUser() {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setAdminSession(token, user) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  // Legacy compatibility for fetch calls using `token` key
  localStorage.setItem('token', token);
}

export function clearAdminSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem('token');
  // Never touch customer supabase_session keys
}
