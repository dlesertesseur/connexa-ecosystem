import { API } from "../Constants";
import { COMEX } from "../Constants/COMEX";

async function createComexRecap(parameters) {
  try {
    const body = JSON.stringify({
      name: parameters.data.name,
      description: parameters.data.name,
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

    const url = API.comexrecap.create;
    const res = await fetch(url, requestOptions);
    const data = await res.json();
    return data;
  } catch (error) {
    return error;
  }
}

async function updateComexRecap(parameters) {
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

    const res = await fetch(API.comexrecap.update, requestOptions);
    const data = await res.json();
    return data;
  } catch (error) {
    return error;
  }
}

async function deleteComexRecap(parameters) {
  try {
    const requestOptions = {
      method: "DELETE",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        token: parameters.token,
      },
    };

    const url = API.comexrecap.delete + parameters.id;
    await fetch(url, requestOptions).then((response) => {
      return response;
    });
  } catch (error) {
    return error;
  }
}

async function findAllComexRecaps(parameters) {
  try {
    const requestOptions = {
      method: "GET",
      mode: "cors",
      headers: { "Content-Type": "application/json", token: parameters.token },
    };

    // const url = API.comexrecap.findAll;
    // const res = await fetch(url, requestOptions);
    // const data = await res.json();

    const data = COMEX.dummyTask;

    return data;
  } catch (error) {
    return error;
  }
}

async function findAllComexCountries(parameters) {
  try {
    const requestOptions = {
      method: "GET",
      mode: "cors",
      headers: { "Content-Type": "application/json", token: parameters.token },
    };

    // const url = API.comexrecap.findAll;
    // const res = await fetch(url, requestOptions);
    // const data = await res.json();

    const data = COMEX.countries;

    return data;
  } catch (error) {
    return error;
  }
}

async function findAllComexDepartments(parameters) {
  try {
    const requestOptions = {
      method: "GET",
      mode: "cors",
      headers: { "Content-Type": "application/json", token: parameters.token },
    };

    // const url = API.comexrecap.findAll;
    // const res = await fetch(url, requestOptions);
    // const data = await res.json();

    const data = COMEX.departments;

    return data;
  } catch (error) {
    return error;
  }
}

async function findAllComexModalities(parameters) {
  try {
    const requestOptions = {
      method: "GET",
      mode: "cors",
      headers: { "Content-Type": "application/json", token: parameters.token },
    };

    // const url = API.comexrecap.findAll;
    // const res = await fetch(url, requestOptions);
    // const data = await res.json();

    const data = COMEX.modalities;

    return data;
  } catch (error) {
    return error;
  }
}

async function findAllComexFactories(parameters) {
  try {
    const requestOptions = {
      method: "GET",
      mode: "cors",
      headers: { "Content-Type": "application/json", token: parameters.token },
    };

    // const url = API.comexrecap.findAll;
    // const res = await fetch(url, requestOptions);
    // const data = await res.json();

    const data = COMEX.factories;

    return data;
  } catch (error) {
    return error;
  }
}

async function findAllComexShippingPorts(parameters) {
  try {
    const requestOptions = {
      method: "GET",
      mode: "cors",
      headers: { "Content-Type": "application/json", token: parameters.token },
    };

    // const url = API.comexrecap.findAll;
    // const res = await fetch(url, requestOptions);
    // const data = await res.json();

    const data = COMEX.shippingPorts;

    return data;
  } catch (error) {
    return error;
  }
}

async function findAllComexProductionTimes(parameters) {
  try {
    const requestOptions = {
      method: "GET",
      mode: "cors",
      headers: { "Content-Type": "application/json", token: parameters.token },
    };

    // const url = API.comexrecap.findAll;
    // const res = await fetch(url, requestOptions);
    // const data = await res.json();

    const data = COMEX.productionTimes;

    return data;
  } catch (error) {
    return error;
  }
}

async function findAllComexAllPaymentTerms(parameters) {
  try {
    const requestOptions = {
      method: "GET",
      mode: "cors",
      headers: { "Content-Type": "application/json", token: parameters.token },
    };

    // const url = API.comexrecap.findAll;
    // const res = await fetch(url, requestOptions);
    // const data = await res.json();

    const data = COMEX.paymentTerms;

    return data;
  } catch (error) {
    return error;
  }
}

async function findAllComexCampaigns(parameters) {
  try {
    const requestOptions = {
      method: "GET",
      mode: "cors",
      headers: { "Content-Type": "application/json", token: parameters.token },
    };

    // const url = API.comexrecap.findAll;
    // const res = await fetch(url, requestOptions);
    // const data = await res.json();

    const data = COMEX.campaigns;

    return data;
  } catch (error) {
    return error;
  }
}
async function findComexRecapById(parameters) {
  try {
    const requestOptions = {
      method: "GET",
      mode: "cors",
      headers: { "Content-Type": "application/json", token: parameters.token },
    };

    // const url = API.comexrecap.findById + parameters.brandId;
    // const res = await fetch(url, requestOptions);
    // const data = await res.json();

    const data = COMEX.dummyTask.find((r) => r.id === parameters.id);
    return data;
  } catch (error) {
    return error;
  }
}

export {
  createComexRecap,
  updateComexRecap,
  deleteComexRecap,
  findAllComexRecaps,
  findComexRecapById,
  findAllComexCountries,
  findAllComexCampaigns,
  findAllComexDepartments,
  findAllComexModalities,
  findAllComexFactories,
  findAllComexShippingPorts,
  findAllComexAllPaymentTerms,
  findAllComexProductionTimes
};
