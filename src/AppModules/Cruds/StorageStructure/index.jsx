import React, { useCallback, useState } from "react";
import CrudFrame from "../../../Components/Crud/CrudFrame";
import DummyPage from "../../../Components/DummyPage";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { FilterControl } from "./FilterControl";
import { CreateRackPage } from "./CreateRackPage";
import { findAllRacksHeaders } from "../../../DataAccess/Racks";
import { UpdateRackPage } from "./UpdateRackPage";

const DynamicApp = ({ app }) => {
  const { user } = useSelector((state) => state.auth.value);
  const [loadingData, setLoadingData] = useState(false);
  const [racks, setRacks] = useState([]);
  const [site, setSite] = useState(null);
  const [floor, setFloor] = useState(null);
  const [enableCreateButton, setEnableCreateButton] = useState(false);
  const [rackId, setRackId] = useState(null);
  const { t } = useTranslation();

  const loadGrid = useCallback(() => {
    const params = {
      token: user.token,
      siteId: site,
      floorId: floor,
    };

    setLoadingData(true);
    findAllRacksHeaders(params).then((ret) => {
      setLoadingData(false);
      setRacks(ret);
      setEnableCreateButton(true);

      console.log("####### LOADING STORAGE STRUCTURES #######");
    });
  },[floor, site, user]);

  const onFilter = () => {
    loadGrid();
  };

  const cols = t("crud.storageStructure.columns", { returnObjects: true });
  const columns = [
    { headerName: cols[0], fieldName: "name", align: "left" },
    { headerName: cols[1], fieldName: "dimensionx", align: "right", format: "round" },
    { headerName: cols[2], fieldName: "dimensiony", align: "right", format: "round" },
    { headerName: cols[3], fieldName: "dimensionz", align: "right", format: "round" },
    { headerName: cols[4], fieldName: "positionx", align: "right", format: "round" },
    { headerName: cols[5], fieldName: "positiony", align: "right", format: "round" },
    { headerName: cols[6], fieldName: "positionz", align: "right", format: "round" },
    { headerName: cols[7], fieldName: "rotationy", align: "right", format: "round" },
    { headerName: cols[8], fieldName: "visible", format: "bool" },
  ];

  const ret = (
    <CrudFrame
      app={app}
      columns={columns}
      data={racks}
      enableCreateButton={enableCreateButton}
      loading={loadingData}
      rowSelected={rackId}
      setRowSelected={setRackId}
      createPage={<CreateRackPage user={user} siteId={site} floorId={floor} back={"../"} onFilter={onFilter}/>}
      updatePage={<UpdateRackPage user={user} siteId={site} floorId={floor} rackId={rackId} back={"../"} onFilter={onFilter}/>}
      deletePage={<DummyPage title={"DELETE SITE"} description={"ABM DE SITIOS"} back={"../"} />}
      filterControl={
        <FilterControl site={site} setSite={setSite} floor={floor} setFloor={setFloor} onFilter={onFilter}  />
      }
    />
  );

  return ret;
};

export default DynamicApp;
