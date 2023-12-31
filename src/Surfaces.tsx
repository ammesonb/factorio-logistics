import { Divider, Nav, Sidenav, Stack } from "rsuite";
import { Category, CATEGORY, LINE, Line, SURFACE, Surface } from "./db/DB";
import { Global, Icon, Table, TableColumn } from "@rsuite/icons";
import { ForwardRefExoticComponent, useState } from "react";
import { IconProps } from "@rsuite/icons/lib/Icon";
import { DeleteButton } from "./wrappers/DeleteButton";
import { AddButton } from "./wrappers/AddButton";

const generateSurfaceMenu = (
  surface: Surface,
  activeKey: string,
  setActiveKey: (activeKey: string) => void,
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
    setActiveKey,
    onPageChange,
    onAdd,
    onDelete,
  );

  return surface.categories.length > 0 ? (
    <Nav.Menu
      key={surfaceKey}
      eventKey={surfaceKey}
      icon={surfaceIcon}
      title={surfaceTitle}
    >
      {surface.categories.map((category) =>
        generateCategoryMenu(
          category,
          activeKey,
          setActiveKey,
          onPageChange,
          onAdd,
          onDelete,
        ),
      )}
    </Nav.Menu>
  ) : (
    <Nav.Item key={surfaceKey} eventKey={surfaceKey} icon={surfaceIcon}>
      {surfaceTitle}
    </Nav.Item>
  );
};

const generateCategoryMenu = (
  category: Category,
  activeKey: string,
  setActiveKey: (activeKey: string) => void,
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
    setActiveKey,
    onPageChange,
    onAdd,
    onDelete,
  );

  return category.lines.length > 0 ? (
    <Nav.Menu
      key={categoryKey}
      eventKey={categoryKey}
      icon={categoryIcon}
      title={categoryTitle}
    >
      {category.lines.map((line) =>
        generateLineMenu(
          line,
          activeKey,
          setActiveKey,
          onPageChange,
          onAdd,
          onDelete,
        ),
      )}
    </Nav.Menu>
  ) : (
    <Nav.Item key={categoryKey} eventKey={categoryKey} icon={categoryIcon}>
      {categoryTitle}
    </Nav.Item>
  );
};

const generateLineMenu = (
  line: Line,
  activeKey: string,
  setActiveKey: (activeKey: string) => void,
  onPageChange: (pageType: string, id: string | number) => void,
  onAdd: (type: string, parent: string | number) => void,
  onDelete: (type: string, id: string | number, name: string) => void,
) => {
  const { key: lineKey, title: lineTitle } = generateButtons(
    LINE,
    line.id as number,
    line,
    activeKey,
    setActiveKey,
    onPageChange,
    onAdd,
    onDelete,
  );

  return (
    <Nav.Item key={lineKey} eventKey={lineKey}>
      {lineTitle}
    </Nav.Item>
  );
};

const generateButtons = (
  type: string,
  id: string | number,
  obj: Surface | Category | Line,
  activeKey: string,
  setActiveKey: (activeKey: string) => void,
  onPageChange: (pageType: string, id: string | number) => void,
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
    <Stack
      spacing={8}
      onClick={() => {
        setActiveKey(key);
        onPageChange(type, id);
      }}
    >
      <Stack.Item>
        <div style={color}>{obj.name}</div>
      </Stack.Item>
      <Stack.Item grow={1} />
      {HIERARCHY[type] && (
        <AddButton
          type={HIERARCHY[type].child}
          parent={id}
          onAdd={onAdd}
          showText={false}
        />
      )}
      <DeleteButton
        showText={false}
        type={type}
        entity={obj}
        onDelete={onDelete}
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
            <AddButton type={SURFACE} parent="" onAdd={onAdd} />
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
