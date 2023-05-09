import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { API } from "../../Constants";

const getUserLS = () => {
  const value = localStorage.getItem("user");

  let user = null;
  if (value !== null) {
    user = JSON.parse(value);
  }
  return user;
};

const setUserLS = (user) => {
  localStorage.setItem("user", JSON.stringify(user));
};

const removeUserLS = () => {
  localStorage.removeItem("user");
};

const createState = () => {
  //Actualiza la informacion con lo almacenado en el localStorage
  let user = getUserLS();
  if (user === null) {
    user = {
      id: null,
      email: null,
      firstName: null,
      lastName: null,
      token: null,
    };
  }

  return user;
};

const initialState = {
  value: {
    user: createState(),
    loading: false,
    organizations: [],
    organizationSelected: null,
    projectSelected: null,
    siteSelected: null,
    updating: false,
    error: null,
    appError: null,
  },
};

export const signUp = createAsyncThunk("auth/signUp", async (parameters, asyncThunk) => {
  try {
    const body = JSON.stringify({
      firstname: parameters.firstName,
      lastname: parameters.lastName,
      email: parameters.email,
      password: parameters.password,
    });

    const requestOptions = {
      method: "POST",
      mode: "cors",
      headers: { "Content-Type": "application/json" },
      body: body,
    };

    const res = await fetch(API.auth.signUp, requestOptions);
    const data = await res.json();

    return data;
  } catch (error) {
    return asyncThunk.rejectWithValue(error);
  }
});

export const signIn = createAsyncThunk("auth/signIn", async (parameters, asyncThunk) => {
  const apiUrl = API.auth.signIn;

  const body = JSON.stringify({
    email: parameters.email,
    password: parameters.password,
  });

  const requestOptions = {
    method: "POST",
    mode: "cors",
    headers: { "Content-Type": "application/json" },
    body: body,
  };

  try {
    const res = await fetch(apiUrl, requestOptions);
    const data = await res.json();

    return data;
  } catch (error) {
    return asyncThunk.rejectWithValue(error);
  }
});

export const changePassword = createAsyncThunk("auth/changePassword", async (parameters, asyncThunk) => {
  const apiUrl = API.auth.changePassword;

  const body = new URLSearchParams({
    email: parameters.email,
  });

  const requestOptions = {
    method: "POST",
    mode: "cors",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body,
  };

  try {
    const res = await fetch(apiUrl, requestOptions);
    const data = await res.json();

    return data;
  } catch (error) {
    return asyncThunk.rejectWithValue(error);
  }
});

export const byUserId = createAsyncThunk("auth/byUserId", async (parameters, asyncThunk) => {
  try {
    const requestOptions = {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        token: parameters.token,
      },
    };

    const url = API.auth.byUserId + parameters.id;
    const res = await fetch(url, requestOptions);
    const data = await res.json();

    return data;
  } catch (error) {
    return asyncThunk.rejectWithValue(error);
  }
});

