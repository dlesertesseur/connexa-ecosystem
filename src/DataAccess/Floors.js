import { API } from "../Constants";

const findAllFloorsBySiteId = async (parameters) => {
  try {
    const requestOptions = {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        token: parameters.token,
      },
    };
    const url = API.floor.findAll + "/" + parameters.siteId;

    const res = await fetch(url, requestOptions);
    const data = await res.json();

    return data;
  } catch (error) {
    return error;
  }
};

const createFloor = async (parameters) => {
  try {
    parameters.pixelmeterrelation=0;

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

    const url = API.floor.create + parameters.siteId;

    const res = await fetch(url, requestOptions);
    const data = await res.json();

    return data;
  } catch (error) {
    return error;
  }
};

const findFloorById = async (parameters) => {
  try {
    const requestOptions = {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        token: parameters.token,
      },
    };
    const url = API.floor.findById + "/" + parameters.floorId
    const res = await fetch(url, requestOptions);
    const data = await res.json();

    return data;
  } catch (error) {
    return error;
  }
};

const updateFloor = async (parameters) => {
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

    const url = API.floor.update;
    const res = await fetch(url, requestOptions);
    const data = await res.json();

    return data;
  } catch (error) {
    return error;
  }
};

const deleteFloor = async (parameters) => {
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

    const url = API.floor.delete + parameters.floorId;
    const res = await fetch(url, requestOptions);
    const data = await res.json();

    return data;
  } catch (error) {
    return error;
  }
};

const findAllImagesByFloorById = async (parameters) => {
  try {
    const requestOptions = {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        token: parameters.token,
      },
    };
    const url = API.floor.findAllImages + "/" + parameters.siteId + "/floors/" + parameters.floorId + "/images"
    const res = await fetch(url, requestOptions);
    const data = await res.json();

    return data;
  } catch (error) {
    return error;
  }
};

const uploadImage = async (parameters) => {
  try {
    parameters.pixelmeterrelation=0;

    const requestOptions = {
      method: "POST",
      mode: "cors",
      headers: {
        token: parameters.token,
      },
      body: parameters.data,
    };

    const url = API.floor.uploadImage + "/" + parameters.siteId + "/floors/" + parameters.floorId + "/images"

    const res = await fetch(url, requestOptions);
    const data = await res.json();

    return data;
  } catch (error) {
    return error;
  }
};

const deleteImage = async (parameters) => {
  try {
    const requestOptions = {
      method: "DELETE",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        token: parameters.token,
      },
    };

    const url = API.floor.uploadImage + "/" + parameters.siteId + "/floors/" + parameters.floorId + "/images/" + parameters.id

    const res = await fetch(url, requestOptions);
    const data = await res.json();

    return data;
  } catch (error) {
    return error;
  }
};
export { findAllFloorsBySiteId, createFloor, updateFloor, deleteFloor, findFloorById, findAllImagesByFloorById, uploadImage, deleteImage };
