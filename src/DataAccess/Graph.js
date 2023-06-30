import { API } from "../Constants";

const createGraph = async (parameters) => {
  try {
    const body = JSON.stringify(parameters.data);

    const requestOptions = {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        token: parameters.token,
      },
      body: body,
    };

    const url = API.graph.create + parameters.siteId + "/floors/" + parameters.floorId + "/graphs";

    const res = await fetch(url, requestOptions);
    const data = await res.json();

    return data;
  } catch (error) {
    return error;
  }
};

const findAllGraphsHeaders = async (parameters) => {
  try {
    const requestOptions = {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        token: parameters.token,
      },
    };
    const url = API.graph.findAllHeaders + "/" + parameters.siteId + "/floors/" + parameters.floorId +"/graphs";
    const res = await fetch(url, requestOptions);
    const data = await res.json();

    return data;
  } catch (error) {
    return error;
  }
};

const findGraphById = async (parameters) => {
  try {
    const requestOptions = {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        token: parameters.token,
      },
    };
    const url = API.graph.findById + "/" + parameters.siteId + "/floors/" + parameters.floorId +"/graphs/" + parameters.graphId;
    const res = await fetch(url, requestOptions);
    const data = await res.json();

    return data;
  } catch (error) {
    return error;
  }
};

const updateGraph = async (parameters) => {
  try {
    const body = JSON.stringify(parameters.data);

    const requestOptions = {
      method: "PUT",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        token: parameters.token,
      },
      body: body,
    };

    const url = API.graph.update + parameters.siteId + "/floors/" + parameters.floorId + "/graphs";
    const res = await fetch(url, requestOptions);
    const data = await res.json();

    return data;
  } catch (error) {
    return error;
  }
};

const deleteGraph = async (parameters) => {
  try {
    const requestOptions = {
      method: "DELETE",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        token: parameters.token,
      },
    };
    const url = API.graph.findById + "/" + parameters.siteId + "/floors/" + parameters.floorId +"/graphs/" + parameters.rackId;
    const res = await fetch(url, requestOptions);
    const data = await res.json();

    return data;
  } catch (error) {
    return error;
  }
};

export { createGraph, findAllGraphsHeaders, findGraphById, updateGraph, deleteGraph };
