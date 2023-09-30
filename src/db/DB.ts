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
  surface: string;
  name: string;
  mostlyConsumes: boolean;
  lines: Line[];
}

export interface Line {
  id?: number;
  categoryID: number;
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

  s.forEach((surface: Surface) => {
    surface.categories.forEach((category) => {
      category.lines.sort((l1, l2) => (l1.name > l2.name ? 1 : -1));
    });
    surface.categories.sort((c1: Category, c2: Category) =>
      c1.name > c2.name ? 1 : -1,
    );
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

export const analyzeResourceUsage = (
  rawResources: Resource[],
  itemsByID: { [key: string]: Item },
  linesByID: { [key: number]: Line },
): {
  resourceProductionRates: { [key: string]: number };
  itemsSeen: Item[];
  linesByResource: { [key: string]: Line[] };
} => {
  // Calculate each resource's production/consumption
  const resourceProductionRates: { [key: string]: number } = {};
  // Track each unique resource seen in the lines
  const itemsSeen: Set<Item> = new Set();
  // Track each line where a resource is produced or consumed
  const linesByResource: { [key: string]: Line[] } = {};
  rawResources.forEach((resource) => {
    itemsSeen.add(itemsByID[resource.item]);
    resourceProductionRates[resource.item] =
      resourceProductionRates?.[resource.item] +
      (resource.isConsumed ? -1 : 1) * resource.quantityPerSec;
    linesByResource[resource.item] = [
      ...(linesByResource?.[resource.item] || []),
      linesByID[resource.lineID],
    ];
  });

  const sortedItems = Array.from(itemsSeen);
  sortedItems.sort((i1, i2) => (i1.name > i2.name ? 1 : -1));

  return {
    resourceProductionRates,
    itemsSeen: sortedItems,
    linesByResource,
  };
};

export const add = (
  type: string,
  parent: string | number,
  name: string,
  onComplete: () => void,
  setError: (text: string) => void,
  mostlyConsumes?: boolean,
) => {
  switch (type) {
    case SURFACE:
      db.surfaces
        .add({ name })
        .catch((e) => setError(`Failed to add surface: ${e}`));
      break;
    case CATEGORY:
      db.categories
        .add({
          name,
          surface: parent as string,
          mostlyConsumes: mostlyConsumes ?? true,
        })
        .catch((e) => setError(`Failed to add category: ${e}`));
      break;
    case LINE:
      db.lines
        .add({ name, categoryID: parent as number })
        .catch((e) => setError(`Failed to add line: ${e}`));
      break;
    case RESOURCE:
      db.resources
        .add({
          lineID: parent as number,
          item: name,
          quantityPerSec: 0,
          isConsumed: mostlyConsumes as boolean,
        })
        .catch((e) => setError(`Failed to add resource: ${e}`));
      break;
  }

  onComplete();
};

export const addSurface = (name: string) => db.surfaces.add({ name });

export const updateCategoryConsumes = (
  categoryID: number,
  mostlyConsumes: boolean,
  onError: (e: string) => void,
) => {
  db.categories
    .update(categoryID, { mostlyConsumes })
    .catch((e) => onError(`Failed to update category consumes: ${e}`));
};

export const updateResourceItem = (
  resourceID: number,
  item: string,
  onError: (e: string) => void,
) => {
  db.resources
    .update(resourceID, { item })
    .catch((e) => onError(`Failed to update resource item: ${e}`));
};

export const updateResourceQuantity = (
  resourceID: number,
  quantityPerSec: number,
  onError: (e: string) => void,
) => {
  db.resources
    .update(resourceID, { quantityPerSec })
    .catch((e) => onError(`Failed to update resource quantity: ${e}`));
};

export const updateResourceConsumed = (
  resourceID: number,
  isConsumed: boolean,
  onError: (e: string) => void,
) => {
  db.resources
    .update(resourceID, { isConsumed })
    .catch((e) => onError(`Failed to update resource consumes: ${e}`));
};

export const renameEntry = (
  type: string,
  id: string | number,
  name: string,
  onComplete: () => void,
  setError: (error: string) => void,
) => {
  switch (type) {
    case SURFACE:
      db.surfaces
        .update(id, { name })
        .catch((e) => setError(`Failed to rename surface: ${e}`));
      break;
    case CATEGORY:
      db.categories
        .update(id, { name })
        .catch((e) => setError(`Failed to rename category: ${e}`));
      break;
    case LINE:
      db.lines
        .update(id, { name })
        .catch((e) => setError(`Failed to rename line: ${e}`));
      break;
  }

  onComplete();
};

export const deleteEntry = (
  type: string,
  id: string | number,
  onComplete: () => void,
  setError: (error: string) => void,
) => {
  switch (type) {
    case SURFACE:
      deleteSurface(id as string, (e) =>
        setError(`Failed to remove surface: ${e}`),
      );
      break;
    case CATEGORY:
      deleteCategory(id as number, (e) =>
        setError(`Failed to remove category: ${e}`),
      );
      break;
    case LINE:
      deleteLine(id as number, (e) => setError(`Failed to remove line: ${e}`));
      break;
    case RESOURCE:
      deleteResource(id as number, (e) =>
        setError(`Failed to remove resource: ${e}`),
      );
  }

  onComplete();
};

export const deleteSurface = async (
  name: string,
  onError: (e: Error) => void,
): Promise<string | number | void> => {
  const categories = db.categories.where({ surface: name });
  const categoryIDs = (await categories.toArray()).map((c) => c.id as number);
  const lines = db.lines.where("categoryID").anyOf(categoryIDs);
  const lineIDs = (await lines.toArray()).map((l) => l.id as number);

  return db.transaction(
    "rw",
    db.surfaces,
    db.categories,
    db.lines,
    db.resources,
    async () =>
      // To avoid losing references, need to reverse the chain of references
      // Above references are stale, so need to re-run queries again for deletion
      db.resources
        .where("lineID")
        .anyOf(lineIDs)
        .delete()
        .then(() =>
          db.lines
            .where("id")
            .anyOf(lineIDs)
            .delete()
            .then(() =>
              db.categories
                .where("id")
                .anyOf(categoryIDs)
                .delete()
                .then(() => db.surfaces.delete(name).catch(onError))
                .catch(onError),
            )
            .catch(onError),
        )
        .catch(onError),
  );
};

export const deleteCategory = async (
  id: number,
  onError: (e: Error) => void,
): Promise<number | string | void> => {
  const lines = db.lines.where({
    categoryID: id,
  });
  const lineIDs = (await lines.toArray()).map((l) => l.id as number);

  return db.transaction("rw", db.categories, db.lines, db.resources, async () =>
    // To avoid losing references, need to reverse the chain of references
    db.resources
      .where("lineID")
      .anyOf(lineIDs)
      .delete()
      .then(() =>
        db.lines
          .where("id")
          .anyOf(lineIDs)
          .delete()
          .then(() => db.categories.delete(id).catch(onError))
          .catch(onError),
      )
      .catch(onError),
  );
};

export const deleteLine = async (
  id: number,
  onError: (e: Error) => void,
): Promise<number | string | void> => {
  return db.transaction("rw", db.categories, db.lines, db.resources, async () =>
    // To avoid losing references, need to reverse the chain of references
    db.resources
      .where({ lineID: id })
      .delete()
      .then(() => db.lines.delete(id).catch(onError))
      .catch(onError),
  );
};

export const deleteResource = async (id: number, onError: (e: Error) => void) =>
  db.resources.delete(id).catch(onError);
