import uuid from "react-uuid";
import { API } from "../Constants";
import { BUSINESS } from "../Constants/BUSINESS";

// async function createBusinessProcess(parameters) {
//   try {
//     const obj = {
//       name: parameters.values.name,
//       description: parameters.values.description,
//     };

//     const body = JSON.stringify(obj);

//     const requestOptions = {
//       method: "POST",
//       mode: "cors",
//       headers: {
//         "Content-Type": "application/json",
//         token: parameters.token,
//       },
//       body: body,
//     };

//     const url = API.businessProcess.create;
//     const res = await fetch(url, requestOptions);
//     const data = await res.json();

//     return data;
//   } catch (error) {
//     return error;
//   }
// }

// async function updateBusinessProcess(parameters) {
//   try {
//     const body = JSON.stringify({
//       id: parameters.data.id,
//       name: parameters.data.name,
//     });

//     const requestOptions = {
//       method: "PUT",
//       mode: "cors",
//       headers: {
//         "Content-Type": "application/json",
//         token: parameters.token,
//       },
//       body: body,
//     };

//     const res = await fetch(API.businessProcess.update, requestOptions);
//     const data = await res.json();
//     return data;
//   } catch (error) {
//     return error;
//   }
// }

async function saveBusinessProcess(parameters) {
  const body = JSON.stringify({
    id: parameters?.id,
    name: parameters.name,
    description: parameters.description,
    stages: parameters.stages,
    parameters: parameters.parameters,
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

  const res = await fetch(API.businessProcess.save, requestOptions);
  const data = await res.json();

  return data;
}

async function deleteBusinessProcess(parameters) {
  const requestOptions = {
    method: "DELETE",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
      token: parameters.token,
    },
  };

  const url = API.businessProcess.delete + parameters.id;
  await fetch(url, requestOptions);
}

async function findAllBusinessProcess(parameters) {
  try {
    const requestOptions = {
      method: "GET",
      mode: "cors",
      headers: { "Content-Type": "application/json", token: parameters.token },
    };

    const url = API.businessProcess.findAll;
    const res = await fetch(url, requestOptions);
    const data = await res.json();

    return data;
  } catch (error) {
    return error;
  }
}

async function findBusinessProcessById(parameters) {
  try {
    const requestOptions = {
      method: "GET",
      mode: "cors",
      headers: { "Content-Type": "application/json", token: parameters.token },
    };

    const url = API.businessProcess.getById + parameters.id;
    const res = await fetch(url, requestOptions);
    const data = await res.json();

    return data;
  } catch (error) {
    return error;
  }
}


export {
  saveBusinessProcess,
  deleteBusinessProcess,
  findAllBusinessProcess,
  findBusinessProcessById
};
