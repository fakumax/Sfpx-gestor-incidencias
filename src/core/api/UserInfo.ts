import { ISiteGroupInfo, ISiteUserProps } from "@pnp/sp/presets/all";
import { SPFI } from "@pnp/sp";
import { getSP } from "../pnp/sp/pnpjs-presets";

import IDatasource from "./IDatasource";
import { Item } from "../entities";
import { _Items } from "@pnp/sp/items/types";

export default class UserInfo implements IDatasource<Item> {
  private _sp: SPFI;
  public listTitle: string;
  private selectProperties: Array<string> = [
    "Id",
    "Title",
    "Created",
    "Author/EMail",
    "Author/ID",
  ];
  private expand: Array<string> = ["Author"];

  constructor(listTitle?: string) {
    this._sp = getSP();
    this.listTitle = listTitle;
  }
  public getLoggedUser(): Promise<any> {
    return new Promise((resolve) => {
      this._sp.web
        .currentUser()
        .then((response) => {
          resolve(response);
        })
        .catch((err) => resolve(err));
    });
  }
  public GetGroupNameByLoggedUser(
    loginName: string
  ): Promise<ISiteGroupInfo[]> {
    return new Promise((resolve) => {
      this._sp.web.siteUsers
        .getByLoginName(loginName)
        .select("Id")()
        .then((user) => {
          this._sp.web.siteUsers
            .getById(user.Id)
            .groups()
            .then((response) => {
              resolve(response);
            })
            .catch((err) => resolve(err));
        })
        .catch((err) => resolve(err));
    });
  }
  public async getItems(): Promise<Array<Item>> {
    const items: any[] = await this._sp.web.lists
      .getByTitle(this.listTitle)
      .items.select(...this.selectProperties)
      .expand(...this.expand)();
    return items.map((item) => new Item(item));
  }
  public async getUserSite(): Promise<Array<ISiteUserProps>> {
    const users = await this._sp.web.siteUsers();
    return users;
  }
  public add(item: Item): Promise<Item> {
    const listItem = item.toListItem();

    //Agrega el elemento desde SP con el usuario en curso.
    return this._sp.web.lists
      .getByTitle(this.listTitle)
      .items.add(listItem)
      .then((result) => {
        return this.getById(result.data.ID).then((itemAdd: Item) => {
          return itemAdd;
        });
      });
  }

  public edit(item: Item): Promise<Item> {
    const listItem = item.toListItem();
    return this._sp.web.lists
      .getByTitle(this.listTitle)
      .items.getById(item.Id)
      .update(listItem)
      .then(() => {
        return this.getById(item.Id);
      });
  }

  public delete(itemId: number): Promise<void> {
    return this._sp.web.lists
      .getByTitle(this.listTitle)
      .items.getById(itemId)
      .delete();
  }

  public async getById(itemId: number): Promise<Item> {
    return this._sp.web.lists
      .getByTitle(this.listTitle)
      .items.getById(itemId)
      .select(...this.selectProperties)
      .expand(...this.expand)()
      .then((item) => new Item(item));
  }

  public getUsersFromGroup(groupName: string): Promise<ISiteUserProps[]> {
    return new Promise((resolve, reject) => {
      this._sp.web.siteGroups
        .getByName(groupName)
        .users()
        .then((response) => {
          resolve(response);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  public async getUserById(id: number): Promise<ISiteUserProps> {
    return new Promise((resolve) => {
      this._sp.web.siteUsers
        .getById(id)()
        .then((response) => resolve(response))
        .catch((err) => resolve(err));
    });
  }
  public async getSiteOwnerGroup(): Promise<string> {
    try {
      const associatedGroups = await this._sp.web.associatedOwnerGroup();
      return associatedGroups.Title;
    } catch (error) {
      console.error("Error getting owner group:", error);
      throw error;
    }
  }

  public async ensureUserId(userLoginName: string): Promise<number | null> {
    try {
      const spUser = await this._sp.web.ensureUser(userLoginName);
      return spUser.Id;
    } catch (error) {
      console.error("Error ensuring user:", error);
      return null;
    }
  }
}
