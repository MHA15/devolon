import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "api";

interface InitialState {
  value: Category[];
  loading: boolean;
  error: string | null;
}

export const initialState: InitialState = {
  value: [],
  loading: false,
  error: null,
};

export const fetchCategories = createAsyncThunk("categories", async (_) => {
  try {
    const response = await api.get<Category[]>(`categories`);
    return response.data;
  } catch (err) {
    throw new Error("Something went wrong.");
  }
});

export const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {},
  extraReducers: {
    [fetchCategories.pending.type]: (state) => {
      state.loading = true;
    },
    [fetchCategories.fulfilled.type]: (state, action) => {
      state.value = action.payload;
      state.loading = false;
    },
    [fetchCategories.rejected.type]: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const categoriesActions = categoriesSlice.actions;
export const categoriesReducer = categoriesSlice.reducer;
