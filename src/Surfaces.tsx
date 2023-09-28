import { useState } from "react";
import { Nav, Sidenav } from "rsuite";
import { Surface } from "./db/DB";
import { Global, Table } from "@rsuite/icons";

export const Surfaces = ({
  surfaces,
  onPageChange,
}: {
  surfaces: Surface[];
  onPageChange: (pageType: string, id: string) => void;
}) => {
  const [expanded, setExpand] = useState(true);

  return (
    <Sidenav expanded={expanded} defaultOpenKeys={["Nauvis"]}>
      <Sidenav.Body>
        <Nav>
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
      <Sidenav.Toggle onToggle={setExpand} />
    </Sidenav>
  );
};
