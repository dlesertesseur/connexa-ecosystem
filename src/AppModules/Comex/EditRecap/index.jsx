import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { CreatePage } from "./CreatePage";
import { UpdatePage } from "./UpdatePage";
import { DeletePage } from "./DeletePage";
import { AbmStateContext } from "./Context";
import { findAllComexCampaigns, findAllComexCountries, findAllComexRecaps } from "../../../DataAccess/ComexRecap";
import { COMEX } from "../../../Constants/COMEX";
import { IconFileUpload, IconList } from "@tabler/icons-react";
import ResponceNotification from "../../../Modal/ResponceNotification";
import CrudFrame from "../../../Components/Crud/CrudFrame";
import ProductsList from "./products/ProductsList";
import UploadData from "./products/UploadData";

const DynamicApp = ({ app }) => {
  const { user } = useSelector((state) => state.auth.value);

  const { t } = useTranslation();
  const [rows, setRows] = useState([]);
  const [error, setError] = useState(null);
  const [countries, setCountries] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [reload, setReload] = useState(null);

  const getData = async () => {
    const params = {
      token: user.token,
      type: COMEX.types.RECAP_CREATED,
    };

    try {
      let ret = null;
      const list = await findAllComexRecaps(params);
      ret = list.map((r) => {
        return {
          id: r.id,
          creationDate: r.creationDate,
          description: r.description,
          campaign: r.campaign.event,
          supplier: r.supplier.name,
          country: r.country.country,
        };
      });
      setRows(ret);

      const campaigns = await findAllComexCampaigns(params);
      setCampaigns(campaigns);

      const countries = await findAllComexCountries(params);
      setCountries(countries);
    } catch (error) {
      setError(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    getData();
  }, [user, reload]);

  let col = 0;
  const cols = t("comex.recap.columns", { returnObjects: true });
  const columns = [
    { headerName: cols[col++], fieldName: "id", align: "right" },
    { headerName: cols[col++], fieldName: "creationDate", align: "center" },
    { headerName: cols[col++], fieldName: "description", align: "center" },
    { headerName: cols[col++], fieldName: "campaign", align: "left" },
    { headerName: cols[col++], fieldName: "supplier", align: "left" },
    { headerName: cols[col++], fieldName: "country", align: "left" },
  ];

  const ret = rows ? (
    <AbmStateContext.Provider value={{ reload, setReload, selectedRowId, countries, campaigns, setError }}>
      <CrudFrame
        app={app}
        columns={columns}
        data={rows}
        rowSelected={selectedRowId}
        enableCreateButton={true}
        setRowSelected={(id) => {
          setSelectedRowId(id);
        }}
        createPage={<CreatePage />}
        updatePage={<UpdatePage />}
        deletePage={<DeletePage />}
        relationshipPages={[
          {
            path: "/products",
            icon: <IconList size={20} />,
            key: "comex.recap.label.addProducts",
            element: <ProductsList back={"../"} />,
          },
          {
            path: "/uploadData",
            icon: <IconFileUpload size={20} />,
            key: "comex.recap.label.addDocuments",
            element: <UploadData back={"../"} />,
          },
        ]}
      />

      <ResponceNotification
        opened={error ? true : false}
        onClose={() => {
          setError(null);
        }}
        code={error}
        title={t("status.error")}
        text={error}
      />
    </AbmStateContext.Provider>
  ) : null;

  return ret;
};

export default DynamicApp;
