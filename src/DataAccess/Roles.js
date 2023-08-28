import { API } from "../Constants";

const findAllRolesByUserId = async ({ siteId, userId, token }) => {
  try {
    const requestOptions = {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
    };

    const url = API.auth.findAllRolesByUserId + siteId + "/" + userId;

    const res = await fetch(url, requestOptions);
    const data = await res.json();

    if (res.status !== 200) {
      throw Error(data.message);
    }

    return data;
  } catch (error) {
    return error;
  }
};

const findAllRolesInContext = async (params) => {
  try {
    const requestOptions = {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        token: params.token,
      },
    };

    const url = API.role.findAllRolesInContext + params.contextId;
    const res = await fetch(url, requestOptions);
    const data = await res.json();

    if (res.status !== 200) {
      throw Error(data.message);
    }

    return data;
  } catch (error) {
    return error;
  }
};

const findAllRoles = async ({ token }) => {
  try {
    const requestOptions = {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
    };

    const url = API.role.findAll;

    const res = await fetch(url, requestOptions);
    const data = await res.json();

    if (res.status !== 200) {
      throw Error(data.message);
    }

    return data;
  } catch (error) {
    return error;
  }
};

async function createRole(parameters) {
  try {
    const body = JSON.stringify({
      name: parameters.data.name,
      groupName: parameters.data.groupName,
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
    return error;
  }
}

async function assignApp(parameters) {
  try {
    const requestOptions = {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        token: parameters.token,
      },
    };

    const url = API.applicationRole.create + parameters.appId + "/role/" + parameters.roleId;
    const res = await fetch(url, requestOptions);
    const data = await res.json();
    return data;
  } catch (error) {
    return error;
  }
}

async function unassignApp(parameters) {
  try {
    const requestOptions = {
      method: "DELETE",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        token: parameters.token,
      },
    };

    const url = API.applicationRole.delete + parameters.appId + "/role/" + parameters.roleId;
    const res = await fetch(url, requestOptions);
    const data = await res.json();
    return data;
  } catch (error) {
    return error;
  }
}

async function updateRole(parameters) {
  const body = JSON.stringify({
    id: parameters.data.id,
    name: parameters.data.name,
    groupName: parameters.data.groupName,
    contextId: parameters.data.context,
  });


  console.log("updateRole -> ", parameters);

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
}

async function deleteRole(parameters) {
  try {
    const requestOptions = {
      method: "DELETE",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        token: parameters.token,
      },
    };

    const url = API.role.delete + parameters.data.id;
    await fetch(url, requestOptions);
    const data = await res.json();
    return data;

  } catch (error) {
    return error;
  }
}

async function findRoleById(parameters) {
  try {
    const requestOptions = {
      method: "GET",
      mode: "cors",
      headers: { "Content-Type": "application/json", token: parameters.token },
    };

    const url = API.role.findById + parameters.id;
    const res = await fetch(url, requestOptions);
    const data = await res.json();

    return data;
  } catch (error) {
    return error;
  }
}

export {
  createRole,
  updateRole,
  deleteRole,
  findAllRolesByUserId,
  findAllRolesInContext,
  findAllRoles,
  findRoleById,
  assignApp,
  unassignApp,
};
