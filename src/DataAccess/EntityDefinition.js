import { API } from "../Constants";

const findAllEntityDefinition = async (parameters) => {
  try {
    const requestOptions = {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        token: parameters.token,
      },
    };
    const url = API.entityDefinition.findAll;

    const res = await fetch(url, requestOptions);
    const data = await res.json();

    return data;
  } catch (error) {
    return error;
  }
};

const createEntityDefinition = async (parameters) => {
  const body = JSON.stringify(parameters.body);

  const requestOptions = {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
      token: parameters.token,
    },
    body: body,
  };

  const url = API.entityDefinition.create;
  const res = await fetch(url, requestOptions);
  const data = await res.json();

  console.log("createEntityDefinition data ->", data);

  return data;
};

const findEntityDefinitionById = async (parameters) => {
  try {
    const requestOptions = {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        token: parameters.token,
      },
    };
    const url = API.entityDefinition.findById + parameters.id;
    const res = await fetch(url, requestOptions);
    const data = await res.json();

    return data;
  } catch (error) {
    return error;
  }
};

const updateEntityDefinition = async (parameters) => {
  const body = JSON.stringify(parameters.body);

  const requestOptions = {
    method: "PUT",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
      token: parameters.token,
    },
    body: body,
  };

  const url = API.entityDefinition.update + parameters.id;
  const res = await fetch(url, requestOptions);
  const data = await res.json();
  
  return data;
};

const deleteEntityDefinition = async (parameters) => {
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

    const url = API.entityDefinition.delete + parameters.id;
    const res = await fetch(url, requestOptions);
    const data = await res.json();

    return data;
  } catch (error) {
    return error;
  }
};

const updateFormHeader = async (parameters) => {
  const body = JSON.stringify(parameters.body);

  const requestOptions = {
    method: "PATCH",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
      token: parameters.token,
    },
    body: body,
  };

  const url = API.entityDefinition.updateHeader;
  const res = await fetch(url, requestOptions);
  const data = await res.json();
  
  return data;
};

export {
  createEntityDefinition,
  updateEntityDefinition,
  deleteEntityDefinition,
  findEntityDefinitionById,
  findAllEntityDefinition,
  updateFormHeader
};
