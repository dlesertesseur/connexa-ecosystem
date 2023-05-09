import ResponceNotification from "../../../Modal/ResponceNotification";
import CheckTable from "../../../Components/Crud/CheckTable";
import { Title, LoadingOverlay, Button, Stack, Group } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  findAllApplications,
  findAllApplicationsByRoleId,
} from "../../../Features/Role";
import { assignApp, unassignApp } from "../../../DataAccess/Roles";

export function ApplicationsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth.value);
  const {
    applications,
    applicationsByRole,
    selectedRole,
    error,
    errorMessage,
  } = useSelector((state) => state.role.value);

  const [rowSelected, setRowSelected] = useState(null);

  const cols = t("crud.application.columns", { returnObjects: true });
  const columns = [
    { headerName: cols[1], fieldName: "name", align: "left" },
    { headerName: cols[2], fieldName: "description", align: "left" },
  ];

  const [processData, setProcessData] = useState(null);

  const onClose = () => {
    navigate(-1);
  };

  useEffect(() => {
    if (selectedRole) {
      const params = {
        token: user.token,
        id: selectedRole.id,
      };
      dispatch(findAllApplicationsByRoleId(params));
      dispatch(findAllApplications(params));
    }else{
      navigate("/");
    }
  }, [dispatch, navigate, selectedRole, user]);

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
      roleId: selectedRole.id,
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
        opened={error}
        onClose={onClose}
        code={errorMessage}
        title={t("status.error")}
        text={errorMessage}
      />
      <LoadingOverlay
        overlayOpacity={0.5}
        visible={!(processData) && !error}
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
        {t("crud.role.title.assignApps") + " : " + selectedRole?.name}
      </Title>

      <CheckTable
        data={processData}
        columns={columns}
        loading={false}
        rowSelected={rowSelected}
        setRowSelected={setRowSelected}
        onCheckRow={onCheckRow}
        height={400}
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
