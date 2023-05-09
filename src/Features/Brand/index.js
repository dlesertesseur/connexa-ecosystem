import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { API } from "../../Constants";

const initialState = {
  value: {
    loadingBrands: false,
    error: "",
    brands: [],
    selectedRow: null,
    refreshData: null,
  },
};

export const create = createAsyncThunk("brand/create", async (parameters, asyncThunk) => {
  try {
    const body = JSON.stringify({
      name: parameters.name,
    });

    const requestOptions = {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        token: parameters.token,
      },
      body: body,
    };

    const url = API.brand.create;
    const res = await fetch(url, requestOptions);
    const data = await res.json();

    return data;
  } catch (error) {
    return asyncThunk.rejectWithValue(error);
  }
});

export const update = createAsyncThunk("brand/update", async (parameters, asyncThunk) => {
  try {
    const body = JSON.stringify({
      id: parameters.id,
      name: parameters.name,
      phone: parameters.phone,
      address: parameters.address,
    });

    const requestOptions = {
      method: "PUT",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        token: parameters.token,
      },
      body: body,
    };

    const res = await fetch(API.brand.update, requestOptions);
    const data = await res.json();

    return data;
  } catch (error) {
    return asyncThunk.rejectWithValue(error);
  }
});

export const remove = createAsyncThunk("brand/delete", async (parameters, asyncThunk) => {
  try {
    const body = JSON.stringify({
      id: parameters.id,
    });

    const requestOptions = {
      method: "DELETE",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        token: parameters.token,
      },
      body: body,
    };

    await fetch(API.brand.delete + parameters.id, requestOptions).then((response) => {
      return response;
    });
  } catch (error) {
    return asyncThunk.rejectWithValue(error);
  }
});

export const findAllBrands = createAsyncThunk("brand/findAllBrands", async (parameters, asyncThunk) => {
  try {
    const requestOptions = {
      method: "GET",
      mode: "cors",
      headers: { "Content-Type": "application/json", token: parameters.token },
    };

    const url = API.brand.findAll;
    const res = await fetch(url, requestOptions);
    const data = await res.json();

    return data;
  } catch (error) {
    return asyncThunk.rejectWithValue(error);
  }
});

export const brandSlice = createSlice({
  name: "brand",
  initialState,
  reducers: {
    setSelectedRow: (state, { payload }) => {
      state.value.selectedRow = payload;
    },

    refreshDataGrid: (state) => {
      state.value.refreshData = Date.now();
    },
  },
  extraReducers: {
    /*CREATE*/
    [create.pending]: (state) => {
      state.value.loadingBrands = true;
      state.value.error = null;
    },

    [create.fulfilled]: (state, { payload }) => {
      if (payload.error) {
        state.value.error = payload;
      } else {
        state.value.id = payload.id;
        state.value.error = null;
        state.value.refreshData = Date.now();
      }
      state.value.loadingBrands = false;
    },

    [create.rejected]: (state, { payload }) => {
      state.value.loadingBrands = false;
      state.value.error = payload;
    },

    /*UPDATE*/
    [update.pending]: (state) => {
      state.value.loadingBrands = true;
      state.value.error = null;
    },
    [update.fulfilled]: (state, { payload }) => {
      if (payload.error) {
        state.value.error = payload;
      } else {
        state.value.selectedRow = payload;
        state.value.error = null;
        state.value.refreshData = Date.now();
      }
      state.value.loadingBrands = false;
    },

    [update.rejected]: (state, { payload }) => {
      state.value.loadingBrands = false;
      state.value.error = payload;
    },

    /*DELETE*/
    [remove.pending]: (state) => {
      state.value.loadingBrands = true;
      state.value.error = null;
    },

    [remove.fulfilled]: (state, { payload }) => {
      if (payload) {
        state.value.error = payload;
      } else {
        state.value.error = null;
        state.value.selectedRow = null;
        state.value.refreshData = Date.now();
      }
      state.value.loadingBrands = false;
    },

    [remove.rejected]: (state, { payload }) => {
      state.value.loadingBrands = false;
      state.value.error = payload;
    },

    /*FIND ALL BRANDS BY PROJECT ID*/
    [findAllBrands.pending]: (state) => {
      state.value.loadingBrands = true;
      state.value.error = null;
    },

    [findAllBrands.fulfilled]: (state, { payload }) => {
      if (payload.error) {
        state.value.error = payload;
      } else {
        state.value.brands = payload;
        state.value.error = null;
      }
      state.value.loadingBrands = false;
    },

    [findAllBrands.rejected]: (state, { payload }) => {
      state.value.loadingBrands = false;
      state.value.error = payload;
    },
  },
});

export const { setSelectedRow, refreshDataGrid } = brandSlice.actions;

export default brandSlice.reducer;
