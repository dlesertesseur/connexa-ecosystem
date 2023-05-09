import { useEffect, useState } from "react";
import {
  createStyles,
  Table,
  ScrollArea,
  UnstyledButton,
  Group,
  Text,
  Center,
  TextInput,
  Button,
  Stack,
  LoadingOverlay,
  Divider,
} from "@mantine/core";
import { keys } from "@mantine/utils";
import { IconSelector, IconChevronDown, IconChevronUp, IconSearch } from "@tabler/icons";
import { useTranslation } from "react-i18next";

const useStyles = createStyles((theme) => ({
  selectedRow: {
    backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.blue[3],
  },
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

  header: {
    position: "sticky",
    top: -1,
    backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
    transition: "box-shadow 150ms ease",

    "&::after": {
      content: '""',
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      borderBottom: `1px solid ${theme.colorScheme === "dark" ? theme.colors.dark[3] : theme.colors.gray[2]}`,
    },
  },

  scrolled: {
    boxShadow: theme.shadows.sm,
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
  return data.filter((item) => keys(data[0]).some((key) => item[key].toString().toLowerCase().includes(query)));
}

function sortData(data, payload) {
  const { sortBy } = payload;

  if (!sortBy) {
    return filterData(data, payload.search);
  }

  return filterData(
    [...data].sort((a, b) => {
      if (payload.reversed) {
        if (typeof a[sortBy] === "string" || a[sortBy] instanceof String) {
          return a[sortBy].toString().localeCompare(b[sortBy].toString());
        } else {
          return b[sortBy] - a[sortBy];
        }
      } else {
        if (typeof a[sortBy] === "string" || a[sortBy] instanceof String) {
          return b[sortBy].toString().localeCompare(a[sortBy].toString());
        } else {
          return a[sortBy] - b[sortBy];
        }
      }
    }),
    payload.search
  );
}

export default function SortedTableStateController({
  data,
  columns,
  filterControl = null,
  loading = false,
  enableCreateButton,
  rowSelected,
  setRowSelected,
  relationship,
  searchBox = false,
  setActivePage,
}) {
  const { classes, cx } = useStyles();
  const { t } = useTranslation();

  const [search, setSearch] = useState("");
  const [sortedData, setSortedData] = useState(data);
  const [sortBy, setSortBy] = useState(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setSortedData(data);
  }, [data]);

  const setSorting = (field) => {
    const reversed = field === sortBy ? !reverseSortDirection : false;
    setReverseSortDirection(reversed);
    setSortBy(field);
    setSortedData(sortData(data, { sortBy: field, reversed, search }));
  };

  const handleSearchChange = (event) => {
    const { value } = event.currentTarget;
    setSearch(value);
    setRowSelected(null);
    setSortedData(sortData(data, { sortBy, reversed: reverseSortDirection, search: value }));
  };

  const formatData = (data, format) => {
    let ret = data;

    if (format) {
      switch (format) {
        case "round":
          ret = Math.round(data * 100) / 100;
          break;
        case "bool":
          ret = data ? t("label.true") : t("label.false");
          break;

        default:
          break;
      }
    }
    return ret;
  };

  const rows = sortedData.map((row) => {
    const ret = (
      <tr
        key={row.id}
        onClick={() => {
          setRowSelected(row.id);
        }}
        style={{ backgroundColor: row.id === rowSelected ? "#74C0FC" : "" }}
      >
        {columns.map((f) => (
          <td key={f.fieldName} align={f.align ? f.align : "center"}>
            {formatData(row[f.fieldName], f.format)}
          </td>
        ))}
      </tr>
    );

    return ret;
  });

  return (
    <Stack>
      <Group position="apart">
        <Group spacing="xs">
          <Button
            disabled={!enableCreateButton}
            onClick={() => {
              setActivePage("./create");
            }}
          >
            {t("label.crud.create")}
          </Button>
          <Button
            onClick={() => {
              setActivePage("./update");
            }}
            disabled={!rowSelected ? true : false}
          >
            {t("label.crud.update")}
          </Button>
          <Button
            onClick={() => {
              setActivePage("./delete");
            }}
            disabled={!rowSelected ? true : false}
          >
            {t("label.crud.delete")}
          </Button>

          {relationship ? <Divider orientation="vertical" /> : null}
          {relationship?.map((r) => (
            <Button
              key={r.path}
              onClick={() => {
                setActivePage("." + r.path);
              }}
              disabled={!rowSelected ? true : false}
            >
              {t(r.key)}
            </Button>
          ))}

          {filterControl !== null ? filterControl : null}
        </Group>

        {searchBox ? (
          <>
            <Divider orientation="vertical" />
            <Group grow>
              <TextInput
                placeholder={t("placeholder.search")}
                icon={<IconSearch size={14} stroke={1.5} />}
                value={search}
                onChange={handleSearchChange}
              />
            </Group>
          </>
        ) : null}
      </Group>

      <ScrollArea sx={{ height: 500 }} onScrollPositionChange={({ y }) => setScrolled(y !== 0)}>
        <LoadingOverlay visible={loading} overlayBlur={2} />

        <Table horizontalSpacing="xs" verticalSpacing="xs" striped highlightOnHover withBorder withColumnBorders>
          <thead className={cx(classes.header, { [classes.scrolled]: scrolled })}>
            <tr>
              {columns.map((h, index) => (
                <Th
                  key={index}
                  sorted={sortBy === h.fieldName}
                  reversed={reverseSortDirection}
                  onSort={() => setSorting(h.fieldName)}
                >
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
                <td colSpan={Object.keys(columns).length}>
                  <Text weight={500} align="center">
                    {t("label.noData")}
                  </Text>
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </ScrollArea>
    </Stack>
  );
}
