import { createStyles, Group, Paper, Text, ThemeIcon } from "@mantine/core";
import { IconArrowUpRight, IconArrowDownRight } from "@tabler/icons";

const useStyles = createStyles((theme) => ({
  root: {
    padding: theme.spacing.xl * 1.5,
  },

  label: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
  },
}));

export function StatsGridIcons({ stat }) {
  const { classes } = useStyles();
  const DiffIcon = stat.diff > 0 ? IconArrowUpRight : IconArrowDownRight;

  return (
    <Paper withBorder p="md" radius="md" key={stat.title}>
      <Group position="apart">
        <div>
          <Text color="dimmed" transform="uppercase" weight={700} size="xs" className={classes.label}>
            {stat.title}
          </Text>
          <Text weight={700} size="xl">
            {stat.value}
          </Text>
        </div>
        <ThemeIcon
          color="gray"
          variant="light"
          sx={(theme) => ({
            color: stat.diff > 0 ? theme.colors.teal[6] : theme.colors.red[6],
          })}
          size={38}
          radius="md"
        >
          <DiffIcon size={28} stroke={1.5} />
        </ThemeIcon>
      </Group>
      <Group spacing={"xs"}>
        <Text size="sm" mt="md" component="span" color={stat.diff > 0 ? "teal" : "red"} weight={700}>
          {stat.diff}%
        </Text>
        <Text color="dimmed" size="sm" mt="md">
          {stat.diff > 0 ? "increase" : "decrease"} compared to last month
        </Text>
      </Group>
    </Paper>
  );
}
