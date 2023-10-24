import { config } from "./config";

export const HEADER_HIGHT = 220;
export const TOOLBAR_HIGHT = 42;
export const VIEW_HEADER_HIGHT = 48;
export const DIVIDER_HIGHT = 20;
export const PIXEL_METER_RELATION = 25.0;
export const BLOCK_SNAP_SIZE = 1.0;
export const CONNECTOR_TWO_WAY = "two_way";
export const CONNECTOR_ONE_WAY = "one_way";
export const NODE_RADIO = 6;

export const RACK_ORIENTATION_Y = "rack_orientation_y_axis";
export const RACK_ORIENTATION_X = "rack_orientation_x_axis";

export const GUIDELINE_OFFSET = 5;

const LOCAL_SERVER = "http://localhost";

export const CRUD_PAGE_MODE = { new: 1, update: 2, delete: 3 };

export const API = {
  auth: {
    signUp: config.SERVER + ":" + config.PORT + config.API_BASE + "/users",
    signIn: config.SERVER + ":" + config.PORT + config.API_BASE + "/authentication",
    changePassword: config.SERVER + ":" + config.PORT + config.API_BASE + "/user/changePassword",
    authorizations: config.SERVER + ":" + config.PORT + config.API_BASE + "/authorizations/",
    findByEmail: config.SERVER + ":" + config.PORT + config.API_BASE + "/authorizations/organizations/",
    byUserId: config.SERVER + ":" + config.PORT + config.API_BASE + "/authorizations/",
    findRolesByEmail:
      config.SERVER +
      ":" +
      config.PORT +
      config.API_BASE +
      "/authorizations/organizations/{email}/organizations/{organizationId}/roles",
    findAllRolesByUserId: config.SERVER + ":" + config.PORT + config.API_BASE + "/authorizations/",
    unassignRole: config.SERVER + ":" + config.PORT + config.API_BASE + "/authorizations/",
    assignRole: config.SERVER + ":" + config.PORT + config.API_BASE + "/authorizations",
    findAllRoleSiteIdAndUserId: config.SERVER + ":" + config.PORT + config.API_BASE + "/authorizations",
  },

  user: {
    create: config.SERVER + ":" + config.PORT + config.API_BASE + "/users",
    update: config.SERVER + ":" + config.PORT + config.API_BASE + "/users/",
    delete: config.SERVER + ":" + config.PORT + config.API_BASE + "/users/",
    getAllUsers: config.SERVER + ":" + config.PORT + config.API_BASE + "/users/unpaged",
    findByEmail: config.SERVER + ":" + config.PORT + config.API_BASE + "/users/",
    findById: config.SERVER + ":" + config.PORT + config.API_BASE + "/users/",
    findAllUserByPage: config.SERVER + ":" + config.PORT + config.API_BASE + "/users/",
    uploadImage: config.SERVER + ":" + config.PORT + config.API_BASE + "/user-images/",
    getAllImages: config.SERVER + ":" + config.PORT + config.API_BASE + "/user-images/",
    deleteImage: config.SERVER + ":" + config.PORT + config.API_BASE + "/user-images/",
    urlPhotoBase: config.SERVER + ":" + config.PORT,
  },

  userRole: {
    create: config.SERVER + ":" + config.PORT + config.API_BASE + "/user-role-relations/user/{userId}/role/",
    delete: config.SERVER + ":" + config.PORT + config.API_BASE + "/user-role-relations/user/{userId}/role/",
    findAllRolesByUser: config.SERVER + ":" + config.PORT + config.API_BASE + "/user-role-relations/user/",
  },

  parameter: {
    create: config.SERVER + ":" + config.PORT + config.API_BASE + "/parameters",
    update: config.SERVER + ":" + config.PORT + config.API_BASE + "/parameters/",
    delete: config.SERVER + ":" + config.PORT + config.API_BASE + "/parameters/",
    findAll: config.SERVER + ":" + config.PORT + config.API_BASE + "/parameters",
    findByName: config.SERVER + ":" + config.PORT + config.API_BASE + "/parameters",
  },

  application: {
    create: config.SERVER + ":" + config.PORT + config.API_BASE + "/applications/",
    update: config.SERVER + ":" + config.PORT + config.API_BASE + "/applications/",
    delete: config.SERVER + ":" + config.PORT + config.API_BASE + "/applications/",
    findAll: config.SERVER + ":" + config.PORT + config.API_BASE + "/applications",
    findById: config.SERVER + ":" + config.PORT + config.API_BASE + "/applications/",
  },

  applicationTranslation: {
    create: config.SERVER + ":" + config.PORT + config.API_BASE + "/applications-translations",
    update: config.SERVER + ":" + config.PORT + config.API_BASE + "/applications-translations",
    delete: config.SERVER + ":" + config.PORT + config.API_BASE + "/applications-translations/",
    findAllByApplicationId: config.SERVER + ":" + config.PORT + config.API_BASE + "/applications-translations/",
  },

  organization: {
    create: config.SERVER + ":" + config.PORT + config.API_BASE + "/organizations",
    update: config.SERVER + ":" + config.PORT + config.API_BASE + "/organizations",
    delete: config.SERVER + ":" + config.PORT + config.API_BASE + "/organizations/",
    findAll: config.SERVER + ":" + config.PORT + config.API_BASE + "/organizations",
    findById: config.SERVER + ":" + config.PORT + config.API_BASE + "/organizations/",
    findRolesByEmailAndOrganization:
      config.SERVER +
      ":" +
      config.PORT +
      config.API_BASE +
      "/organizations/{email}/organizations/{organizationId}/roles",
  },

  organizationRole: {
    asignRol: config.SERVER + ":" + config.PORT + config.API_BASE + "/organization-role-relations/organizations/",
    unasignRol: config.SERVER + ":" + config.PORT + config.API_BASE + "/organization-role-relations/roles/",
    findAllByOrganizationId:
      config.SERVER + ":" + config.PORT + config.API_BASE + "/organization-role-relations/organizations/",
  },

  project: {
    create: config.SERVER + ":" + config.PORT + config.API_BASE + "/projects/{0}/",
    update: config.SERVER + ":" + config.PORT + config.API_BASE + "/projects/",
    delete: config.SERVER + ":" + config.PORT + config.API_BASE + "/projects/",
    findAll: config.SERVER + ":" + config.PORT + config.API_BASE + "/projects",
    findByName: config.SERVER + ":" + config.PORT + config.API_BASE + "/projects",
    findAllByIdOrganizationId: config.SERVER + ":" + config.PORT + config.API_BASE + "/projects/",
  },

  role: {
    create: config.SERVER + ":" + config.PORT + config.API_BASE + "/roles",
    update: config.SERVER + ":" + config.PORT + config.API_BASE + "/roles/",
    delete: config.SERVER + ":" + config.PORT + config.API_BASE + "/roles/",
    findAll: config.SERVER + ":" + config.PORT + config.API_BASE + "/roles",
    findByName: config.SERVER + ":" + config.PORT + config.API_BASE + "/roles",
    findById: config.SERVER + ":" + config.PORT + config.API_BASE + "/roles/",
    findAllApplicationsByRole:
      config.SERVER + ":" + config.PORT + config.API_BASE + "/application-role-relations/role/",
    findAllRolesInContext: config.SERVER + ":" + config.PORT + config.API_BASE + "/roles/context/",
  },

  roleTranslation: {
    create: config.SERVER + ":" + config.PORT + config.API_BASE + "/roles-translations",
    update: config.SERVER + ":" + config.PORT + config.API_BASE + "/roles-translations",
    delete: config.SERVER + ":" + config.PORT + config.API_BASE + "/roles-translations/",
    findAllByRoleId: config.SERVER + ":" + config.PORT + config.API_BASE + "/roles-translations/",
  },

  applicationRole: {
    create: config.SERVER + ":" + config.PORT + config.API_BASE + "/application-role-relations/application/",
    delete: config.SERVER + ":" + config.PORT + config.API_BASE + "/application-role-relations/application/",
  },

  site: {
    create: config.SERVER + ":" + config.PORT + config.API_BASE + "/sites/",
    update: config.SERVER + ":" + config.PORT + config.API_BASE + "/sites/",
    delete: config.SERVER + ":" + config.PORT + config.API_BASE + "/sites/",
    findAllByIdProjectId: config.SERVER + ":" + config.PORT + config.API_BASE + "/sites/projects/",
    findAllSitesByPage: config.SERVER + ":" + config.PORT + config.API_BASE + "/sites/",
    findSiteById: config.SERVER + ":" + config.PORT + config.API_BASE + "/sites/",
    findAllSites: config.SERVER + ":" + config.PORT + config.API_BASE + "/sites/unpaged",
  },

  brand: {
    create: config.SERVER + ":" + config.PORT + config.API_BASE + "/brands/",
    update: config.SERVER + ":" + config.PORT + config.API_BASE + "/brands/",
    delete: config.SERVER + ":" + config.PORT + config.API_BASE + "/brands/",
    findAll: config.SERVER + ":" + config.PORT + config.API_BASE + "/brands",
    findById: config.SERVER + ":" + config.PORT + config.API_BASE + "/brands/",
  },

  retailer: {
    create: config.SERVER + ":" + config.PORT + config.API_BASE + "/retailers/",
    update: config.SERVER + ":" + config.PORT + config.API_BASE + "/retailers/",
    delete: config.SERVER + ":" + config.PORT + config.API_BASE + "/retailers/",
    findAll: config.SERVER + ":" + config.PORT + config.API_BASE + "/retailers",
    findById: config.SERVER + ":" + config.PORT + config.API_BASE + "/retailers/",
  },

  category: {
    create: config.SERVER + ":" + config.PORT + config.API_BASE + "/categories/",
    update: config.SERVER + ":" + config.PORT + config.API_BASE + "/categories",
    delete: config.SERVER + ":" + config.PORT + config.API_BASE + "/categories/",
    getRootOfCategories: config.SERVER + ":" + config.PORT + config.API_BASE + "/categories",
    getChildrenOfCategory: config.SERVER + ":" + config.PORT + config.API_BASE + "/categories/",
    getAllCategories: config.SERVER + ":" + config.PORT + config.API_BASE + "/categories/full/",
    findById: config.SERVER + ":" + config.PORT + config.API_BASE + "/categories/",
  },

  product: {
    create: config.SERVER + ":" + config.PORT + config.API_BASE + "/products",
    update: config.SERVER + ":" + config.PORT + config.API_BASE + "/products",
    delete: config.SERVER + ":" + config.PORT + config.API_BASE + "/products/",
    findAllByIdProjectId: config.SERVER + ":" + config.PORT + config.API_BASE + "/products/projects/",
    findAllCountries: config.SERVER + ":" + config.PORT + config.API_BASE + "/countries",
    findAllProductsPage: config.SERVER + ":" + config.PORT + config.API_BASE + "/products/",
    findAllProducts: config.SERVER + ":" + config.PORT + config.API_BASE + "/products/unpaged",
    findProductById: config.SERVER + ":" + config.PORT + config.API_BASE + "/products/",
    uploadImage: config.SERVER + ":" + config.PORT + config.API_BASE + "/product-images/",
    deleteImage: config.SERVER + ":" + config.PORT + config.API_BASE + "/product-images/",
  },

  category_product_relation: {
    findAllProductsByCategoryIdPage:
      config.SERVER + ":" + config.PORT + config.API_BASE + "/category-product-relation/",
    categorizeProductsByProjectIdCategortyId:
      config.SERVER + ":" + config.PORT + config.API_BASE + "/category-product-relation/",
    uncategorizeProductsByProjectId:
      config.SERVER + ":" + config.PORT + config.API_BASE + "/category-product-relation/",
  },

  country: {
    getImage: config.SERVER + ":" + config.PORT + "/countries/",
  },

  locale: {
    findAll: config.SERVER + ":" + config.PORT + config.API_BASE + "/locales/",
  },

  measurement: {
    findAllMeasurementTypes: config.SERVER + ":" + config.PORT + config.API_BASE + "/measurement-types",
    findAllMeasurementUnitsByType: config.SERVER + ":" + config.PORT + config.API_BASE + "/measurement-units/",
  },

  productImages: {
    upload: config.SERVER + ":" + config.PORT + config.API_BASE + "/product-images/",
    findAllImagesByProductId: config.SERVER + ":" + config.PORT + config.API_BASE + "/product-images/",
    baseUrl: config.SERVER + ":" + config.PORT,
    delete: config.SERVER + ":" + config.PORT + config.API_BASE + "/product-images/",
  },

  context: {
    create: config.SERVER + ":" + config.PORT + config.API_BASE + "/contexts",
    update: config.SERVER + ":" + config.PORT + config.API_BASE + "/contexts/",
    delete: config.SERVER + ":" + config.PORT + config.API_BASE + "/contexts/",
    findAll: config.SERVER + ":" + config.PORT + config.API_BASE + "/contexts",
    findByName: config.SERVER + ":" + config.PORT + config.API_BASE + "/contexts",
  },

  graphic: {
    findStructure: LOCAL_SERVER + ":" + config.PORT + config.API_BASE + "/structure",
    findScene: LOCAL_SERVER + ":" + config.PORT + config.API_BASE + "/scene",
    findActors: LOCAL_SERVER + ":" + config.PORT + config.API_BASE + "/actors",
    findTarget: LOCAL_SERVER + ":" + config.PORT + config.API_BASE + "/target",
    findPath: LOCAL_SERVER + ":" + config.PORT + config.API_BASE + "/findPath",
    findOperator: LOCAL_SERVER + ":" + config.PORT + config.API_BASE + "/work-orders",
  },

  surface: {
    findZone: config.SERVER + ":" + config.PORT + config.API_BASE + "/storage-zones",
    findRacksByZoneId: config.SERVER + ":" + config.PORT + config.API_BASE + "/sites",
    findRackId: config.SERVER + ":" + config.PORT + config.API_BASE + "/racks",
    findLayout: config.SERVER + ":" + config.PORT + config.API_BASE + "/site-drawings",
    findFloor: config.SERVER + ":" + config.PORT + config.API_BASE + "/floors",
    savePosAndRot: config.SERVER + ":" + config.PORT + config.API_BASE + "/sites",
    saveLayout: config.SERVER + ":" + config.PORT + config.API_BASE + "/site-drawings/",
    findLayoutByFloorId: config.SERVER + ":" + config.PORT + config.API_BASE + "/site-drawings",
  },

  floor: {
    findAll: config.SERVER + ":" + config.PORT + config.API_BASE + "/floors/all",
    findById: config.SERVER + ":" + config.PORT + config.API_BASE + "/floors",
    create: config.SERVER + ":" + config.PORT + config.API_BASE + "/floors/",
    update: config.SERVER + ":" + config.PORT + config.API_BASE + "/floors",
    delete: config.SERVER + ":" + config.PORT + config.API_BASE + "/floors/",
    findAllImages: config.SERVER + ":" + config.PORT + config.API_BASE + "/sites",
    uploadImage: config.SERVER + ":" + config.PORT + config.API_BASE + "/sites",
    urlBase: config.SERVER + ":" + config.PORT,
  },

  rack: {
    create: config.SERVER + ":" + config.PORT + config.API_BASE + "/sites/",
    update: config.SERVER + ":" + config.PORT + config.API_BASE + "/sites/",
    findAllHeaders: config.SERVER + ":" + config.PORT + config.API_BASE + "/sites",
    findById: config.SERVER + ":" + config.PORT + config.API_BASE + "/sites",
  },

  layout: {
    findAllById: config.SERVER + ":" + config.PORT + config.API_BASE + "/site-drawings",
    findById: config.SERVER + ":" + config.PORT + config.API_BASE + "/site-drawings",
    create: config.SERVER + ":" + config.PORT + config.API_BASE + "/site-drawings/",
    update: config.SERVER + ":" + config.PORT + config.API_BASE + "/site-drawings/",
    delete: config.SERVER + ":" + config.PORT + config.API_BASE + "/site-drawings/",
  },

  layoutMarkers: {
    findAllById: config.SERVER + ":" + config.PORT + config.API_BASE + "/sites",
    findById: config.SERVER + ":" + config.PORT + config.API_BASE + "/sites",
    create: config.SERVER + ":" + config.PORT + config.API_BASE + "/sites/",
    update: config.SERVER + ":" + config.PORT + config.API_BASE + "/sites/",
    delete: config.SERVER + ":" + config.PORT + config.API_BASE + "/sites/",
    save: config.SERVER + ":" + config.PORT + config.API_BASE + "/sites/",
  },

  categorizer: {
    getUncategorizeProducts: config.SERVER + ":" + config.PORT + config.API_BASE + "/category-product-relation",
    getCategorizeProducts: config.SERVER + ":" + config.PORT + config.API_BASE + "/category-product-relation/",
    uncategorizeProducts: config.SERVER + ":" + config.PORT + config.API_BASE + "/category-product-relation",
    categorizeProducts: config.SERVER + ":" + config.PORT + config.API_BASE + "/category-product-relation/",
  },

  worker: {
    findAllWorkersByOrganization:
      config.SERVER + ":" + config.PORT + config.API_BASE + "/organization-worker-relations/organizations/",
    findAllWorkerByIdentification:
      config.SERVER + ":" + config.PORT + config.API_BASE + "/organization-worker-relations/",
    findAllOrganizationsByWorker:
      config.SERVER + ":" + config.PORT + config.API_BASE + "/organization-worker-relations/workers/",
    findAllCountries: config.SERVER + ":" + config.PORT + config.API_BASE + "/countries-provinces-cities/",
    findWorkerById: config.SERVER + ":" + config.PORT + config.API_BASE + "/organization-worker-relations/workers/",
    addRelationWorkerOrganization:
      config.SERVER + ":" + config.PORT + config.API_BASE + "/organization-worker-relations/organizations/",
    create: config.SERVER + ":" + config.PORT + config.API_BASE + "/organization-worker-relations",
    update: config.SERVER + ":" + config.PORT + config.API_BASE + "/organization-worker-relations",
    delete: config.SERVER + ":" + config.PORT + config.API_BASE + "/organization-worker-relations/workers/",
    findAllWorkerPhotos: config.SERVER + ":" + config.PORT + config.API_WORKERS + "/workers/",
    urlPhotoBase: config.SERVER + ":" + config.PORT,
  },

  shift: {
    findAllRetailers: config.SERVER + ":" + config.PORT + config.API_BASE + "/retailers",
    findAllStoresByRetailer: config.SERVER + ":" + config.PORT + config.API_BASE + "/retailers/",
    findAllShiftsByStore: config.SERVER + ":" + config.PORT + config.API_BASE + "/retailers/stores/",
    findShiftById: config.SERVER + ":" + config.PORT + config.API_BASE + "/retailers/stores/",
    create: config.SERVER + ":" + config.PORT + config.API_BASE + "/retailers/stores/",
    update: config.SERVER + ":" + config.PORT + config.API_BASE + "/retailers/stores/",
    delete: config.SERVER + ":" + config.PORT + config.API_BASE + "/retailers/stores/",
  },

  variables: {
    create: config.SERVER + ":" + config.PORT + config.API_BASE + "/variables",
    update: config.SERVER + ":" + config.PORT + config.API_BASE + "/variables/",
    delete: config.SERVER + ":" + config.PORT + config.API_BASE + "/variables/",
    findAll: config.SERVER + ":" + config.PORT + config.API_BASE + "/variables",
    findById: config.SERVER + ":" + config.PORT + config.API_BASE + "/variables/",
  },

  registation: {
    create: config.SERVER + ":" + config.PORT + config.API_BASE + "/registrations",
  },

  graph: {
    create: config.SERVER + ":" + config.PORT + config.API_BASE + "/sites/",
    update: config.SERVER + ":" + config.PORT + config.API_BASE + "/sites/",
    findAllHeaders: config.SERVER + ":" + config.PORT + config.API_BASE + "/sites",
    findById: config.SERVER + ":" + config.PORT + config.API_BASE + "/sites",
  },

  wms: {
    authenticate: config.SERVER + ":" + config.WMS_API_PORT + config.WMS_API_BASE + "/authentication",
    getLocationStatus: config.SERVER + ":" + config.WMS_API_PORT + config.WMS_API_BASE + "/locationStatus",
    getLocationTypes: config.SERVER + ":" + config.WMS_API_PORT + config.WMS_API_BASE + "/locationTypes",
    getTrademarks: config.SERVER + ":" + config.WMS_API_PORT + config.WMS_API_BASE + "/trademarks",
    getLocations: config.SERVER + ":" + config.WMS_API_PORT + config.WMS_API_BASE + "/locations?",
    getBaseUrlImage: config.SERVER + ":" + config.WMS_API_PORT + config.WMS_IMAGE_URL,
  },

  comexrecap: {
    create: config.SERVER + ":" + config.PORT + config.API_COMEX_BASE + "/importations",
    update: config.SERVER + ":" + config.PORT + config.API_COMEX_BASE + "/importations/",
    delete: config.SERVER + ":" + config.PORT + config.API_COMEX_BASE + "/importations/",
    findAllByUserId: config.SERVER + ":" + config.PORT + config.API_COMEX_BASE + "/importations?userId=",
    findById: config.SERVER + ":" + config.PORT + config.API_COMEX_BASE + "/importations?id=",
    findAllComexCountries: config.SERVER + ":" + config.PORT + config.API_COMEX_BASE + "/countries",
    findAllComexCampaigns: config.SERVER + ":" + config.PORT + config.API_COMEX_BASE + "/campaigns",
    findAllComexPaymentTerms: config.SERVER + ":" + config.PORT + config.API_COMEX_BASE + "/paymentTerms",
    findAllComexImportationTypes: config.SERVER + ":" + config.PORT + config.API_COMEX_BASE + "/importationTypes",
    findAllComexPorts: config.SERVER + ":" + config.PORT + config.API_COMEX_BASE + "/ports",
    findAllComexSuppliers: config.SERVER + ":" + config.PORT + config.API_COMEX_BASE + "/suppliers",
    findAllComexIncoterms: config.SERVER + ":" + config.PORT + config.API_COMEX_BASE + "/incoterms",
    findAllComexCurrencies: config.SERVER + ":" + config.PORT + config.API_COMEX_BASE + "/currencies",
    findAllComexCategories: config.SERVER + ":" + config.PORT + config.API_COMEX_BASE + "/categories",
    findAllComexTransportationMode: config.SERVER + ":" + config.PORT + config.API_COMEX_BASE + "/transportation-mode",
    findAllComexBarcodeTypes: config.SERVER + ":" + config.PORT + config.API_COMEX_BASE + "/barcodes",
    findAllComexMeasureUnits: config.SERVER + ":" + config.PORT + config.API_COMEX_BASE + "/measureUnits",
    findComexRecapItems:
      config.SERVER + ":" + config.PORT + config.API_COMEX_BASE + "/importations-items?importationId=",
    findComexRecapItemById: config.SERVER + ":" + config.PORT + config.API_COMEX_BASE + "/importations-items?itemId=",
    comexRecapAddItem: config.SERVER + ":" + config.PORT + config.API_COMEX_BASE + "/importations-items/",
    comexRecapUpdateItem: config.SERVER + ":" + config.PORT + config.API_COMEX_BASE + "/importations-items/",
    comexRecapDeleteItem: config.SERVER + ":" + config.PORT + config.API_COMEX_BASE + "/importations-items/",
    comexRecapAddItemImage: config.SERVER + ":" + config.PORT + config.API_COMEX_BASE + "/importations-items-images/",
  },

  businessProcess: {
    save: config.SERVER + ":" + config.PORT + config.API_COMEX_BASE + "/business-processes",
    create: config.SERVER + ":" + config.PORT + config.API_COMEX_BASE + "/business-processes",
    update: config.SERVER + ":" + config.PORT + config.API_COMEX_BASE + "/business-processes/",
    delete: config.SERVER + ":" + config.PORT + config.API_COMEX_BASE + "/business-processes/",
    findAll: config.SERVER + ":" + config.PORT + config.API_COMEX_BASE + "/business-processes",
    getById: config.SERVER + ":" + config.PORT + config.API_COMEX_BASE + "/business-processes/",
  },

  sprint: {
    create: config.SERVER + ":" + config.PORT + config.API_BASE + "/sprint/",
    update: config.SERVER + ":" + config.PORT + config.API_BASE + "/sprint/",
    delete: config.SERVER + ":" + config.PORT + config.API_BASE + "/sprint/",
    findAll: config.SERVER + ":" + config.PORT + config.API_BASE + "/sprint",
    findById: config.SERVER + ":" + config.PORT + config.API_BASE + "/sprint/",
  },

  businessProcessModelRelation: {
    save: config.SERVER + ":" + config.PORT + config.API_COMEX_BASE + "/process-model-form-model-relations",
    delete: config.SERVER + ":" + config.PORT + config.API_COMEX_BASE + "/process-model-form-model-relations/",
    findAll: config.SERVER + ":" + config.PORT + config.API_COMEX_BASE + "/process-model-form-model-relations",
    findById: config.SERVER + ":" + config.PORT + config.API_COMEX_BASE + "/process-model-form-model-relations/",
  },

  businessProcessInstanceRelation: {
    findAllById:
      config.SERVER + ":" + config.PORT + config.API_COMEX_BASE + "/process-instance-form-instance-relations/",
  },

  businessProcessModel: {
    save: config.SERVER + ":" + config.PORT + config.API_COMEX_BASE + "/business-process-models",
    create: config.SERVER + ":" + config.PORT + config.API_COMEX_BASE + "/business-process-models",
    update: config.SERVER + ":" + config.PORT + config.API_COMEX_BASE + "/business-process-models/",
    delete: config.SERVER + ":" + config.PORT + config.API_COMEX_BASE + "/business-process-models/",
    findAll: config.SERVER + ":" + config.PORT + config.API_COMEX_BASE + "/business-process-models",
    getById: config.SERVER + ":" + config.PORT + config.API_COMEX_BASE + "/business-process-models/",
    getInstanceById: config.SERVER + ":" + config.PORT + config.API_COMEX_BASE + "/business-process-models/",
  },

  businessProcessModelInbox: {
    findAllbusinessProcessModelByRoleId:
      config.SERVER + ":" + config.PORT + config.API_COMEX_BASE + "/business-process-inbox/",
    findAllTasksByRoleId: config.SERVER + ":" + config.PORT + config.API_COMEX_BASE + "/business-process-inbox/",
    createInstance: config.SERVER + ":" + config.PORT + config.API_COMEX_BASE + "/business-process-inbox",
    getById: config.SERVER + ":" + config.PORT + config.API_COMEX_BASE + "/business-process-inbox/",
    getAllOutgoingTaskByTaskId: config.SERVER + ":" + config.PORT + config.API_COMEX_BASE + "/business-process-inbox/",
    executeTask: config.SERVER + ":" + config.PORT + config.API_COMEX_BASE + "/business-process-inbox",
    releaseTask: config.SERVER + ":" + config.PORT + config.API_COMEX_BASE + "/business-process-inbox",
    takeTask: config.SERVER + ":" + config.PORT + config.API_COMEX_BASE + "/business-process-inbox",
  },

  businessProcessInstance: {
    getById: config.SERVER + ":" + config.PORT + config.API_COMEX_BASE + "/business-process-instance/",
    findAllByStatus: config.SERVER + ":" + config.PORT + config.API_COMEX_BASE + "/business-process-instance/status/",
  },

  businessProcessInstanceLog: {
    getById: config.SERVER + ":" + config.PORT + config.API_COMEX_BASE + "/business-process-instance-log/",
  },

  entityDefinition: {
    findAll: config.SERVER + ":" + config.PORT + config.API_COMEX_BASE + "/form-models",
    findById: config.SERVER + ":" + config.PORT + config.API_COMEX_BASE + "/form-models/",
    create: config.SERVER + ":" + config.PORT + config.API_COMEX_BASE + "/form-models",
    update: config.SERVER + ":" + config.PORT + config.API_COMEX_BASE + "/form-models",
    delete: config.SERVER + ":" + config.PORT + config.API_COMEX_BASE + "/form-models/",
    updateHeader: config.SERVER + ":" + config.PORT + config.API_COMEX_BASE + "/form-models",
  },

  dataSource: {
    findAll: config.SERVER + ":" + config.PORT + config.API_COMEX_BASE + "/form-datasources",
    findById: config.SERVER + ":" + config.PORT + config.API_COMEX_BASE + "/form-datasources/",
    create: config.SERVER + ":" + config.PORT + config.API_COMEX_BASE + "/form-datasources",
    update: config.SERVER + ":" + config.PORT + config.API_COMEX_BASE + "/form-datasources",
    delete: config.SERVER + ":" + config.PORT + config.API_COMEX_BASE + "/form-datasources/",
  },

  formDefinition: {
    findAll: config.SERVER + ":" + config.PORT + config.API_BASE + "/form-definition",
    findById: config.SERVER + ":" + config.PORT + config.API_BASE + "/form-definition",
    create: config.SERVER + ":" + config.PORT + config.API_BASE + "/form-definition/",
    update: config.SERVER + ":" + config.PORT + config.API_BASE + "/form-definition/",
    delete: config.SERVER + ":" + config.PORT + config.API_BASE + "/form-definition/",
  },

  field: {
    findAll: config.SERVER + ":" + config.PORT + config.API_BASE + "/form-definition-field",
    findById: config.SERVER + ":" + config.PORT + config.API_BASE + "/form-definition-field",
    create: config.SERVER + ":" + config.PORT + config.API_BASE + "/form-definition-field/",
    update: config.SERVER + ":" + config.PORT + config.API_BASE + "/form-definition-field/",
    delete: config.SERVER + ":" + config.PORT + config.API_BASE + "/form-definition-field/",
  },

  sections: {
    findAll: config.SERVER + ":" + config.PORT + config.API_BASE + "/form-definition-sections",
    findById: config.SERVER + ":" + config.PORT + config.API_BASE + "/form-definition-sections",
    create: config.SERVER + ":" + config.PORT + config.API_BASE + "/form-definition-sections/",
    update: config.SERVER + ":" + config.PORT + config.API_BASE + "/form-definition-sections/",
    delete: config.SERVER + ":" + config.PORT + config.API_BASE + "/form-definition-sections/",
  },

  formInstance: {
    findById: config.SERVER + ":" + config.PORT + config.API_COMEX_BASE + "/form-instances/",
    create: config.SERVER + ":" + config.PORT + config.API_COMEX_BASE + "/form-instances",
    update: config.SERVER + ":" + config.PORT + config.API_COMEX_BASE + "/form-instances",
    delete: config.SERVER + ":" + config.PORT + config.API_COMEX_BASE + "/form-instances/",
  },
};

export const ERRORS = {
  auth: {
    OK: 1000,
    SIGNIN_ERROR: 1001,
    SIGNUP_ERROR: 1002,
    CHANGE_PASSWORD_ERROR: 1003,
  },
  crud: {
    OK: 2000,
    ERROR: 2001,
  },
};

export const CONTEXTS = {
  organizatrionId: 2,
};

export const actions = {
  created: "CREATED",
  updated: "UPDATED",
  deleted: "DELETED",
  readed: "READED",
  reload: "RELOAD",
};

export const currency = {
  pesos: "PESOS",
};
