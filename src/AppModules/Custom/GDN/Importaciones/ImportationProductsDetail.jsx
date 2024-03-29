import { Stack } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { HEADER_HIGHT } from "../../../../Constants";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { findImportationsItemsByReference } from "../../../../DataAccess/Custom/DGN/Importations";
import { useEffect } from "react";
import React from "react";
import SimpleTable from "../../../../Components/SimpleTable";
import ImportationProductsDetailToolbar from "./ImportationProductsDetailToolbar";
import ImportationProductDetailDialog from "./ImportationProductDetailDialog";

const ImportationProductsDetail = ({ setError }) => {
  const { t } = useTranslation();
  const { user } = useSelector((state) => state.auth.value);
  const [rows, setRows] = useState(null);
  const [loading, setLoading] = useState(false);
  const [rowSelected, setRowSelected] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const { reference, product, status } = location.state;

  let col = 0;
  const cols = t("importations.items.columns", { returnObjects: true });
  const columns = [
    { headerName: cols[col++], fieldName: "image", type: "image", align: "center", width: "48" },
    { headerName: cols[col++], fieldName: "codigo", align: "right", width: "200px" },
    { headerName: cols[col++], fieldName: "descripcion", align: "left", width: "200px" },
    { headerName: cols[col++], fieldName: "upc", align: "left", width: "200px" },
    { headerName: cols[col++], fieldName: "fob", align: "right", width: "200px" },
    { headerName: cols[col++], fieldName: "unidad", align: "left", width: "200px" },
    { headerName: cols[col++], fieldName: "cantidad", align: "right", width: "200px" },
    { headerName: cols[col++], fieldName: "valor", align: "right", width: "200px" },
    { headerName: cols[col++], fieldName: "timestamp", align: "center", format: "date" },
  ];

  const getData = async () => {
    const params = {
      token: user.token,
      reference: reference,
      status: status,
    };

    try {
      setLoading(true);
      const list = await findImportationsItemsByReference(params);
      setLoading(false);

      if (list.message) {
        setError(list.message);
      } else {
        const rows = list.map((p) => {
          const ret = { ...p };
          ret.image = `/resources/gdnar_images/${p.upc}.jpg`;
          return ret;
        });
        setRows(rows);
      }
    } catch (error) {
      setError(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (reference) {
      getData();
    }
  }, [reference]);

  useEffect(() => {
    if (rowSelected) {
      const product = rows.find((r) => r.id === rowSelected);
      if (product) {
        setSelectedProduct(product);
      }
    }
  }, [rowSelected]);

  return (
    <>
      <Stack spacing={"xs"}>
        <ImportationProductsDetailToolbar
          title={`${status} / ${reference}`}
          back={() => {
            navigate(-1);
          }}
        />
        <SimpleTable
          data={rows}
          columns={columns}
          rowSelected={rowSelected}
          setRowSelected={setRowSelected}
          headerHeight={HEADER_HIGHT}
          loading={loading}
        />

        <ImportationProductDetailDialog
          title={rowSelected}
          open={selectedProduct}
          setOpen={() => {
            setSelectedProduct(null);
          }}
          product={selectedProduct}
        />
      </Stack>
    </>
  );
};

export default ImportationProductsDetail;
