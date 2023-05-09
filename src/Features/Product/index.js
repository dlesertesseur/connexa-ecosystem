import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { actions, API } from "../../Constants";

const initialState = {
  value: {
    processing: false,
    loadingImages: false,
    error: null,
    errorMessage: null,
    errorCode: null,
    created: false,
    creating: false,
    products: [],
    images: [],
    selectedRow: null,
    refreshData: null,
    refreshImageList: Date.now(),
    productsPages: 0,
    totalElements: 0,
    itemsByPage: 12,
    page: 1,
    productsInCategory: [],
    productsInCategoryPages: 0,
    totalProductsInCategory: 0,
    unassignedProducts: [],
    unassignedProductsPages: 0,
    totalUnassignedProducts: 0,
    refreshCategorizeData: Date.now(),
    uploading: false,
    downloading: false,
    loadingUnassignedProducts: false,
    activePage: null,
    selectedRowId: null,
    product: null,
    reloadImages: Date.now(),
    appState: null
  },
};

export const create = createAsyncThunk("product/create", async (parameters, asyncThunk) => {
  try {
    const body = JSON.stringify({
      sku: parameters.sku,
      ean: parameters.ean,
      description: parameters.description,
      brandId: parameters.brandId,
      price: parameters.price,
      currency: parameters.currency,
      status: parameters.status,
      projectId: parameters.projectId,
      countryOfOriginId: parameters.countryOfOriginId,
      measurementTypeIdForContent: parameters.measurementTypeIdForContent,
      measurementUnitIdForContent: parameters.measurementUnitIdForContent,
      measurementTypeIdForSale: parameters.measurementTypeIdForSale,
      measurementUnitIdForSale: parameters.measurementUnitIdForSale,
      measurementTypeIdForPrice: parameters.measurementTypeIdForPrice,
      measurementUnitIdForPrice: parameters.measurementUnitIdForPrice,
    });

    console.log("product/create", {
      sku: parameters.sku,
      ean: parameters.ean,
      description: parameters.description,
      brandId: parameters.brand,
      price: parameters.price,
      currency: parameters.currency,
      status: parameters.status,
      projectId: parameters.projectId,
      countryOfOriginId: parameters.countryOfOrigin,
      measurementTypeIdForContent: parameters.measurementTypeIdForContent,
      measurementUnitIdForContent: parameters.measurementUnitIdForContent,
      measurementTypeIdForSale: parameters.measurementTypeIdForSale,
      measurementUnitIdForSale: parameters.measurementUnitIdForSale,
      measurementTypeIdForPrice: parameters.measurementTypeIdForPrice,
      measurementUnitIdForPrice: parameters.measurementUnitIdForPrice,
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

    const res = await fetch(API.product.create, requestOptions);
    const data = await res.json();

    return data;
  } catch (error) {
    return asyncThunk.rejectWithValue(error);
  }
});

export const update = createAsyncThunk("product/update", async (parameters, asyncThunk) => {
  try {
    const transfer = {
      id: parameters.id,
      sku: parameters.sku,
      ean: parameters.ean,
      description: parameters.description,
      brandId: parameters.brand,
      price: parameters.price,
      currency: parameters.currency,
      status: parameters.status,
      projectId: parameters.projectId,
      countryOfOriginId: parameters.countryOfOrigin,
      measurementTypeIdForContent: parameters.measurementTypeIdForContent,
      measurementUnitIdForContent: parameters.measurementUnitIdForContent,
      measurementTypeIdForSale: parameters.measurementTypeIdForSale,
      measurementUnitIdForSale: parameters.measurementUnitIdForSale,
      measurementTypeIdForPrice: parameters.measurementTypeIdForPrice,
      measurementUnitIdForPrice: parameters.measurementUnitIdForPrice,
    };

    const body = JSON.stringify(transfer);

    const requestOptions = {
      method: "PUT",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        token: parameters.token,
      },
      body: body,
    };

    const res = await fetch(API.product.update, requestOptions);
    const data = await res.json();

    return data;
  } catch (error) {
    return asyncThunk.rejectWithValue(error);
  }
});

export const remove = createAsyncThunk("product/delete", async (parameters, asyncThunk) => {
  try {
    const requestOptions = {
      method: "DELETE",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        token: parameters.token,
      },
    };

    await fetch(API.product.delete + parameters.id, requestOptions).then((response) => {
      return response;
    });
  } catch (error) {
    return asyncThunk.rejectWithValue(error);
  }
});

