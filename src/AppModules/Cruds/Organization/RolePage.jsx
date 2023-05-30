import ResponceNotification from "../../../Modal/ResponceNotification";
import CheckTable from "../../../Components/Crud/CheckTable";
import { Title, LoadingOverlay, Button, Stack, Group } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useContext } from "react";
import { AbmStateContext } from "./Context";
import { findOrganizationById } from "../../../DataAccess/Organization";
import { assignRoleToOrg, findAllByOrganizationId, unassignRoleToOrg } from "../../../DataAccess/OrganizationRole";
import { findAllRoles } from "../../../DataAccess/Roles";

export function RolePage() {
  const { t } = useTranslation();
  const { user } = useSelector((state) => state.auth.value);
  const { selectedRowId } = useContext(AbmStateContext);
  const [errorMessage, setErrorMessage] = useState(null);
  const [rowSelected, setRowSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const cols = t("crud.organizations.appplications.columns", { returnObjects: true });
  const columns = [
    { headerName: cols[1], fieldName: "name", align: "left" },
    { headerName: cols[2], fieldName: "groupName", align: "left" },
  ];

  const [processData, setProcessData] = useState(null);
  const [roles, setRoles] = useState([]);
  const [organization, setOrganization] = useState(null);
  const [rolesByOrg, setRolesByOrg] = useState([]);

  const onClose = () => {
    navigate(-1);
  };

  const getData = async () => {
    if (selectedRowId) {
      const params = {
        token: user.token,
        id: selectedRowId,
      };

      const rolesByOrg = await findAllByOrganizationId(params);
      if(rolesByOrg){
        setRolesByOrg(rolesByOrg);
      }else{
        setRolesByOrg([]);
      }

      const roles = await findAllRoles(params);
      roles.sort((a, b) => {
        const vA = a.groupName.toUpperCase() + "-" + a.name.toUpperCase();
        const vB = b.groupName.toUpperCase() + "-" + b.name.toUpperCase();
        if (vA < vB) {
          return -1;
        }
        if (vA > vB) {
          return 1;
        }
        return 0;
      });
      setRoles(roles);

      const org = await findOrganizationById(params);
      setOrganization(org);
    } else {
      navigate("/");
    }

    setLoading(false);
  };

  useEffect(() => {
    getData();
  }, [selectedRowId]);

  useEffect(() => {
    const ids = rolesByOrg?.map((app) => app.role.id);
    if (ids) {
      const list = roles?.map((app) => {
        const ret = { ...app };
        ret.checked = ids.includes(app.id);

        return ret;
      });
      setProcessData(list);
    } else {
      setProcessData(null);
    }
  }, [roles, rolesByOrg]);

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
      id: selectedRowId,
      roleId: rowId,
    };
    if (check) {
      assignRoleToOrg(params);
    } else {
      unassignRoleToOrg(params);
    }
  };

  return (
    <Stack
      justify="stretch"
      spacing="xs"
      sx={(theme) => ({
        backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.colors.gray[0],
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
      <LoadingOverlay overlayOpacity={0.5} visible={!processData && !errorMessage} />

      <Group position="center" spacing={0}>
        <Title
          order={2}
          align="center"
          sx={(theme) => ({
            fontFamily: `Greycliff CF, ${theme.fontFamily}`,
            fontWeight: 700,
          })}
        >
          {t("crud.organization.title.assignRoles")}
        </Title>

        {organization ? (
          <Title
            order={2}
            align="center"
            sx={(theme) => ({
              fontFamily: `Greycliff CF, ${theme.fontFamily}`,
              fontWeight: 700,
            })}
          >
            {" : " + organization?.name}
          </Title>
        ) : null}
      </Group>

      <CheckTable
        data={processData}
        columns={columns}
        loading={loading}
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
