import React, { useState } from "react";
import CrudFrame from "../../../Components/Crud/CrudFrame";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { FilterControl } from "./FilterControl";
import { findRetailerById } from "../../../DataAccess/Retailers";

const DynamicApp = ({ app }) => {
  const { user } = useSelector((state) => state.auth.value);
  const [entities, setEntitites] = useState([]);
  const [retailer, setRetailer] = useState(null);
  const [entityId, setEntityId] = useState(null);
  const [showFilterControl, setShowFilterControl] = useState(true);
  const { t } = useTranslation();

  const onLoadGrid = (entity) => {
    const params = {
      token: user.token,
      id: entity,
    };

    findRetailerById(params).then((ret) => {
      if (ret) {
        setEntitites(ret);
      }
    });
  };

  const onFilter = (entity) => {
    onLoadGrid(entity);
  };

  // useEffect(() => {
  //   onLoadGrid();
  // }, [onLoadGrid, user]);

  // useEffect(() => {
  //   const params = {
  //     token: user.token,
  //   };
  //   findAllContext(params).then((ret) => {
  //     setContexts(ret);
  //   });
  // }, [user]);

  const cols = t("crud.retailerStore.columns", { returnObjects: true });
  const columns = [
    { headerName: cols[0], fieldName: "name", align: "left" },
    { headerName: cols[1], fieldName: "address", align: "left" },
    { headerName: cols[2], fieldName: "country", align: "left" },
    { headerName: cols[3], fieldName: "province", align: "left" },
    { headerName: cols[4], fieldName: "city", align: "left" },
    { headerName: cols[5], fieldName: "type", align: "left" },
  ];

  const ret = (
    <CrudFrame
      app={app}
      columns={columns}
      data={entities}
      // rowSelected={entityId}
      // setRowSelected={setEntityId}
      // enableCreateButton={true}
      // createPage={
      //   <CreatePage
      //     user={user}
      //     back={"../"}
      //     onLoadGrid={onLoadGrid}
      //     contexts={contexts}
      //   />
      // }
      // updatePage={
      //   <UpdatePage
      //     user={user}
      //     back={"../"}
      //     entityId={entityId}
      //     onLoadGrid={onLoadGrid}
      //     contexts={contexts}
      //   />
      // }
      // deletePage={
      //   <DeletePage
      //     user={user}
      //     back={"../"}
      //     entityId={entityId}
      //     onLoadGrid={onLoadGrid}
      //     contexts={contexts}
      //   />
      // }
      filterControl={
        <FilterControl
          entity={retailer}
          setEntity={setRetailer}
          onFilter={onFilter}
        />
      }
    />
  );

  return ret;
};

export default DynamicApp;
