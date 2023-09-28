import Dexie, { Table } from "dexie";

const DB_NAME = "FactorioLogistics";

export interface Item {
  internalName: string;
  name: string;
  icon: string;
}

interface ISurface {
  name: string;
}

interface ICategory {
  id: string;
  surface: string;
  name: string;
  mostlyConsumes: boolean;
}

interface ILine {
  id: string;
  categoryID: string;
  name: string;
}

export interface Resource {
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
  resources!: Table<Resource>;

  constructor() {
    super(DB_NAME);
    this.version(1).stores({
      items: "internalName, name",
      surfaces: "name",
      categories: "++id, surface, name",
      lines: "++id, categoryID, name",
      resources: "++id, lineID, item",
    });
  }
}

export const db = new LogisticsDB();
db.surfaces.get("Nauvis").then((n) => {
  if (n === undefined) {
    db.surfaces.add({ name: "Nauvis" });
  }
});

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

export interface Surface {
  name: string;
  categories: Category[];
}

export interface Category {
  id: string;
  name: string;
  mostlyConsumes: boolean;
  lines: Line[];
}

export interface Line {
  id: string;
  name: string;
  resources: Resource[];
}

export const parseDBData = (
  rawSurfaces: ISurface[],
  rawCategories: ICategory[],
  rawLines: ILine[],
  rawResources: Resource[],
): Surface[] => {
  // First initialize "real" surfaces
  const s = [...rawSurfaces].map((s) => ({ ...s, categories: [] }));

  const surfacesByName: { [key: string]: Surface } = {};
  s.forEach((surface) => (surfacesByName[surface.name] = surface));

  // Then populate categories, lines, and resources
  const categoriesByID: { [key: string]: Category } = {};
  const linesByID: { [key: string]: Line } = {};

  rawCategories.forEach((dbCat) => {
    const category = { ...dbCat, lines: [] };
    surfacesByName[category.surface].categories.push(category);
    categoriesByID[category.id] = category;
  });

  rawLines.forEach((dbLine) => {
    const line = { ...dbLine, resources: [] };
    categoriesByID[line.categoryID].lines.push(line);
    linesByID[line.id] = line;
  });

  rawResources.forEach((dbRes) => {
    linesByID[dbRes.lineID].resources.push(dbRes);
  });
  return s;
};

export const analyzeResourceUsage = (rawResources: Resource[]) => {
  const byID: { [key: string]: number } = {};
  const resourcesSeen: Set<Resource> = new Set();
  const linesByResource: { [key: string]: string[] } = {};
  rawResources.forEach((resource) => {
    resourcesSeen.add(resource);
    byID[resource.item] =
      byID?.[resource.item] +
      (resource.isConsumed ? -1 : 1) * resource.quantityPerSec;
    linesByResource[resource.item] = [
      ...(linesByResource?.[resource.item] || []),
      resource.lineID,
    ];
  });

  return { byID, resourcesSeen: Array.from(resourcesSeen), linesByResource };
};

export const addSurface = (name: string) => db.surfaces.add({ name });
