import { API } from "../Constants";

async function createBrand(parameters) {
  try {
    const body = JSON.stringify({
      name: parameters.data.name,
      description: parameters.data.name
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

    const url = API.brand.create;
    const res = await fetch(url, requestOptions);
    const data = await res.json();
    return data;
  } catch (error) {
    return error;
  }
}

async function updateBrand(parameters) {
  try {
    const body = JSON.stringify({
      id: parameters.data.id,
      name: parameters.data.name,
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

    const res = await fetch(API.brand.update, requestOptions);
    const data = await res.json();
    return data;

  } catch (error) {
    return error;
  }
}

async function deleteBrand(parameters) {
  try {
    const requestOptions = {
      method: "DELETE",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        token: parameters.token,
      },
    };

    const url = API.brand.delete + parameters.id;
    await fetch(url, requestOptions).then((response) => {
      return response;
    });
  } catch (error) {
    return error;
  }
}

async function findAllBrandsByProjectId(parameters) {
  try {
    const requestOptions = {
      method: "GET",
      mode: "cors",
      headers: { "Content-Type": "application/json", token: parameters.token },
    };

    const url = API.brand.findAllByIdProjectId + parameters.id;
    const res = await fetch(url, requestOptions);
    const data = await res.json();

    return data;
  } catch (error) {
    return error;
  }
}

async function findAllBrandsByPage(parameters) {
  try {
    const requestOptions = {
      method: "GET",
      mode: "cors",
      headers: { "Content-Type": "application/json", token: parameters.token },
    };

    const url = API.brand.findAllBrandsByPage + parameters.pageNbr + "/" + parameters.itemsByPage;
    const res = await fetch(url, requestOptions);
    const data = await res.json();

    return data;
  } catch (error) {
    return error;
  }
}

async function findAllBrands(parameters) {
  try {
    const requestOptions = {
      method: "GET",
      mode: "cors",
      headers: { "Content-Type": "application/json", token: parameters.token },
    };

    const url = API.brand.findAll;
    const res = await fetch(url, requestOptions);
    const data = await res.json();

    return data;
  } catch (error) {
    return error;
  }
}

async function findBrandById(parameters) {
  try {
    const requestOptions = {
      method: "GET",
      mode: "cors",
      headers: { "Content-Type": "application/json", token: parameters.token },
    };

    const url = API.brand.findById + parameters.brandId;
    const res = await fetch(url, requestOptions);
    const data = await res.json();

    return data;
  } catch (error) {
    return error;
  }
}

export { createBrand, updateBrand, deleteBrand, findAllBrandsByPage, findAllBrandsByProjectId, findAllBrands, findBrandById};
