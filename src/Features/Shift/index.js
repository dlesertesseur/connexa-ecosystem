import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { actions, API } from "../../Constants";
import { formatDateToDDMMYYYY } from "../../Util";

const initialState = {
  value: {
    loading: false,
    loadingCountries:false,
    processing: false,
    error: null,
    errorMessage: null,
    errorCode: null,
    shifts:[]
  },
};

export const create = createAsyncThunk("shift/create", async (parameters, asyncThunk) => {
  try {
    const wData = { ...parameters.values };
    wData.birthDate = formatDateToDDMMYYYY(wData.birthDate);
    const body = JSON.stringify(wData);

    const requestOptions = {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        token: parameters.token,
      },
      body: body,
    };

    const res = await fetch(API.shift.create, requestOptions);
    const data = await res.json();

    return data;
  } catch (error) {
    return asyncThunk.rejectWithValue(error);
  }
});

export const update = createAsyncThunk("shift/update", async (parameters, asyncThunk) => {
  try {
    const wData = { ...parameters.values };
    wData.birthDate = formatDateToDDMMYYYY(wData.birthDate);
    const body = JSON.stringify(wData);

    const requestOptions = {
      method: "PUT",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        token: parameters.token,
      },
      body: body,
    };

    const res = await fetch(API.shift.update, requestOptions);
    const data = await res.json();

    return data;
  } catch (error) {
    return asyncThunk.rejectWithValue(error);
  }
});

export const remove = createAsyncThunk("shift/delete", async (parameters, asyncThunk) => {
  try {
    const requestOptions = {
      method: "DELETE",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        token: parameters.token,
      },
    };

    const url = API.shift.delete + parameters.id + "/organizations/" + parameters.organizationId;
    await fetch(url, requestOptions).then((response) => {
      return response;
    });
  } catch (error) {
    return asyncThunk.rejectWithValue(error);
  }
});

export const findShiftById = createAsyncThunk("shift/findShiftById", async (parameters, asyncThunk) => {
  try {
    const requestOptions = {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        token: parameters.token,
      },
    };

    const url = API.shift.findWorkerById + parameters.id;
    const res = await fetch(url, requestOptions);
    const data = await res.json();

    return data;
  } catch (error) {
    return asyncThunk.rejectWithValue(error);
  }
});

export const findAllRetailers = createAsyncThunk("shift/findAllRetailers", async (parameters, asyncThunk) => {
  try {
    const requestOptions = {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        token: parameters.token,
      },
    };

    const url = API.shift.findAllRetailers;
    const res = await fetch(url, requestOptions);
    const data = await res.json();

    return data;
  } catch (error) {
    return asyncThunk.rejectWithValue(error);
  }
});

export const findAllShiftsByStore = createAsyncThunk(
  "shift/findAllShiftsByStore",
  async (parameters, asyncThunk) => {
    try {
      const requestOptions = {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          token: parameters.token,
        },
      };

      const url = API.shift.findAllShiftsByStore + parameters.organizationId;
      const res = await fetch(url, requestOptions);
      const data = await res.json();

      return data;
    } catch (error) {
      return asyncThunk.rejectWithValue(error);
    }
  }
);

export const findAllOrganizationsByWorker = createAsyncThunk(
  "shift/findAllOrganizationsByWorker",
  async (parameters, asyncThunk) => {
    try {
      const requestOptions = {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          token: parameters.token,
        },
      };

      const url = API.shift.findAllOrganizationsByWorker + parameters.id + "/organizations";
      const res = await fetch(url, requestOptions);
      const data = await res.json();

      return data;
    } catch (error) {
      return asyncThunk.rejectWithValue(error);
    }
  }
);




