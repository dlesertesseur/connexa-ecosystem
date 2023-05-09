import React, { useCallback, useEffect, useState } from "react";
import CrudFrame from "../../../Components/Crud/CrudFrame";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { FilterControl } from "./FilterControl";
import { findAllFloorsBySiteId } from "../../../DataAccess/Floors";
import { CreateFloorPage } from "./CreateFloorPage";
import { UpdateFloorPage } from "./UpdateFloorPage";
import { DeleteFloorPage } from "./DeleteFloorPage";
import { CONTEXTS } from "../../../Constants";
import { ImagesByFloorPage } from "./ImagesByFloorPage";

const DynamicApp = ({ app }) => {
  const { user, siteSelected } = useSelector((state) => state.auth.value);
  const [loadingData, setLoadingData] = useState(false);
  const [site, setSite] = useState(null);
  const [floors, setFloors] = useState([]);
  const [enableCreateButton, setEnableCreateButton] = useState(false);
  const [floorId, setFloorId] = useState(null);
  const [showFilterControl, setShowFilterControl] = useState(false);

  const { t } = useTranslation();

  useEffect(() => {
    if (siteSelected.context.id !== CONTEXTS.organizatrionId) {
      setSite(siteSelected.id);
    } else {
      setShowFilterControl(true);
    }
  }, [siteSelected]);

  const loadGrid = useCallback(() => {
    const params = {
      token: user.token,
      siteId: site,
    };

    setLoadingData(true);
    findAllFloorsBySiteId(params).then((ret) => {
      setLoadingData(false);
      setFloors(ret);
      setEnableCreateButton(true);

      console.log("####### LOADING FLOORS #######");
    });
  }, [site, user]);

  const onFilter = () => {
    loadGrid();
  };

  const cols = t("crud.floor.columns", { returnObjects: true });
  const columns = [
    { headerName: cols[0], fieldName: "name", align: "left" },
    { headerName: cols[1], fieldName: "description", align: "left" },
  ];

  const ret = (
    <CrudFrame
      app={app}
      columns={columns}
      data={floors}
      enableCreateButton={enableCreateButton}
      loading={loadingData}
      rowSelected={floorId}
      setRowSelected={setFloorId}
      createPage={<CreateFloorPage user={user} siteId={site} back={"../"} onFilter={onFilter} />}
      updatePage={<UpdateFloorPage user={user} siteId={site} floorId={floorId} back={"../"} onFilter={onFilter} />}
      deletePage={<DeleteFloorPage user={user} siteId={site} floorId={floorId} back={"../"} onFilter={onFilter} />}
      filterControl={showFilterControl ? <FilterControl site={site} setSite={setSite} onFilter={onFilter} /> : null}
      relationshipPages={[
        {
          path: "/images",
          key: "label.crud.images",
          element: <ImagesByFloorPage user={user} siteId={site} floorId={floorId} back={"../"} onFilter={onFilter} />,
        },
      ]}
    />
  );

  return ret;
};

export default DynamicApp;
