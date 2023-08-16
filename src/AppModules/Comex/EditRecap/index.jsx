import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { CreatePage } from "./CreatePage";
import { UpdatePage } from "./UpdatePage";
import { DeletePage } from "./DeletePage";
import { AbmStateContext } from "./Context";
import {
  findAllComexPaymentTerms,
  findAllComexCampaigns,
  findAllComexCountries,
  findAllComexFactories,
  findAllComexImportationTypes,
  findAllComexRecapsByUserId,
  findAllComexIncoterms,
  findAllComexCurrencies,
  findAllComexStatus,
  findAllComexCategoriesRoot,
  findAllComexCategories,
  findAllComexTransportType,
} from "../../../DataAccess/ComexRecap";
import { IconFileUpload, IconList } from "@tabler/icons-react";
import { convertMilisegToYYYYMMDDHHMISS } from "../../../Util";
import ResponceNotification from "../../../Modal/ResponceNotification";
import CrudFrame from "../../../Components/Crud/CrudFrame";
import ProductsList from "./products/ProductsList";
import UploadData from "./products/UploadData";
import { config } from "../../../Constants/config";

const DynamicApp = ({ app }) => {
  const { user } = useSelector((state) => state.auth.value);

  const { t } = useTranslation();
  const [rows, setRows] = useState([]);
  const [error, setError] = useState(null);
  const [countries, setCountries] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [importationTypes, setImportationTypes] = useState([]);
  const [categoryRoot, setCategoryRoot] = useState(null);
  const [incoterms, setIncoterms] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [transportationType, setTransportationType] = useState([]);
  const [status, setStatus] = useState([]);

  const [factories, setFactories] = useState([]);
  const [paymentTerms, setPaymentTerms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [reload, setReload] = useState(null);
  const [reloadItems, setReloadItems] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  const getData = async () => {
    const params = {
      token: user.token,
      apikey: config.COMEX_API_KEY,
      userId: user.id,
    };

    try {
      let ret = null;
      const list = await findAllComexRecapsByUserId(params);

      ret = list.map((r) => {
        return {
          id: r.id,
          code: r.code,
          description: r.description,
          status: r.status,
          totalManufacturingTimeInDays: r.totalManufacturingTimeInDays,
          lastModification: convertMilisegToYYYYMMDDHHMISS(r.timestamp),
        };
      });
      setRows(ret);

      const campaigns = await findAllComexCampaigns(params);
      setCampaigns(campaigns);

      const countries = await findAllComexCountries(params);
      setCountries(countries);

      const importationTypes = await findAllComexImportationTypes(params);
      setImportationTypes(importationTypes);

      const factories = await findAllComexFactories(params);
      setFactories(factories);

      const paymentTerms = await findAllComexPaymentTerms(params);
      setPaymentTerms(paymentTerms);

      const categoryRoot = await findAllComexCategoriesRoot(params);
      setCategoryRoot(categoryRoot);

      const departments = await findAllComexCategories({ ...params, categoryId: categoryRoot.id });
      setDepartments(departments);

      const incoterms = await findAllComexIncoterms(params);
      setIncoterms(incoterms);

      const currencies = await findAllComexCurrencies(params);
      setCurrencies(currencies);

      const status = await findAllComexStatus(params);
      setStatus(status);

      const transportType = await findAllComexTransportType(params);
      setTransportationType(transportType);
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
    { headerName: cols[col++], fieldName: "code", align: "left" },
    { headerName: cols[col++], fieldName: "description", align: "left" },
    { headerName: cols[col++], fieldName: "lastModification", align: "center" },
    { headerName: cols[col++], fieldName: "totalManufacturingTimeInDays", align: "right" },
    { headerName: cols[col++], fieldName: "status", align: "left" },
  ];

  const ret = rows ? (
    <AbmStateContext.Provider
      value={{
        reload,
        setReload,
        selectedRowId,
        countries,
        campaigns,
        departments,
        importationTypes,
        factories,
        incoterms,
        currencies,
        status,
        transportationType,
        paymentTerms,
        setError,
        reloadItems,
        setReloadItems,
        selectedItem,
        setSelectedItem,
      }}
    >
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
            path: "products",
            icon: <IconList size={20} />,
            key: "comex.recap.label.addProducts",
            element: <ProductsList back={"../"} />,
          },
          {
            path: "uploadData",
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
