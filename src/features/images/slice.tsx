import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "api";

interface InitialState {
  value: ImageItem[];
  loading: boolean;
  error: string | null;
}

export const initialState: InitialState = {
  value: [],
  loading: false,
  error: null,
};

export const fetchImagesByCategory = createAsyncThunk(
  "/images/search",
  async (categoryId: number | string, thunkAPI) => {
    try {
      const images = (thunkAPI.getState() as any).images as InitialState;
      const response = await api.get<ImageItem[]>(`/images/search`, {
        params: {
          category_ids: categoryId,
          limit: 10,
          page: images.value.length / 10 + 1,
        },
      });
      return response.data;
    } catch (err) {
      throw new Error("Something went wrong.");
    }
  }
);

export const imagesSlice = createSlice({
  name: "images",
  initialState,
  reducers: {
    clear() {
      return initialState;
    },
  },
  extraReducers: {
    [fetchImagesByCategory.pending.type]: (state) => {
      state.loading = true;
    },
    [fetchImagesByCategory.fulfilled.type]: (state, action) => {
      state.value = [...state.value, ...action.payload];
      state.loading = false;
    },
    [fetchImagesByCategory.rejected.type]: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const imagesActions = imagesSlice.actions;

export const imagesReducer = imagesSlice.reducer;
