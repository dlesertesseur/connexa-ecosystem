import { API } from "../Constants";

async function createOrganization(parameters) {
  try {
    const body = JSON.stringify({
      name: parameters.data.name,
      description: parameters.data.description,
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

    const url = API.organization.create;
    const res = await fetch(url, requestOptions);
    const data = await res.json();
    return data;
  } catch (error) {
    return error;
  }
}

async function updateOrganization(parameters) {
  try {
    const body = JSON.stringify({
      id: parameters.data.id,
      name: parameters.data.name,
      description: parameters.data.description,
    });

    const requestOptions = {
      method: "PUT",
      mode: "cors",
      headers: {
        "Content-Type":"application/json",
        token: parameters.token,
      },
      body: body,
    };

    console.log("updateOrganization requestOptions -> ", requestOptions);

    const res = await fetch(API.organization.update, requestOptions);
    const data = await res.json();
    return data;
  } catch (error) {
    return error;
  }
}

async function deleteOrganization(parameters) {
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

    await fetch(API.organization.delete + parameters.id, requestOptions).then((response) => {
      return response;
    });
  } catch (error) {
    return error;
  }
}

async function findAllOrganizations(parameters) {
  try {
    const requestOptions = {
      method: "GET",
      mode: "cors",
      headers: { "Content-Type": "application/json", token: parameters.token },
    };

    const url = API.organization.findAll;
    const res = await fetch(url, requestOptions);
    const data = await res.json();

    return data;
  } catch (error) {
    return error;
  }
}


async function findOrganizationById(parameters) {
  try {
    const requestOptions = {
      method: "GET",
      mode: "cors",
      headers: { "Content-Type": "application/json", token: parameters.token },
    };

    const url = API.organization.findById + parameters.id;
    const res = await fetch(url, requestOptions);
    const data = await res.json();

    return data;
  } catch (error) {
    return error;
  }
}

export { createOrganization, updateOrganization, deleteOrganization, findAllOrganizations, findOrganizationById};
