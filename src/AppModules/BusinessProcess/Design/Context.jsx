import { createContext } from "react";

const AbmStateContext = createContext(null);
const AbmParametersStateContext = createContext(null);
const AbmConnectionStateContext = createContext(null);
const DesignerStateContext = createContext(null);

export {AbmStateContext, DesignerStateContext, AbmParametersStateContext, AbmConnectionStateContext}