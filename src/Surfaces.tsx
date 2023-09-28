import { Divider, IconButton, Nav, Sidenav, Stack } from "rsuite";
import { CATEGORY, SURFACE, Surface } from "./db/DB";
import { Global, Table, Trash } from "@rsuite/icons";
import { useState } from "react";

/* TODO: delete a surface, category, etc with prompt via modal */
/* TODO: add modal */
/* TODO: add category/line buttons */

export const Surfaces = ({
  surfaces,
  onPageChange,
  onAdd,
}: {
  surfaces: Surface[];
  onPageChange: (pageType: string, id: string) => void;
  onAdd: (type: string, parent: string) => void;
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
        <Nav
          activeKey={active}
          onSelect={(eventKey: string) => {
            console.log(eventKey);
            setActive(eventKey);
            const [pageType, pageID] = eventKey.split("-", 2);
            onPageChange(pageType, pageID);
          }}
        >
          {surfaces.map((surface) => {
            const surfaceKey = `surface-${surface.name}`;
            const surfaceTitle = (
              <Stack spacing={8}>
                {surface.name}
                <Stack.Item grow={1} />
                <IconButton
                  appearance="primary"
                  color="green"
                  icon={<Table />}
                  onClick={(e) => {
                    e.stopPropagation();
                    onAdd(CATEGORY, surface.name);
                  }}
                />
                <IconButton
                  appearance="primary"
                  color="red"
                  icon={<Trash />}
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                />
              </Stack>
            );
            return surface.categories.length > 0 ? (
              <Nav.Menu
                key={surfaceKey}
                eventKey={surfaceKey}
                icon={<Global style={{ marginTop: "10px" }} />}
                title={surfaceTitle}
              >
                {surface.categories.map((category) =>
                  category.lines.length > 0 ? (
                    <Nav.Menu
                      key={`category-${category.id}`}
                      eventKey={`category-${category.id}`}
                      icon={<Table />}
                      title={category.name}
                    >
                      {category.lines.map((line) => (
                        <Nav.Item
                          key={`line-${line.id}`}
                          eventKey={`line-${line.id}`}
                        >
                          {line.name}
                        </Nav.Item>
                      ))}
                    </Nav.Menu>
                  ) : (
                    <Nav.Item
                      key={`category-${category.id}`}
                      eventKey={`category-${category.id}`}
                    >
                      {category.name}
                    </Nav.Item>
                  ),
                )}
              </Nav.Menu>
            ) : (
              <Nav.Item
                key={surfaceKey}
                icon={<Global style={{ marginTop: "10px" }} />}
                eventKey={surfaceKey}
              >
                {surfaceTitle}
              </Nav.Item>
            );
          })}
        </Nav>
      </Sidenav.Body>
    </Sidenav>
  );
};
