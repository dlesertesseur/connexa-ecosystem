import { config } from "../../../Constants/config";

async function findAllImportations(params) {
  try {
    const requestOptions = {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        token: params.token,
      },
    };

    const url = config.SERVER + ":" + config.PORT + config.API_COMEX_BASE + "/importations";
    const res = await fetch(url, requestOptions);
    const data = await res.json();
    return data;
  } catch (error) {
    return error;
  }
}

async function findAllImportationStatuses(params) {
  const requestOptions = {
    method: "GET",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
      apikey: params.token,
    },
  };

  const url = "http://192.168.0.12:8085/comex/api/v1/importations/statuses"; //config.SERVER + ":" + config.PORT + config.API_COMEX_BASE + "/importations/statuses";
  const res = await fetch(url, requestOptions);
  const data = await res.json();
  if (data.error) {
    throw new Error(data.error);
  }
  return data;
}

async function findImportationsByStatus(params) {
  const requestOptions = {
    method: "GET",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
      apikey: params.token,
    },
  };

  const url = `http://192.168.0.12:8085/comex/api/v1/importations/${params.status}`;
  const res = await fetch(url, requestOptions);
  const data = await res.json();
  return data;
}

async function findImportationStatusCount(params) {
  const requestOptions = {
    method: "GET",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
      apikey: params.token,
    },
  };

  const url = `http://192.168.0.12:8085/comex/api/v1/importations/${params.status}/count`; //config.SERVER + ":" + config.PORT + config.API_COMEX_BASE + "/importations/statuses";
  const res = await fetch(url, requestOptions);
  const data = await res.json();
  if (data.error) {
    throw new Error(data.error);
  }
  return data;
}

async function findImportationsIndicatorsByStatus(params) {
  const requestOptions = {
    method: "GET",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
      apikey: params.token,
    },
  };

  const url = `http://192.168.0.12:8085/comex/api/v1/importations/${params.status}/indicators`;
  const res = await fetch(url, requestOptions);
  const data = await res.json();
  return data;
}


export { findAllImportations, findAllImportationStatuses, findImportationsByStatus, findImportationStatusCount, findImportationsIndicatorsByStatus };
