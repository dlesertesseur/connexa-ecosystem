import { API } from "../Constants";

export const findOperator = async (parameters) => {
  try {

    const body = JSON.stringify({
      site: parameters.site,
      momentum: parameters.momentum,
      operators: parameters.operators,
    });

    const requestOptions = {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        token: parameters.token,
      },
      body:body,
    };

    const res = await fetch(API.graphic.findOperator, requestOptions);
    const data = await res.json();

    return data;
  } catch (error) {
    return error;
  }
};
