type AuthEvent = 'INITIAL_SESSION' | 'SIGNED_IN' | 'SIGNED_OUT' | 'USER_UPDATED';

interface ApiUser {
  id: string;
  email: string;
  created_at: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost/project/api';
const listeners = new Set<(event: AuthEvent, session: { user: ApiUser } | null) => void>();
let cachedUser: ApiUser | null = null;
let initialized = false;

const endpoint = (path: string) => `${API_BASE_URL}${path}`;

async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(endpoint(path), {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    },
    ...init,
  });

  const text = await response.text();
  const payload = text ? JSON.parse(text) : {};

  if (!response.ok) {
    throw new Error(payload.error || `Request failed with status ${response.status}`);
  }

  return payload as T;
}

function sessionPayload(user: ApiUser | null): { user: ApiUser } | null {
  return user ? { user } : null;
}

function emit(event: AuthEvent): void {
  const session = sessionPayload(cachedUser);
  listeners.forEach((listener) => listener(event, session));
}

async function refreshUser(): Promise<ApiUser | null> {
  const result = await apiRequest<{ user: ApiUser | null }>('/auth/me.php');
  cachedUser = result.user;
  initialized = true;
  return cachedUser;
}

export interface Message {
  id: string;
  conversation_id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
  helpful?: boolean;
  feedback?: string;
  topic?: string;
  confidence_score?: number;
}

export interface UserSubscription {
  plan: 'free' | 'pro' | 'premium';
  status: 'active' | 'cancelled' | 'expired';
  current_period_end: string;
}

export const supabase = {
  auth: {
    async signUp({ email, password }: { email: string; password: string }) {
      try {
        const result = await apiRequest<{ user: ApiUser }>('/auth/signup.php', {
          method: 'POST',
          body: JSON.stringify({ email, password }),
        });
        cachedUser = result.user;
        initialized = true;
        emit('SIGNED_IN');
        return { data: { user: result.user }, error: null };
      } catch (error) {
        return { data: { user: null }, error: error as Error };
      }
    },

    async signInWithPassword({ email, password }: { email: string; password: string }) {
      try {
        const result = await apiRequest<{ user: ApiUser }>('/auth/login.php', {
          method: 'POST',
          body: JSON.stringify({ email, password }),
        });
        cachedUser = result.user;
        initialized = true;
        emit('SIGNED_IN');
        return { data: { user: result.user }, error: null };
      } catch (error) {
        return { data: { user: null }, error: error as Error };
      }
    },

    async signOut() {
      try {
        await apiRequest('/auth/logout.php', { method: 'POST' });
        cachedUser = null;
        initialized = true;
        emit('SIGNED_OUT');
        return { error: null };
      } catch (error) {
        return { error: error as Error };
      }
    },

    async getUser() {
      try {
        if (!initialized) {
          await refreshUser();
        }
        return { data: { user: cachedUser }, error: null };
      } catch (error) {
        return { data: { user: null }, error: error as Error };
      }
    },

    async updateUser({ email }: { email: string }) {
      try {
        const result = await apiRequest<{ user: ApiUser }>('/auth/update-email.php', {
          method: 'POST',
          body: JSON.stringify({ email }),
        });
        cachedUser = result.user;
        initialized = true;
        emit('USER_UPDATED');
        return { data: { user: result.user }, error: null };
      } catch (error) {
        return { data: { user: null }, error: error as Error };
      }
    },

    async resetPasswordForEmail(email: string, _options?: { redirectTo?: string }) {
      try {
        await apiRequest('/auth/request-password-reset.php', {
          method: 'POST',
          body: JSON.stringify({ email }),
        });
        return { error: null };
      } catch (error) {
        return { error: error as Error };
      }
    },

    onAuthStateChange(callback: (event: AuthEvent, session: { user: ApiUser } | null) => void) {
      listeners.add(callback);

      if (!initialized) {
        refreshUser()
          .then(() => callback('INITIAL_SESSION', sessionPayload(cachedUser)))
          .catch(() => callback('INITIAL_SESSION', null));
      } else {
        callback('INITIAL_SESSION', sessionPayload(cachedUser));
      }

      return {
        data: {
          subscription: {
            unsubscribe: () => {
              listeners.delete(callback);
            },
          },
        },
      };
    },
  },
};

export const createConversation = async (): Promise<string | null> => {
  const result = await apiRequest<{ conversation: { id: string } }>('/chat/conversations.php', {
    method: 'POST',
  });
  return result.conversation.id || null;
};

export const saveMessage = async (message: Partial<Message>): Promise<Message | null> => {
  const result = await apiRequest<{ message: Message }>('/chat/messages.php', {
    method: 'POST',
    body: JSON.stringify(message),
  });
  return result.message;
};

export const updateMessageFeedback = async (messageId: string, helpful: boolean): Promise<void> => {
  await apiRequest('/chat/message-feedback.php', {
    method: 'POST',
    body: JSON.stringify({
      message_id: messageId,
      helpful,
    }),
  });
};

export const getConversationHistory = async (conversationId: string): Promise<Message[] | null> => {
  const result = await apiRequest<{ messages: Message[] }>(
    `/chat/messages.php?conversation_id=${encodeURIComponent(conversationId)}`
  );
  return result.messages;
};

export const getUserSubscription = async (): Promise<UserSubscription | null> => {
  const result = await apiRequest<{ subscription: UserSubscription | null }>('/user/subscription.php');
  return result.subscription;
};

export const updateUserSubscription = async (subscription: Partial<UserSubscription>): Promise<void> => {
  await apiRequest('/user/subscription.php', {
    method: 'POST',
    body: JSON.stringify(subscription),
  });
};

export const deleteUserSubscription = async (): Promise<void> => {
  await apiRequest('/user/subscription.php', {
    method: 'DELETE',
  });
};

export const deleteCurrentUserAccount = async (): Promise<void> => {
  await apiRequest('/auth/delete-account.php', {
    method: 'POST',
  });
  cachedUser = null;
  initialized = true;
  emit('SIGNED_OUT');
};
