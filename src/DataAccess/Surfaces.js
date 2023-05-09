import { API } from "../Constants";

export const findZoneById = async (parameters) => {
  try {
    const requestOptions = {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        token: parameters.token,
      },
    };
    const url = API.surface.findZone + "/" + parameters.id;
    const res = await fetch(url, requestOptions);
    const data = await res.json();

    return data;
  } catch (error) {
    return error;
  }
};

export const findRacksByZoneId = async (parameters) => {
  try {
    const requestOptions = {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        token: parameters.token,
      },
    };
    const url = API.surface.findRacksByZoneId + "/" + parameters.siteId + "/floors/" + parameters.floorId +"/racks";
    const res = await fetch(url, requestOptions);
    const data = await res.json();

    console.log("-> findRacksByZoneId")

    return data;
  } catch (error) {
    return error;
  }
};

export const findRackById = async (parameters) => {
  try {
    const requestOptions = {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        token: parameters.token,
      },
    };
    const url = API.surface.findRackId + "/" + parameters.id;
    const res = await fetch(url, requestOptions);
    const data = await res.json();

    return data;
  } catch (error) {
    return error;
  }
};

export const findOperators = async (parameters) => {
  try {
    const requestOptions = {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        token: parameters.token,
      },
    };

    const res = await fetch(
      API.graphic.findOperator + "/" + parameters.site + "/" + parameters.momentum,
      requestOptions
    );
    const data = await res.json();

    return data;
  } catch (error) {
    return error;
  }
};

export const savePosAndRots = async (parameters) => {
  try {
    const body = JSON.stringify(parameters.racks);

    const requestOptions = {
      method: "PUT",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        token: parameters.token,
      },
      body: body,
    };

    const res = await fetch(API.surface.savePosAndRot +"/"+parameters.siteId + "/floors/" + parameters.floorId + "/racks/posandrots", requestOptions);
    const data = await res.json();

    return data;
  } catch (error) {
    return error;
  }
};

export const saveLayout = async (parameters) => {
  try {
    const body = JSON.stringify(parameters.layout);

    const requestOptions = {
      method: "PUT",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        token: parameters.token,
      },
      body: body,
    };

    const url = API.surface.saveLayout + parameters.siteId + "/floors/" + parameters.floorId + "/layouts";
    const res = await fetch(url, requestOptions);
    const data = await res.json();

    return data;
  } catch (error) {
    return error;
  }
};

export const findFloor = async (parameters) => {
  try {
    const requestOptions = {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        token: parameters.token,
      },
    };
    const url =
      API.surface.findFloor + "/" + parameters.floorId;
    const res = await fetch(url, requestOptions);
    const data = await res.json();

    return data;
  } catch (error) {
    return error;
  }
};

export const findLayout = async (parameters) => {
  try {
    const requestOptions = {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        token: parameters.token,
      },
    };
    const url =
      API.surface.findLayout + "/" + parameters.siteId + "/floors/" + parameters.floorId + "/layouts/" + parameters.layoutId;
    const res = await fetch(url, requestOptions);
    const data = await res.json();

    return data;
  } catch (error) {
    return error;
  }
};

export const findLayoutByFloorId = async (parameters) => {
  try {
    const requestOptions = {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        token: parameters.token,
      },
    };
    const url = API.surface.findLayoutByFloorId + "/" + parameters.siteId + "/floors/" + parameters.floorId + "/layouts";
    const res = await fetch(url, requestOptions);
    const data = await res.json();

    console.log("-> findLayoutByFloorId")

    return data;
  } catch (error) {
    return error;
  }
};
