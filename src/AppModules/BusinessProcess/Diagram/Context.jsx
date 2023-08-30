import { createContext } from "react";

const AbmStateContext = createContext(null);
const AbmParametersStateContext = createContext(null);
const AbmConnectionStateContext = createContext(null);
const EditorStateContext = createContext(null);

export {AbmStateContext, EditorStateContext, AbmParametersStateContext, AbmConnectionStateContext}