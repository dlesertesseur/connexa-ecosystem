import React from "react";
import { Stack, Button, Group, HueSlider, Textarea } from "@mantine/core";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const FindByDescription = () => {
  const { t } = useTranslation();

  const [value, onChange] = useState(250);
  const [textValue, setTextValue] = useState(null);
  return (
    <Stack>
      <Textarea
        description="Search items by similar description"
        placeholder="a description"
        label="Item description"
        value={textValue}
        onChange={(event) => setTextValue(event.currentTarget.value)}
      />

      <HueSlider value={value} onChange={onChange} size="md" />
      <Group position="right">
        <Button
          size="xs"
          disabled={!textValue}
          onClick={() => {
            console.log("obClick");
          }}
        >
          {t("button.accept")}
        </Button>
      </Group>
    </Stack>
  );
};

export default FindByDescription;
