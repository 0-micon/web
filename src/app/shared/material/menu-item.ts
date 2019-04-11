import { isArray } from 'util';

export interface MenuItem {
  name: string;
  disabled?: boolean;
  icon?: string;
  data?: string;
  children?: MenuItem[];
}

export function forEach(item: MenuItem, callback: (it: MenuItem) => void) {
  callback(item);
  if (isArray(item.children)) {
    item.children.forEach(it => forEach(it, callback));
  }
}

function createSubMenu(items: MenuItem[], obj: object) {
  for (const name of Object.keys(obj)) {
    const data = obj[name];
    if (typeof data === 'string') {
      items.push({ name, data });
    } else if (typeof data === 'object') {
      const children: MenuItem[] = [];
      createSubMenu(children, data);
      items.push({ name, children });
    }
  }
}

export function createMenu(obj: object): MenuItem[] {
  const items: MenuItem[] = [];
  createSubMenu(items, obj);
  return items;
}
