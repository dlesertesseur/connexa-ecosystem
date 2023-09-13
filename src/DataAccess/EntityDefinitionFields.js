import uuid from "react-uuid";
import { API } from "../Constants";
import { DOCUMENTS } from "../Constants/DOCUMENTS";

const findAllField = async (parameters) => {
  try {
    const requestOptions = {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        token: parameters.token,
      },
    };
    const url = API.field.findAll;
    // const res = await fetch(url, requestOptions);
    // const data = await res.json();

    const index = DOCUMENTS.entityDefinition.findIndex((obj => obj.id == parameters.id));
    const data = DOCUMENTS.entityDefinition[index].fields;
    return data;
  } catch (error) {
    return error;
  }
};

const createField = async (parameters) => {
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

    const url = API.field.create;

    // const res = await fetch(url, requestOptions);
    // const data = await res.json();

    const index = DOCUMENTS.entityDefinition.findIndex((obj => obj.id == parameters.id));
    const fields = DOCUMENTS.entityDefinition[index].fields;
    const data = fields.push({ ...parameters.values, id: uuid() });

    return data;
  } catch (error) {
    return error;
  }
};

const findFieldById = async (parameters) => {
  try {
    const requestOptions = {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        token: parameters.token,
      },
    };
    const url = API.field.findById + parameters.id;
    // const res = await fetch(url, requestOptions);
    // const data = await res.json();

    const index = DOCUMENTS.entityDefinition.findIndex((obj => obj.id == parameters.entityDefinitionId));
    const fields = DOCUMENTS.entityDefinition[index].fields;
    const data = fields.find((e) => e.id === parameters.fieldId);

    return data;
  } catch (error) {
    return error;
  }
};

const updateField = async (parameters) => {
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

    const url = API.field.update + parameters.id;
    // const res = await fetch(url, requestOptions);
    // const data = await res.json();

    let index = DOCUMENTS.entityDefinition.findIndex((obj => obj.id == parameters.entityId));
    const fields = DOCUMENTS.entityDefinition[index].fields;

    index = fields.findIndex((obj => obj.id == parameters.id));
    fields[index].name = parameters.values.name;
    fields[index].description = parameters.values.description;
    return fields[index];

  } catch (error) {
    return error;
  }
};

const deleteField = async (parameters) => {
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

    const url = API.field.delete + parameters.id;
    // const res = await fetch(url, requestOptions);
    // const data = await res.json();

    const index = DOCUMENTS.entityDefinition.findIndex((obj => obj.id == parameters.entityId));
    const fields = DOCUMENTS.entityDefinition[index].fields;

    const data = fields.filter((e) => e.id !== parameters.id);
    DOCUMENTS.entityDefinition[index].fields = data;

    return data;
  } catch (error) {
    return error;
  }
};

export {
  createField,
  updateField,
  deleteField,
  findFieldById,
  findAllField,
};
