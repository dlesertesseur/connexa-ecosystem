import React, { useEffect } from "react";
import { Stack, Tabs } from "@mantine/core";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { HEADER_HIGHT } from "../../../Constants";
import { useSelector } from "react-redux";
import { useContext } from "react";
import { AbmStateContext } from "./Context";
import { findAllBusinessProcessInstances } from "../../../DataAccess/BusinessProcessInstance";
import SimpleTable from "../../../Components/SimpleTable";
import Toolbar from "./Toolbar";

const BusinessProcessInstancePanel = ({ name, status }) => {
  const { user } = useSelector((state) => state.auth.value);
  const { t } = useTranslation();
  const { setError, onViewDiagram, onViewDocument, onViewLog} = useContext(AbmStateContext);
  const [rowSelected, setRowSelected] = useState(null);
  const [instances, setInstances] = useState(null);

  let col = 0;
  const cols = t("businessProcessInstances.columns.values", { returnObjects: true });
  const columns = [
    { headerName: cols[col++], fieldName: "name", align: "left" },
    { headerName: cols[col++], fieldName: "description", align: "left" },
    { headerName: cols[col++], fieldName: "advance", align: "right", format: "percentage", width: 160 },
  ];

  const getData = async () => {
    let params = {
      token: user.token,
      status: status,
    };

    try {
      const instances = await findAllBusinessProcessInstances(params);
      setInstances(instances);
    } catch (error) {
      setError(error);
    }
  };

  useEffect(() => {
    if (status) {
      getData();
    }
  }, [status]);


  return (
    <Tabs.Panel value={name} pt="xs">
      <Stack spacing={"xs"}>
        <Toolbar
          rowSelected={rowSelected}
          onViewDiagram={() => {onViewDiagram(rowSelected)}}
          onViewDocument={() => {onViewDocument(rowSelected)}}
          onViewLog={() => {onViewLog(rowSelected)}}
        />
        <SimpleTable
          data={instances}
          columns={columns}
          rowSelected={rowSelected}
          setRowSelected={setRowSelected}
          headerHeight={HEADER_HIGHT + 64}
        />
      </Stack>
    </Tabs.Panel>
  );
};

export default BusinessProcessInstancePanel;
