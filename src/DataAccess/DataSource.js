import uuid from "react-uuid";
import { API } from "../Constants";
import { DOCUMENTS } from "../Constants/DOCUMENTS";

const findAllDataSource = async (parameters) => {
  try {
    const requestOptions = {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        token: parameters.token,
      },
    };
    const url = API.dataSource.findAll;
    // const res = await fetch(url, requestOptions);
    // const data = await res.json();

    const data = DOCUMENTS.dataSource;

    return data;
  } catch (error) {
    return error;
  }
};

const createDataSource = async (parameters) => {
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

    const url = API.dataSource.create;

    // const res = await fetch(url, requestOptions);
    // const data = await res.json();

    const data = DOCUMENTS.dataSource.push({ ...parameters.values, id: uuid() });

    return data;
  } catch (error) {
    return error;
  }
};

const findDataSourceById = async (parameters) => {
  try {
    const requestOptions = {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        token: parameters.token,
      },
    };
    const url = API.dataSource.findById + parameters.id;
    // const res = await fetch(url, requestOptions);
    // const data = await res.json();

    const data = DOCUMENTS.dataSource.find((e) => e.id === parameters.id);

    return data;
  } catch (error) {
    return error;
  }
};

const updateDataSource = async (parameters) => {
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

    const url = API.dataSource.update + parameters.id;
    // const res = await fetch(url, requestOptions);
    // const data = await res.json();

    const index = DOCUMENTS.dataSource.findIndex((obj => obj.id == parameters.id));
    DOCUMENTS.dataSource[index].name = parameters.values.name;
    DOCUMENTS.dataSource[index].description = parameters.values.description;
    return DOCUMENTS.dataSource[index];

  } catch (error) {
    return error;
  }
};

const deleteDataSource = async (parameters) => {
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

    const url = API.dataSource.delete + parameters.id;
    // const res = await fetch(url, requestOptions);
    // const data = await res.json();

    const data = DOCUMENTS.dataSource.filter((e) => e.id !== parameters.id);
    DOCUMENTS.dataSource = data;

    return data;
  } catch (error) {
    return error;
  }
};

export {
  createDataSource,
  updateDataSource,
  deleteDataSource,
  findDataSourceById,
  findAllDataSource,
};
