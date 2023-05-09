import { createStyles, Group, Paper, Text } from "@mantine/core";
import {
  IconUserPlus,
  IconDiscount2,
  IconReceipt2,
  IconCoin,
  IconArrowUpRight,
  IconArrowDownRight,
} from "@tabler/icons";
import { Sparklines, SparklinesLine, SparklinesSpots } from "react-sparklines";

const useStyles = createStyles((theme) => ({
  root: {
    padding: theme.spacing.xl * 1.5,
  },

  value: {
    fontSize: 24,
    fontWeight: 700,
    lineHeight: 1,
  },

  diff: {
    lineHeight: 1,
    display: "flex",
    alignItems: "center",
  },

  icon: {
    color: theme.colorScheme === "dark" ? theme.colors.dark[3] : theme.colors.gray[4],
  },

  title: {
    fontWeight: 700,
    textTransform: "uppercase",
  },
}));

const icons = {
  user: IconUserPlus,
  discount: IconDiscount2,
  receipt: IconReceipt2,
  coin: IconCoin,
  up: IconArrowUpRight,
  down: IconArrowDownRight,
};

export function StatSparklines({ stat }) {
  const { classes } = useStyles();
  const Icon = icons[stat.icon] ? icons[stat.icon] : IconCoin;

  return (
    <Paper withBorder p="md" radius="md" key={stat.title}>
      <Group position="apart">
        <Text size="xs" color="dimmed" className={classes.title}>
          {stat.title}
        </Text>
        <Icon className={classes.icon} size={22} stroke={1.5} />
      </Group>

      <Group align="flex-end" spacing="xs" mt={25}>
        <Sparklines data={stat.data}>
          <SparklinesLine color={stat.color} />
          <SparklinesSpots style={{ fill: stat.color }} />
        </Sparklines>
      </Group>
    </Paper>
  );
}
