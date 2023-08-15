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
  Image,
  Avatar,
} from "@mantine/core";
import { keys } from "@mantine/utils";
import { IconSelector, IconChevronDown, IconChevronUp, IconSearch } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { API } from "../../Constants";
import { useWindowSize } from "../../Hook";

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
    zIndex: 1,

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
        {onSort ? (
          <Group position="apart">
            <Text weight={500} size="sm">
              {children}
            </Text>
            <Center className={classes.icon}>
              <Icon size={14} stroke={1.5} />
            </Center>
          </Group>
        ) : null}
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

export default function SortedTable({
  data,
  columns,
  filterControl = null,
  filterSelection = null,
  loading = false,
  enableCreateButton,
  rowSelected,
  setRowSelected,
  relationship,
  searchBox = false,
  headerHeight = 230,
  createButton = true,
  updateButton = true,
  deleteButton = true,
  backButton = null,
}) {
  const { classes, cx } = useStyles();
  const { t } = useTranslation();

  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [sortedData, setSortedData] = useState([]);
  const [sortBy, setSortBy] = useState(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const wSize = useWindowSize();

  useEffect(() => {
    if (data) {
      setSortedData(data);
    }
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
    {
      setRowSelected ? setRowSelected(null) : null;
    }
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

  const formatImage = (data) => {
    const ret = data ? (
      <Image src={API.productImages.baseUrl + data} alt={"Not found"} height={24} fit="contain" />
    ) : null;
    return ret;
  };

  const avatarImage = (data) => {
    const ret = data ? (
      <Avatar radius={36} src={API.productImages.baseUrl + data} alt={"Not found"} height={24} fit="contain" />
    ) : null;
    return ret;
  };

  const createCellType = (cell, data) => {
    let ret = null;

    switch (cell.type) {
      case "image":
        ret = formatImage(data);
        break;

      case "avatar":
        ret = avatarImage(data);
        break;

      default:
        ret = formatData(data, cell.format);
        break;
    }
    return ret;
  };

  const rows = sortedData?.map((row) => {
    const ret = (
      <tr
        key={row.id}
        onClick={() => {
          {
            setRowSelected ? setRowSelected(row.id) : null;
          }
        }}
        style={{ backgroundColor: row.id === rowSelected ? "#74C0FC" : "" }}
      >
        {columns.map((f) => {
          return (
            <td key={f.fieldName} align={f.align ? f.align : "center"} width={f.width ? f.width : ""}>
              {/* {f.type === "image" ? formatImage(row[f.fieldName]) : formatData(row[f.fieldName], f.format)} */}
              {createCellType(f, row[f.fieldName])}
            </td>
          );
        })}
      </tr>
    );

    return ret;
  });

  return (
    <Stack>
      <Group position="apart">
        <Group spacing="xs">
          {setRowSelected ? (
            <>
              {createButton ? (
                <Button
                  disabled={!enableCreateButton}
                  onClick={() => {
                    navigate("./create");
                  }}
                >
                  {t("label.crud.create")}
                </Button>
              ) : null}

              {updateButton ? (
                <Button
                  onClick={() => {
                    navigate("./update");
                  }}
                  disabled={!rowSelected ? true : false}
                >
                  {t("label.crud.update")}
                </Button>
              ) : null}

              {deleteButton ? (
                <Button
                  onClick={() => {
                    navigate("./delete");
                  }}
                  disabled={!rowSelected ? true : false}
                >
                  {t("label.crud.delete")}
                </Button>
              ) : null}
              {relationship ? <Divider orientation="vertical" /> : null}
              {relationship?.map((r) => (
                <Button
                  key={r.path}
                  onClick={() => {
                    //r.onPress ? r.onPress(r) : navigate("." + r.path);
                    r.onPress ? r.onPress(r) : navigate(r.path);
                  }}
                  disabled={r.customState ? r.customState() : !rowSelected ? true : false}
                >
                  {r.icon ? (
                    <Group position="apart" spacing={"xs"}>
                      {r.icon} {t(r.key)}
                    </Group>
                  ) : (
                    t(r.key)
                  )}
                </Button>
              ))}

              {filterControl !== null ? <Divider orientation="vertical" /> : null}
            </>
          ) : null}

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
            {backButton ? (
              <Button onClick={backButton}>
                <Text>{t("button.back")}</Text>
              </Button>
            ) : null}
          </>
        ) : null}

        {backButton ? (
          <Group>
            <Button onClick={backButton}>
              <Text>{t("button.back")}</Text>
            </Button>
          </Group>
        ) : null}
      </Group>

      {filterSelection ? filterSelection : null}

      <ScrollArea sx={{ height: wSize.height - headerHeight }} onScrollPositionChange={({ y }) => setScrolled(y !== 0)}>
        <LoadingOverlay visible={loading} overlayBlur={2} />

        <Table horizontalSpacing="xs" verticalSpacing="xs" striped highlightOnHover withBorder withColumnBorders>
          <thead className={cx(classes.header, { [classes.scrolled]: scrolled })}>
            <tr>
              {columns.map((h, index) => (
                <Th
                  key={index}
                  sorted={sortBy === h.fieldName}
                  reversed={reverseSortDirection}
                  onSort={h.headerName ? () => setSorting(h.fieldName) : null}
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