export const findAllProductsByPage = createAsyncThunk(
  "product/findAllProductsByPage",
  async (parameters, asyncThunk) => {
    try {
      const requestOptions = {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          token: parameters.token,
        },
      };

      const url = API.product.findAllProductsPage + parameters.pageNbr + "/" + parameters.itemsByPage;
      const res = await fetch(url, requestOptions);
      const data = await res.json();

      return data;
    } catch (error) {
      return asyncThunk.rejectWithValue(error);
    }
  }
);

export const findProductById = createAsyncThunk("product/findProductById", async (parameters, asyncThunk) => {
  try {
    const requestOptions = {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        token: parameters.token,
      },
    };

    const url = API.product.findProductById + parameters.id;
    const res = await fetch(url, requestOptions);
    const data = await res.json();

    return data;
  } catch (error) {
    return asyncThunk.rejectWithValue(error);
  }
});

export const findAllProductsByCategoryIdPage = createAsyncThunk(
  "product/findAllProductsByCategoryIdPage",
  async (parameters, asyncThunk) => {
    try {
      const requestOptions = {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          token: parameters.token,
        },
      };

      const url =
        API.category_product_relation.findAllProductsByCategoryIdPage +
        parameters.categoryId +
        "/" +
        parameters.pageNbr +
        "/" +
        parameters.itemsByPage;

      const res = await fetch(url, requestOptions);
      const data = await res.json();

      return data;
    } catch (error) {
      return asyncThunk.rejectWithValue(error);
    }
  }
);

export const findAllProductsUnassignedPage = createAsyncThunk(
  "product/findAllProductsUnassignedPage",
  async (parameters, asyncThunk) => {
    try {
      const requestOptions = {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          token: parameters.token,
        },
      };

      const url =
        API.category_product_relation.findAllProductsByCategoryIdPage +
        parameters.pageNbr +
        "/" +
        parameters.itemsByPage;
      const res = await fetch(url, requestOptions);
      const data = await res.json();

      return data;
    } catch (error) {
      return asyncThunk.rejectWithValue(error);
    }
  }
);

export const categorizeProductsByProjectIdCategortyId = createAsyncThunk(
  "product/categorizeProductsByProjectIdCategortyId",
  async (parameters, asyncThunk) => {
    try {
      const body = JSON.stringify({
        arrayOfProductIds: parameters.productIds,
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

      const url =
        API.category_product_relation.categorizeProductsByProjectIdCategortyId +
        parameters.organizationId +
        "/" +
        parameters.projectId +
        "/" +
        parameters.categoryId;

      const res = await fetch(url, requestOptions);
      const data = await res.json();

      return data;
    } catch (error) {
      return asyncThunk.rejectWithValue(error);
    }
  }
);

export const uncategorizeProductsByProjectId = createAsyncThunk(
  "product/uncategorizeProductsByProjectId",
  async (parameters, asyncThunk) => {
    try {
      const body = JSON.stringify({
        arrayOfProductIds: parameters.productIds,
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

      const url =
        API.category_product_relation.uncategorizeProductsByProjectId +
        parameters.organizationId +
        "/" +
        parameters.projectId;

      const res = await fetch(url, requestOptions);
      const data = await res.json();

      return data;
    } catch (error) {
      return asyncThunk.rejectWithValue(error);
    }
  }
);

export const findAllCountries = createAsyncThunk("product/findAllCountries", async (parameters, asyncThunk) => {
  try {
    const requestOptions = {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        token: parameters.token,
      },
    };

    const url = API.product.findAllCountries;
    const res = await fetch(url, requestOptions);
    const data = await res.json();

    return data;
  } catch (error) {
    return asyncThunk.rejectWithValue(error);
  }
});

export const findAllImagesByProductId = createAsyncThunk(
  "product/findAllImagesByProductId",
  async (parameters, asyncThunk) => {
    try {
      const requestOptions = {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          token: parameters.token,
        },
      };

      const url = API.productImages.findAllImagesByProductId + parameters.id;
      const res = await fetch(url, requestOptions);
      const data = await res.json();

      return data;
    } catch (error) {
      return asyncThunk.rejectWithValue(error);
    }
  }
);

export const removeImage = createAsyncThunk("product/removeImage", async (parameters, asyncThunk) => {
  try {
    const requestOptions = {
      method: "DELETE",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        token: parameters.token,
      },
    };

    await fetch(API.productImages.delete + parameters, requestOptions).then((response) => {
      return response;
    });
  } catch (error) {
    return asyncThunk.rejectWithValue(error);
  }
});

export const findAllProducts = createAsyncThunk("product/findAllProducts", async (parameters, asyncThunk) => {
  try {
    const requestOptions = {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        token: parameters.token,
      },
    };

    const url = API.product.findAllProducts;
    const res = await fetch(url, requestOptions);
    const data = await res.json();

    return data;
  } catch (error) {
    return asyncThunk.rejectWithValue(error);
  }
});

