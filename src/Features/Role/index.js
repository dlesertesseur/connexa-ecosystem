import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { actions, API } from "../../Constants";

const initialState = {
  value: {
    loading: false,
    action: null,
    roles: [],
    contexts: [],
    applications: [],
    applicationsByRole: [],
    selectedRole: null,
    error: null,
    errorMessage: null,
  },
};

export const findAllRoles = createAsyncThunk(
  "role/findAllRoles",
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

      const url = API.role.findAll;
      const res = await fetch(url, requestOptions);
      const data = await res.json();

      return data;
    } catch (error) {
      return asyncThunk.rejectWithValue(error);
    }
  }
);

export const findRoleById = createAsyncThunk(
  "role/findRoleById",
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

      const url = API.role.findById + parameters.id;
      const res = await fetch(url, requestOptions);
      const data = await res.json();
      return data;
    } catch (error) {
      return asyncThunk.rejectWithValue(error);
    }
  }
);

export const findAllContexts = createAsyncThunk(
  "role/findAllContexts",
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

      const url = API.context.findAll;
      const res = await fetch(url, requestOptions);
      const data = await res.json();

      return data;
    } catch (error) {
      return asyncThunk.rejectWithValue(error);
    }
  }
);

export const createRole = createAsyncThunk(
  "role/createRole",
  async (parameters, asyncThunk) => {
    try {
      const body = JSON.stringify({
        name: parameters.data.name,
        contextId: parameters.data.context,
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

      const url = API.role.create;
      const res = await fetch(url, requestOptions);
      const data = await res.json();

      return data;
    } catch (error) {
      return asyncThunk.rejectWithValue(error);
    }
  }
);

export const updateRole = createAsyncThunk(
  "role/updateRole",
  async (parameters, asyncThunk) => {
    try {
      const body = JSON.stringify({
        id: parameters.data.id,
        name: parameters.data.name,
        contextId: parameters.data.context,
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

      const res = await fetch(API.role.update, requestOptions);
      const data = await res.json();
      return data;
    } catch (error) {
      return asyncThunk.rejectWithValue(error);
    }
  }
);

export const deleteRole = createAsyncThunk(
  "role/deleteRole",
  async (parameters, asyncThunk) => {
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

      await fetch(API.role.delete + parameters.id, requestOptions).then(
        (response) => {
          return response;
        }
      );
    } catch (error) {
      return asyncThunk.rejectWithValue(error);
    }
  }
);

export const findAllApplications = createAsyncThunk(
  "role/findAllApplications",
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

      const res = await fetch(API.application.findAll, requestOptions);
      const data = await res.json();
      return data;
    } catch (error) {
      return asyncThunk.rejectWithValue(error);
    }
  }
);

export const findAllApplicationsByRoleId = createAsyncThunk(
  "role/findAllApplicationsByRoleId",
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

      const res = await fetch(
        API.role.findAllApplicationsByRole + parameters.id,
        requestOptions
      );
      const data = await res.json();
      return data;
    } catch (error) {
      return asyncThunk.rejectWithValue(error);
    }
  }
);

