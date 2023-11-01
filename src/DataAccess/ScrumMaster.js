import { API } from "../Constants";

const saveBusinessProcessModelInstanceTasks = async (parameters) => {
  const body = JSON.stringify(parameters.tasks);

  const requestOptions = {
    method: "PUT",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
      token: parameters.token,
    },
    body: body,
  };

  const res = await fetch(API.businessProcessInstanceTasks.save, requestOptions);
  const data = await res.json();

  return data;
};

export { saveBusinessProcessModelInstanceTasks };
