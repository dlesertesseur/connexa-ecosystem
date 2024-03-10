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

async function getAllOutgoingTaskByTaskId(parameters) {
  const requestOptions = {
    method: "GET",
    mode: "cors",
    headers: { "Content-Type": "application/json", token: parameters.token },
  };

  const url = API.businessProcessModelInbox.getAllOutgoingTaskByTaskId + parameters.taskId + "/outgoing";
  const res = await fetch(url, requestOptions);
  const data = await res.json();

  return data;
}

async function executeTask(parameters) {
  const body = JSON.stringify({
    userId: parameters.userId,
    originTaskId: parameters.originTaskId,
    targetTaskId: parameters.targetTaskId,
  });

  const requestOptions = {
    method: "PATCH",
    mode: "cors",
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
      token: parameters.token,
    },
    body: body,
  };

  const url = API.businessProcessModelInbox.executeTask;
  const res = await fetch(url, requestOptions);
  const data = await res.json();

  return data;
}

async function releaseTask(parameters) {
  const body = JSON.stringify({
    userId: parameters.userId,
    taskId: parameters.taskId,
    action: "Release",
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

  const url = API.businessProcessModelInbox.releaseTask;
  const res = await fetch(url, requestOptions);
  const data = await res.json();

  return data;
}

async function takeTask(parameters) {
  const body = JSON.stringify({
    userId: parameters.userId,
    taskId: parameters.taskId,
    action: "Take",
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

  const url = API.businessProcessModelInbox.takeTask;
  const res = await fetch(url, requestOptions);
  const data = await res.json();

  return data;
}

async function createBusinessProcessModelInstanceTemplate(parameters) {
  try {
    const requestOptions = {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        token: parameters.token,
      },
    };

    const url = API.businessProcessModelInbox.createTemplate + parameters.businessProcessModelId +"/"+ parameters.userId;
    const res = await fetch(url, requestOptions);
    const data = await res.json();

    return data;
  } catch (error) {
    return error;
  }
}

async function saveBusinessProcessModelInstance(parameters) {
  try {
    const param = {
      "parameters": {
        "businessProcessModelId": parameters.businessProcessModelId,
        "userId": parameters.userId,
      },
      "businessProcessInstance":parameters.businessProcessInstance
    }
    const body = JSON.stringify(param);

    const requestOptions = {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        apikey: parameters.token,
      },
      body: body,
    };

    const url = API.businessProcessModelInbox.saveInstance;
    const res = await fetch(url, requestOptions);
    const data = await res.json();

    return data;
  } catch (error) {
    return error;
  }
}

export {
  findAllBusinessProcessModelByRole,
  createBusinessProcessModelInstance,
  findAllTaskByRoleId,
  getAllOutgoingTaskByTaskId,
  executeTask,
  releaseTask,
  takeTask,
  createBusinessProcessModelInstanceTemplate,
  saveBusinessProcessModelInstance,
};
