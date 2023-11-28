import { config } from "../../../Constants/config";

const baseUrl = config.SERVER + ":" + config.PORT + config.API_GDNAR_BASE;

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

    const url = `${baseUrl}/importations`;
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

  const url = `${baseUrl}/importations/statuses`;
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

  const url = `${baseUrl}/importations/${params.status}`;
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

  const url = `${baseUrl}/importations/${params.status}/count`;
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

  const url = `${baseUrl}/importations/${params.status}/indicators`;
  const res = await fetch(url, requestOptions);
  const data = await res.json();
  return data;
}

async function getProcessStatus(params) {
  const requestOptions = {
    method: "GET",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
      apikey: params.token,
    },
  };

  const url = `${baseUrl}/process-control`;
  const res = await fetch(url, requestOptions);
  const data = await res.json();
  return data;
}

export {
  findAllImportations,
  findAllImportationStatuses,
  findImportationsByStatus,
  findImportationStatusCount,
  findImportationsIndicatorsByStatus,
  getProcessStatus,
};