export const uploadImage = createAsyncThunk("product/uploadImage", async (parameters, asyncThunk) => {
  try {
    const requestOptions = {
      method: "POST",
      mode: "cors",
      headers: {
        token: parameters.token,
      },
      body: parameters.data,
    };

    const url = API.product.uploadImage + parameters.id;

    const res = await fetch(url, requestOptions);
    const data = await res.json();

    return data;
  } catch (error) {
    return asyncThunk.rejectWithValue(error);
  }
});

export const deleteImage = createAsyncThunk("product/deleteImage", async (parameters, asyncThunk) => {
  try {
    const requestOptions = {
      method: "DELETE",
      mode: "cors",
      headers: {
        token: parameters.token,
      },
      body: parameters.data,
    };

    const url = API.product.deleteImage + parameters.id;

    const res = await fetch(url, requestOptions);
    const data = await res.json();

    return data;
  } catch (error) {
    return asyncThunk.rejectWithValue(error);
  }
});

export const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setSelectedRow: (state, { payload }) => {
      state.value.selectedRow = payload;
    },

    refreshDataGrid: (state) => {
      state.value.refreshData = Date.now();
    },

    refreshImageListData: (state) => {
      state.value.refreshImageList = Date.now();
    },

    setPage: (state, { payload }) => {
      state.value.page = payload;
    },

    refreshCategorizeData: (state) => {
      state.value.refreshCategorizeData = Date.now();
    },

    clearProductsInCategory: (state) => {
      state.value.productsInCategory = [];
      state.value.productsInCategoryPages = 0;
      state.value.totalProductsInCategory = 0;
    },

    clearError: (state) => {
      state.value.error = null;
      state.value.errorMessage = null;
      state.value.errorCode = null;
      state.value.creating = null;
    },

    setSelectedRowId: (state, { payload }) => {
      state.value.selectedRowId = payload;
    },

    resetGlobalStates: (state, { payload }) => {
      state.value.selectedRowId = payload;
    },
  },
  extraReducers: {
    /*CREATE*/
    [create.pending]: (state) => {
      state.value.processing = true;
      state.value.error = null;
      state.value.errorMessage = null;
      state.value.errorCode = null;
      state.value.creating = true;
      state.value.created = false;
    },

    [create.fulfilled]: (state, { payload }) => {
      if (payload.error) {
        state.value.error = payload.error;
        state.value.errorMessage = payload.message;
        state.value.errorCode = payload.status;
      } else {
        state.value.id = payload.id;
        state.value.errorMessage = null;
        state.value.errorCode = null;
        state.value.error = null;
        state.value.appState = actions.created;
      }
      state.value.processing = false;
    },

    [create.rejected]: (state, { payload }) => {

      console.log("[create.rejected]", payload);

      state.value.processing = false;
      state.value.error = payload;
      state.value.errorMessage = payload.message;
      state.value.errorCode = payload.status;
    },

    /*UPDATE*/
    [update.pending]: (state) => {
      state.value.processing = true;
      state.value.error = null;
      state.value.errorMessage = null;
      state.value.errorCode = null;
      state.value.creating = true;
    },
    [update.fulfilled]: (state, { payload }) => {
      if (payload.error) {
        state.value.error = payload.error;
        state.value.errorMessage = payload.message;
        state.value.errorCode = payload.status;
      } else {
        state.value.id = payload.id;
        state.value.errorMessage = null;
        state.value.errorCode = null;
        state.value.error = null;
        state.value.appState = actions.updated;
      }
      state.value.processing = false;
    },

    [update.rejected]: (state, { payload }) => {
      state.value.processing = false;
      state.value.error = payload;
      state.value.errorMessage = payload.message;
      state.value.errorCode = payload.status;
    },

    /*DELETE*/
    [remove.pending]: (state) => {
      state.value.processing = true;
      state.value.error = null;
      state.value.errorMessage = null;
      state.value.errorCode = null;
      state.value.creating = true;
    },

    [remove.fulfilled]: (state, { payload }) => {
      state.value.errorMessage = null;
      state.value.errorCode = null;
      state.value.error = null;
      state.value.appState = actions.created;
      state.value.selectedRowId = null;
      state.value.product = null;
      state.value.processing = false;
    },

    [remove.rejected]: (state, { payload }) => {
      state.value.processing = false;
      state.value.error = payload;
      state.value.errorMessage = payload.message;
      state.value.errorCode = payload.status;
      state.value.creating = false;
    },

    /*FIND ALL COUNTRIES*/
    [findAllCountries.pending]: (state) => {
      state.value.loadingCountries = true;
      state.value.error = null;
    },

    [findAllCountries.fulfilled]: (state, { payload }) => {
      if (payload.error) {
        state.value.error = payload;
      } else {
        state.value.countries = payload;
        state.value.error = null;
      }
      state.value.loadingCountries = false;
    },

    [findAllCountries.rejected]: (state, { payload }) => {
      state.value.loadingCountries = false;
      state.value.error = payload;
    },

    /*FIND ALL IMAGES BY PRODUCID*/
    [findAllImagesByProductId.pending]: (state) => {
      state.value.loadingImages = true;
      state.value.error = null;
    },

    [findAllImagesByProductId.fulfilled]: (state, { payload }) => {
      if (payload.error) {
        state.value.error = payload;
      } else {
        state.value.images = payload;
        state.value.error = null;
      }
      state.value.loadingImages = false;
    },

    [findAllImagesByProductId.rejected]: (state, { payload }) => {
      state.value.loadingImages = false;
      state.value.error = payload;
    },

    /*DELETE IMAGE*/
    [removeImage.pending]: (state) => {
      state.value.loadingImages = true;
      state.value.error = null;
    },

    [removeImage.fulfilled]: (state, { payload }) => {
      if (payload) {
        state.value.error = payload;
      } else {
        state.value.error = null;
        state.value.refreshImageList = Date.now();
      }
      state.value.loadingImages = false;
    },

    [removeImage.rejected]: (state, { payload }) => {
      state.value.loadingImages = false;
      state.value.error = payload;
    },

    /*FIND ALL PRODUCTS BY PROJECT ID BY PAGE*/
    [findAllProductsByPage.pending]: (state) => {
      state.value.processing = true;
      state.value.error = null;
    },

    [findAllProductsByPage.fulfilled]: (state, { payload }) => {
      if (payload.error) {
        state.value.error = payload;
      } else {
        const ret = payload.content.map((p) => ({
          ...p,
          countryName: p.countryOfOrigin.name,
        }));
        state.value.products = ret;
        state.value.productsPages = payload.totalPages;
        state.value.totalProducts = payload.totalElements;
        state.value.error = null;

        console.log("[findAllProductsByPage.fulfilled]", ret);
      }
      state.value.processing = false;
    },

    [findAllProductsByPage.rejected]: (state, { payload }) => {
      state.value.processing = false;
      state.value.error = payload;
    },

    /*FIND ALL PRODUCTS BY PROJECT ID AND CATEGORY ID - PAGE*/
    [findAllProductsByCategoryIdPage.pending]: (state) => {
      state.value.processing = true;
      state.value.error = null;
    },

    [findAllProductsByCategoryIdPage.fulfilled]: (state, { payload }) => {
      if (payload.error) {
        state.value.error = payload;
      } else {
        state.value.productsInCategory = payload.content.map((p) => ({
          ...p,
          countryName: p.countryOfOrigin.name,
        }));
        state.value.productsInCategoryPages = payload.totalPages;
        state.value.totalProductsInCategory = payload.totalElements;
        state.value.error = null;
      }
      state.value.processing = false;
    },

    [findAllProductsByCategoryIdPage.rejected]: (state, { payload }) => {
      state.value.processing = false;
      state.value.error = payload;
    },

    /*FIND ALL PRODUCTS BY PROJECT ID AND CATEGORY ID - PAGE*/
    [findAllProductsUnassignedPage.pending]: (state) => {
      state.value.loadingUnassignedProducts = true;
      state.value.error = null;
    },

    [findAllProductsUnassignedPage.fulfilled]: (state, { payload }) => {
      if (payload.error) {
        state.value.error = payload;
      } else {
        state.value.unassignedProducts = payload.content.map((p) => ({
          ...p,
          countryName: p.countryOfOrigin.name,
        }));
        state.value.unassignedProductsPages = payload.totalPages;
        state.value.totalUnassignedProducts = payload.totalElements;
        state.value.error = null;
      }
      state.value.loadingUnassignedProducts = false;
    },

    [findAllProductsUnassignedPage.rejected]: (state, { payload }) => {
      state.value.loadingUnassignedProducts = false;
      state.value.error = payload;
    },

    /*CATEGORIZE PRODUCTS*/
    [categorizeProductsByProjectIdCategortyId.pending]: (state) => {
      state.value.uploading = true;
      state.value.error = null;
    },

    [categorizeProductsByProjectIdCategortyId.fulfilled]: (state, { payload }) => {
      if (payload.error) {
        state.value.error = payload;
      } else {
        state.value.error = null;
      }
      state.value.uploading = false;
      state.value.refreshCategorizeData = Date.now();
    },

    [categorizeProductsByProjectIdCategortyId.rejected]: (state, { payload }) => {
      state.value.uploading = false;
      state.value.error = payload;
    },

    /*UNCATEGORIZE PRODUCTS*/
    [uncategorizeProductsByProjectId.pending]: (state) => {
      state.value.downloading = true;
      state.value.error = null;
    },

    [uncategorizeProductsByProjectId.fulfilled]: (state, { payload }) => {
      if (payload.error) {
        state.value.error = payload;
      } else {
        state.value.error = null;
      }
      state.value.downloading = false;
      state.value.refreshCategorizeData = Date.now();
    },

    [uncategorizeProductsByProjectId.rejected]: (state, { payload }) => {
      state.value.downloading = false;
      state.value.error = payload;
    },

    /*ALL PRODUCTS*/
    [findAllProducts.pending]: (state) => {
      state.value.processing = true;
      state.value.error = null;
    },

    [findAllProducts.fulfilled]: (state, { payload }) => {
      if (payload.error) {
        state.value.error = payload;
      } else {
        state.value.products = payload;
        state.value.error = null;
        state.value.appState = actions.readed;
      }
      state.value.processing = false;
    },

    [findAllProducts.rejected]: (state, { payload }) => {
      state.value.processing = false;
      state.value.error = payload;
    },

    /*PRODUCT BY ID*/
    [findProductById.pending]: (state) => {
      state.value.processing = true;
      state.value.error = null;
      state.value.created = false;
      state.value.creating = false;
    },

    [findProductById.fulfilled]: (state, { payload }) => {
      if (payload.error) {
        state.value.error = payload;
      } else {
        state.value.product = payload;
        state.value.error = null;
      }
      state.value.processing = false;
    },

    [findProductById.rejected]: (state, { payload }) => {
      state.value.processing = false;
      state.value.error = payload;
    },

    /*DELETE IMAGE ID*/
    [deleteImage.pending]: (state) => {
      state.value.processing = true;
      state.value.error = null;
      state.value.errorMessage = null;
    },

    [deleteImage.fulfilled]: (state, { payload }) => {
      console.log("[deleteImage.fulfilled]", payload);
      state.value.error = null;
      state.value.errorMessage = null;
      state.value.processing = false;
    },

    [deleteImage.rejected]: (state, { payload }) => {
      state.value.error = payload;
      state.value.errorMessage = payload.message;
      state.value.processing = false;
    },


    [uploadImage.pending]: (state) => {
      state.value.loadingImages = true;
      state.value.error = null;
    },

    [uploadImage.fulfilled]: (state, { payload }) => {

      if (payload.error) {
        state.value.error = payload.error;
        state.value.errorMessage = payload.message;
        state.value.errorCode = payload.status;
      } else {
        state.value.id = payload.id;
        state.value.errorMessage = null;
        state.value.errorCode = null;
        state.value.error = null;
        state.value.refreshImageList = Date.now();
      }
      state.value.loadingImages = false;
    },

    [uploadImage.rejected]: (state, { payload }) => {
      state.value.loadingImages = false;
      state.value.error = payload;
    },
  },
});

export const {
  setSelectedRow,
  refreshDataGrid,
  refreshImageListData,
  setPage,
  refreshCategorizeData,
  clearProductsInCategory,
  clearError,
  setSelectedRowId,
} = productSlice.actions;

export default productSlice.reducer;
