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
  const event = params.event ? `&event=${params.event}` : null;
  const analyst = params.analyst ? `&analyst=${params.analyst}` : null;

  const url = `${baseUrl}/importations?status=${params.status}${event ? event : ""}${analyst ? analyst : ""}`;

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

  const event = params.event ? `&event=${params.event}` : null;
  const analyst = params.analyst ? `&analyst=${params.analyst}` : null;

  const url = `${baseUrl}/importations/count?status=${params.status}${event ? event : ""}${analyst ? analyst : ""}`;

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

  const event = params.event ? `&event=${params.event}` : null;
  const analyst = params.analyst ? `&analyst=${params.analyst}` : null;
  const url = `${baseUrl}/importations/indicators?status=${params.status}${event ? event : ""}${analyst ? analyst : ""}`;

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

async function findAllBusinessObjectives(params) {
  const requestOptions = {
    method: "GET",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
      apikey: params.token,
    },
  };

  const url = `${baseUrl}/importations/events`;
  const res = await fetch(url, requestOptions);
  const data = await res.json();
  if (data.error) {
    throw new Error(data.error);
  }
  return data;
}

async function findAllAnalysts(params) {
  const requestOptions = {
    method: "GET",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
      apikey: params.token,
    },
  };

  const url = `${baseUrl}/importations/analists`;
  const res = await fetch(url, requestOptions);
  const data = await res.json();
  if (data.error) {
    throw new Error(data.error);
  }
  return data;
}


async function findImportationsItemsByReference(params) {
  const requestOptions = {
    method: "GET",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
      apikey: params.token,
    },
  };

  const url = `${baseUrl}/importations/items?reference=${params.reference}`;

  const res = await fetch(url, requestOptions);
  const data = await res.json();
  if (data.error) {
    throw new Error(data.error);
  }
  return data;
}

export {
  findAllImportations,
  findAllImportationStatuses,
  findImportationsByStatus,
  findImportationStatusCount,
  findImportationsIndicatorsByStatus,
  getProcessStatus,
  findAllBusinessObjectives,
  findAllAnalysts,
  findImportationsItemsByReference
};
