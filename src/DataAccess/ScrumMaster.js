import { API } from "../Constants";

const scrumMasterSaveTasks = async (parameters) => {
  const params = {
    tasks: parameters.tasks,
    businessProcessInstanceId: parameters.businessProcessInstanceId,
    userId: parameters.userId,
  };

  const body = JSON.stringify(params);

  const requestOptions = {
    method: "PUT",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
      token: parameters.token,
    },
    body: body,
  };

  const res = await fetch(API.scrumMaster.saveTasks, requestOptions);
  let data = null;
  if (res.status !== 200) {
    data = await res.json();
  } else {
    data = "";
  }

  return data;
};

const scrumMasterSaveSprints = async (parameters) => {
  const params = {
    sprints: parameters.sprints,
    businessProcessInstanceId: parameters.businessProcessInstanceId,
    userId: parameters.userId,
  };

  const body = JSON.stringify(params);

  const requestOptions = {
    method: "PUT",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
      token: parameters.token,
    },
    body: body,
  };

  const res = await fetch(API.scrumMaster.saveSprints, requestOptions);
  let data = null;
  if (res.status !== 200) {
    data = await res.json();
  } else {
    data = "";
  }

  return data;
};

export { scrumMasterSaveTasks, scrumMasterSaveSprints };
