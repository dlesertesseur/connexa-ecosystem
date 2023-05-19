import { API } from "../Constants";

async function createRetailer(parameters) {
  try {
    const body = JSON.stringify({
      name: parameters.data.name,
      description: parameters.data.name
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

    const url = API.retailer.create;
    const res = await fetch(url, requestOptions);
    const data = await res.json();
    return data;
  } catch (error) {
    return error;
  }
}

async function updateRetailer(parameters) {
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

    const res = await fetch(API.retailer.update, requestOptions);
    const data = await res.json();
    return data;

  } catch (error) {
    return error;
  }
}

async function deleteRetailer(parameters) {
  try {
    const requestOptions = {
      method: "DELETE",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        token: parameters.token,
      },
    };

    const url = API.retailer.delete + parameters.id;
    await fetch(url, requestOptions).then((response) => {
      return response;
    });
  } catch (error) {
    return error;
  }
}

async function findAllRetailers(parameters) {
  try {
    const requestOptions = {
      method: "GET",
      mode: "cors",
      headers: { "Content-Type": "application/json", token: parameters.token },
    };

    const url = API.retailer.findAll;
    const res = await fetch(url, requestOptions);
    const data = await res.json();

    return data;
  } catch (error) {
    return error;
  }
}

async function findRetailerById(parameters) {
  try {
    const requestOptions = {
      method: "GET",
      mode: "cors",
      headers: { "Content-Type": "application/json", token: parameters.token },
    };

    const url = API.retailer.findById + parameters.id;
    const res = await fetch(url, requestOptions);
    const data = await res.json();

    return data;
  } catch (error) {
    return error;
  }
}

export { createRetailer, updateRetailer, deleteRetailer, findAllRetailers, findRetailerById};
