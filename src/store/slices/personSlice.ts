import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../config/api';

interface Person {
  id: number;
  name: string;
  lastName: string;
  age: number;
  weight: number;
  height: number;
  userID?: number;
}

interface PersonState {
  persons: Person[];
  loading: boolean;
  error: string | null;
}

const initialState: PersonState = {
  persons: [],
  loading: false,
  error: null,
};

export const fetchPersons = createAsyncThunk('person/fetchPersons', async () => {
  try {
    const response = await api.get('/persons');
    return response.data.persons;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Failed to fetch persons');
  }
});

export const addPerson = createAsyncThunk(
  'person/addPerson',
  async (personData: Omit<Person, 'id'>) => {
    try {
      const response = await api.post('/persons', personData);
      return response.data.result;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to add person');
    }
  }
);

export const updatePerson = createAsyncThunk(
  'person/updatePerson',
  async ({ id, data }: { id: number; data: Partial<Person> }) => {
    try {
      const response = await api.put(`/persons/${id}`, data);
      return response.data.result;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to update person');
    }
  }
);

export const deletePerson = createAsyncThunk(
  'person/deletePerson',
  async (id: number) => {
    try {
      await api.delete(`/persons/${id}`);
      return id;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to delete person');
    }
  }
);

const personSlice = createSlice({
  name: 'person',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPersons.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPersons.fulfilled, (state, action) => {
        state.loading = false;
        state.persons = action.payload;
      })
      .addCase(fetchPersons.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch persons';
      })
      .addCase(addPerson.fulfilled, (state, action) => {
        state.persons.push(action.payload);
      })
      .addCase(updatePerson.fulfilled, (state, action) => {
        const index = state.persons.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.persons[index] = action.payload;
        }
      })
      .addCase(deletePerson.fulfilled, (state, action) => {
        state.persons = state.persons.filter(p => p.id !== action.payload);
      });
  },
});

export default personSlice.reducer;