import { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';

const AUTH_STORAGE_KEY = 'reachlyAuth';
const AUTH_SCHEMA_VERSION = 1;

// Default user state
const DEFAULT_USER = {
  id: null,
  email: null,
  name: null,
  role: null, // 'BUSINESS' | 'INFLUENCER' | null
  roleLocked: false,
  onboardingComplete: false,
  profile: null, // role-specific profile data
  createdAt: null
};

// Load auth state from localStorage
const loadAuthState = () => {
  try {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!stored) return { user: DEFAULT_USER, isAuthenticated: false };
    
    const parsed = JSON.parse(stored);
    if (parsed.version !== AUTH_SCHEMA_VERSION) {
      // Handle migration if needed in future
      localStorage.removeItem(AUTH_STORAGE_KEY);
      return { user: DEFAULT_USER, isAuthenticated: false };
    }
    
    return {
      user: { ...DEFAULT_USER, ...parsed.user },
      isAuthenticated: parsed.isAuthenticated || false
    };
  } catch {
    return { user: DEFAULT_USER, isAuthenticated: false };
  }
};

// Save auth state to localStorage
const saveAuthState = (user, isAuthenticated) => {
  try {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({
      version: AUTH_SCHEMA_VERSION,
      user,
      isAuthenticated
    }));
  } catch {
    // Ignore storage errors
  }
};

// Create context
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [state, setState] = useState(() => loadAuthState());
  const { user, isAuthenticated } = state;

  // Persist to localStorage on state change
  useEffect(() => {
    saveAuthState(user, isAuthenticated);
  }, [user, isAuthenticated]);

  // Sign up with email
  const signup = useCallback(async ({ email, password, name }) => {
    // Mock signup - in production, call real auth API
    const newUser = {
      ...DEFAULT_USER,
      id: `user_${Date.now()}`,
      email,
      name: name || email.split('@')[0],
      createdAt: new Date().toISOString()
    };
    
    setState({ user: newUser, isAuthenticated: true });
    return { success: true, user: newUser };
  }, []);

  // Login with email
  const login = useCallback(async ({ email, password }) => {
    // Mock login - in production, call real auth API
    // For demo, we'll create/find user based on email
    const existingState = loadAuthState();
    
    if (existingState.user?.email === email) {
      setState({ user: existingState.user, isAuthenticated: true });
      return { success: true, user: existingState.user };
    }
    
    // For demo: create new user on login if not exists
    const newUser = {
      ...DEFAULT_USER,
      id: `user_${Date.now()}`,
      email,
      name: email.split('@')[0],
      createdAt: new Date().toISOString()
    };
    
    setState({ user: newUser, isAuthenticated: true });
    return { success: true, user: newUser };
  }, []);

  // Social login (Google/Apple)
  const socialLogin = useCallback(async (provider) => {
    // Mock social login
    const mockEmails = {
      google: 'user@gmail.com',
      apple: 'user@icloud.com'
    };
    
    const email = mockEmails[provider] || 'user@example.com';
    const existingState = loadAuthState();
    
    if (existingState.user?.email === email) {
      setState({ user: existingState.user, isAuthenticated: true });
      return { success: true, user: existingState.user };
    }
    
    const newUser = {
      ...DEFAULT_USER,
      id: `user_${Date.now()}`,
      email,
      name: email.split('@')[0],
      createdAt: new Date().toISOString()
    };
    
    setState({ user: newUser, isAuthenticated: true });
    return { success: true, user: newUser };
  }, []);

  // Logout
  const logout = useCallback(() => {
    setState({ user: DEFAULT_USER, isAuthenticated: false });
    localStorage.removeItem(AUTH_STORAGE_KEY);
    // Also clear old role storage
    localStorage.removeItem('reachlyUserRole');
  }, []);

  // Set role (one-time, irreversible)
  const setRole = useCallback((role) => {
    if (user.roleLocked) {
      console.warn('Role is already locked and cannot be changed');
      return false;
    }
    
    if (role !== 'BUSINESS' && role !== 'INFLUENCER') {
      console.warn('Invalid role:', role);
      return false;
    }
    
    setState(prev => ({
      ...prev,
      user: {
        ...prev.user,
        role,
        roleLocked: true
      }
    }));
    
    return true;
  }, [user.roleLocked]);

  // Complete onboarding
  const completeOnboarding = useCallback((profileData) => {
    setState(prev => ({
      ...prev,
      user: {
        ...prev.user,
        onboardingComplete: true,
        profile: profileData
      }
    }));
  }, []);

  // Update profile
  const updateProfile = useCallback((profileData) => {
    setState(prev => ({
      ...prev,
      user: {
        ...prev.user,
        profile: { ...prev.user.profile, ...profileData }
      }
    }));
  }, []);

  const value = useMemo(() => ({
    user,
    isAuthenticated,
    signup,
    login,
    socialLogin,
    logout,
    setRole,
    completeOnboarding,
    updateProfile,
    // Computed helpers
    needsRoleSelection: isAuthenticated && !user.role,
    needsOnboarding: isAuthenticated && user.role && !user.onboardingComplete,
    isBusiness: user.role === 'BUSINESS',
    isInfluencer: user.role === 'INFLUENCER'
  }), [user, isAuthenticated, signup, login, socialLogin, logout, setRole, completeOnboarding, updateProfile]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
