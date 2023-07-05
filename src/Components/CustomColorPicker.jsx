import React from "react";
import { Box, ColorPicker, Group, Stack, Text } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { config } from "../Constants/config";

const CustomColorPicker = ({ value, onChange }) => {
  const { t } = useTranslation();
  return (
    <Stack spacing={0}>
      <Group position="apart">
        <Text fz="sm">{t("label.color")}</Text>

        <Box
          w={24}
          h={24}
          bg={value}
          sx={(theme) => ({
            borderRadius: theme.radius.sm,
          })}
        />
      </Group>
      <ColorPicker
        format="hex"
        value={value}
        onChange={onChange}
        fullWidth
        withPicker={false}
        swatches={config.ARR_COLORS}
      />
    </Stack>
  );
};

export default CustomColorPicker;
