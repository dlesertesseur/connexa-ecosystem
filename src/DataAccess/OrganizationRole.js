import { API } from "../Constants";

async function assignRoleToOrg(parameters) {
  try {
    const requestOptions = {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        token: parameters.token,
      },
    };

    const url = API.organizationRole.asignRol + parameters.id + "/roles/" + parameters.roleId;
    const res = await fetch(url, requestOptions);
    const data = await res.json();
    return data;
  } catch (error) {
    return error;
  }
}


async function unassignRoleToOrg(parameters) {
  try {
    const requestOptions = {
      method: "DELETE",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        token: parameters.token,
      },
    };

    const url = API.organizationRole.unasignRol + parameters.roleId + "/organizations/" + parameters.id;
    const res = await fetch(url , requestOptions);
    const data = await res.json();
    return data;
    
  } catch (error) {
    return error;
  }
}

async function findAllByOrganizationId(parameters) {
  try {
    const requestOptions = {
      method: "GET",
      mode: "cors",
      headers: { "Content-Type": "application/json", token: parameters.token },
    };

    const url = API.organizationRole.findAllByOrganizationId + parameters.id;
    const res = await fetch(url, requestOptions);
    const data = await res.json();
    
    return data;
  } catch (error) {
    return error;
  }
}

export { findAllByOrganizationId, assignRoleToOrg, unassignRoleToOrg};
