import { Stack } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { HEADER_HIGHT } from "../../../../Constants";
import { useLocation, useNavigate } from "react-router-dom";
import React from "react";
import SimpleTable from "../../../../Components/SimpleTable";
import ImportationStatusDetailToolbar from "./ImportationStatusDetailToolbar";
import { useSelector } from "react-redux";
import { findImportationsByStatus } from "../../../../DataAccess/Custom/DGN/Importations";
import { useEffect } from "react";

const ImportationStatusDetail = ({ setError }) => {
  const { t } = useTranslation();
  const { user } = useSelector((state) => state.auth.value);
  const [rows, setRows] = useState(null);
  const [loading, setLoading] = useState(false);
  const [rowSelected, setRowSelected] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  let status = location.state.status;

  let col = 0;
  const cols = t("importations.columns", { returnObjects: true });
  const columns = [
    { headerName: cols[col++], fieldName: "referencia", align: "left", width: "200px" },
    { headerName: cols[col++], fieldName: "shpProducto", align: "left",width: "200px"},
    { headerName: cols[col++], fieldName: "shpAnalista", align: "left",width: "200px" },
    { headerName: cols[col++], fieldName: "shpEvento", align: "left",width: "200px" },
    { headerName: cols[col++], fieldName: "shpPaisOrigen", align: "left",width: "200px" },
    { headerName: cols[col++], fieldName: "docValor", align: "right",width: "200px" },
    { headerName: cols[col++], fieldName: "docMoneda", align: "left" ,width: "200px"},
    { headerName: cols[col++], fieldName: "docIncoterm", align: "left",width: "200px" },
    { headerName: cols[col++], fieldName: "docFob", align: "right",width: "200px" },
    { headerName: cols[col++], fieldName: "shpProveedor", align: "left",width: "200px" },
    { headerName: cols[col++], fieldName: "docFecha", align: "center", format: "date",width: "200px" },
    { headerName: cols[col++], fieldName: "shpNecesidadEnCd", align: "center",width: "200px" },
  ];

  const getData = async () => {
    const params = {
      token: user.token,
      status: status,
    };

    try {
      setLoading(true);
      const list = await findImportationsByStatus(params);
      setLoading(false);

      if (list.message) {
        setError(list.message);
      } else {
        setRows(list);
      }
    } catch (error) {
      setError(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (status) {
      getData();
    }
  }, [status]);

  return (
    <Stack spacing={"xs"}>
      <ImportationStatusDetailToolbar
        title={status}
        back={() => {
          navigate("../");
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
    </Stack>
  );
};

export default ImportationStatusDetail;
