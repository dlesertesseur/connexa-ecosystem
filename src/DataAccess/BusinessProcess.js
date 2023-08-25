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

async function createBusinessProcessParameter(parameters) {
  try {
    const obj = {
      name: parameters.values.name,
      description: parameters.values.description,
      type: parameters.values.type,
    };

    const body = JSON.stringify(obj);

    const requestOptions = {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        apikey: parameters.apikey,
      },
      body: body,
    };

    // const url = API.businessProjectParameter.create;
    // const res = await fetch(url, requestOptions);
    // const data = await res.json();

    const data = BUSINESS.list.find((r) => (r.id = parameters.projectId));
    if (data) {
      data.parameters.push({ ...obj, id: uuid() });
    }

    return data;
  } catch (error) {
    return error;
  }
}

async function updateBusinessProcessParameter(parameters) {
  try {
    const body = JSON.stringify({
      id: parameters.paramId,
      name: parameters.values.name,
      description: parameters.values.description,
      type: parameters.values.type,
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

    // const res = await fetch(API.businessProcess.update, requestOptions);
    // const data = await res.json();

    const data = BUSINESS.list.find((r) => (r.id = parameters.projectId));
    if (data) {
      const param = data.parameters.find((r) => (r.id = parameters.paramId));
      if (param) {
        param.name = parameters.values.name;
        param.description = parameters.values.description;
        param.type = parameters.values.type;
      }
    }

    return data;
  } catch (error) {
    return error;
  }
}

async function deleteBusinessProcessParameter(parameters) {
  try {
    const requestOptions = {
      method: "DELETE",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        token: parameters.token,
      },
    };

    // const url = API.businessProcess.delete + parameters.id;
    // await fetch(url, requestOptions).then((response) => {
    //   return response;
    // });

    const data = BUSINESS.list.find((r) => (r.id = parameters.projectId));
    if (data) {
      const params = data.parameters.filter((r) => r.id !== parameters.paramId);
      if (params) {
        data.parameters = params;
      }
    }
  } catch (error) {
    return error;
  }
}

async function findAllBusinessProcessParameters(parameters) {
  try {
    const requestOptions = {
      method: "GET",
      mode: "cors",
      headers: { "Content-Type": "application/json", apikey: parameters.apikey },
    };

    // const url = API.businessProcess.findAllByUserId + parameters.userId;
    // const res = await fetch(url, requestOptions);
    // const data = await res.json();

    let params = null;
    const data = BUSINESS.list.find((r) => (r.id = parameters.id));
    if (data) {
      params = data.parameters.filter((r) => r.id !== parameters.paramId);
    }

    return params;
  } catch (error) {
    return error;
  }
}

async function findBusinessProcessParameterById(parameters) {
  try {
    const requestOptions = {
      method: "GET",
      mode: "cors",
      headers: { "Content-Type": "application/json", apikey: parameters.token },
    };

    // const url = API.businessProcess.findAllByUserId + parameters.userId;
    // const res = await fetch(url, requestOptions);
    // const data = await res.json();

    let param = null;
    const data = BUSINESS.list.find((r) => (r.id = parameters.projectId));
    if (data) {
      param = data.parameters.find((r) => r.id === parameters.paramId);
    }

    return param;
  } catch (error) {
    return error;
  }
}

export {
  // createBusinessProcess,
  // updateBusinessProcess,
  saveBusinessProcess,
  deleteBusinessProcess,
  findAllBusinessProcess,
  findBusinessProcessById,
  createBusinessProcessParameter,
  updateBusinessProcessParameter,
  deleteBusinessProcessParameter,
  findAllBusinessProcessParameters,
  findBusinessProcessParameterById,
};
