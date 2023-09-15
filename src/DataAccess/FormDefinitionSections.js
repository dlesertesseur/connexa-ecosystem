import uuid from "react-uuid";
import { API } from "../Constants";
import { DOCUMENTS } from "../Constants/DOCUMENTS";

const findAllFormDefinitionSections = async (parameters) => {
  try {
    const requestOptions = {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        token: parameters.token,
      },
    };
    const url = API.sections.findAll;
    // const res = await fetch(url, requestOptions);
    // const data = await res.json();

    const data = DOCUMENTS.formDefinition;
    return data;
  } catch (error) {
    return error;
  }
};

const createFormDefinitionSection = async (parameters) => {
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

    const url = API.sections.create;

    // const res = await fetch(url, requestOptions);
    // const data = await res.json();

    const index = DOCUMENTS.formDefinition.findIndex((obj => obj.id == parameters.id));
    const sections = DOCUMENTS.formDefinition[index].sections;
    const data = sections.push({ ...parameters.values, id: uuid() });

    return data;
  } catch (error) {
    return error;
  }
};

const findFormDefinitionSectionById = async (parameters) => {
  try {
    const requestOptions = {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        token: parameters.token,
      },
    };
    const url = API.sections.findById + parameters.id;
    // const res = await fetch(url, requestOptions);
    // const data = await res.json();

    const index = DOCUMENTS.formDefinition.findIndex((obj => obj.id == parameters.id));
    const sections = DOCUMENTS.formDefinition[index].sections;
    const data = sections.find((e) => e.id === parameters.sectionId);

    return data;
  } catch (error) {
    return error;
  }
};

const updateFormDefinitionSection = async (parameters) => {
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

    const url = API.sections.update + parameters.id;
    // const res = await fetch(url, requestOptions);
    // const data = await res.json();

    let index = DOCUMENTS.formDefinition.findIndex((obj => obj.id == parameters.id));
    const sections = DOCUMENTS.formDefinition[index].sections;

    index = sections.findIndex((obj => obj.id == parameters.sectionId));

    sections[index].name = parameters.values.name;
    sections[index].entity = parameters.values.entity;
    sections[index].relation = parameters.values.relation;
    return sections[index];

  } catch (error) {
    return error;
  }
};

const deleteFormDefinitionSection = async (parameters) => {
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

    const url = API.sections.delete + parameters.id;
    // const res = await fetch(url, requestOptions);
    // const data = await res.json();

    let index = DOCUMENTS.formDefinition.findIndex((obj => obj.id == parameters.id));
    const sections = DOCUMENTS.formDefinition[index].sections;

    const data = sections.filter((e) => e.id !== parameters.sectionId);
    DOCUMENTS.formDefinition[index].sections = data;

    return data;
  } catch (error) {
    return error;
  }
};

export {
  createFormDefinitionSection,
  updateFormDefinitionSection,
  deleteFormDefinitionSection,
  findFormDefinitionSectionById,
  findAllFormDefinitionSections,
};
