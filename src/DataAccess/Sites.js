import { API } from "../Constants";

async function createSite(parameters) {
  try {
    const body = JSON.stringify({
      name: parameters.name,
      phone: parameters.phone,
      address: parameters.address,
      contextId: parameters.contextId,
    });

    const requestOptions = {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        token: parameters.token,
      },
      body: body,
    };

    const url = API.site.create + parameters.projectId;
    const res = await fetch(url, requestOptions);
    const data = await res.json();
    return data;
  } catch (error) {
    return error;
  }
}

async function updateSite(parameters) {
  try {
    const body = JSON.stringify({
      id: parameters.id,
      name: parameters.name,
      phone: parameters.phone,
      address: parameters.address,
      contextId: parameters.contextId,
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

    const res = await fetch(API.site.update, requestOptions);
    const data = await res.json();
    return data;
  } catch (error) {
    return error;
  }
}

async function deleteSite(parameters) {
  try {
    const body = JSON.stringify({
      id: parameters.id,
    });

    const requestOptions = {
      method: "DELETE",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        token: parameters.token,
      },
      body: body,
    };

    await fetch(API.site.delete + parameters.id, requestOptions).then((response) => {
      return response;
    });
  } catch (error) {
    return error;
  }
}

async function findAllSitesByProjectId(parameters) {
  try {
    const requestOptions = {
      method: "GET",
      mode: "cors",
      headers: { "Content-Type": "application/json", token: parameters.token },
    };

    const url = API.site.findAllByIdProjectId + parameters.id;
    const res = await fetch(url, requestOptions);
    const data = await res.json();

    return data;
  } catch (error) {
    return error;
  }
}

async function findAllSitesByPage(parameters) {
  try {
    const requestOptions = {
      method: "GET",
      mode: "cors",
      headers: { "Content-Type": "application/json", token: parameters.token },
    };

    const url = API.site.findAllSitesByPage + parameters.pageNbr + "/" + parameters.itemsByPage;
    const res = await fetch(url, requestOptions);
    const data = await res.json();

    return data;
  } catch (error) {
    return error;
  }
}

async function findAllSites(parameters) {
  try {
    const requestOptions = {
      method: "GET",
      mode: "cors",
      headers: { "Content-Type": "application/json", token: parameters.token },
    };

    const url = API.site.findAllSites;
    const res = await fetch(url, requestOptions);
    const data = await res.json();

    data.map((s) => {
      s.contextName = s.context.name;
      return s;
    });
    return data;
  } catch (error) {
    return error;
  }
}

async function findSiteById(parameters) {
  try {
    const requestOptions = {
      method: "GET",
      mode: "cors",
      headers: { "Content-Type": "application/json", token: parameters.token },
    };

    const url = API.site.findSiteById + parameters.siteId;
    const res = await fetch(url, requestOptions);
    const data = await res.json();

    return data;
  } catch (error) {
    return error;
  }
}

export { createSite, updateSite, deleteSite, findAllSitesByPage, findAllSitesByProjectId, findAllSites, findSiteById};
