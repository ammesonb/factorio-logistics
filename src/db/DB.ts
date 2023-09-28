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
  id?: number;
  surface: string;
  name: string;
  mostlyConsumes: boolean;
}

export interface ILine {
  id?: number;
  categoryID: number;
  name: string;
}

export interface Resource {
  id?: number;
  lineID: number;
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
  id?: number;
  name: string;
  mostlyConsumes: boolean;
  lines: Line[];
}

export interface Line {
  id?: number;
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
  const categoriesByID: { [key: number]: Category } = {};
  const linesByID: { [key: number]: Line } = {};

  rawCategories.forEach((dbCat) => {
    const category = { ...dbCat, lines: [] };
    surfacesByName[category.surface].categories.push(category);
    categoriesByID[category?.id as number] = category;
  });

  rawLines.forEach((dbLine) => {
    const line = { ...dbLine, resources: [] };
    categoriesByID[line.categoryID].lines.push(line);
    linesByID[line?.id as number] = line;
  });

  rawResources.forEach((dbRes) => {
    linesByID[dbRes.lineID].resources.push(dbRes);
  });
  return s;
};

export const memoizeCategories = (
  categories: ICategory[],
): { [key: number]: ICategory } => {
  const byID: { [key: string]: ICategory } = {};
  categories.forEach((category) => (byID[category?.id as number] = category));
  return byID;
};

export const memoizeLines = (lines: ILine[]): { [key: number]: ILine } => {
  const byID: { [key: number]: ILine } = {};
  lines.forEach((line) => (byID[line?.id as number] = line));
  return byID;
};

export const analyzeResourceUsage = (rawResources: Resource[]) => {
  // Calculate each resource's production/consumption
  const byName: { [key: string]: number } = {};
  // Track each unique resource seen in the lines
  const resourcesSeen: Set<Resource> = new Set();
  // Track each line where a resource is produced or consumed
  const linesByResource: { [key: string]: number[] } = {};
  rawResources.forEach((resource) => {
    resourcesSeen.add(resource);
    byName[resource.item] =
      byName?.[resource.item] +
      (resource.isConsumed ? -1 : 1) * resource.quantityPerSec;
    linesByResource[resource.item] = [
      ...(linesByResource?.[resource.item] || []),
      resource.lineID,
    ];
  });

  return { byName, resourcesSeen: Array.from(resourcesSeen), linesByResource };
};

export const addSurface = (name: string) => db.surfaces.add({ name });

export const addCategory = (
  name: string,
  surface: string,
  mostlyConsumes: boolean,
) => db.categories.add({ name, surface, mostlyConsumes });

export const addLine = (name: string, categoryID: number) =>
  db.lines.add({ name, categoryID });
