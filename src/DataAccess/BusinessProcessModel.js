import { API } from "../Constants";

async function saveBusinessProcessModel(parameters) {
  const body = JSON.stringify({
    id: parameters.id,
    name: parameters.name,
    description: parameters.description,
    tasks: parameters.tasks,
    stages: parameters.stages,
    status: parameters.status,
    sprints: parameters.sprints,
    transitions: parameters.transitions,
    initialTaskId: parameters.initialTaskId,
    requiredRole: parameters.requiredRole,
    requiresEvent: parameters.requiresEvent,
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

  const url = API.businessProcessModel.save;
  const res = await fetch(url, requestOptions);
  const data = await res.json();

  return data;
}

async function deleteBusinessProcessModel(parameters) {
  const requestOptions = {
    method: "DELETE",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
      token: parameters.token,
    },
  };

  const url = API.businessProcessModel.delete + parameters.id;
  await fetch(url, requestOptions);
}

async function findAllBusinessProcessModel(parameters) {
  try {
    const requestOptions = {
      method: "GET",
      mode: "cors",
      headers: { "Content-Type": "application/json", token: parameters.token },
    };

    const url = API.businessProcessModel.findAll;
    const res = await fetch(url, requestOptions);
    const data = await res.json();

    return data;
  } catch (error) {
    return error;
  }
}

async function findBusinessProcessModelById(parameters) {
  try {
    const requestOptions = {
      method: "GET",
      mode: "cors",
      headers: { "Content-Type": "application/json", token: parameters.token },
    };

    const url = API.businessProcessModel.getById + parameters.id;
    const res = await fetch(url, requestOptions);
    const data = await res.json();

    return data;
  } catch (error) {
    return error;
  }
}

async function findBusinessProcessInstanceById(parameters) {
  try {
    const requestOptions = {
      method: "GET",
      mode: "cors",
      headers: { "Content-Type": "application/json", token: parameters.token },
    };

    const url = API.businessProcessInstance.getById + parameters.id;
    const res = await fetch(url, requestOptions);
    const data = await res.json();

    return data;
  } catch (error) {
    return error;
  }
}

async function findBusinessProcessInstanceLogById(parameters) {
  try {
    const requestOptions = {
      method: "GET",
      mode: "cors",
      headers: { "Content-Type": "application/json", token: parameters.token },
    };

    const url = API.businessProcessInstanceLog.getById + parameters.id;
    const res = await fetch(url, requestOptions);
    const data = await res.json();

    return data;
  } catch (error) {
    return error;
  }
}

async function saveBusinessProcessModelParameter(parameters) {
  try {
    const obj = {
      businessProcessModelId: parameters.businessProcessModelId,
      name: parameters.values.name,
      value: parameters.values.value,
      defaultValue: parameters.values.defaultValue,
      required: parameters.values.required,
      id: parameters.id,
    };

    const body = JSON.stringify(obj);

    const requestOptions = {
      method: "PUT",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        token: parameters.token,
      },
      body: body,
    };

    const url = API.businessProcess.saveBusinessProcessParameter;
    const res = await fetch(url, requestOptions);
    const data = await res.json();

    return data;
  } catch (error) {
    return error;
  }
}

async function deleteBusinessProcessModelParameter(parameters) {
  try {
    const requestOptions = {
      method: "DELETE",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        token: parameters.token,
      },
    };

    const url = API.businessProcess.deleteBusinessProcessParameter + parameters.id;
    await fetch(url, requestOptions).then((response) => {
      return response;
    });
  } catch (error) {
    return error;
  }
}

async function findAllBusinessProcessModelParameters(parameters) {
  try {
    const requestOptions = {
      method: "GET",
      mode: "cors",
      headers: { "Content-Type": "application/json", token: parameters.token },
    };

    const url = API.businessProcess.findAllBusinessProcessParameters + parameters.id;
    const res = await fetch(url, requestOptions);
    const data = await res.json();

    return data;
  } catch (error) {
    return error;
  }
}

async function findBusinessProcessModelParameterById(parameters) {
  try {
    const requestOptions = {
      method: "GET",
      mode: "cors",
      headers: { "Content-Type": "application/json", token: parameters.token },
    };

    const url = API.businessProcess.getBusinessProcessParameterById + parameters.id;
    const res = await fetch(url, requestOptions);
    const data = await res.json();

    return data;
  } catch (error) {
    return error;
  }
}


export {
  saveBusinessProcessModel,
  deleteBusinessProcessModel,
  findAllBusinessProcessModel,
  findBusinessProcessModelById,
  findBusinessProcessInstanceById,
  findBusinessProcessInstanceLogById,
  saveBusinessProcessModelParameter,
  deleteBusinessProcessModelParameter,
  findAllBusinessProcessModelParameters,
  findBusinessProcessModelParameterById,

};
