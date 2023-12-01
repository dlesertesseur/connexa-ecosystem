import React from "react";
import { useState } from "react";
import { useContext } from "react";
import { createContext } from "react";
import { useTranslation } from "react-i18next";

const ImportationContext = createContext();

export const useImportationContext = () => {
  const ctx = useContext(ImportationContext);
  return ctx;
};

const ImportationProvider = ({ children }) => {
  const { t } = useTranslation();
  const [businessObjectiveSelected, setBusinessObjectiveSelected] = useState(t("importations.label.all"));
  const [analystSelected, setAnalystSelected] = useState(t("importations.label.all"));

  return (
    <ImportationContext.Provider
      value={{
        businessObjectiveSelected,
        setBusinessObjectiveSelected,
        analystSelected,
        setAnalystSelected,
      }}
    >
      {children}
    </ImportationContext.Provider>
  );
};

export default ImportationProvider;
