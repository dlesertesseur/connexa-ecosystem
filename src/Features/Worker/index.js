import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { actions, API } from "../../Constants";
import { formatDateToDDMMYYYY } from "../../Util";

const initialState = {
  value: {
    loading: false,
    processing: false,
    error: null,
    errorMessage: null,
    errorCode: null,
    loadingCountries: false,
    countries: [],
    organizationsByWorker: null,
    creating: false,
    updating: false,
    workers: [],
    images: [],
    selectedRow: null,
    refreshData: null,
    refreshImageList: Date.now(),
    workersPages: 0,
    totalElements: 0,
    loadingWorker: false,
    worker: null,
    appState: actions.readed,
    selectedRowId: null,
    workerFound: null,
  },
};

export const create = createAsyncThunk("worker/create", async (parameters, asyncThunk) => {
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

    const res = await fetch(API.worker.create, requestOptions);
    const data = await res.json();

    return data;
  } catch (error) {
    return asyncThunk.rejectWithValue(error);
  }
});

export const update = createAsyncThunk("worker/update", async (parameters, asyncThunk) => {
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

    const res = await fetch(API.worker.update, requestOptions);
    const data = await res.json();

    return data;
  } catch (error) {
    return asyncThunk.rejectWithValue(error);
  }
});

export const remove = createAsyncThunk("worker/delete", async (parameters, asyncThunk) => {
  try {
    const requestOptions = {
      method: "DELETE",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        token: parameters.token,
      },
    };

    const url = API.worker.delete + parameters.id + "/organizations/" + parameters.organizationId;
    await fetch(url, requestOptions).then((response) => {
      return response;
    });
  } catch (error) {
    return asyncThunk.rejectWithValue(error);
  }
});

export const findWorkerById = createAsyncThunk("worker/findWorkerById", async (parameters, asyncThunk) => {
  try {
    const requestOptions = {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        token: parameters.token,
      },
    };

    const url = API.worker.findWorkerById + parameters.id;
    const res = await fetch(url, requestOptions);
    const data = await res.json();

    return data;
  } catch (error) {
    return asyncThunk.rejectWithValue(error);
  }
});

export const findAllCountries = createAsyncThunk("worker/findAllCountries", async (parameters, asyncThunk) => {
  try {
    const requestOptions = {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        token: parameters.token,
      },
    };

    const url = API.worker.findAllCountries;
    const res = await fetch(url, requestOptions);
    const data = await res.json();

    return data;
  } catch (error) {
    return asyncThunk.rejectWithValue(error);
  }
});

export const findAllWorkersByOrganization = createAsyncThunk(
  "worker/findAllWorkersByOrganization",
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

      const url = API.worker.findAllWorkersByOrganization + parameters.organizationId;
      const res = await fetch(url, requestOptions);
      const data = await res.json();

      return data;
    } catch (error) {
      return asyncThunk.rejectWithValue(error);
    }
  }
);

export const findAllOrganizationsByWorker = createAsyncThunk(
  "worker/findAllOrganizationsByWorker",
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

      const url = API.worker.findAllOrganizationsByWorker + parameters.id + "/organizations";
      const res = await fetch(url, requestOptions);
      const data = await res.json();

      return data;
    } catch (error) {
      return asyncThunk.rejectWithValue(error);
    }
  }
);

export const findAllWorkerByIdentification = createAsyncThunk(
  "worker/findAllWorkerByIdentification",
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

      const url = API.worker.findAllWorkerByIdentification + parameters.nid;
      const res = await fetch(url, requestOptions);
      const data = await res.json();

      return data;
    } catch (error) {
      return asyncThunk.rejectWithValue(error);
    }
  }
);

