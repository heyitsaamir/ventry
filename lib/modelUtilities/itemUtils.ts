import { InventoryState } from "../../Store/inventory";
import { ContainerItem, Item } from "../../Store/types";

export const getParentPath = (item: Item, inventoryState: InventoryState) => {
  let container = item;
  const parentNames: string[] = []
  while (container.parentId !== 'x') {
    container = inventoryState.items[container.parentId];
    parentNames.unshift(container.name);
  }

  return parentNames;
}

export const getNumberOfItemsInside = (item: ContainerItem, inventoryState: InventoryState) => {
  return item.itemsInside.map((itemId) => inventoryState.items[itemId]).reduce((total, item) => {
    if (item.type === 'NonContainer') {
      return total + item.quantity;
    } else {
      return total + 1 + getNumberOfItemsInside(item, inventoryState);
    }
  }, 0)
}