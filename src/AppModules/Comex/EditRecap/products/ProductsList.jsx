import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Stack } from "@mantine/core";
import { Route, Routes, useNavigate } from "react-router-dom";
import { CRUD_PAGE_MODE, HEADER_HIGHT } from "../../../../Constants";
import { useContext } from "react";
import { AbmStateContext } from "../Context";
import { findComexRecapById, findComexRecapItems } from "../../../../DataAccess/ComexRecap";
import { ProductPage } from "./ProductPage";
import { config } from "../../../../Constants/config";
import RecapHeader from "../RecapHeader";
import SortedTable from "../../../../Components/Crud/SortedTable";

const RACAP_HEADER = 48;

const ProductsList = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [rows, setRows] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [recap, setRecap] = useState(null);
  const [item, setItem] = useState(null);

  const { selectedRowId, reloadItems, selectedItem, setSelectedItem } = useContext(AbmStateContext);

  const getData = async () => {
    const params = {
      apikey: config.COMEX_API_KEY,
      id: selectedRowId,
    };
    const recaps = await findComexRecapById(params);
    if (recaps) {
      setRecap(recaps[0]);
    }
  };

  const getRows = async () => {
    const params = {
      apikey: config.COMEX_API_KEY,
      id: selectedRowId,
    };

    const rows = await findComexRecapItems(params);
    if (rows) {
      setRows(rows);
    }
  };

  useEffect(() => {
    getData();
  }, [selectedRowId]);

  useEffect(() => {
    getRows();
  }, [reloadItems]);

  let col = 0;
  const cols = t("comex.recap.products.columns", { returnObjects: true });
  const columns = [
    { headerName: cols[col++], fieldName: "barcode", align: "right" },
    { headerName: cols[col++], fieldName: "description", align: "left" },
    { headerName: cols[col++], fieldName: "price", align: "right" },
    { headerName: cols[col++], fieldName: "pricePerUnit", align: "right" },
    { headerName: cols[col++], fieldName: "quantity", align: "right" },
    { headerName: cols[col++], fieldName: "boxes", align: "right" },
  ];

  const onSelectItem = (env) => {
    const item = rows.find(r => r.id === env);
    setItem(item);
    setSelectedItem(env);
  }

  return (
    <Stack spacing={"xs"}>
      <Stack
        justify="flex-start"
        sx={(theme) => ({
          backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.colors.gray[0],
        })}
      >
        <RecapHeader recap={recap} h={RACAP_HEADER} />

        <Routes>
          <Route
            path="/"
            element={
              <SortedTable
                data={rows}
                columns={columns}
                loading={loading}
                enableCreateButton={true}
                rowSelected={selectedItem}
                setRowSelected={onSelectItem}
                headerHeight={HEADER_HIGHT + RACAP_HEADER + 32}
                backButton={() => {
                  navigate("../");
                }}
              />
            }
          ></Route>
          <Route path="create" element={<ProductPage mode={CRUD_PAGE_MODE.new} recap={recap}/>} />
          <Route path="update" element={<ProductPage mode={CRUD_PAGE_MODE.update} recap={recap} rowItem={item}/>} />
          <Route path="delete" element={<ProductPage mode={CRUD_PAGE_MODE.delete} recap={recap} rowItem={item}/>} />
        </Routes>
      </Stack>
    </Stack>
  );
};

export default ProductsList;
