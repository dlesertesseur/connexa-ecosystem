import { RingProgress, Text, Paper, Center, Group } from "@mantine/core";
import {
  IconArrowUpRight,
  IconArrowDownRight,
  IconUserPlus,
  IconDiscount2,
  IconReceipt2,
  IconCoin,
} from "@tabler/icons";

const icons = {
  up: IconArrowUpRight,
  down: IconArrowDownRight,
  user: IconUserPlus,
  discount: IconDiscount2,
  receipt: IconReceipt2,
  coin: IconCoin,
};
export function StatRing({ stat }) {
  const Icon = icons[stat.icon];
  return (
    <Paper withBorder radius="md" p="xs" key={stat.label}>
      <Group>
        <RingProgress
          size={80}
          roundCaps
          thickness={8}
          sections={[{ value: stat.progress, color: stat.color }]}
          label={
            <Center>
              <Icon size={22} stroke={1.5} />
            </Center>
          }
        />

        <div>
          <Text color="dimmed" size="xs" transform="uppercase" weight={700}>
            {stat.label}
          </Text>
          <Text weight={700} size="xl">
            {stat.stats}
          </Text>
        </div>
      </Group>
    </Paper>
  );
}
