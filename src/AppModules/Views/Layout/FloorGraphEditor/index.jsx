import React, { useEffect, useState } from "react";
import CrudFrame from "../../../../Components/Crud/CrudFrame";
import ResponceNotification from "../../../../Modal/ResponceNotification";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { GraphPage } from "./GraphPage";
import { DeletePage } from "./DeletePage";
import { AbmStateContext } from "./Context";
import { Filter } from "./Filter";
import { findAllGraphsHeaders } from "../../../../DataAccess/Graph";

const DynamicApp = ({ app }) => {
  const { user } = useSelector((state) => state.auth.value);
  const { t } = useTranslation();
  const [rows, setRows] = useState([]);
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [reload, setReload] = useState(null);
  const [loading, setLoading] = useState(false);
  const [site, setSite] = useState(null);
  const [floor, setFloor] = useState(null);
  const [disabledActionButtons, setDisabledActionButtons] = useState(false);

  const [enableCreateButton, setEnableCreateButton] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const initilizeContext = () => {
    console.log("initilizeContext -> ");
  };

  const getData = async () => {
    const params = {
      token: user.token,
      siteId: site,
      floorId: floor,
    };
    initilizeContext();
    setLoading(true);
    try {
      const graphs = await findAllGraphsHeaders(params);

      setRows(graphs);
      setEnableCreateButton(true);
      setErrorMessage(null);
    } catch (error) {
      setErrorMessage(error.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (site && floor) {
      getData();
    }
  }, [user, reload]);

  const cols = t("crud.floorGrapthEditor.columns", { returnObjects: true });
  const columns = [
    { headerName: cols[0], fieldName: "description", align: "left" },
  ];

  const refresh = () => {
    setReload(Date.now());
  };

  const onCreate = async (values, type) => {};

  const ret = (
    <AbmStateContext.Provider
      value={{
        refresh,
        selectedRowId,
        site,
        setSite,
        floor,
        setFloor,
        onCreate,
        initilizeContext,
        disabledActionButtons,
        setDisabledActionButtons,
        setErrorMessage
      }}
    >
      <ResponceNotification
        opened={errorMessage ? true : false}
        onClose={() => {
          setErrorMessage(null);
        }}
        code={errorMessage}
        title={t("status.error")}
        text={errorMessage}
      />

      <CrudFrame
        app={app}
        columns={columns}
        data={rows}
        rowSelected={selectedRowId}
        setRowSelected={setSelectedRowId}
        loading={loading}
        enableCreateButton={enableCreateButton}
        createPage={<GraphPage action={"new"}/>}
        updatePage={<GraphPage action={"update"}/>}
        deletePage={<DeletePage />}
        filterControl={<Filter />}
      />
      
    </AbmStateContext.Provider>
  );

  return ret;
};

export default DynamicApp;