export const workerSlice = createSlice({
  name: "worker",
  initialState,
  reducers: {
    setSelectedRow: (state, { payload }) => {
      state.value.selectedRow = payload;
    },

    refreshDataGrid: (state) => {
      state.value.refreshData = Date.now();
    },

    refreshImageListData: (state) => {
      state.value.refreshImageList = Date.now();
    },

    setPage: (state, { payload }) => {
      state.value.page = payload;
    },

    refreshCategorizeData: (state) => {
      state.value.refreshCategorizeData = Date.now();
    },

    clearWorkersInCategory: (state) => {
      state.value.workersInCategory = [];
      state.value.workersInCategoryPages = 0;
      state.value.totalWorkersInCategory = 0;
    },

    clearError: (state) => {
      state.value.error = null;
      state.value.errorMessage = null;
      state.value.errorCode = null;
      state.value.creating = null;
      state.value.created = null;
      state.value.organizationsByWorker = null;
      state.value.worker = null;
      state.value.workerFound = null;
    },

    setSelectedRowId: (state, { payload }) => {
      state.value.selectedRowId = payload;
    },

    resetGlobalStates: (state, { payload }) => {
      state.value.selectedRowId = payload;
    },
  },
  extraReducers: {
    /*CREATE*/
    [create.pending]: (state) => {
      state.value.processing = true;
      state.value.error = null;
      state.value.errorMessage = null;
      state.value.errorCode = null;
      state.value.creating = true;
    },

    [create.fulfilled]: (state, { payload }) => {
      console.log("[create.fulfilled]", payload);
      if (payload.error) {
        state.value.error = payload.error;
        state.value.errorMessage = payload.message;
        state.value.errorCode = payload.status;
      } else {
        state.value.id = payload.id;
        state.value.errorMessage = null;
        state.value.errorCode = null;
        state.value.error = null;
        state.value.worker = null;
        state.value.workerFound = null;
        state.value.organizationsByWorker = null;
        state.value.appState = actions.reload;
      }
      state.value.creating = false;
    },

    [create.rejected]: (state, { payload }) => {
      console.log("[create.rejected]", payload);
      state.value.creating = false;
      state.value.error = payload;
      state.value.errorMessage = payload.message;
      state.value.errorCode = payload.status;
    },

    /*UPDATE*/
    [update.pending]: (state) => {
      state.value.processing = true;
      state.value.error = null;
      state.value.errorMessage = null;
      state.value.errorCode = null;
      state.value.updating = true;
    },
    [update.fulfilled]: (state, { payload }) => {
      if (payload.error) {
        state.value.error = payload.error;
        state.value.errorMessage = payload.message;
        state.value.errorCode = payload.status;
      } else {
        state.value.id = payload.id;
        state.value.errorMessage = null;
        state.value.errorCode = null;
        state.value.error = null;
        state.value.worker = null;
        state.value.workerFound = null;
        state.value.organizationsByWorker = null;
        state.value.appState = actions.reload;
      }
      state.value.updating = false;
    },

    [update.rejected]: (state, { payload }) => {
      state.value.processing = false;
      state.value.error = payload;
      state.value.errorMessage = payload.message;
      state.value.errorCode = payload.status;
    },

    /*DELETE*/
    [remove.pending]: (state) => {
      state.value.error = null;
      state.value.errorMessage = null;
      state.value.errorCode = null;
      state.value.deleting = true;
    },

    [remove.fulfilled]: (state, { payload }) => {
      state.value.errorMessage = null;
      state.value.errorCode = null;
      state.value.error = null;
      state.value.selectedRowId = null;
      state.value.deleting = false;
      state.value.worker = null;
      state.value.workerFound = null;
      state.value.organizationsByWorker = null;
      state.value.appState = actions.reload;
    },

    [remove.rejected]: (state, { payload }) => {
      state.value.processing = false;
      state.value.error = payload;
      state.value.errorMessage = payload.message;
      state.value.errorCode = payload.status;
      state.value.deleting = false;
    },

    /*FIND ALL RETAILERS*/
    [findAllRetailers.pending]: (state) => {
      state.value.loadingRetailers = true;
      state.value.error = null;
      state.value.errorMessage = null;
      state.value.errorCode = null;
    },

    [findAllRetailers.fulfilled]: (state, { payload }) => {
      console.log("[findAllCountries.fulfilled]", payload);

      if (payload.error) {
        state.value.error = payload.error;
        state.value.errorMessage = payload.message;
        state.value.errorCode = payload.status;
      } else {
        state.value.countries = payload;
        state.value.errorMessage = null;
        state.value.errorCode = null;
        state.value.error = null;
      }
      state.value.loadingRetailers = false;
    },

    [findAllRetailers.rejected]: (state, { payload }) => {
      console.log("[findAllCountries.rejected]", payload);

      state.value.error = payload;
      state.value.errorMessage = payload.message;
      state.value.errorCode = payload.status;
      state.value.loadingRetailers = false;
    },

    //FIND ALL WORKERS BY ORGANIZATION
    [findAllShiftsByStore.pending]: (state) => {
      state.value.loading = true;
      state.value.error = null;
      state.value.errorMessage = null;
      state.value.errorCode = null;
    },

    [findAllShiftsByStore.fulfilled]: (state, { payload }) => {
      console.log("[findAllShiftsByStore.fulfilled]", payload);

      if (payload.error) {
        state.value.error = payload.error;
        state.value.errorMessage = payload.message;
        state.value.errorCode = payload.status;
      } else {
        state.value.workers = payload;
        state.value.errorMessage = null;
        state.value.errorCode = null;
        state.value.error = null;
        state.value.appState = actions.readed;
      }
      state.value.loading = false;
    },

    [findAllShiftsByStore.rejected]: (state, { payload }) => {
      console.log("[findAllWorkersByOrganization.rejected]", payload);

      state.value.error = payload;
      state.value.errorMessage = payload.message;
      state.value.errorCode = payload.status;
      state.value.loading = false;
    },

    //FIND ALL OGANIZATIONS BY WORKER
    [findAllOrganizationsByWorker.pending]: (state) => {
      state.value.loading = true;
      state.value.error = null;
      state.value.errorMessage = null;
      state.value.errorCode = null;
      state.value.organizationsByWorker = null;
    },

    [findAllOrganizationsByWorker.fulfilled]: (state, { payload }) => {
      console.log("[findAllOrganizationsByWorker.fulfilled]", payload);

      if (payload.error) {
        state.value.error = payload.error;
        state.value.errorMessage = payload.message;
        state.value.errorCode = payload.status;
      } else {
        state.value.organizationsByWorker = payload;
        state.value.errorMessage = null;
        state.value.errorCode = null;
        state.value.error = null;
      }
      state.value.loading = false;
    },

    [findAllOrganizationsByWorker.rejected]: (state, { payload }) => {
      console.log("[findAllOrganizationsByWorker.rejected]", payload);

      state.value.error = payload;
      state.value.errorMessage = payload.message;
      state.value.errorCode = payload.status;
      state.value.loading = false;
    },

    /*FIND SHIFT BY ID*/
    [findShiftById.pending]: (state) => {
      state.value.loadingShift = false;
      state.value.error = null;
      state.value.errorMessage = null;
      state.value.errorCode = null;
    },

    [findShiftById.fulfilled]: (state, { payload }) => {
      console.log("[findShiftById.fulfilled]", payload);

      if (payload.error) {
        state.value.error = payload.error;
        state.value.errorMessage = payload.message;
        state.value.errorCode = payload.status;
      } else {
        state.value.worker = payload;
        state.value.errorMessage = null;
        state.value.errorCode = null;
        state.value.error = null;
      }
      state.value.loadingShift = false;
    },

    [findShiftById.rejected]: (state, { payload }) => {
      console.log("[findWorkerById.rejected]", payload);
      state.value.error = payload;
      state.value.errorMessage = payload.message;
      state.value.errorCode = payload.status;
      state.value.loadingShift = false;
    },
  },
});

export const {
  setSelectedRow,
  refreshDataGrid,
  refreshImageListData,
  setPage,
  refreshCategorizeData,
  clearWorkersInCategory,
  clearError,
  setSelectedRowId,
} = workerSlice.actions;

export default workerSlice.reducer;
