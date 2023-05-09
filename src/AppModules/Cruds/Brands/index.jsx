import React, { useCallback, useEffect, useState } from "react";
import CrudFrame from "../../../Components/Crud/CrudFrame";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { CreatePage } from "./CreatePage";
import { UpdatePage } from "./UpdatePage";
import { DeletePage } from "./DeletePage";
import { findAllBrands } from "../../../DataAccess/Brands";

const DynamicApp = ({ app }) => {
  const { user } = useSelector((state) => state.auth.value);
  const [brands, setBrands] = useState([]);
  const [brandId, setBrandId] = useState(null);
  const { t } = useTranslation();

  const onLoadGrid = useCallback(() => {
    const params = {
      token: user.token,
    };
    findAllBrands(params).then((ret) => {
      if(ret){
        setBrands(ret);
      }
    });
  }, [user]);

  useEffect(() => {
    onLoadGrid();
  }, [onLoadGrid, user]);

  const cols = t("crud.brands.columns", { returnObjects: true });
  const columns = [{ headerName: cols[0], fieldName: "name", align: "left" }];

  const ret = (
    <CrudFrame
      app={app}
      columns={columns}
      data={brands}
      rowSelected={brandId}
      setRowSelected={setBrandId}
      enableCreateButton={true}
      createPage={<CreatePage user={user} back={"../"} onLoadGrid={onLoadGrid} />}
      updatePage={<UpdatePage user={user} back={"../"} brandId={brandId} onLoadGrid={onLoadGrid} />}
      deletePage={<DeletePage user={user} back={"../"} brandId={brandId} onLoadGrid={onLoadGrid} />}
    />
  );

  return ret;
};

export default DynamicApp;
