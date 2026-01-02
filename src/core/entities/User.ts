export default class User {
    public Id: number;
    public EMail: string;
    public Name?: string;

    constructor(item: any) {
        this.Id = item?.ID || item?.Id || item?.id || 0;
        this.EMail = item?.EMail || item?.secondaryText || '';
        this.Name = item?.Title || item?.Name || '';
    }
}