import { API } from "../Constants";
import { COMEX } from "../Constants/COMEX";

async function createComexRecap(parameters) {
  try {
    const obj = {
      campaignId: parameters.values.campaign,
      description: parameters.values.description,
      originCountryId: parameters.values.originCountry,
      destinationCountryId: parameters.values.destinationCountry,
      importationTypeId: parameters.values.importationType,
      supplierId: parameters.values.supplier,
      originPortId: parameters.values.originShippingPort,
      destinationPortId: parameters.values.destinationShippingPort,
      totalManufacturingTimeInDays: parameters.values.productionTime,
      status: parameters.values.status,
      creatorId: parameters.userId,
      creatorName: parameters.creatorName,
      paymentTermId: parameters.values.paymentTerms,
      incotermId: parameters.values.incoterm,
      currencyId: parameters.values.currency,
      departmentId: parameters.values.department,
      transportationModeId: parameters.values.transportType,
    }

    console.log("createComexRecap ->", obj);

    const body = JSON.stringify(obj);

    const requestOptions = {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        apikey: parameters.apikey,
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

async function findAllComexRecapsByUserId(parameters) {
  try {
    const requestOptions = {
      method: "GET",
      mode: "cors",
      headers: { "Content-Type": "application/json", apikey: parameters.apikey },
    };

    const url = API.comexrecap.findAllByUserId + parameters.userId;
    const res = await fetch(url, requestOptions);
    const data = await res.json();

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
      headers: { "Content-Type": "application/json", apikey: parameters.apikey },
    };

    const url = API.comexrecap.findAllComexCountries;
    const res = await fetch(url, requestOptions);
    const data = await res.json();

    return data;
  } catch (error) {
    return error;
  }
}

async function findAllComexCountryPorts(parameters) {
  try {
    const requestOptions = {
      method: "GET",
      mode: "cors",
      headers: { "Content-Type": "application/json", apikey: parameters.apikey },
    };

    const url = API.comexrecap.findAllComexPorts + "/" + parameters.countryId;
    const res = await fetch(url, requestOptions);
    const data = await res.json();

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

async function findAllComexImportationTypes(parameters) {
  try {
    const requestOptions = {
      method: "GET",
      mode: "cors",
      headers: { "Content-Type": "application/json", apikey: parameters.apikey },
    };

    const url = API.comexrecap.findAllComexImportationTypes;
    const res = await fetch(url, requestOptions);
    const data = await res.json();

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

async function findAllComexCurrencies(parameters) {
  try {
    const requestOptions = {
      method: "GET",
      mode: "cors",
      headers: { "Content-Type": "application/json", apikey: parameters.apikey },
    };

    const url = API.comexrecap.findAllComexCurrencies;
    const res = await fetch(url, requestOptions);
    const data = await res.json();

    return data;
  } catch (error) {
    return error;
  }
}

async function findAllComexStatus(parameters) {
  try {
    const requestOptions = {
      method: "GET",
      mode: "cors",
      headers: { "Content-Type": "application/json", apikey: parameters.apikey },
    };

    // const url = API.comexrecap.findAll;
    // const res = await fetch(url, requestOptions);
    // const data = await res.json();

    const data = COMEX.status;
    return data;
  } catch (error) {
    return error;
  }
}

async function findAllComexTransportType(parameters) {
  try {
    const requestOptions = {
      method: "GET",
      mode: "cors",
      headers: { "Content-Type": "application/json", apikey: parameters.apikey },
    };

    const url = API.comexrecap.findAllComexTransportationMode;
    const res = await fetch(url, requestOptions);
    const data = await res.json();

    return data;
  } catch (error) {
    return error;
  }
}

async function findAllComexCountrySuppliers(parameters) {
  try {
    const requestOptions = {
      method: "GET",
      mode: "cors",
      headers: { "Content-Type": "application/json", apikey: parameters.apikey },
    };

    const url = API.comexrecap.findAllComexSuppliers + "/" + parameters.countryId;
    const res = await fetch(url, requestOptions);
    const data = await res.json();

    return data;
  } catch (error) {
    return error;
  }
}

async function findAllComexIncoterms(parameters) {
  try {
    const requestOptions = {
      method: "GET",
      mode: "cors",
      headers: { "Content-Type": "application/json", apikey: parameters.apikey },
    };

    const url = API.comexrecap.findAllComexIncoterms;
    const res = await fetch(url, requestOptions);
    const data = await res.json();

    return data;
  } catch (error) {
    return error;
  }
}

async function findAllComexCategoriesRoot(parameters) {
  try {
    const requestOptions = {
      method: "GET",
      mode: "cors",
      headers: { "Content-Type": "application/json", apikey: parameters.apikey },
    };

    const url = API.comexrecap.findAllComexCategories;
    const res = await fetch(url, requestOptions);
    const data = await res.json();

    return data;
  } catch (error) {
    return error;
  }
}

async function findAllComexCategories(parameters) {
  try {
    const requestOptions = {
      method: "GET",
      mode: "cors",
      headers: { "Content-Type": "application/json", apikey: parameters.apikey },
    };

    const url = API.comexrecap.findAllComexCategories + "/" + parameters.categoryId;
    const res = await fetch(url, requestOptions);
    const data = await res.json();

    return data;
  } catch (error) {
    return error;
  }
}

async function findAllComexPaymentTerms(parameters) {
  try {
    const requestOptions = {
      method: "GET",
      mode: "cors",
      headers: { "Content-Type": "application/json", apikey: parameters.apikey },
    };

    const url = API.comexrecap.findAllComexPaymentTerms;
    const res = await fetch(url, requestOptions);
    const data = await res.json();

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
      headers: { "Content-Type": "application/json", apikey: parameters.apikey },
    };

    const url = API.comexrecap.findAllComexCampaigns;
    const res = await fetch(url, requestOptions);
    const data = await res.json();

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
      headers: { "Content-Type": "application/json", apikey : parameters.apikey},
    };

    const url = API.comexrecap.findById + parameters.id;
    const res = await fetch(url, requestOptions);
    const data = await res.json();

    return data;
  } catch (error) {
    return error;
  }
}

async function findComexRecapBarcodeTypes(parameters) {
  try {
    const requestOptions = {
      method: "GET",
      mode: "cors",
      headers: { "Content-Type": "application/json", apikey : parameters.apikey},
    };

    const url = API.comexrecap.findAllComexBarcodeTypes;
    const res = await fetch(url, requestOptions);
    const data = await res.json();

    return data;
  } catch (error) {
    return error;
  }
}

async function findComexRecapMeasureUnits(parameters) {
  try {
    const requestOptions = {
      method: "GET",
      mode: "cors",
      headers: { "Content-Type": "application/json", apikey : parameters.apikey},
    };

    // const url = API.comexrecap.findAllComexBarcodeTypes;
    // const res = await fetch(url, requestOptions);
    // const data = await res.json();
    const data = COMEX.measureUnits;

    return data;
  } catch (error) {
    return error;
  }
}

async function findComexRecapItems(parameters) {
  try {
    const requestOptions = {
      method: "GET",
      mode: "cors",
      headers: { "Content-Type": "application/json", apikey : parameters.apikey},
    };

    const url = API.comexrecap.findComexRecapItems + parameters.id;
    const res = await fetch(url, requestOptions);
    const data = await res.json();

    return data;
  } catch (error) {
    return error;
  }
}

async function comexRecapAddItem(parameters) {
  try {
    const body = JSON.stringify(parameters.body);

    const requestOptions = {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        apikey: parameters.apikey,
      },
      body: body,
    };

    const url = API.comexrecap.comexRecapAddItem + parameters.id;
    const res = await fetch(url, requestOptions);
    const data = await res.json();

    return data;
  } catch (error) {
    return error;
  }
}

async function findComexRecapItemById(parameters) {
  try {
    const requestOptions = {
      method: "GET",
      mode: "cors",
      headers: { "Content-Type": "application/json", apikey : parameters.apikey},
    };

    const url = API.comexrecap.findComexRecapItemById + parameters.id;
    const res = await fetch(url, requestOptions);
    const data = await res.json();

    return data;
  } catch (error) {
    return error;
  }
}

async function comexRecapUpdateItem(parameters) {
  try {
    const body = JSON.stringify(parameters.body);

    const requestOptions = {
      method: "PUT",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        apikey: parameters.apikey,
      },
      body: body,
    };

    const url = API.comexrecap.comexRecapUpdateItem + parameters.itemId;
    console.log("comexRecapUpdateItem url ->", url);

    const res = await fetch(url, requestOptions);
    console.log("comexRecapUpdateItem res ->", res);

    const data = await res.json();
    console.log("comexRecapUpdateItem data ->", data);

    return data;
  } catch (error) {
    return error;
  }
}

const uploadItemImage = async (parameters) => {
  try {
    const requestOptions = {
      method: "POST",
      mode: "cors",
      headers: {
        apikey: parameters.apikey,
      },
      body: parameters.data,
    };

    const url = API.comexrecap.uploadImage + parameters.id

    const res = await fetch(url, requestOptions);
    const data = await res.json();

    return data;
  } catch (error) {
    return error;
  }
};

export {
  createComexRecap,
  updateComexRecap,
  deleteComexRecap,
  findAllComexRecapsByUserId,
  findComexRecapById,
  findAllComexCountries,
  findAllComexCampaigns,
  findAllComexDepartments,
  findAllComexImportationTypes,
  findAllComexFactories,
  findAllComexPaymentTerms,
  findAllComexProductionTimes,
  findAllComexCountryPorts,
  findAllComexCountrySuppliers,
  findAllComexIncoterms,
  findAllComexCurrencies,
  findAllComexStatus,
  findAllComexCategoriesRoot,
  findAllComexCategories,
  findAllComexTransportType,
  findComexRecapBarcodeTypes,
  findComexRecapMeasureUnits,
  findComexRecapItems,
  findComexRecapItemById,
  comexRecapAddItem,
  comexRecapUpdateItem,
  uploadItemImage
};
