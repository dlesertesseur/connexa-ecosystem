import { API } from "../Constants";

async function saveBusinessProcessModelRelation(parameters) {
  const body = JSON.stringify({
    processModelId: parameters.processModelId,
    formModelId: parameters.formModelId,
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

  const url = API.businessProcessModelRelation.save;
  const res = await fetch(url, requestOptions);
  const data = await res.json();

  return data;
}

async function deleteBusinessProcessModelRelation(parameters) {
  const requestOptions = {
    method: "DELETE",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
      token: parameters.token,
    },
  };

  const url =
    API.businessProcessModelRelation.delete +
    "processModel/" +
    parameters.processModelId +
    "/formModel/" +
    parameters.formModelId;

  const res = await fetch(url, requestOptions);
  const data = res.status;
  return data;
}

async function findAllBusinessProcessModelRelationsById(parameters) {
  try {
    const requestOptions = {
      method: "GET",
      mode: "cors",
      headers: { "Content-Type": "application/json", token: parameters.token },
    };

    const url = API.businessProcessModelRelation.findById + parameters.id;
    const res = await fetch(url, requestOptions);
    const data = await res.json();

    return data;
  } catch (error) {
    return error;
  }
}

export {
  saveBusinessProcessModelRelation,
  deleteBusinessProcessModelRelation,
  findAllBusinessProcessModelRelationsById,
};
