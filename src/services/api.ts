import axios from 'axios';
import { Message, LoginState, PlanState, SignupState, SubscriptionState } from '../utils/types';

const baseURL = import.meta.env.VITE_BASE_API_URL || 'https://kittycare-nodejs.vercel.app';

const API = axios.create({
  baseURL: baseURL,
});

export const signUpAPI = async (userData: SignupState) => {
  try {
    const response = await API.post('/api/supabase/signup', userData);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || error.response?.data?.message || 'Signup failed');
  }
};

export const loginAPI = async (credentials: LoginState) => {
  try {
    const response = await API.post('/api/supabase/signin', credentials);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || error.response?.data?.message || 'Login failed');
  }
};

export const chatAPI = async ({ catId, messages }: { catId: string; messages: Message[] }) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error("User Not Authenticated");
    }
    const response = await API.post('/api/openai/chat', { catId, messages }, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || error.response?.data?.message || 'Chat request failed');
  }
};

export const getCatsAPI = async (token: string) => {
  try {
    token = localStorage.getItem('token') || token;
    if (!token) {
      throw new Error("User Not Authenticated");
    }

    const response = await API.get('/api/supabase/cats', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || error.response?.data?.message || 'Failed to fetch cats');
  }
};

export const getCatRecommendationsAPI = async (catDetails: any) => {
  try {
    const response = await API.post('/api/openai/recommendations', catDetails);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || error.response?.data?.message || 'Failed to get cat suggestions');
  }
};

export const updateConversationAPI = async ({ id, messages }: { id: string; messages: Message[] }) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error("User Not Authenticated");
    }

    const response = await API.put(`/api/supabase/conversations/${id}`, { messages }, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || error.response?.data?.message || 'Failed to update conversation');
  }
};

export const createConversationAPI = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error("User Not Authenticated");
    }

    const response = await API.post('/api/supabase/conversations', {}, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || error.response?.data?.message || 'Failed to create conversation');
  }
};

export const getConversationsAPI = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error("User Not Authenticated");
    }

    const response = await API.get('/api/supabase/conversations', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || error.response?.data?.message || 'Failed to fetch conversations');
  }
};

export const getConversationByIdAPI = async (id: string) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error("User Not Authenticated");
    }

    const response = await API.get(`/api/supabase/conversations/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || error.response?.data?.message || 'Failed to fetch conversation');
  }
};


export const createPlanAPI = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error("User Not Authenticated");
    }

    const response = await API.post('/api/supabase/createPlan', {}, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || error.response?.data?.message || 'Create plan failed');
  }
};

export const updatePlanAPI = async (credentials: PlanState) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error("User Not Authenticated");
    }

    const response = await API.put('/api/supabase/updatePlan', credentials, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || error.response?.data?.message || 'Update plan failed');
  }
};

type GetClientSecretKeyParams = {
  name: string;
  email: string | null;
  paymentMethodId: string | undefined;
  priceId: string;
  trial_end: number;
};

export const getClientSecretKey = async ({
  name,
  email,
  paymentMethodId,
  priceId,
  trial_end
}: GetClientSecretKeyParams) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error("User Not Authenticated");
    }
    const response = await API.post('/api/payments/stripe/subscription', {
      name,
      email,
      paymentMethodId,
      priceId,
      trial_end
    }, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    return response.data;

  } catch (error: any) {
    console.log("error", error);
    throw new Error(error.response?.data?.error || error.response?.data?.message || 'Get client secret key failed');
  }
};

export const updateCatAPI = async (catData: any, catId: string | null) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error("User Not Authenticated");
    }

    const response = await API.put(`/api/supabase/cats/${catId}`, catData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || error.response?.data?.message || 'Failed to update cat');
  }
};

export const createCatAPI = async (catDetails: any) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error("User Not Authenticated");
    }

    const response = await API.post('/api/supabase/cats', catDetails, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || error.response?.data?.message || 'Failed to create cat');
  }
};

export const removePlanAPI = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error("User Not Authenticated");
    }

    const response = await API.delete('/api/supabase/removePlan');
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || error.response?.data?.message || 'Cancel plan failed');
  }
}

export const createSubscriptionAPI = async (subscriptionData: SubscriptionState) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error("User Not Authenticated");
    }

    const response = await API.post('/api/supabase/subscriptions', subscriptionData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || error.response?.data?.message || 'Failed to create subscription');
  }
};

export const getSubscriptionsAPI = async (token: string) => {
  try {
    token = localStorage.getItem('token') || token;
    if (!token) {
      throw new Error("User Not Authenticated");
    }

    const response = await API.get('/api/supabase/subscriptions', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || error.response?.data?.message || 'Failed to fetch subscriptions');
  }
};

export const deleteSubscriptionAPI = async (subscriptionId: string) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error("User Not Authenticated");
    }

    const response = await API.delete(`/api/supabase/subscriptions/${subscriptionId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || error.response?.data?.message || 'Failed to delete subscription');
  }
};

export const deleteStripeSubscriptionAPI = async (subscriptionId: string) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error("User Not Authenticated");
    }
    const response = await API.delete(`/api/payments/stripe/subscription/${subscriptionId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || error.response?.data?.message || 'Failed to delete subscription');
  }
};

export const requestForgotPasswordAPI = async (email: string) => {
  
  try {
    const response = await API.post('/api/supabase/password-reset/request', { email }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || error.response?.data?.message || 'Failed to reset password');
  }
}

export const requestResetPasswordAPI = async (token: string, newPassword: string) => {
  try {
    const response = await API.post('/api/supabase/password-reset/reset', {
      token,
      newPassword,
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || error.response?.data?.message || 'Failed to reset password');
  }
}
export default baseURL;
