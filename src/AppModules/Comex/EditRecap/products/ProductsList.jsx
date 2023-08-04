import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { Button, Center, Group, Stack, Text } from "@mantine/core";
import { Route, Routes, useNavigate, useRoutes } from "react-router-dom";
import { HEADER_HIGHT } from "../../../../Constants";
import { useContext } from "react";
import { AbmStateContext } from "../Context";
import { findComexRecapById } from "../../../../DataAccess/ComexRecap";
import RecapHeader from "../RecapHeader";
import SortedTable from "../../../../Components/Crud/SortedTable";
import DummyPage from "./DummyPage";

const RACAP_HEADER = 120;

const ProductsList = () => {
  const { user } = useSelector((state) => state.auth.value);

  const { t } = useTranslation();
  const [rows, setRows] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [recap, setRecap] = useState(null);

  const { selectedRowId } = useContext(AbmStateContext);
  const navigate = useNavigate();

  const getData = async () => {
    const params = {
      token: user.token,
      id: selectedRowId,
    };
    const ret = await findComexRecapById(params);
    setRecap(ret);
  };

  useEffect(() => {
    getData();
  }, [selectedRowId]);

  let col = 0;
  const cols = t("comex.recap.products.columns", { returnObjects: true });
  const columns = [
    { headerName: cols[col++], fieldName: "sku", align: "right" },
    { headerName: cols[col++], fieldName: "description", align: "left" },
    { headerName: cols[col++], fieldName: "department", align: "center" },
    { headerName: cols[col++], fieldName: "factory", align: "left" },
    { headerName: cols[col++], fieldName: "vendorHost", align: "left" },
    { headerName: cols[col++], fieldName: "shippingPort", align: "left" },
    { headerName: cols[col++], fieldName: "manufacturingTime", align: "left" },
  ];

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
                rowSelected={selectedRow}
                setRowSelected={setSelectedRow}
                headerHeight={HEADER_HIGHT + RACAP_HEADER + 64}
              />
            }
          ></Route>
          <Route path="/create" element={<DummyPage title={"NEW PRODUCT"} />} />
          <Route path="update" element={<DummyPage title={"UPDATE PRODUCT"} />} />
          <Route path="delete" element={<DummyPage title={"DELETE PRODUCT"} />} />
        </Routes>
      </Stack>

      <Group spacing={"xs"} position="right">
        <Button
          onClick={() => {
            navigate("../");
          }}
        >
          <Text>{t("button.back")}</Text>
        </Button>
      </Group>
    </Stack>
  );
};

export default ProductsList;
