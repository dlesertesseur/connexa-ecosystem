import { API } from "../Constants";

async function findAllBusinessProcessModelByRole(parameters) {
  try {
    const requestOptions = {
      method: "GET",
      mode: "cors",
      headers: { "Content-Type": "application/json", token: parameters.token },
    };

    const url = API.businessProcessModelInbox.findAllbusinessProcessModelByRoleId + parameters.roleId;

    const res = await fetch(url, requestOptions);
    const data = await res.json();

    return data;
  } catch (error) {
    return error;
  }
}

async function createBusinessProcessModelInstance(parameters) {
  try {
    const body = JSON.stringify({
      businessProcessModelId: parameters.businessProcessModelId,
      name: parameters.name,
      description: parameters.description,
      userId: parameters.userId,
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
    const url = API.businessProcessModelInbox.createInstance;
    const res = await fetch(url, requestOptions);
    const data = await res.json();

    return data;
  } catch (error) {
    return error;
  }
}
async function findAllTaskByRoleId(parameters) {
  const requestOptions = {
    method: "GET",
    mode: "cors",
    headers: { "Content-Type": "application/json", token: parameters.token },
  };

  const url = `${API.businessProcessModelInbox.findAllTasksByRoleId}?userId=${parameters.userId}&roleId=${parameters.roleId}`;
  const res = await fetch(url, requestOptions);
  const data = await res.json();

  return data;
}

export { findAllBusinessProcessModelByRole, createBusinessProcessModelInstance, findAllTaskByRoleId };
