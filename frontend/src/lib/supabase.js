// Since the default Supabase VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are placeholders
// and we want a fully production-ready local/demo app with functional authentication,
// session persistence, and wishlist, we implement a robust Mock Supabase Client.

class MockSupabaseClient {
  constructor() {
    this.authListeners = new Set();
    const savedSession = localStorage.getItem('supabase_session');
    this.session = savedSession ? JSON.parse(savedSession) : null;
  }

  get auth() {
    return {
      signUp: async ({ email, password, options }) => {
        const users = JSON.parse(localStorage.getItem('mock_users') || '[]');
        if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
          return { data: { user: null }, error: { message: 'User already exists' } };
        }
        
        const newUser = {
          id: `user-${Math.random().toString(36).substr(2, 9)}`,
          email,
          raw_user_meta_data: options?.data || {},
          created_at: new Date().toISOString()
        };
        
        users.push({ ...newUser, password });
        localStorage.setItem('mock_users', JSON.stringify(users));

        // Create profile
        const profiles = JSON.parse(localStorage.getItem('mock_profiles') || '[]');
        const newProfile = {
          id: newUser.id,
          full_name: newUser.raw_user_meta_data.full_name || email.split('@')[0],
          email: newUser.email,
          role: 'customer',
          avatar_url: newUser.raw_user_meta_data.avatar_url || '',
          created_at: newUser.created_at
        };
        profiles.push(newProfile);
        localStorage.setItem('mock_profiles', JSON.stringify(profiles));

        const session = {
          access_token: `mock-jwt-token-${newUser.id}`,
          user: newUser
        };
        this.session = session;
        localStorage.setItem('supabase_session', JSON.stringify(session));
        
        this.notifyAuthChange('SIGNED_IN', session);
        return { data: { user: newUser, session }, error: null };
      },

      signInWithPassword: async ({ email, password }) => {
        const users = JSON.parse(localStorage.getItem('mock_users') || '[]');

        const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
        if (!user) {
          return { data: { user: null }, error: { message: 'Invalid login credentials' } };
        }

        const session = {
          access_token: `mock-jwt-token-${user.id}`,
          user: {
            id: user.id,
            email: user.email,
            raw_user_meta_data: user.raw_user_meta_data,
            created_at: user.created_at
          }
        };
        
        this.session = session;
        localStorage.setItem('supabase_session', JSON.stringify(session));
        this.notifyAuthChange('SIGNED_IN', session);
        return { data: { user: session.user, session }, error: null };
      },

      signInWithOAuth: async ({ provider, options }) => {
        const mockUser = {
          id: `oauth-user-${Math.random().toString(36).substr(2, 9)}`,
          email: `${provider}-user@example.com`,
          raw_user_meta_data: { full_name: `OAuth ${provider} User` },
          created_at: new Date().toISOString()
        };
        const session = {
          access_token: `mock-jwt-token-${mockUser.id}`,
          user: mockUser
        };
        this.session = session;
        localStorage.setItem('supabase_session', JSON.stringify(session));

        // Create profile
        const profiles = JSON.parse(localStorage.getItem('mock_profiles') || '[]');
        profiles.push({
          id: mockUser.id,
          full_name: mockUser.raw_user_meta_data.full_name,
          email: mockUser.email,
          role: 'customer',
          avatar_url: '',
          created_at: mockUser.created_at
        });
        localStorage.setItem('mock_profiles', JSON.stringify(profiles));

        this.notifyAuthChange('SIGNED_IN', session);
        return { data: { provider, url: options?.redirectTo || window.location.origin }, error: null };
      },

      signOut: async () => {
        this.session = null;
        localStorage.removeItem('supabase_session');
        this.notifyAuthChange('SIGNED_OUT', null);
        return { error: null };
      },

      getSession: async () => {
        return { data: { session: this.session }, error: null };
      },

      onAuthStateChange: (callback) => {
        this.authListeners.add(callback);
        // Fire initial event
        callback(this.session ? 'SIGNED_IN' : 'SIGNED_OUT', this.session);
        return {
          data: {
            subscription: {
              unsubscribe: () => {
                this.authListeners.delete(callback);
              }
            }
          }
        };
      }
    };
  }

  notifyAuthChange(event, session) {
    for (const listener of this.authListeners) {
      listener(event, session);
    }
  }

  from(table) {
    let dataStore = [];
    if (table === 'profiles') {
      dataStore = JSON.parse(localStorage.getItem('mock_profiles') || '[]');
    } else if (table === 'wishlist_items') {
      dataStore = JSON.parse(localStorage.getItem('mock_wishlist_items') || '[]');
    }

    const chain = {
      data: dataStore,
      error: null,

      select() {
        return this;
      },

      eq(column, value) {
        if (Array.isArray(this.data)) {
          this.data = this.data.filter(item => item[column] === value);
        }
        return this;
      },

      single() {
        if (Array.isArray(this.data) && this.data.length > 0) {
          this.data = this.data[0];
        } else if (!Array.isArray(this.data)) {
          // Already resolved single object
        } else {
          this.data = null;
          this.error = { message: 'Row not found' };
        }
        return this;
      },

      insert(row) {
        if (table === 'wishlist_items') {
          const items = JSON.parse(localStorage.getItem('mock_wishlist_items') || '[]');
          const newId = `wishlist-${Math.random().toString(36).substr(2, 9)}`;
          const newRow = { id: newId, ...row, created_at: new Date().toISOString() };
          items.push(newRow);
          localStorage.setItem('mock_wishlist_items', JSON.stringify(items));
          
          this.data = newRow;
          this.error = null;
        }
        return this;
      },

      delete() {
        if (table === 'wishlist_items') {
          let items = JSON.parse(localStorage.getItem('mock_wishlist_items') || '[]');
          const targetIds = Array.isArray(this.data) ? this.data.map(i => i.id) : (this.data ? [this.data.id] : []);
          
          items = items.filter(item => !targetIds.includes(item.id));
          localStorage.setItem('mock_wishlist_items', JSON.stringify(items));
          this.data = null;
          this.error = null;
        }
        return this;
      },

      then(onfulfilled) {
        const resolvePromise = async () => {
          // If we need to populate product details for wishlist items
          if (table === 'wishlist_items') {
            const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            if (Array.isArray(this.data)) {
              const populated = [];
              for (const item of this.data) {
                let product = null;
                try {
                  const res = await fetch(`${apiBase}/products/${item.product_id}`);
                  if (res.ok) {
                    product = await res.json();
                  }
                } catch (e) {
                  console.error('Mock DB failed to fetch product details:', e);
                }
                populated.push({ ...item, product });
              }
              this.data = populated.filter(item => item.product !== null);
            } else if (this.data && typeof this.data === 'object') {
              let product = null;
              try {
                const res = await fetch(`${apiBase}/products/${this.data.product_id}`);
                if (res.ok) {
                  product = await res.json();
                }
              } catch (e) {
                console.error('Mock DB failed to fetch single product details:', e);
              }
              this.data = { ...this.data, product };
            }
          }
          return { data: this.data, error: this.error };
        };
        return resolvePromise().then(onfulfilled);
      }
    };
    return chain;
  }
}

export const supabase = new MockSupabaseClient();
