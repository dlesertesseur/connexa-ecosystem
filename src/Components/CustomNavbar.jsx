import { Navbar, ScrollArea, createStyles, Paper } from "@mantine/core";
import { IconApps } from "@tabler/icons";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { findTranslatedField } from "../Util";
import { LinksGroup } from "./LinksGroup";
import { OrganizationInfo } from "./OrganizationInfo";
import SiteSelector from "./SiteSelector";

const useStyles = createStyles((theme) => ({
  navbar: {
    backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.white,
    paddingBottom: 0,
    paddingTop: 70,
  },

  links: {
    marginLeft: -theme.spacing.md,
    marginRight: -theme.spacing.md,
    height: "100%",
  },

  linksInner: {
    paddingTop: 0,
    paddingBottom: 0,
  },
}));

export default function CustomNavbar() {
  const [links, setLinks] = useState(null);
  const { i18n, t } = useTranslation();
  const { organizationSelected, projectSelected, siteSelected } = useSelector((state) => state.auth.value);
  const { classes } = useStyles();

  useEffect(() => {
    if (siteSelected) {
      const l = siteSelected.roles.map((role) => {
        const item = {
          label: findTranslatedField(i18n.language, role, "name"),
          icon: IconApps,
        };

        item.links = role.applications.map((app) => {
          const subItem = {
            id: app.id,
            label: findTranslatedField(i18n.language, app, "name"),
            description: findTranslatedField(i18n.language, app, "description"),
            icon: app.icon,
            link: app.path,
          };
          return subItem;
        });

        return <LinksGroup {...item} key={role.id} />;
      });
      setLinks(l);
    }
  }, [i18n.language, siteSelected]);

  return (
    <Navbar width={{ sm: 300 }} p="md" className={classes.navbar}>
      <Navbar.Section className={classes.header}>
        <Paper>
          {organizationSelected ? (
            <OrganizationInfo
              title={findTranslatedField(i18n.language, organizationSelected, "name")}
              description={organizationSelected?.description}
               />
          ) : null}
        </Paper>
      </Navbar.Section>

      <Navbar.Section className={classes.header} mt={"xs"} >
        {projectSelected ? <SiteSelector label={t("label.selectedSite")} /> : null}
      </Navbar.Section>

      <Navbar.Section grow className={classes.links} component={ScrollArea} mt={"xs"}>
        <div className={classes.linksInner}>{links}</div>
      </Navbar.Section>
    </Navbar>
  );
}
