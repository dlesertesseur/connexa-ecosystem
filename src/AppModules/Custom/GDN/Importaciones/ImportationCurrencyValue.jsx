import { Group, Text } from "@mantine/core";
import { IconCoin, IconCurrencyDollar, IconCurrencyEuro, IconCurrencyYuan } from "@tabler/icons-react";
import React from "react";

const ImportationCurrencyValue = ({ currency, value }) => {
  const getIcon = (currency) => {
    let ret = null;
    switch (currency) {
      case "DOL":
        ret = <IconCurrencyDollar size={20} />;
        break;
      case "EUR":
        ret = <IconCurrencyEuro size={20} />;
        break;
      case "CNY":
        ret = <IconCurrencyYuan size={20} />;
        break;

      default:
        ret = <IconCoin size={20} />;
        break;
    }
    return ret;
  };
  return (
    <Group position="apart" spacing={0} align="center">
      <Group spacing={0}>
        {getIcon(currency)}
        <Text size={"xs"} weight={600} align="center" mr={"xs"}>
          {currency}
        </Text>
      </Group>

      <Text size={"xs"} weight={600} align="center">
        {`${value}`}
      </Text>
    </Group>
  );
};

export default ImportationCurrencyValue;
