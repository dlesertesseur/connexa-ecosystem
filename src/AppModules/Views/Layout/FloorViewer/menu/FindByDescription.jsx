import React from "react";
import { Stack, Button, Group, Textarea, ColorPicker } from "@mantine/core";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const FindByDescription = () => {
  const { t } = useTranslation();

  const [color, onChange] = useState("#ff0000");
  const [textValue, setTextValue] = useState("");
  return (
    <Stack>
      <Textarea
        description="Search items by similar description"
        placeholder="a description"
        label="Item description"
        value={textValue}
        onChange={(event) => setTextValue(event.currentTarget.value)}
      />

      <ColorPicker format="hex" value={color} onChange={onChange} fullWidth withPicker={true} />

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
