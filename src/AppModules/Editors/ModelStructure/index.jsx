import React, { useEffect, useState } from "react";
import CrudFrame from "../../../Components/Crud/CrudFrame";
import ResponceNotification from "../../../Modal/ResponceNotification";
import StructureMetaDataBuilder from "../../../Components/Builder3d/StructureMetaDataBuilder";
import RackBasicMetaDataBuilder from "../../../Components/Builder3d/RackBasicMetaDataBuilder";
import StagingMetaDataBuilder from "../../../Components/Builder3d/StagingMetaDataBuilder";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { CreatePage } from "./CreatePage";
import { UpdatePage } from "./UpdatePage";
import { DeletePage } from "./DeletePage";
import { AbmStateContext } from "./Context";
import { FilterControl } from "./FilterControl";
import { findAllRacksHeaders } from "../../../DataAccess/Racks";
import { STRUCTURE_TYPE_RACK, STRUCTURE_TYPE_SHELVING, STRUCTURE_TYPE_RACK_BASIC, STRUCTURE_TYPE_STAGING } from "../../../Constants/structures";

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
  const [structureName, setStructureName] = useState(null);
  const [modelStructure, setModelStructure] = useState(null);

  const initilizeContext = () => {
    setModelStructure(null);
    setStructureName(null);
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
    setStructureName(null);
    setSelectedRowId(null);
    if (site && floor) {
      getData();
    }
  }, [user, reload]);

  const cols = t("crud.modelStructure.columns", { returnObjects: true });
  const columns = [
    { headerName: cols[0], fieldName: "name", align: "left" },
    { headerName: cols[1], fieldName: "description", align: "left" },
  ];

  const refresh = () => {
    setReload(Date.now());
  };

  const onCreate = async (values, type) => {
    let model = null;
    switch (type) {
      case STRUCTURE_TYPE_SHELVING:
        model = StructureMetaDataBuilder.createShelving(values);
        break;

      case STRUCTURE_TYPE_RACK:
        model = StructureMetaDataBuilder.createRack(values);
        break;

      case STRUCTURE_TYPE_RACK_BASIC:
        model = RackBasicMetaDataBuilder.createRack(values);
        break;

      case STRUCTURE_TYPE_STAGING:
        model = StagingMetaDataBuilder.createRack(values);
        break;

      default:
        break;
    }

    setModelStructure(model);
  };

  const ret = (
    <AbmStateContext.Provider
      value={{
        refresh,
        selectedRowId,
        site,
        setSite,
        floor,
        setFloor,
        structureName,
        setStructureName,
        onCreate,
        modelStructure,
        setModelStructure,
        initilizeContext,
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
        createPage={<CreatePage />}
        updatePage={<UpdatePage />}
        deletePage={<DeletePage />}
        filterControl={<FilterControl />}
      />
    </AbmStateContext.Provider>
  );

  return ret;
};

export default DynamicApp;
