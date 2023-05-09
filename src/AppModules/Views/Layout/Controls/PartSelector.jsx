import { Popover, Button, Stack } from "@mantine/core";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { IconPolygon } from "@tabler/icons";

function PartSelector({ disabled, onOption }) {
  const { t } = useTranslation();
  const [opened, setOpened] = useState(false);

  return (
    <Popover position="bottom" withArrow shadow="md" opened={opened}>
      <Popover.Target>
        <Button
          leftIcon={<IconPolygon size={22} />}
          disabled={disabled}
          size={"xs"}
          py={0}
          onClick={() => setOpened((o) => !o)}
        >
          {t("button.addPart")}
        </Button>
      </Popover.Target>
      <Popover.Dropdown
        sx={(theme) => ({ background: theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white })}
      >
        <Stack spacing={"xs"}>
          <Button
            onClick={() => {
              onOption("addPart", "wall");
              setOpened(false);
            }}
          >
            {t("partType.wall")}{" "}
          </Button>
          <Button
            onClick={() => {
              onOption("addPart", "column");
              setOpened(false);
            }}
          >
            {t("partType.column")}
          </Button>
          <Button
            onClick={() => {
              onOption("addPart", "zone");
              setOpened(false);
            }}
          >
            {t("partType.zone")}
          </Button>
        </Stack>
      </Popover.Dropdown>
    </Popover>
  );
}

export { PartSelector };
