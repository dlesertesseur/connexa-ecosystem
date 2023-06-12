import { Button, Group, HueSlider, Stack, TextInput } from "@mantine/core";
import React from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const FindByCode = () => {
  const { t } = useTranslation();

  const [value, onChange] = useState(250);
  const [textValue, setTextValue] = useState(null);
  return (
    <Stack>
      <TextInput
        description="Search item by exact code"
        placeholder="a code"
        label="Item code"
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

export default FindByCode;
