import Dexie, { Table } from "dexie";

const DB_NAME = "FactorioLogistics";

export const SURFACE = "surface";
export const CATEGORY = "category";
export const LINE = "line";
export const RESOURCE = "resource";

export interface Item {
  internalName: string;
  name: string;
  icon: string;
}

export interface ISurface {
  name: string;
}

export interface ICategory {
  id?: string;
  surface: string;
  name: string;
  mostlyConsumes: boolean;
}

export interface ILine {
  id?: string;
  categoryID: string;
  name: string;
}

export interface Resource {
  id?: string;
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

export interface Surface {
  name: string;
  categories: Category[];
}

export interface Category {
  id?: string;
  name: string;
  mostlyConsumes: boolean;
  lines: Line[];
}

export interface Line {
  id?: string;
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
    categoriesByID[category?.id as string] = category;
  });

  rawLines.forEach((dbLine) => {
    const line = { ...dbLine, resources: [] };
    categoriesByID[line.categoryID].lines.push(line);
    linesByID[line?.id as string] = line;
  });

  rawResources.forEach((dbRes) => {
    linesByID[dbRes.lineID].resources.push(dbRes);
  });
  return s;
};

export const memoizeCategories = (
  categories: ICategory[],
): { [key: string]: ICategory } => {
  const byID: { [key: string]: ICategory } = {};
  categories.forEach((category) => (byID[category?.id as string] = category));
  return byID;
};

export const memoizeLines = (lines: ILine[]): { [key: string]: ILine } => {
  const byID: { [key: string]: ILine } = {};
  lines.forEach((line) => (byID[line?.id as string] = line));
  return byID;
};

export const analyzeResourceUsage = (rawResources: Resource[]) => {
  // Calculate each resource's production/consumption
  const byID: { [key: string]: number } = {};
  // Track each unique resource seen in the lines
  const resourcesSeen: Set<Resource> = new Set();
  // Track each line where a resource is produced or consumed
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

export const addCategory = (
  name: string,
  surface: string,
  mostlyConsumes: boolean,
) => db.categories.add({ name, surface, mostlyConsumes });

export const addLine = (name: string, categoryID: string) =>
  db.lines.add({ name, categoryID });
