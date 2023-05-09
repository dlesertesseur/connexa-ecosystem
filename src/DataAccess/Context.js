import { API } from "../Constants";

async function findAllContext(parameters) {
    try {
      const requestOptions = {
        method: "GET",
        mode: "cors",
        headers: { "Content-Type": "application/json", token: parameters.token },
      };
  
      const url = API.context.findAll;
      const res = await fetch(url, requestOptions);
      const data = await res.json();
  
      return data;
    } catch (error) {
      return error;
    }
  }
  export { findAllContext};
  