import { API } from "../Constants";

async function findAllApplications(params) {
  try {
    const requestOptions = {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        token: params.token,
      },
    };

    const res = await fetch(API.application.findAll, requestOptions);
    const data = await res.json();
    return data;
  } catch (error) {
    return error;
  }
}

async function findAllApplicationsByRoleId(params, setData) {
  try {
    const requestOptions = {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        token: params.token,
      },
    };

    const res = await fetch(API.role.findAllApplicationsByRole + params.roleId, requestOptions);
    const data = await res.json();
    return data;
  } catch (error) {
    return error;
  }
}

async function findApplicationById(params, setData) {
  try {
    const requestOptions = {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        token: params.token,
      },
    };

    const res = await fetch(API.application.findById + params.id, requestOptions);
    const data = await res.json();
    return data;
  } catch (error) {
    return error;
  }
}

async function createApplication(parameters) {
  try {
    const body = JSON.stringify({
      name: parameters.data.name,
      description: parameters.data.description,
      path: parameters.data.path,
      icon: parameters.data.icon,
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

    const url = API.application.create;
    const res = await fetch(url, requestOptions);
    const data = await res.json();
    return data;
  } catch (error) {
    return error;
  }
}


async function updateApplication(parameters) {
  try {
    const body = JSON.stringify({
      id: parameters.data.id,
      name: parameters.data.name,
      description: parameters.data.description,
      path: parameters.data.path,
      icon: parameters.data.icon,
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

    const res = await fetch(API.application.update, requestOptions);
    const data = await res.json();
    return data;
  } catch (error) {
    return error;
  }
}

async function deleteApplication(parameters) {
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

    await fetch(API.application.delete + parameters.id, requestOptions).then((response) => {
      return response;
    });
  } catch (error) {
    return error;
  }
}


export { findAllApplicationsByRoleId, findApplicationById, findAllApplications, createApplication, updateApplication, deleteApplication};
