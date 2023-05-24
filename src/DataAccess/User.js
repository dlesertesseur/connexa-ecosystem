import { API } from "../Constants";

async function createUser(parameters) {
  const obj = { ...parameters.data, active: true, password: "11111111" };

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

    const url = API.user.findAllUserByPage + parameters.pageNbr + "/" + parameters.itemsByPage;
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

    const url = API.user.findByEmail + "?email=" + parameters.email;
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
    return error;
  }
};

async function assignRol(parameters) {
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

    const res = await fetch(url, requestOptions);
    const data = await res.json();
    return data;
  } catch (error) {
    console.log("assignRol -> error", error);
    return error;
  }
}

async function unassignRol(parameters) {
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
      parameters.projectId +
      "/" +
      parameters.siteId +
      "/" +
      parameters.userId +
      "/" +
      parameters.roleId;

    const res = await fetch(url, requestOptions);
    const data = await res.json();
    return data;
  } catch (error) {
    return error;
  }
}

async function getRoleBySiteIdAndUserId(parameters) {
  try {
    const requestOptions = {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        token: parameters.token,
      },
    };

    let url = API.auth.findAllRoleSiteIdAndUserId + "/" + parameters.siteId + "/" + parameters.userId;

    const res = await fetch(url, requestOptions);
    const data = await res.json();

    return data;
  } catch (error) {
    console.log("assignRol -> error", error);
    return error;
  }
}

export const uploadImage = async (parameters) => {
  try {
    const requestOptions = {
      method: "POST",
      mode: "cors",
      headers: {
        token: parameters.token,
      },
      body: parameters.data,
    };

    const url = API.user.uploadImage + parameters.userId;
    const res = await fetch(url, requestOptions);
    const data = await res.json();

    return data;
  } catch (error) {
    return(error);
  }
};

const getAllImages = async (parameters) => {
  try {
    const requestOptions = {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        token: parameters.token,
      },
    };

    let url = API.user.getAllImages + parameters.userId;

    const res = await fetch(url, requestOptions);
    const data = await res.json();

    return data;
  } catch (error) {
    console.log("getAllImages -> error", error);
    return error;
  }
};

async function deleteUserImage(parameters) {
  try {
    const requestOptions = {
      method: "DELETE",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        token: parameters.token,
      },
    };

    const url = API.user.deleteImage + parameters.id;
    await fetch(url, requestOptions).then((response) => {
      return response;
    });
  } catch (error) {
    return error;
  }
}

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
  assignRol,
  unassignRol,
  getRoleBySiteIdAndUserId,
  getAllImages,
  deleteUserImage,
};
