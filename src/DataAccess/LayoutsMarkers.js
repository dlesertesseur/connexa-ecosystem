import { API } from "../Constants";

const findAllLayoutMarkersById = async (parameters) => {
  try {
    const requestOptions = {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        token: parameters.token,
      },
    };
    const url = API.layoutMarkers.findAllById + "/" + parameters.siteId + "/floors/" + parameters.floorId + "/markers/all";
    const res = await fetch(url, requestOptions);
    const data = await res.json();

    return data;
  } catch (error) {
    return error;
  }
};

const createLayoutMarker = async (parameters) => {
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

    const url = API.layoutMarkers.create + parameters.siteId + "/floors/" + parameters.floorId + "/markers";

    const res = await fetch(url, requestOptions);
    const data = await res.json();

    return data;
  } catch (error) {
    return error;
  }
};

const findLayoutMarkerById = async (parameters) => {
  try {
    const requestOptions = {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        token: parameters.token,
      },
    };
    const url = API.layoutMarkers.findById + parameters.siteId + "/floors/" + parameters.floorId + "/markers/" + parameters.layoutId;
    const res = await fetch(url, requestOptions);
    const data = await res.json();

    return data;
  } catch (error) {
    return error;
  }
};

const updateLayoutMarker = async (parameters) => {
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

    const url = API.layoutMarkers.update + parameters.siteId + "/floors/" + parameters.floorId + "/markers";
    const res = await fetch(url, requestOptions);
    const data = await res.json();

    return data;
  } catch (error) {
    return error;
  }
};

const deleteLayoutMarker = async (parameters) => {
  try {
    const body = JSON.stringify(parameters.data);

    const requestOptions = {
      method: "DELETE",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        token: parameters.token,
      },
      body: body,
    };

    const url = API.layoutMarkers.delete + parameters.siteId + "/floors/" + parameters.floorId + "/markers/" + parameters.layoutId;
    const res = await fetch(url, requestOptions);
    const data = await res.json();

    return data;
  } catch (error) {
    return error;
  }
};

const saveLayoutMarkers = async (parameters) => {
  try {
    const body = JSON.stringify(parameters.markers);

    const requestOptions = {
      method: "PUT",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        token: parameters.token,
      },
      body: body,
    };

    const url = API.layoutMarkers.save + parameters.siteId + "/floors/" + parameters.floorId + "/markers/posandrots";
    const res = await fetch(url, requestOptions);
    const data = await res.json();

    return data;
  } catch (error) {
    return error;
  }
};

export { createLayoutMarker, updateLayoutMarker, deleteLayoutMarker, findLayoutMarkerById, findAllLayoutMarkersById, saveLayoutMarkers };
