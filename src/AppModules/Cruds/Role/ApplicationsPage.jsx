import ResponceNotification from "../../../Modal/ResponceNotification";
import CheckTable from "../../../Components/Crud/CheckTable";
import { Title, LoadingOverlay, Button, Stack, Group } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { assignApp, findRoleById, unassignApp } from "../../../DataAccess/Roles";
import { findAllApplications, findAllApplicationsByRoleId } from "../../../DataAccess/Applications";
import { useContext } from "react";
import { AbmStateContext } from "./Context";

export function ApplicationsPage() {
  const { t } = useTranslation();
  const { user } = useSelector((state) => state.auth.value);
  const { setReload, selectedRowId } = useContext(AbmStateContext);
  const [errorMessage, setErrorMessage] = useState(null);
  const [rowSelected, setRowSelected] = useState(null);
  const [role, setRole] = useState(null);

  const navigate = useNavigate();

  const cols = t("crud.application.columns", { returnObjects: true });
  const columns = [
    { headerName: cols[1], fieldName: "name", align: "left" },
    { headerName: cols[2], fieldName: "description", align: "left" },
  ];

  const [processData, setProcessData] = useState(null);
  const [applications, setApplications] = useState([]);
  const [applicationsByRole, setApplicationsByRole] = useState([]);

  const onClose = () => {
    navigate(-1);
  };

  const getData = async () => {
    if (selectedRowId) {
      const params = {
        token: user.token,
        roleId: selectedRowId,
        id: selectedRowId,
      };
      const appByRol = await findAllApplicationsByRoleId(params);
      setApplicationsByRole(appByRol);

      const appls = await findAllApplications(params);
      setApplications(appls);

      const role = await findRoleById(params);
      setRole(role);
    }else{
      navigate("/");
    }
  }

  useEffect(() => {
    getData();
  }, [selectedRowId]);

  useEffect(() => {
    const ids = applicationsByRole?.map((app) => app.id);
    if (ids) {
      const list = applications?.map((app) => {
        const ret = { ...app };
        ret.checked = ids.includes(app.id);

        return ret;
      });
      setProcessData(list);
    } else {
      setProcessData(null);
    }
  }, [applications, applicationsByRole]);

  const onCheckRow = (rowId, check) => {
    const ret = processData.map((p) => {
      if (p.id === rowId) {
        p.checked = check;
      }
      return p;
    });
    setProcessData(ret);

    const params = {
      token: user.token,
      roleId: selectedRowId,
      appId: rowId,
    };
    if (check) {
      assignApp(params);
    } else {
      unassignApp(params);
    }
  };

  return (
    <Stack
      justify="stretch"
      spacing="xs"
      sx={(theme) => ({
        backgroundColor:
          theme.colorScheme === "dark"
            ? theme.colors.dark[8]
            : theme.colors.gray[0],
        height: "100%",
        width: "100%",
      })}
    >
      <ResponceNotification
        opened={errorMessage ? true : false}
        onClose={onClose}
        code={errorMessage}
        title={t("status.error")}
        text={errorMessage}
      />
      <LoadingOverlay
        overlayOpacity={0.5}
        visible={!(processData) && !errorMessage}
      />

      <Title
        mb={"lg"}
        order={2}
        align="center"
        sx={(theme) => ({
          fontFamily: `Greycliff CF, ${theme.fontFamily}`,
          fontWeight: 700,
        })}
      >
        {t("crud.role.title.assignApps") + " : " + role?.name + " - " + role?.groupName}
      </Title>

      <CheckTable
        data={processData}
        columns={columns}
        loading={false}
        rowSelected={rowSelected}
        setRowSelected={setRowSelected}
        onCheckRow={onCheckRow}
        headerHeight={300}
      />

      <Group position="right" mt="xs" mb="xs" width="100%">
        <Button
          onClick={(event) => {
            navigate(-1);
          }}
        >
          {t("button.close")}
        </Button>
      </Group>
    </Stack>
  );
}
