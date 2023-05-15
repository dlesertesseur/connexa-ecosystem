import { useEffect, useState } from "react";
import { Group, Select } from "@mantine/core";
import { useTranslation } from "react-i18next";

const data = [
  { label: "English", value: "en" },
  { label: "Español", value: "es" },
];

export default function LanguageSelector() {
  const { i18n, t } = useTranslation();
  const [selected, setSelected] = useState(data[0].value);

  useEffect(() => {
    i18n.changeLanguage(selected);
  }, [i18n, selected]);

  return (
    <Group grow>
      <Select
        label={t("label.selectLanguage")}
        placeholder="Pick one"
        data={data}
        value={selected}
        onChange={setSelected}
      />
    </Group>
  );
}
