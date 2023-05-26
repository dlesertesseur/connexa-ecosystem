import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { AbmStateContext } from "./Context";
import { findAllOrganizations } from "../../../DataAccess/Organization";
import WizardFrame from "../../../Components/Crud/WizardFrame";

import RegistrationPage from "./RegistrationPage";

const DynamicApp = ({ app }) => {
  const { t } = useTranslation();
  const { user } = useSelector((state) => state.auth.value);
  const [rows, setRows] = useState([]);
  const [wizardData, setWizardData] = useState(null);
  const [reload, setReload] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedRowId, setSelectedRowId] = useState(true);

  const stepHeader = 374;

  const getAllOrganizations = async () => {
    const parameters = {
      token: user.token,
    };

    setLoading(true);
    const organizations = await findAllOrganizations(parameters);
    setRows(organizations);
    setLoading(false);
  };

  useEffect(() => {
    getAllOrganizations();
  }, [user, reload]);

  // useEffect(() => {
  //   console.log("######## wizardData ########", wizardData);
  // }, [wizardData]);

  const registrate = () => {
    console.log("registrate data ->", wizardData);
  }

  const cols = t("wizard.registration.columns", { returnObjects: true });
  const columns = [
    { headerName: cols[0], fieldName: "name", align: "left", width: 200 },
    { headerName: cols[1], fieldName: "description", align: "left" },
  ];

  const ret = rows ? (
    <AbmStateContext.Provider
      value={{ reload, setReload, wizardData, setWizardData, registrate, stepHeader }}
    >
      <WizardFrame
        app={app}
        columns={columns}
        data={rows}
        rowSelected={selectedRowId}
        setRowSelected={setSelectedRowId}
        loading={loading}
        enableCreateButton={true}
        createPage={<RegistrationPage />}
      />
    </AbmStateContext.Provider>
  ) : null;

  return ret;
};

export default DynamicApp;
