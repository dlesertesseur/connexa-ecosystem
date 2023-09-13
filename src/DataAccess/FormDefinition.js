import uuid from "react-uuid";
import { API } from "../Constants";
import { DOCUMENTS } from "../Constants/DOCUMENTS";

const findAllFormDefinition = async (parameters) => {
  try {
    const requestOptions = {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        token: parameters.token,
      },
    };
    const url = API.formDefinition.findAll;
    // const res = await fetch(url, requestOptions);
    // const data = await res.json();

    const data = DOCUMENTS.formDefinition;
    return data;
  } catch (error) {
    return error;
  }
};

const createFormDefinition = async (parameters) => {
  try {
    const body = JSON.stringify(parameters.values);

    const requestOptions = {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        token: parameters.token,
      },
      body: body,
    };

    const url = API.formDefinition.create;

    // const res = await fetch(url, requestOptions);
    // const data = await res.json();

    const data = DOCUMENTS.formDefinition.push({ ...parameters.values, id: uuid() });

    return data;
  } catch (error) {
    return error;
  }
};

const findFormDefinitionById = async (parameters) => {
  try {
    const requestOptions = {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        token: parameters.token,
      },
    };
    const url = API.formDefinition.findById + parameters.id;
    // const res = await fetch(url, requestOptions);
    // const data = await res.json();

    const data = DOCUMENTS.formDefinition.find((e) => e.id === parameters.id);

    return data;
  } catch (error) {
    return error;
  }
};

const updateFormDefinition = async (parameters) => {
  try {
    const body = JSON.stringify(parameters.values);

    const requestOptions = {
      method: "PUT",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        token: parameters.token,
      },
      body: body,
    };

    const url = API.formDefinition.update + parameters.id;
    // const res = await fetch(url, requestOptions);
    // const data = await res.json();

    const index = DOCUMENTS.formDefinition.findIndex((obj => obj.id == parameters.id));
    DOCUMENTS.formDefinition[index].name = parameters.values.name;
    DOCUMENTS.formDefinition[index].description = parameters.values.description;
    return DOCUMENTS.formDefinition[index];

  } catch (error) {
    return error;
  }
};

const deleteFormDefinition = async (parameters) => {
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

    const url = API.formDefinition.delete + parameters.id;
    // const res = await fetch(url, requestOptions);
    // const data = await res.json();

    const data = DOCUMENTS.formDefinition.filter((e) => e.id !== parameters.id);
    DOCUMENTS.formDefinition = data;

    return data;
  } catch (error) {
    return error;
  }
};

export {
  createFormDefinition,
  updateFormDefinition,
  deleteFormDefinition,
  findFormDefinitionById,
  findAllFormDefinition,
};
