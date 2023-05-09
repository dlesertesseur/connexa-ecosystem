import { API } from "../Constants";

const getRootOfCategories = async (params) => {
  const requestOptions = {
    method: "GET",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
      token: params.token,
    },
  };

  const url = API.category.getRootOfCategories + params.projectId;
  const res = await fetch(url, requestOptions);
  const data = await res.json();

  if (res.status !== 200) {
    throw Error(data.message);
  }

  return data;
};

const getChildrenOfCategory = async (params) => {
  try {
    const requestOptions = {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        token: params.token,
      },
    };

    const url = API.category.getChildrenOfCategory + params.projectId + "/" + params.nodeId;
    const res = await fetch(url, requestOptions);
    const data = await res.json();

    if (res.status !== 200) {
      throw Error(data.message);
    }

    return data;
  } catch (error) {
    return error;
  }
};

export { getRootOfCategories, getChildrenOfCategory };
