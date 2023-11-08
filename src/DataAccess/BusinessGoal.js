import { API } from "../Constants";

async function createBusinessGoal(parameters) {
  try {
    const body = JSON.stringify({
      name: parameters.name,
      // description: parameters.data.description,
      startDate: parameters.startDate,
      endDate: parameters.endDate,
    });

    const requestOptions = {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        apikey: parameters.token,
      },
      body: body,
    };

    const url = API.businessGoal.create;
    const res = await fetch(url, requestOptions);
    const data = await res.json();
    return data;
  } catch (error) {
    return error;
  }
}

async function updateBusinessGoal(parameters) {
  try {
    const body = JSON.stringify({
      id: parameters.id,
      name: parameters.name,
      startDate: parameters.startDate,
      endDate: parameters.endDate,
    });

    const requestOptions = {
      method: "PUT",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        apikey: parameters.token,
      },
      body: body,
    };

    const res = await fetch(API.businessGoal.update, requestOptions);
    const data = await res.json();
    return data;
  } catch (error) {
    return error;
  }
}

async function deleteBusinessGoal(parameters) {
  try {
    const body = JSON.stringify({
      id: parameters.id,
    });

    const requestOptions = {
      method: "DELETE",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        apikey: parameters.token,
      },
      body: body,
    };

    const res = await fetch(API.businessGoal.delete + parameters.id, requestOptions);
    const data = await res.json();
    return data;
  } catch (error) {
    return error;
  }
}

async function findAllBusinessGoals(parameters) {
  const requestOptions = {
    method: "GET",
    mode: "cors",
    headers: { "Content-Type": "application/json", apikey: parameters.token },
  };

  const url = API.businessGoal.findAll;
  const res = await fetch(url, requestOptions);
  const data = await res.json();

  if (data.error) {
    throw new Error(data.error);
  }
  return data;
}

async function findBusinessGoalById(parameters) {
  try {
    const requestOptions = {
      method: "GET",
      mode: "cors",
      headers: { "Content-Type": "application/json", apikey: parameters.token },
    };

    const url = API.businessGoal.findById + parameters.id;
    const res = await fetch(url, requestOptions);
    const data = await res.json();

    return data;
  } catch (error) {
    return error;
  }
}

export { createBusinessGoal, updateBusinessGoal, deleteBusinessGoal, findAllBusinessGoals, findBusinessGoalById };
