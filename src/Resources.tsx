import { Divider, Loader, Nav, Sidenav } from "rsuite";
import { Item, Resource } from "./db/DB";
import { useState } from "react";

export const Resources = ({
  itemsByID,
  resources,
  onPageChange,
}: {
  itemsByID: { [key: string]: Item };
  resources: Resource[];
  onPageChange: (pageType: string, id: string) => void;
}) => {
  const [active, setActive] = useState("");

  return (
    <Sidenav>
      <Sidenav.Header style={{ padding: "5% 5% 0% 5%" }}>
        <h3>Resources</h3>
      </Sidenav.Header>
      <Divider />
      <Sidenav.Body>
        {Object.keys(itemsByID).length === 0 ? (
          <Loader center inverse size="lg" />
        ) : (
          <Nav
            activeKey={active}
            onSelect={(eventKey: string) => {
              setActive(eventKey);
              const [pageType, pageID] = eventKey.split("-", 2);
              onPageChange(pageType, pageID);
            }}
          >
            {resources.map((resource) => (
              <Nav.Item
                key={`resource-${resource.id}`}
                eventKey={`surface-${resource.item}`}
                icon={
                  <img
                    src={itemsByID[resource.item].icon}
                    height={32}
                    style={{ marginRight: "3%" }}
                  />
                }
                style={{ paddingLeft: "8%" }}
              >
                {itemsByID[resource.item].name}
              </Nav.Item>
            ))}
          </Nav>
        )}
      </Sidenav.Body>
    </Sidenav>
  );
};
