import { API } from "../Constants";

// async function createBusinessProcessModel(parameters) {
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

// async function updateBusinessProcessModel(parameters) {
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

async function saveBusinessProcessModel(parameters) {
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

  const res = await fetch(API.businessProcessModel.save, requestOptions);
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


export {
  saveBusinessProcessModel,
  deleteBusinessProcessModel,
  findAllBusinessProcessModel,
  findBusinessProcessModelById,
};
