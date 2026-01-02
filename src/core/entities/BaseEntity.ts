export default abstract class BaseEntity {
	constructor(item?: any) {
		if (item != null) {
			if (item.Id) {
				this.Id = item.Id;
			}
			this.Title = item.Title || '';
			this.Modified = item.Modified ? item.Modified : "";
			this.Created = item.Created ? item.Created : "";
			this.mapItem(item);
		}
	}

	protected abstract mapItem(item: any): void;

	public toListItem(): any {
		return {
			Id: this.Id,
			Title: this.Title
		};
	}

	public Id?: number;
	public Title: string;
	public Modified: Date;
	public Created: Date;
}
