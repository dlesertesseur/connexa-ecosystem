const mode = import.meta.env.MODE;
const config = {
  MODE: mode,
  SERVER: mode === "production" ? import.meta.env.VITE_APP_SERVER_PROD : import.meta.env.VITE_APP_SERVER_DEV,
  PORT: mode === "production" ? import.meta.env.VITE_APP_PORT_PROD : import.meta.env.VITE_APP_PORT_DEV,
  API_BASE: mode === "production" ? import.meta.env.VITE_APP_API_BASE_PROD : import.meta.env.VITE_APP_API_BASE_DEV,
  API_COMEX_BASE: mode === "production" ? import.meta.env.VITE_APP_COMEX_API_BASE_PROD : import.meta.env.VITE_APP_COMEX_API_BASE_DEV,
  API_WORKERS: import.meta.env.VITE_APP_API_WORKERS,
  WMS_API_BASE: import.meta.env.VITE_APP_API_WMS,
  WMS_IMAGE_URL: import.meta.env.VITE_APP_API_WMS_IMAGE_URL,
  WMS_API_PORT: mode === "production" ? import.meta.env.VITE_APP_API_WMS_PORT_PROD : import.meta.env.VITE_APP_API_WMS_PORT_DEV,
  PORT: mode === "production" ? import.meta.env.VITE_APP_PORT_PROD : import.meta.env.VITE_APP_PORT_DEV,
  PUBLIC_URL: mode === "production" ? import.meta.env.VITE_PUBLIC_URL_PROD : import.meta.env.VITE_PUBLIC_URL_DEV,
  PIXEL_METER_RELATION: 1,
  ARR_COLORS: [
    "#ffffff",
    "#000000",
    "#868e96",
    "#fa5252",
    "#e64980",
    "#be4bdb",
    "#7950f2",
    "#4c6ef5",
    "#228be6",
    "#15aabf",
    "#12b886",
    "#40c057",
    "#82c91e",
    "#fab005",
    "#fd7e14",
  ],
  PALLET_VERTICAL_SEPARATION : 0.25,
  FRAMES_LAYER : 1,
  BASE_URL:import.meta.env.BASE_URL,
  COMEX_API_KEY: import.meta.env.VITE_APP_COMEX_API_KEY
};

export { config };
