import { Divider, IconButton, Nav, Sidenav, Stack } from "rsuite";
import { Surface } from "./db/DB";
import { Global, Table } from "@rsuite/icons";
import { useState } from "react";

export const Surfaces = ({
  surfaces,
  onPageChange,
}: {
  surfaces: Surface[];
  onPageChange: (pageType: string, id: string) => void;
}) => {
  const [active, setActive] = useState("surface-nauvis");
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
            <IconButton icon={<Global />} appearance="primary" color="green">
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
            setActive(eventKey);
            const [pageType, pageID] = eventKey.split("-", 2);
            onPageChange(pageType, pageID);
          }}
        >
          {surfaces.map((surface) =>
            surface.categories.length > 0 ? (
              <Nav.Menu
                key={`surface-${surface.name}`}
                eventKey={`surface-${surface.name}`}
                icon={<Global />}
                title={surface.name}
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
                key={`surface-${surface.name}`}
                icon={<Global />}
                eventKey={`surface-${surface.name}`}
              >
                {surface.name}
              </Nav.Item>
            ),
          )}
        </Nav>
      </Sidenav.Body>
    </Sidenav>
  );
};
