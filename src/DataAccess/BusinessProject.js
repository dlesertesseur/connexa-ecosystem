import { API } from "../Constants";
import { BUSINESS } from "../Constants/BUSINESS";

async function createBusinessProject(parameters) {
  try {
    const obj = {
      name: parameters.values.campaign,
      description: parameters.values.description,
    };

    const body = JSON.stringify(obj);

    const requestOptions = {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        apikey: parameters.apikey,
      },
      body: body,
    };

    const url = API.businessProject.create;
    const res = await fetch(url, requestOptions);
    const data = await res.json();

    return data;
  } catch (error) {
    return error;
  }
}

async function updateBusinessProject(parameters) {
  try {
    const body = JSON.stringify({
      id: parameters.data.id,
      name: parameters.data.name,
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

    const res = await fetch(API.businessProject.update, requestOptions);
    const data = await res.json();
    return data;
  } catch (error) {
    return error;
  }
}

async function deleteBusinessProject(parameters) {
  try {
    const requestOptions = {
      method: "DELETE",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        token: parameters.token,
      },
    };

    const url = API.businessProject.delete + parameters.id;
    await fetch(url, requestOptions).then((response) => {
      return response;
    });
  } catch (error) {
    return error;
  }
}

async function findAllBusinessProjects(parameters) {
  try {
    const requestOptions = {
      method: "GET",
      mode: "cors",
      headers: { "Content-Type": "application/json", apikey: parameters.apikey },
    };

    // const url = API.businessProject.findAllByUserId + parameters.userId;
    // const res = await fetch(url, requestOptions);
    // const data = await res.json();

    const data = BUSINESS.list;

    return data;
  } catch (error) {
    return error;
  }
}

async function findBusinessProjectsById(parameters) {
  try {
    const requestOptions = {
      method: "GET",
      mode: "cors",
      headers: { "Content-Type": "application/json", apikey: parameters.token },
    };

    // const url = API.businessProject.findAllByUserId + parameters.userId;
    // const res = await fetch(url, requestOptions);
    // const data = await res.json();

    const data = BUSINESS.list.find((r) => (r.id = parameters.id));

    return data;
  } catch (error) {
    return error;
  }
}

export {
  createBusinessProject,
  updateBusinessProject,
  deleteBusinessProject,
  findAllBusinessProjects,
  findBusinessProjectsById,
};