export const assignRole = createAsyncThunk("auth/assignRole", async (parameters, asyncThunk) => {
  try {
    const body = JSON.stringify({
      siteId: parameters.siteId,
      userId: parameters.userId,
      roleId: parameters.roleId,
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

    let url = API.auth.assignRole;

    await fetch(url, requestOptions).then((response) => {
      return response;
    });

  } catch (error) {
    return asyncThunk.rejectWithValue(error);
  }
});

export const unassignRole = createAsyncThunk("auth/unassignRole", async (parameters, asyncThunk) => {
  try {
    const requestOptions = {
      method: "DELETE",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        token: parameters.token,
      },
    };

    let url =
      API.auth.unassignRole +
      parameters.siteId + "/" +
      parameters.userId +"/" +
      parameters.roleId;

    await fetch(url, requestOptions).then((response) => {
      return response;
    });

  } catch (error) {
    return asyncThunk.rejectWithValue(error);
  }
});

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    selectOrganization: (state, { payload }) => {
      state.value.organizationSelected = payload;
      state.value.projectSelected = payload.projects[0];
    },

    selectProject: (state, { payload }) => {
      console.log("selectProject -> ", payload);
      state.value.projectSelected = payload;
      state.value.siteSelected = payload?.sites[0];
    },

    selectSite: (state, { payload }) => {
      console.log("selectSite -> ", payload);
      state.value.siteSelected = payload;
    },

    logOut: (state) => {
      state.value.user.id = null;
      state.value.user.email = null;
      state.value.user.token = null;
      state.value.user.firstName = null;
      state.value.user.lastName = null;

      state.value.loading = false;
      state.value.organizations = [];
      state.value.organizationSelected = null;
      state.value.projectSelected = null;
      state.value.siteSelected = null;
      state.value.updating = false;
      state.value.error = null;
      state.value.appError = null;

      removeUserLS();
    },

    getUserName: (state) => {
      const ret = state.value.user.firstName + " " + state.value.user.lastName;
      return ret;
    },

    clearError: (state) => {
      state.value.error = "";
      state.value.statusError = null;
    },

    setAppError: (state, { payload }) => {
      state.value.appError = payload;
    },

  },
  extraReducers: {
    //SIGNUP
    [signUp.pending]: (state) => {
      state.value.loading = true;
    },
    [signUp.fulfilled]: (state, { payload }) => {
      if (payload.error) {
        state.value.error = payload.error.message;
      }
      state.value.loading = false;

      state.value.user.id = payload.id;
      state.value.user.email = payload.email;
      state.value.error = null;
    },
    [signUp.rejected]: (state, { payload }) => {
      state.value.loading = false;
      state.value.error = payload;
    },

    //SIGNIN
    [signIn.pending]: (state) => {
      state.value.loading = true;
    },
    [signIn.fulfilled]: (state, { payload }) => {
      if (payload.error) {
        state.value.error = payload;
      }
      else{
        state.value.user.token = payload.token;
        state.value.user.email = payload.user.email;
        state.value.user.firstName = payload.user.firstname;
        state.value.user.lastName = payload.user.lastname;
        state.value.user.id = payload.user.id;
        state.value.error = null;
  
        setUserLS(state.value.user);
      }

      state.value.loading = false;
    },

    [signIn.rejected]: (state, { payload }) => {
      state.value.loading = false;
      state.value.user.token = null;
      state.value.user.email = null;
      state.value.user.firstName = null;
      state.value.user.lastName = null;
      state.value.user.id = null;
      state.value.appError = null;
      state.value.error = payload;
    },

    //CHANGE PASSWORD
    [changePassword.pending]: (state) => {
      state.value.loading = true;
    },
    [changePassword.fulfilled]: (state, { payload }) => {
      if (payload.error) {
        state.value.error = payload.error.message;
      }
      state.value.loading = false;
      state.value.error = null;
      state.value.statusError = null;
    },
    [changePassword.rejected]: (state, { payload }) => {
      state.value.loading = false;
      state.value.statusError = null;
      state.value.error = payload;
    },

    /*Autorizations by user*/
    [byUserId.pending]: (state) => {
      state.value.loading = true;
      state.value.error = null;
      state.value.statusError = null;
    },

    [byUserId.fulfilled]: (state, { payload }) => {
      if (payload.error) {
        state.value.error = payload;
      } else {
        if (payload !== null) {
          const organizations = payload;

          if (organizations.length > 0) {
            state.value.organizations = organizations;
            state.value.organizationSelected = organizations[0];
            const projects = organizations[0].projects;

            if (projects !== undefined) {
              if (projects.length > 0) {
                state.value.projectSelected = projects[0];

                const sites = projects[0].sites;
                const site = sites[0];
                state.value.siteSelected = site;
              }
            }
          }
        }

        state.value.error = null;
      }
      state.value.loading = false;
    },

    [byUserId.rejected]: (state, { payload }) => {
      state.value.loading = false;
      state.value.error = payload;
    },

    /*CREATE*/
    [assignRole.pending]: (state) => {
      state.value.updating = true;
      state.value.error = null;
    },

    [assignRole.fulfilled]: (state, { payload }) => {
      if (payload) {
        state.value.error = payload.message;
      } else {
        state.value.error = null;
      }
      state.value.updating = false;
    },

    [assignRole.rejected]: (state, { payload }) => {
      state.value.updating = false;
      state.value.error = payload;
    },

    /*DELETE*/
    [unassignRole.pending]: (state) => {
      state.value.updating = true;
      state.value.error = null;
    },

    [unassignRole.fulfilled]: (state, { payload }) => {
      if (payload) {
        state.value.error = payload.message;
      } else {
        state.value.error = null;
      }
      state.value.updating = false;
    },

    [unassignRole.rejected]: (state, { payload }) => {
      state.value.updating = false;
      state.value.error = payload;
    },
  },
});

export const { resetAuthData, logOut, getUserName, clearError, selectSite, selectProject, selectOrganization, setAppError } =
  authSlice.actions;

export default authSlice.reducer;
