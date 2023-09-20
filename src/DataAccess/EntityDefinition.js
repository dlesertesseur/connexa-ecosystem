import uuid from "react-uuid";
import { API } from "../Constants";
import { DOCUMENTS } from "../Constants/DOCUMENTS";

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
    // const res = await fetch(url, requestOptions);
    // const data = await res.json();

    const data = DOCUMENTS.entityDefinition;
    return data;
  } catch (error) {
    return error;
  }
};

const saveEntityDefinition = async (parameters) => 
{
  const data = DOCUMENTS.entityDefinition.find((e) => e.id === parameters.id);
  if(data){
    const ret = await updateEntityDefinition(parameters);
    console.log("saveEntityDefinition updateEntityDefinition ->", ret);
  }else{
    createEntityDefinition(parameters);
  }
}

const createEntityDefinition = async (parameters) => {
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

    const url = API.entityDefinition.create;

    // const res = await fetch(url, requestOptions);
    // const data = await res.json();

    const data = DOCUMENTS.entityDefinition.push({ ...parameters.values, id: uuid() });
  
    return data;
  } catch (error) {
    return error;
  }
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
    // const res = await fetch(url, requestOptions);
    // const data = await res.json();

    const data = DOCUMENTS.entityDefinition.find((e) => e.id === parameters.id);

    return data;
  } catch (error) {
    return error;
  }
};

const updateEntityDefinition = async (parameters) => {
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

    const url = API.entityDefinition.update + parameters.id;
    // const res = await fetch(url, requestOptions);
    // const data = await res.json();

    const index = DOCUMENTS.entityDefinition.findIndex((obj) => obj.id == parameters.id);
    DOCUMENTS.entityDefinition[index].name = parameters.values.name;
    DOCUMENTS.entityDefinition[index].description = parameters.values.description;
    DOCUMENTS.entityDefinition[index].fields = parameters.values.fields;
    DOCUMENTS.entityDefinition[index].size = parameters.size;
    return DOCUMENTS.entityDefinition[index];
  } catch (error) {
    return error;
  }
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
    // const res = await fetch(url, requestOptions);
    // const data = await res.json();

    const data = DOCUMENTS.entityDefinition.filter((e) => e.id !== parameters.id);
    DOCUMENTS.entityDefinition = data;

    return data;
  } catch (error) {
    return error;
  }
};

export {
  createEntityDefinition,
  updateEntityDefinition,
  deleteEntityDefinition,
  findEntityDefinitionById,
  findAllEntityDefinition,
  saveEntityDefinition
};
