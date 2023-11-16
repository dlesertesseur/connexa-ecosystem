import { Stack } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { HEADER_HIGHT } from "../../../../Constants";
import React from "react";
import SimpleTable from "../../../../Components/SimpleTable";
import { useLocation } from "react-router-dom";

const ImportationStatusDetail = () => {
  const { t } = useTranslation();
  const [rows, setRows] = useState(null);
  const [rowSelected, setRowSelected] = useState(null);

  const location = useLocation();
  let status = location.state.status;

  console.log("ImportationStatusDetail -> status", status)
  
  let col = 0;
  const cols = t("businessProcessModelInbox.columns.tasks", { returnObjects: true });
  const columns = [
    { headerName: cols[col++], fieldName: "businesProcessName", align: "left" },
    { headerName: cols[col++], fieldName: "name", align: "left" },
    { headerName: cols[col++], fieldName: "roleName", align: "left" },
    { headerName: cols[col++], fieldName: "userName", align: "left" },
    { headerName: cols[col++], fieldName: "status", align: "left" },
  ];

  return (
    <Stack spacing={"xs"}>
      {/* <BusinessProcessModelInboxToolbar
        rowSelected={rowSelected}
        onCreate={() => {
          setOpenCreateProcessInstance(true);
        }}
      /> */}
      <SimpleTable
        data={rows}
        columns={columns}
        rowSelected={rowSelected}
        setRowSelected={setRowSelected}
        headerHeight={HEADER_HIGHT + 64}
      />
    </Stack>
  );
};

export default ImportationStatusDetail;
