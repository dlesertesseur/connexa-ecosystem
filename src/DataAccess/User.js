import { API } from "../Constants";

async function createUser(parameters) {

  const obj = {...parameters.data, active:true, password:"11111111"}

  try {
    const body = JSON.stringify(obj);

    const requestOptions = {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        token: parameters.token,
      },
      body: body,
    };

    const url = API.user.create;    
    const res = await fetch(url, requestOptions);
    const data = await res.json();

    return data;
  } catch (error) {
    return error;
  }
}

async function updateUser(parameters) {
  try {
    const body = JSON.stringify(parameters.values);

    const requestOptions = {
      method: "PUT",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        token: parameters.token,
      },
      body: body,
    };

    const res = await fetch(API.user.update, requestOptions);
    const data = await res.json();
    return data;
  } catch (error) {
    return error;
  }
}

async function deleteUser(parameters) {
  try {
    const requestOptions = {
      method: "DELETE",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        token: parameters.token,
      },
    };

    const url = API.user.delete + parameters.id;
    await fetch(url, requestOptions).then((response) => {
      return response;
    });
  } catch (error) {
    return error;
  }
}

async function findAllUsersByOrganization(parameters) {
  try {
    const requestOptions = {
      method: "GET",
      mode: "cors",
      headers: { "Content-Type": "application/json", token: parameters.token },
    };

    const url = API.user.findAllByIdProjectId + parameters.id;
    const res = await fetch(url, requestOptions);
    const data = await res.json();

    return data;
  } catch (error) {
    return error;
  }
}

async function findAllUsersByPage(parameters) {
  try {
    const requestOptions = {
      method: "GET",
      mode: "cors",
      headers: { "Content-Type": "application/json", token: parameters.token },
    };

    const url =
      API.user.findAllUserByPage +
      parameters.pageNbr +
      "/" +
      parameters.itemsByPage;
    const res = await fetch(url, requestOptions);
    const data = await res.json();

    return data;
  } catch (error) {
    return error;
  }
}

async function findAllUsers(parameters) {
  try {
    const requestOptions = {
      method: "GET",
      mode: "cors",
      headers: { "Content-Type": "application/json", token: parameters.token },
    };

    const url = API.user.getAllUsers;
    const res = await fetch(url, requestOptions);
    const data = await res.json();

    return data;
  } catch (error) {
    return error;
  }
}

async function findUserById(parameters) {
  try {
    const requestOptions = {
      method: "GET",
      mode: "cors",
      headers: { "Content-Type": "application/json", token: parameters.token },
    };

    const url = API.user.findById + parameters.id;
    const res = await fetch(url, requestOptions);
    const data = await res.json();

    return data;
  } catch (error) {
    return error;
  }
}

async function findUserByEmail(parameters) {
  try {
    const requestOptions = {
      method: "GET",
      mode: "cors",
      headers: { "Content-Type": "application/json", token: parameters.token },
    };

    const url = API.user.findByEmail +"?email="+ parameters.email;

console.log("findUserByEmail url ->", url);

    const res = await fetch(url, requestOptions);
    const data = await res.json();

    return data;
  } catch (error) {
    return error;
  }
}

const findAllCountries = async (parameters, asyncThunk) => {
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
};

export {
  createUser,
  updateUser,
  deleteUser,
  findAllUsersByPage,
  findAllUsersByOrganization,
  findAllUsers,
  findUserById,
  findUserByEmail,
  findAllCountries,
};
