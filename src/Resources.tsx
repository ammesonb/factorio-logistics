import { Divider, Loader, Nav, Sidenav } from "rsuite";
import { Item } from "./db/DB";
import { useState } from "react";

export const Resources = ({
  items,
  onPageChange,
}: {
  items: Item[];
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
        {items.length > 0 && !items[0] ? (
          <Loader center inverse size="lg" />
        ) : (
          <Nav
            activeKey={active}
            onSelect={(eventKey: string) => {
              setActive(eventKey);
              const [pageType, ...pageID] = eventKey.split("-");
              onPageChange(pageType, pageID.join("-"));
            }}
          >
            {items.map((item) => (
              <Nav.Item
                key={`resource-${item.internalName}`}
                eventKey={`resource-${item.internalName}`}
                icon={
                  <img
                    src={item.icon}
                    height={32}
                    style={{ marginRight: "3%" }}
                  />
                }
                style={{ paddingLeft: "8%" }}
              >
                {item.name}
              </Nav.Item>
            ))}
          </Nav>
        )}
      </Sidenav.Body>
    </Sidenav>
  );
};
