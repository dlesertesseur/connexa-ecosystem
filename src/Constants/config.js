const mode = import.meta.env.MODE;

const config = {
    MODE: mode,
    SERVER: mode === 'production' ? import.meta.env.VITE_APP_SERVER_PROD : import.meta.env.VITE_APP_SERVER_DEV,
    PORT: mode === 'production' ? import.meta.env.VITE_APP_PORT_PROD : import.meta.env.VITE_APP_PORT_DEV,
    API_BASE: mode === 'production' ? import.meta.env.VITE_APP_API_BASE_PROD : import.meta.env.VITE_APP_API_BASE_DEV,
    API_WORKERS: import.meta.env.VITE_APP_API_WORKERS,
    PUBLIC_URL: mode === 'production' ? import.meta.env.VITE_PUBLIC_URL_PROD : import.meta.env.VITE_PUBLIC_URL_DEV,
  };

  export { config };