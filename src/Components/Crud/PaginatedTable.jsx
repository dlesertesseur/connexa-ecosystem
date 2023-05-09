import { useState } from "react";
import { createStyles, Table, ScrollArea, UnstyledButton, Group, Text, Center, TextInput, Button } from "@mantine/core";
import { keys } from "@mantine/utils";
import { IconSelector, IconChevronDown, IconChevronUp, IconSearch } from "@tabler/icons";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const useStyles = createStyles((theme) => ({
  th: {
    padding: "0 !important",
    backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.blue[0],
  },

  control: {
    width: "100%",
    padding: `${theme.spacing.xs}px ${theme.spacing.md}px`,

    "&:hover": {
      backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.blue[1],
    },
  },

  icon: {
    width: 21,
    height: 21,
    borderRadius: 21,
  },
}));

function Th({ children, reversed, sorted, onSort }) {
  const { classes } = useStyles();
  const Icon = sorted ? (reversed ? IconChevronUp : IconChevronDown) : IconSelector;
  return (
    <th className={classes.th}>
      <UnstyledButton onClick={onSort} className={classes.control}>
        <Group position="apart">
          <Text weight={500} size="sm">
            {children}
          </Text>
          <Center className={classes.icon}>
            <Icon size={14} stroke={1.5} />
          </Center>
        </Group>
      </UnstyledButton>
    </th>
  );
}

function filterData(data, search) {
  const query = search.toLowerCase().trim();
  return data.filter((item) => keys(data[0]).some((key) => item[key].toLowerCase().includes(query)));
}

function sortData(data, payload) {
  const { sortBy } = payload;

  if (!sortBy) {
    return filterData(data, payload.search);
  }

  return filterData(
    [...data].sort((a, b) => {
      if (payload.reversed) {
        return b[sortBy].localeCompare(a[sortBy]);
      }

      return a[sortBy].localeCompare(b[sortBy]);
    }),
    payload.search
  );
}

export default function PaginatedTable({ data, columns }) {
  const [search, setSearch] = useState("");
  const [sortedData, setSortedData] = useState(data);
  const [sortBy, setSortBy] = useState(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);
  const [rowSelected, setRowSelected] = useState(null);

  const navigate = useNavigate();
  const { t } = useTranslation();

  const setSorting = (field) => {
    const reversed = field === sortBy ? !reverseSortDirection : false;
    setReverseSortDirection(reversed);
    setSortBy(field);
    setSortedData(sortData(data, { sortBy: field, reversed, search }));
  };

  const handleSearchChange = (event) => {
    const { value } = event.currentTarget;
    setSearch(value);
    setSortedData(sortData(data, { sortBy, reversed: reverseSortDirection, search: value }));
  };

  const rows = sortedData.map((row) => (
    <tr
      key={row.id}
      onClick={() => {
        setRowSelected(row.id);
      }}
      style={{ backgroundColor: row.id === rowSelected ? "#ff0000" : "" }}
    >
      {columns.map((f) => (
        <td key={f.fieldName}>{f.fieldName}</td>
      ))}
    </tr>
  ));

  return (
    <ScrollArea>
      <Group position="apart" mb={"xs"}>
        <Group spacing="xs">
          <Button
            onClick={() => {
              navigate("./create");
            }}
          >
            {t("label.crud.create")}
          </Button>
          <Button
            onClick={() => {
              navigate("./update");
            }}
            disabled={!rowSelected ? true : false}
          >
            {t("label.crud.update")}
          </Button>
          <Button
            onClick={() => {
              navigate("./delete");
            }}
            disabled={!rowSelected ? true : false}
          >
            {t("label.crud.delete")}
          </Button>
        </Group>
        <Group grow>
          <TextInput
            placeholder={t("placeholder.search")}
            icon={<IconSearch size={14} stroke={1.5} />}
            value={search}
            onChange={handleSearchChange}
          />
        </Group>
      </Group>
      <Table
        horizontalSpacing="md"
        verticalSpacing="xs"
        striped
        highlightOnHover
        withBorder
        withColumnBorders
        sx={{ tableLayout: "fixed", minWidth: 700 }}
      >
        <thead>
          <tr>
            {columns.map((h, index) => (
              <Th key={index} sorted={sortBy === h.fieldName} reversed={reverseSortDirection} onSort={() => setSorting(h.fieldName)}>
                {h.headerName}
              </Th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length > 0 ? (
            rows
          ) : (
            <tr>
              <td colSpan={Object.keys(data[0]).length}>
                <Text weight={500} align="center">
                  {t("label.noData")}
                </Text>
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </ScrollArea>
  );
}