export const roleSlice = createSlice({
  name: "role",
  initialState,
  reducers: {
    resetError: (state) => {
      state.value.error = false;
      state.value.errorMessage = null;
    },

    resetApplicationsData: (state) => {
      state.value.applicationsByRole = null;
    },
  },
  extraReducers: {
    [findAllRoles.pending]: (state) => {
      state.value.loading = true;
      state.value.error = false;
      state.value.errorMessage = null;
    },

    [findAllRoles.fulfilled]: (state, { payload }) => {
      if (payload.error) {
        state.value.error = true;
        state.value.errorMessage = payload.message;
      } else {
        state.value.error = false;
        state.value.errorMessage = null;
        state.value.roles = payload;
        state.value.action = actions.readed;
      }
    },

    [findAllRoles.rejected]: (state, { payload }) => {
      state.value.loading = false;
      state.value.error = true;
      state.value.errorMessage = payload;
    },

    [findRoleById.pending]: (state) => {
      state.value.loading = true;
      state.value.error = false;
      state.value.errorMessage = null;
    },

    [findRoleById.fulfilled]: (state, { payload }) => {
      if (payload.error) {
        state.value.error = true;
        state.value.errorMessage = payload.message;
      } else {
        state.value.error = false;
        state.value.errorMessage = null;
        state.value.selectedRole = payload;
      }
    },

    [findRoleById.rejected]: (state, { payload }) => {
      state.value.loading = false;
      state.value.error = true;
      state.value.errorMessage = payload;
    },

    [findAllContexts.pending]: (state) => {
      state.value.loading = true;
      state.value.error = false;
      state.value.errorMessage = null;
    },

    [findAllContexts.fulfilled]: (state, { payload }) => {
      if (payload.error) {
        state.value.error = true;
        state.value.errorMessage = payload.message;
      } else {
        state.value.error = false;
        state.value.errorMessage = null;
        state.value.contexts = payload;
      }
    },

    [findAllContexts.rejected]: (state, { payload }) => {
      state.value.loading = false;
      state.value.error = true;
      state.value.errorMessage = payload;
    },

    [createRole.pending]: (state) => {
      state.value.loading = true;
      state.value.error = false;
      state.value.errorMessage = null;
    },

    [createRole.fulfilled]: (state, { payload }) => {
      if (payload.error) {
        state.value.error = true;
        state.value.errorMessage = payload.message;
      } else {
        state.value.error = false;
        state.value.errorMessage = null;
        state.value.action = actions.created;
      }
    },

    [createRole.rejected]: (state, { payload }) => {
      state.value.loading = false;
      state.value.error = true;
      state.value.errorMessage = payload;
    },

    [updateRole.pending]: (state) => {
      state.value.loading = true;
      state.value.error = false;
      state.value.errorMessage = null;
    },

    [updateRole.fulfilled]: (state, { payload }) => {
      if (payload.error) {
        state.value.error = true;
        state.value.errorMessage = payload.message;
      } else {
        state.value.error = false;
        state.value.errorMessage = null;
        state.value.action = actions.updated;
      }
    },

    [updateRole.rejected]: (state, { payload }) => {
      state.value.loading = false;
      state.value.error = true;
      state.value.errorMessage = payload;
    },

    [deleteRole.pending]: (state) => {
      state.value.loading = true;
      state.value.error = false;
      state.value.errorMessage = null;
    },

    [deleteRole.fulfilled]: (state, { payload }) => {
      state.value.error = false;
      state.value.errorMessage = null;
      state.value.selectedRole = null;
      state.value.action = actions.deleted;
    },

    [deleteRole.rejected]: (state, { payload }) => {
      state.value.loading = false;
      state.value.error = true;
      state.value.errorMessage = payload;
    },

    [findAllApplications.pending]: (state) => {
      state.value.loading = true;
      state.value.error = false;
      state.value.errorMessage = null;
    },

    [findAllApplications.fulfilled]: (state, { payload }) => {
      if (payload.error) {
        state.value.error = true;
        state.value.errorMessage = payload.message;
      } else {
        state.value.error = false;
        state.value.errorMessage = null;
        state.value.applications = payload;
        state.value.action = actions.applicationsReaded;
      }
    },

    [findAllApplications.rejected]: (state, { payload }) => {
      state.value.loading = false;
      state.value.error = true;
      state.value.errorMessage = payload;
    },

    [findAllApplicationsByRoleId.pending]: (state) => {
      state.value.loading = true;
      state.value.error = false;
      state.value.errorMessage = null;
    },

    [findAllApplicationsByRoleId.fulfilled]: (state, { payload }) => {
      if (payload.error) {
        state.value.error = true;
        state.value.errorMessage = payload.message;
      } else {
        state.value.error = false;
        state.value.errorMessage = null;
        state.value.applicationsByRole = payload;
      }
    },

    [findAllApplicationsByRoleId.rejected]: (state, { payload }) => {
      state.value.loading = false;
      state.value.error = true;
      state.value.errorMessage = payload;
    },
  },
});

export const { resetError, resetApplicationsData } = roleSlice.actions;

export default roleSlice.reducer;
