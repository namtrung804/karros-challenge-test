import {MenuItem} from './menu-item';

export class Menu {
  id: number = -1;
  title: string = '';
  handle: string = '';
  menu_item: any = [];
  constructor() {
    this.menu_item.push(new MenuItem());
  }
}
