import { useEffect, useState } from "react";
import { createStyles, UnstyledButton, Menu, Image, Group } from "@mantine/core";
import { useTranslation } from "react-i18next";
import en from "./images/en.png";
import es from "./images/es.png";
import br from "./images/br.png";

const data = [
  { label: "English", image: en, locale: "en" },
  { label: "Spain", image: es, locale: "es" },
  { label: "Brazil", image: br, locale: "br" },
];

const useStyles = createStyles((theme) => ({
  control: {
    display: "flex",
    justifyContent: "space-evenly",
    alignItems: "center",
    padding: "9px 15px",
    borderRadius: theme.radius.sm,
    border: `1px solid ${theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[2]}`,
    transition: "background-color 150ms ease",

    backgroundColor: theme.colors.gray[1],

    "&:hover": {
      backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[3],
    },
  },

  label: {
    fontWeight: 500,
    fontSize: theme.fontSizes.sm,
  },

  icon: {
    transition: "transform 150ms ease",
  },

  iconOpen: {
    transition: "transform 150ms ease",
    transform: "rotate(0deg)",
  },

  iconClose: {
    transition: "transform 150ms ease",
    transform: "rotate(180deg)",
  },
}));

export default function LanguageSelector() {
  const { i18n } = useTranslation();
  const { classes } = useStyles();
  const [selected, setSelected] = useState(data[0]);

  useEffect(() => {
    i18n.changeLanguage(selected.locale);
  }, [i18n, selected]);

  const items = data.map((item) => (
    <Menu.Item
      icon={<Image src={item.image} width={18} height={18} />}
      onClick={() => setSelected(item)}
      key={item.label}
    >
      {item.label}
    </Menu.Item>
  ));

  return (
    <Menu onOpen={() => {}} onClose={() => {}} radius="sm" width="target">
      <Menu.Target>
        <UnstyledButton className={classes.control}>
          <Group spacing="xs">
            <Image src={selected.image} width={18} height={18} />
            <span className={classes.label}>{selected.label}</span>
          </Group>
        </UnstyledButton>
      </Menu.Target>
      <Menu.Dropdown>{items}</Menu.Dropdown>
    </Menu>
  );
}
