import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../config/api';
import CryptoJS from 'crypto-js';

interface AuthState {
  user: any;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  loading: false,
  error: null,
};

const encryptData = (data: string) => {
  return CryptoJS.AES.encrypt(data, 'e64b27744b31cfb2a749454936b11e224d7a7a4819ceb5ae79f6afb3d07d0afed4001c4ec33a4c3eaf2d575f4d897bd026755112071856ec706692875f4e929c').toString();
};

export const register = createAsyncThunk(
  'auth/register',
  async (credentials: { email: string; password: string }) => {
    try {
      const encryptedToken = encryptData(JSON.stringify(credentials));
      const response = await api.post('/users', { token: encryptedToken });
      const { token } = response.data;
      localStorage.setItem('token', token);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.msn || 'Registration failed');
    }
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }) => {
    try {
      const encryptedToken = encryptData(JSON.stringify(credentials));
      const response = await api.post('/users/login', { token: encryptedToken });
      const { token } = response.data;
      localStorage.setItem('token', token);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.msn || 'Login failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('token');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Login failed';
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Registration failed';
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;