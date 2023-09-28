import { Divider, IconButton, Nav, Sidenav, Stack } from "rsuite";
import { Category, CATEGORY, LINE, Line, SURFACE, Surface } from "./db/DB";
import { Global, Icon, Table, TableColumn, Trash } from "@rsuite/icons";
import { ForwardRefExoticComponent, useState } from "react";
import { IconProps } from "@rsuite/icons/lib/Icon";

const generateSurfaceMenu = (
  surface: Surface,
  activeKey: string,
  setActive: (activeKey: string) => void,
  onPageChange: (pageType: string, id: string | number) => void,
  onAdd: (type: string, parent: string | number) => void,
  onDelete: (type: string, id: string | number, name: string) => void,
) => {
  const {
    key: surfaceKey,
    icon: surfaceIcon,
    title: surfaceTitle,
  } = generateButtons(
    SURFACE,
    surface.name,
    surface,
    activeKey,
    onAdd,
    onDelete,
  );

  const selectSurface = () => {
    setActive(surfaceKey);
    onPageChange(SURFACE, surface.name);
  };

  return surface.categories.length > 0 ? (
    <Nav.Menu
      key={surfaceKey}
      eventKey={surfaceKey}
      icon={surfaceIcon}
      title={surfaceTitle}
      onClick={selectSurface}
    >
      {surface.categories.map((category) =>
        generateCategoryMenu(
          category,
          activeKey,
          setActive,
          onPageChange,
          onAdd,
          onDelete,
        ),
      )}
    </Nav.Menu>
  ) : (
    <Nav.Item
      key={surfaceKey}
      eventKey={surfaceKey}
      icon={surfaceIcon}
      onClick={selectSurface}
    >
      {surfaceTitle}
    </Nav.Item>
  );
};

const generateCategoryMenu = (
  category: Category,
  activeKey: string,
  setActive: (activeKey: string) => void,
  onPageChange: (pageType: string, id: string | number) => void,
  onAdd: (type: string, parent: string | number) => void,
  onDelete: (type: string, id: string | number, name: string) => void,
) => {
  const {
    key: categoryKey,
    icon: categoryIcon,
    title: categoryTitle,
  } = generateButtons(
    CATEGORY,
    category.id as number,
    category,
    activeKey,
    onAdd,
    onDelete,
  );

  const selectCategory = () => {
    setActive(categoryKey);
    onPageChange(CATEGORY, category.id as number);
  };

  return category.lines.length > 0 ? (
    <Nav.Menu
      key={categoryKey}
      eventKey={categoryKey}
      icon={categoryIcon}
      title={categoryTitle}
      onClick={selectCategory}
    >
      {category.lines.map((line) =>
        generateLineMenu(
          line,
          activeKey,
          setActive,
          onPageChange,
          onAdd,
          onDelete,
        ),
      )}
    </Nav.Menu>
  ) : (
    <Nav.Item
      key={categoryKey}
      eventKey={categoryKey}
      icon={categoryIcon}
      onClick={selectCategory}
    >
      {categoryTitle}
    </Nav.Item>
  );
};

const generateLineMenu = (
  line: Line,
  activeKey: string,
  setActive: (activeKey: string) => void,
  onPageChange: (pageType: string, id: string | number) => void,
  onAdd: (type: string, parent: string | number) => void,
  onDelete: (type: string, id: string | number, name: string) => void,
) => {
  const { key: lineKey, title: lineTitle } = generateButtons(
    LINE,
    line.id as number,
    line,
    activeKey,
    onAdd,
    onDelete,
  );

  const selectLine = () => {
    setActive(lineKey);
    onPageChange(LINE, line.id as number);
  };

  return (
    <Nav.Item key={lineKey} eventKey={lineKey} onClick={selectLine}>
      {lineTitle}
    </Nav.Item>
  );
};

const generateButtons = (
  type: string,
  id: string | number,
  obj: Surface | Category | Line,
  activeKey: string,
  onAdd: (type: string, parent: string | number) => void,
  onDelete: (type: string, id: string | number, name: string) => void,
) => {
  const HIERARCHY: {
    [key: string]: {
      child: string;
      icon: ForwardRefExoticComponent<IconProps>;
      childIcon: ForwardRefExoticComponent<IconProps>;
    };
  } = {
    [SURFACE]: {
      child: CATEGORY,
      icon: Global,
      childIcon: Table,
    },
    [CATEGORY]: {
      child: LINE,
      icon: Table,
      childIcon: TableColumn,
    },
  };

  const key = `${type}-${id}`;
  const color =
    key === activeKey
      ? { color: "var(--rs-sidenav-default-selected-text)" }
      : {};
  const icon = HIERARCHY[type] ? (
    <Icon as={HIERARCHY[type].icon} style={{ marginTop: "10px", ...color }} />
  ) : (
    <></>
  );

  const title = (
    <Stack spacing={8}>
      <span style={color}>{obj.name}</span>
      <Stack.Item grow={1} />
      {HIERARCHY[type] && (
        <IconButton
          appearance="primary"
          color="green"
          icon={<Icon as={HIERARCHY[type].childIcon} />}
          onClick={(e) => {
            e.stopPropagation();
            onAdd(HIERARCHY[type].child, id);
          }}
        />
      )}
      <IconButton
        appearance="primary"
        color="red"
        icon={<Trash />}
        onClick={(e) => {
          e.stopPropagation();
          onDelete(type, id, obj.name);
        }}
      />
    </Stack>
  );

  return { key, icon, title };
};

export const Surfaces = ({
  surfaces,
  onPageChange,
  onAdd,
  onDelete,
}: {
  surfaces: Surface[];
  onPageChange: (pageType: string, id: string | number) => void;
  onAdd: (type: string, parent: string | number) => void;
  onDelete: (type: string, id: string | number, name: string) => void;
}) => {
  const [active, setActive] = useState("surface-Nauvis");
  return (
    <Sidenav defaultOpenKeys={["Nauvis"]}>
      <Sidenav.Header style={{ padding: "5% 5% 0% 5%" }}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-around"
        >
          <Stack.Item>
            <h3>Surfaces</h3>
          </Stack.Item>
          <Stack.Item>
            <IconButton
              icon={<Global />}
              appearance="primary"
              color="green"
              onClick={() => onAdd(SURFACE, "")}
            >
              Add
            </IconButton>
          </Stack.Item>
        </Stack>
      </Sidenav.Header>
      <Divider />
      <Sidenav.Body>
        <Nav activeKey={active}>
          {surfaces.map((surface) =>
            generateSurfaceMenu(
              surface,
              active,
              setActive,
              onPageChange,
              onAdd,
              onDelete,
            ),
          )}
        </Nav>
      </Sidenav.Body>
    </Sidenav>
  );
};
