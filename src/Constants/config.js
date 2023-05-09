const config = {
    MODE: import.meta.env.MODE,
    SERVER: import.meta.env.VITE_APP_SERVER,
    PORT: import.meta.env.VITE_APP_PORT,
    API_BASE: import.meta.env.VITE_APP_API_BASE,
    API_WORKERS: import.meta.env.VITE_APP_API_WORKERS,
  };

  export { config };