export const addRelationWorkerOrganization = createAsyncThunk(
  "worker/addRelationWorkerOrganization",
  async (parameters, asyncThunk) => {
    try {
      const requestOptions = {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          token: parameters.token,
        },
      };

      const url =
        API.worker.addRelationWorkerOrganization + parameters.organizationId + "/workers/" + parameters.workerId;

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

    /*FIND ALL COUNTRIES*/
    [findAllCountries.pending]: (state) => {
      state.value.loadingCountries = true;
      state.value.error = null;
      state.value.errorMessage = null;
      state.value.errorCode = null;
    },

    [findAllCountries.fulfilled]: (state, { payload }) => {
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
      state.value.loadingCountries = false;
    },

    [findAllCountries.rejected]: (state, { payload }) => {
      console.log("[findAllCountries.rejected]", payload);

      state.value.error = payload;
      state.value.errorMessage = payload.message;
      state.value.errorCode = payload.status;
      state.value.loadingCountries = false;
    },

    //FIND ALL WORKERS BY ORGANIZATION
    [findAllWorkersByOrganization.pending]: (state) => {
      state.value.loading = true;
      state.value.error = null;
      state.value.errorMessage = null;
      state.value.errorCode = null;
    },

    [findAllWorkersByOrganization.fulfilled]: (state, { payload }) => {
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

    [findAllWorkersByOrganization.rejected]: (state, { payload }) => {
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
      state.value.error = payload;
      state.value.errorMessage = payload.message;
      state.value.errorCode = payload.status;
      state.value.loading = false;
    },

    /*FIND WORKER BY ID*/
    [findWorkerById.pending]: (state) => {
      state.value.loadingWorkerloadingWorker = false;
      state.value.error = null;
      state.value.errorMessage = null;
      state.value.errorCode = null;
    },

    [findWorkerById.fulfilled]: (state, { payload }) => {
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
      state.value.loadingWorker = false;
    },

    [findWorkerById.rejected]: (state, { payload }) => {
      state.value.error = payload;
      state.value.errorMessage = payload.message;
      state.value.errorCode = payload.status;
      state.value.loadingWorker = false;
    },

    //FIND WORKER BY EMAIL
    [findAllWorkerByIdentification.pending]: (state) => {
      state.value.loading = true;
      state.value.error = null;
      state.value.errorMessage = null;
      state.value.errorCode = null;
      state.value.organizationsByWorker = null;
      state.value.workerFound = null;
    },

    [findAllWorkerByIdentification.fulfilled]: (state, { payload }) => {
      if (payload.error) {
        state.value.error = payload.error;
        state.value.errorMessage = payload.message;
        state.value.errorCode = payload.status;
      } else {
        state.value.workerFound = payload;
        state.value.errorMessage = null;
        state.value.errorCode = null;
        state.value.error = null;
      }
      state.value.loading = false;
    },

    [findAllWorkerByIdentification.rejected]: (state, { payload }) => {
      state.value.error = payload;
      state.value.errorMessage = payload.message;
      state.value.errorCode = payload.status;
      state.value.loading = false;
    },

    //FIND WORKER BY EMAIL
    [addRelationWorkerOrganization.pending]: (state) => {
      state.value.loading = true;
      state.value.error = null;
      state.value.errorMessage = null;
      state.value.errorCode = null;
    },

    [addRelationWorkerOrganization.fulfilled]: (state, { payload }) => {
      //console.log("[addRelationWorkerOrganization.fulfilled]", payload);
      if (payload.error) {
        state.value.error = payload.error;
        state.value.errorMessage = payload.message;
        state.value.errorCode = payload.status;
      } else {
        state.value.errorMessage = null;
        state.value.errorCode = null;
        state.value.error = null;
        state.value.worker = null;
        state.value.workerFound = null;
        state.value.organizationsByWorker = null;
        state.value.appState = actions.reload;
      }
      state.value.loading = false;
    },

    [addRelationWorkerOrganization.rejected]: (state, { payload }) => {
      state.value.error = payload;
      state.value.errorMessage = payload.message;
      state.value.errorCode = payload.status;
      state.value.loading = false;
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
