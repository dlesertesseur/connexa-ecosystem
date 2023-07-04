import { API } from "../Constants";

async function authenticate(parameters) {

  const body = JSON.stringify({
    email: parameters.email,
    password: parameters.password,
  });

  try {
    const requestOptions = {
      method: "POST",
      mode: "cors",
      headers: { "Content-Type": "application/json"},
      body:body
    };

    const url = API.wms.authenticate;
    const res = await fetch(url, requestOptions);
    const data = await res.json();

    return data;
  } catch (error) {
    return error;
  }
}


async function getLocationStatus(parameters) {
  try {
    const requestOptions = {
      method: "GET",
      mode: "cors",
      headers: { "Content-Type": "application/json", token: parameters.token },
    };

    const url = API.wms.getLocationStatus;
    const res = await fetch(url, requestOptions);
    const data = await res.json();

    return data;
  } catch (error) {
    return error;
  }
}

async function getLocationTypes(parameters) {
  try {
    const requestOptions = {
      method: "GET",
      mode: "cors",
      headers: { "Content-Type": "application/json", token: parameters.token },
    };

    const url = API.wms.getLocationTypes;
    const res = await fetch(url, requestOptions);
    const data = await res.json();

    return data;
  } catch (error) {
    return error;
  }
}

async function getTrademarks(parameters) {
  try {
    const requestOptions = {
      method: "GET",
      mode: "cors",
      headers: { "Content-Type": "application/json", token: parameters.token },
    };

    const url = API.wms.getTrademarks;
    const res = await fetch(url, requestOptions);
    const data = await res.json();

    return data;
  } catch (error) {
    return error;
  }
}

async function getLocations(parameters) {
  try {
    const requestOptions = {
      method: "GET",
      mode: "cors",
      headers: { "Content-Type": "application/json", token: parameters.token },
    };

    const url = API.wms.getLocations + parameters.filter;
    const res = await fetch(url, requestOptions);
    const data = await res.json();

    return data;
  } catch (error) {
    return error;
  }
}


export { authenticate, getLocationStatus, getLocationTypes, getTrademarks, getLocations };
