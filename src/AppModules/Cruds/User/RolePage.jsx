import ResponceNotification from "../../../Modal/ResponceNotification";
import CheckTable from "../../../Components/Crud/CheckTable";
import { Title, Button, Stack, Group, Select } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { findAllRoles } from "../../../DataAccess/Roles";
import { getRoleBySiteIdAndUserId, assignRol, unassignRol } from "../../../DataAccess/User";
import { findAllSites } from "../../../DataAccess/Sites";
import { findAllByOrganizationId } from "../../../DataAccess/OrganizationRole";
import { AbmStateContext } from "./Context";
import { useContext } from "react";

export function RolePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { selectedRowId, selectedUserName } = useContext(AbmStateContext);
  const [errorMessage, setErrorMessage] = useState(null);
  const [roles, setRoles] = useState([]);
  const [sites, setSites] = useState([]);
  const [formatedSites, setFormatedSites] = useState([]);
  const [site, setSite] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filteredRole, setFilteredRole] = useState([]);
  const [userRole, setUserRole] = useState([]);

  const { user, projectSelected, organizationSelected } = useSelector((state) => state.auth.value);

  const [rowSelected, setRowSelected] = useState(null);

  const cols = t("crud.role.columns", { returnObjects: true });
  const columns = [
    { headerName: cols[1], fieldName: "name", align: "left" },
    { headerName: cols[2], fieldName: "groupName", align: "left" },
  ];

  const onClose = () => {
    navigate(-1);
  };

  const getAssignedRoleId = (userAllRole) => {
    const ret = userAllRole.map((r) => r.id);
    return ret;
  };

  const findSites = async () => {
    const params = { token: user.token, id: organizationSelected.id };
    setLoading(true);

    try {
      const sites = await findAllSites(params);
      const rs = sites.map((r) => {
        return { value: r.id, label: r.name };
      });
      setFormatedSites(rs);
      setSites(sites);
      setSite(rs[0].value);

      const userAllRole = await getRoleBySiteIdAndUserId({
        token: user.token,
        siteId: rs[0].value,
        userId: selectedRowId,
      });

      setUserRole(userAllRole);
      const assignedRoleId = getAssignedRoleId(userAllRole);

      let filtredIdRoles = null;
      const filtredRoles = await findAllByOrganizationId(params);
      if(filtredRoles){
        filtredIdRoles = filtredRoles.map(r => r.role.id);
      }
      
      let roles = await findAllRoles(params);
      if(filtredIdRoles){
        roles = roles.filter(r => filtredIdRoles.includes(r.id))
      }

      for (let index = 0; index < roles.length; index++) {
        const r = roles[index];
        const check = assignedRoleId.includes(r.id);
        r["checked"] = check;
      }

      setRoles(roles);
    } catch (error) {
      setErrorMessage(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    findSites();
  }, []);

  useEffect(() => {
    if (site && roles) {
      const fs = sites.find((s) => {
        return s.id === site;
      });

      if (fs) {
        const ret = roles.filter((r) => {
          return r.context.id === fs.context.id;
        });
        setFilteredRole(ret);
      }
    }
  }, [site, roles]);

  const addRol = async (siteId, userId, roleId) => {
    const parameters = {
      token: user.token,
      siteId: siteId,
      userId: userId,
      roleId: roleId,
    };
    setLoading(true);
    try {
      await assignRol(parameters);
      const r = roles.find((r) => r.id === roleId);
      if (r) {
        r["checked"] = true;
      }
    } catch (error) {
      setErrorMessage(error);
    }
    setLoading(false);
  };

  const removeRol = async (projectId, siteId, userId, roleId) => {
    const parameters = {
      token: user.token,
      projectId: projectId,
      siteId: siteId,
      userId: userId,
      roleId: roleId,
    };

    setLoading(true);

    try {
      await unassignRol(parameters);
      const r = roles.find((r) => r.id === roleId);
      if (r) {
        r["checked"] = false;
      }
    } catch (error) {
      setErrorMessage(error);
    }

    setLoading(false);
  };

  const onCheckRow = (rowId, check) => {
    if (check) {
      addRol(site, selectedRowId, rowId);
    } else {
      removeRol(projectSelected.id, site, selectedRowId, rowId);
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

      <Title
        mb={"lg"}
        order={3}
        align="left"
        sx={(theme) => ({
          fontFamily: `Greycliff CF, ${theme.fontFamily}`,
          fontWeight: 700,
        })}
      >
        {t("crud.user.title.role") + " " + selectedUserName}
      </Title>

      <Group>
        <Select
          label={t("crud.user.title.site")}
          placeholder=""
          data={formatedSites}
          value={site}
          onChange={setSite}
          disabled={loading}
        />
      </Group>

      <CheckTable
        data={filteredRole}
        columns={columns}
        loading={loading}
        rowSelected={rowSelected}
        setRowSelected={setRowSelected}
        onCheckRow={onCheckRow}
        headerHeight={360}
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
