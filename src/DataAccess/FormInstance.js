import { API } from "../Constants";

const createFormInstance = async (parameters) => {
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

  const url = API.formInstance.create;
  const res = await fetch(url, requestOptions);
  const data = await res.json();

  return data;
};

const findFormInstanceById = async (parameters) => {
  try {
    const requestOptions = {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        token: parameters.token,
      },
    };
    const url = API.formInstance.findById + parameters.id;
    const res = await fetch(url, requestOptions);
    const data = await res.json();

    return data;
  } catch (error) {
    return error;
  }
};

const updateFormInstance = async (parameters) => {
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

  const url = API.formInstance.update;
  const res = await fetch(url, requestOptions);
  const data = await res.json();
  
  return data;
};

const deleteFormInstance = async (parameters) => {
  try {
    const requestOptions = {
      method: "DELETE",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        token: parameters.token,
      },
    };

    const url = API.formInstance.delete + parameters.id;
    const res = await fetch(url, requestOptions);
    const data = await res.json();

    return data;
  } catch (error) {
    return error;
  }
};

// const updateFormHeader = async (parameters) => {
//   const body = JSON.stringify(parameters.body);

//   const requestOptions = {
//     method: "PATCH",
//     mode: "cors",
//     headers: {
//       "Content-Type": "application/json",
//       token: parameters.token,
//     },
//     body: body,
//   };

//   const url = API.formInstance.updateHeader;
//   const res = await fetch(url, requestOptions);
//   const data = await res.json();
  
//   return data;
// };

export {
  createFormInstance,
  updateFormInstance,
  deleteFormInstance,
  findFormInstanceById,
};
