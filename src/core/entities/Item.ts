import { BaseEntity } from './';
import moment from "moment";
import User from "../entities/User";

export default class Item extends BaseEntity {
	constructor(item?: any) {
		super(item);
	}

	protected mapItem(item: any): void {
		this.FechaCreacion = item.Created ? moment(item.Created).toISOString() : undefined;

		if (item.Author) {
			let user = new User(item);
			this.Creador = user;
		}

	}

	public toListItem(): any {
		return {
			...super.toListItem(),
			Created: this.FechaCreacion,
			Author: this.Creador
		};
	}

	public FechaCreacion?: string;
	public Creador?: User;
}
