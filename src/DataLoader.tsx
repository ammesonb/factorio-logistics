import { useLiveQuery } from "dexie-react-hooks";
import { useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import {
  Button,
  Col,
  Container,
  Grid,
  Loader,
  Message,
  Panel,
  Row,
  Stack,
  Tag,
  TagGroup,
  Tooltip,
  Uploader,
  Whisper,
} from "rsuite";
import { FileType } from "rsuite/esm/Uploader";
import { db, Item } from "./db/DB";
import { ImportExportModal } from "./ImportExportModal";

export const DataLoader = ({ setLoaded }: { setLoaded: () => void }) => {
  const [error, setError] = useState("");
  const items = useLiveQuery(() => db.items.toArray(), [], null);
  const allIconsPresent = useMemo(
    () => items?.filter((item: Item) => item.icon.length === 0).length === 0,
    [items],
  );

  const helpText = useMemo(
    () =>
      items?.length === 0
        ? "Please add items"
        : allIconsPresent
        ? ""
        : "One or more items are missing icons",
    [items, allIconsPresent],
  );

  const addItems = useMemo(
    () =>
      (file: FileType): boolean => {
        file.blobFile?.text().then((data: string) => {
          const newItems = JSON.parse(data);
          if (!Object.keys(newItems).includes("names")) {
            setError(
              "Uploaded item locale file did not include `names` property",
            );
          } else {
            // Some names have colors in them, it seems - fluids in particular
            db.items.bulkPut(
              Object.entries(newItems["names"])
                .filter(([name]) => !name.startsWith("YARM-fake-"))
                // Filter out primitives that are undesired
                .filter(
                  ([name]) =>
                    !["tree", "rock", "ruin"].includes(name.toLowerCase()),
                )
                .map(([internalName, display]) => ({
                  internalName,
                  name: (display as string).split("[color")[0],
                  icon: "",
                })),
            );
          }
        });

        return false;
      },
    [setError],
  );

  const addIcons = useMemo(
    () =>
      (file: FileType): boolean => {
        const r = new FileReader();
        r.onloadend = () =>
          db.items.update((file.name as string).replace(".png", ""), {
            icon: r.result,
          });
        r.readAsDataURL(file.blobFile as File);

        return false;
      },
    [setError],
  );

  const [importOpen, setImportOpen] = useState(false);

  return (
    <Container>
      {error && (
        <Message type="error" style={{ marginBottom: "1%" }}>
          {error}
        </Message>
      )}
      <ImportExportModal
        open={importOpen}
        onClose={() => setImportOpen(false)}
        isExporting={false}
      />
      <Grid fluid style={{ width: "80%" }}>
        <Row>
          <Col md={18} mdOffset={3}>
            <Panel bordered>
              <>
                <ReactMarkdown>{`## Instructions
1. You will need to generate some sources from Factorio for this tool to work
    - Reference their [command line parameters](https://wiki.factorio.com/Command_line_parameters) page as needed
2. Upload the outputted item JSON using the button below
3. Upload icons from the Factorio output (supports multi-select)

### Generating Factorio sources
1. Locate your factorio executable and run the following commands
  - \`<factorio executable> --dump-prototype-locale\`
  - \`<factorio executable> --dump-icon-sprites\`
  - Note for steam, you may need to use the following: \`<steam executable> -applaunch 427520 --dump-<etc>\` instead
  - If there are errors in the \`factorio-current.log\` file, that may prevent export

    You may need to lower graphics quality to "normal" if it is set to "high", depending on installed mods

2. Locate your script-output directory, which should be in your [user data directory](https://wiki.factorio.com/Application_directory#Locations)
3. Upload the \`item-locale.json\` and \`fluid-locale.json\` files using the "Upload Items" button
4. Upload the \`item\` and \`fluid\` directories for corresponding icons
5. Check all expected icons present ("Done" button should be green or yellow)
              `}</ReactMarkdown>

                <br />
                <Stack direction="row" spacing={12}>
                  <Uploader
                    accept="application/json"
                    action=""
                    fileListVisible={false}
                    shouldUpload={addItems}
                  >
                    <Button appearance="primary" color="blue">
                      Upload Items
                    </Button>
                  </Uploader>
                  <Uploader
                    accept="image/png"
                    action=""
                    multiple
                    fileListVisible={false}
                    shouldUpload={addIcons}
                  >
                    <Button appearance="primary" color="blue">
                      Upload Icons
                    </Button>
                  </Uploader>

                  <Button
                    appearance="primary"
                    color="green"
                    onClick={() => setImportOpen(true)}
                  >
                    Import
                  </Button>
                </Stack>
              </>
            </Panel>
          </Col>
        </Row>

        <Row style={{ marginTop: "1%" }}>
          <Stack spacing={24}>
            <Stack.Item grow={1} />
            <Button
              appearance="primary"
              color="red"
              size="lg"
              onClick={() => db.items.clear()}
              disabled={items?.length === 0}
            >
              Clear Items
            </Button>
            <Whisper
              placement="right"
              trigger="hover"
              speaker={<Tooltip>{helpText}</Tooltip>}
            >
              <Button
                appearance="primary"
                color={
                  (items?.length || 0) > 0
                    ? allIconsPresent
                      ? "green"
                      : "yellow"
                    : "red"
                }
                size="lg"
                onClick={setLoaded}
                disabled={items?.length === 0}
              >
                Done
              </Button>
            </Whisper>
            <Stack.Item grow={1} />
          </Stack>
        </Row>
      </Grid>
      <br />
      <Panel header={<h3>Loaded items</h3>}>
        {items === null && <Loader size="lg" inverse />}
        <TagGroup>
          {items?.map((item) => (
            <Whisper
              key={item.internalName}
              placement="top"
              trigger="hover"
              speaker={<Tooltip>{item.internalName}</Tooltip>}
            >
              <Tag
                color={item.icon === "" ? "red" : "green"}
                closable
                onClose={() => db.items.delete(item.internalName)}
              >
                {item.icon.length > 0 && <img height={32} src={item.icon} />}
                {item.name}
              </Tag>
            </Whisper>
          ))}
        </TagGroup>
      </Panel>
    </Container>
  );
};
