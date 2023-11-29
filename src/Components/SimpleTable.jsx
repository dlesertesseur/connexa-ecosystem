import { useEffect, useState } from "react";
import {
  createStyles,
  Table,
  ScrollArea,
  UnstyledButton,
  Group,
  Text,
  Center,
  Stack,
  LoadingOverlay,
  Image,
  Avatar,
} from "@mantine/core";
import { keys } from "@mantine/utils";
import { IconSelector, IconChevronDown, IconChevronUp } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import { API } from "../Constants";
import { useWindowSize } from "../Hook";
import { convertMilisegToYYYYMMDD } from "../Util";

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
          <Group position="apart" noWrap>
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

export default function SimpleTable({
  data,
  columns,
  loading = false,
  rowSelected,
  setRowSelected,
  headerHeight = 230,
}) {
  const { classes, cx } = useStyles();
  const { t } = useTranslation();

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

        case "percentage":
          ret = `${data ? Math.round(data * 10) / 10 : 0} %`;
          break;

        case "date":
          if (data) {
            ret = convertMilisegToYYYYMMDD(data);
          }else{
            ret = "----/--/--";
          }
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
      <ScrollArea
        offsetScrollbars
        sx={{ height: wSize.height - headerHeight }}
        onScrollPositionChange={({ y }) => setScrolled(y !== 0)}
      >
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
