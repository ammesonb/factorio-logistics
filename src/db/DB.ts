import Dexie, { Table } from "dexie";

const DB_NAME = "FactorioLogistics";

export interface Item {
  internalName: string;
  name: string;
  icon: string;
}

interface ISurface {
  id: string;
  name: string;
}

interface ICategory {
  id: string;
  surfaceID: string;
  name: string;
  mostlyConsumes: boolean;
}

interface ILine {
  id: string;
  categoryID: string;
  name: string;
}

interface IResource {
  id: string;
  lineID: string;
  item: string;
  quantityPerSec: number;
  isConsumed: boolean;
}

class LogisticsDB extends Dexie {
  items!: Table<Item>;
  surfaces!: Table<ISurface>;
  categories!: Table<ICategory>;
  lines!: Table<ILine>;
  resources!: Table<IResource>;

  constructor() {
    super(DB_NAME);
    this.version(1).stores({
      items: "internalName, name",
      surfaces: "++id, name",
      categories: "++id, surfaceID, name",
      lines: "++id, categoryID, name",
      resources: "++id, lineID, item",
    });
  }
}

export const db = new LogisticsDB();

/*
export const DB_CONFIG = {
  name: DB_NAME,
  version: 1,
  objectStoresMeta: [
    {
      store: ICON_STORE,
      storeConfig: {keyPath: "name", autoIncrement: false},
      storeSchema: [
        {name: "name", keypath: "name", options: {unique: true}},
        {name: "icon", keypath: "icon", options: {unique: false}},
      ]
    },
    {
    store: SURFACE_STORE,
    storeConfig: {keyPath: "id", autoIncrement: true},
      storeSchema: [
        {name: "name", keypath: "name", options: {unique: true}},
      ],
    }, {
    store: CATEGORY_STORE,
    storeConfig: {keyPath: "id", autoIncrement: true},
      storeSchema: [
        {name: "surface", keypath: "surface_id", options: {unique: false}},
        {name: "name", keypath: "name", options: {unique: false}},
        {name: "mostlyConsumes", keypath: "mostly_consumes", options: {unique: false}},
      ],
    }, {
    store: LINE_STORE,
    storeConfig: {keyPath: "id", autoIncrement: true},
      storeSchema: [
        {name: "category", keypath: "category_id", options: {unique: false}},
        {name: "name", keypath: "name", options: {unique: false}},
      ],
    }, {
    store: RESOURCE_STORE,
    storeConfig: {keyPath: "id", autoIncrement: true},
      storeSchema: [
        {name: "item", keypath: "item_name", options: {unique: false}},
        {name: "quantityPerSec", keypath: "quantity_per_second", options: {unique: false}},
        {name: "isConsumed", keypath: "item_is_consumed", options: {unique: false}},
      ],
    }
  ],
}
*/
