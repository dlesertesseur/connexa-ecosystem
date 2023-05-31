import React, { useEffect, useState } from "react";
import CrudFrame from "../../../Components/Crud/CrudFrame";
import ResponceNotification from "../../../Modal/ResponceNotification";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { CreatePage } from "./CreatePage";
import { UpdatePage } from "./UpdatePage";
import { DeletePage } from "./DeletePage";
import { AbmStateContext } from "./Context";
import { FilterControl } from "./FilterControl";
import { findAllRacksHeaders } from "../../../DataAccess/Racks";
import { EditorPanel } from "./EditorPanel";

const DynamicApp = ({ app }) => {
  const { user } = useSelector((state) => state.auth.value);
  const { t } = useTranslation();
  const [rows, setRows] = useState([]);
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [reload, setReload] = useState(null);
  const [loading, setLoading] = useState(false);
  const [site, setSite] = useState(null);
  const [floor, setFloor] = useState(null);
  const [enableCreateButton, setEnableCreateButton] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const getData = async () => {
    const params = {
      token: user.token,
      siteId: site,
      floorId: floor,
    };

    setLoading(true);
    try {
      const racks = await findAllRacksHeaders(params);
      setRows(racks);
      setEnableCreateButton(true);
      setErrorMessage(null);
    } catch (error) {
      setErrorMessage(error.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    if(site && floor){
      getData();
    }
  }, [user, reload]);

  const cols = t("crud.modelStructure.columns", { returnObjects: true });
  const columns = [
    { headerName: cols[0], fieldName: "name", align: "left" },
    { headerName: cols[1], fieldName: "description", align: "left" },
    // { headerName: cols[1], fieldName: "dimensionx", align: "right", format: "round" },
    // { headerName: cols[2], fieldName: "dimensiony", align: "right", format: "round" },
    // { headerName: cols[3], fieldName: "dimensionz", align: "right", format: "round" },
    // { headerName: cols[4], fieldName: "positionx", align: "right", format: "round" },
    // { headerName: cols[5], fieldName: "positiony", align: "right", format: "round" },
    // { headerName: cols[6], fieldName: "positionz", align: "right", format: "round" },
    // { headerName: cols[7], fieldName: "rotationy", align: "right", format: "round" },
    // { headerName: cols[8], fieldName: "visible", format: "bool" },
  ];

  const refresh = () => {setReload(Date.now())}
  const ret = (
    <AbmStateContext.Provider value={{ refresh, selectedRowId, site, setSite, floor, setFloor }}>
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
        createPage={<CreatePage />}
        updatePage={<UpdatePage />}
        deletePage={<DeletePage />}
        relationshipPages={[
          {
            path: "/editor",
            key: "crud.modelStructure.label.editor",
            element: <EditorPanel />,
          },
        ]}
        filterControl={
          <FilterControl />
        }
      />
    </AbmStateContext.Provider>
  );

  return ret;
};

export default DynamicApp;
