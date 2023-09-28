import { Divider, Nav, Sidenav } from "rsuite";
import { Item, Resource } from "./db/DB";
import { useState } from "react";

export const Resources = ({
  items,
  resources,
  onPageChange,
}: {
  items: { [key: string]: Item };
  resources: Resource[];
  onPageChange: (pageType: string, id: string) => void;
}) => {
  const [active, setActive] = useState("surface-nauvis");

  return (
    <Sidenav>
      <Sidenav.Header style={{ padding: "5% 5% 0% 5%" }}>
        <h3>Resources</h3>
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
          {resources.map((resource) => {
            return (
              <Nav.Item
                key={`resource-${resource.item}`}
                eventKey={`surface-${resource.item}`}
                icon={<img src={items[resource.item].icon} height={32} />}
              >
                {items[resource.item].name}
              </Nav.Item>
            );
          })}
        </Nav>
      </Sidenav.Body>
    </Sidenav>
  );
};
