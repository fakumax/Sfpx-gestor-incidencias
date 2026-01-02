
export default class ItemEmail {

    public Codigo: string;
    public Flujo: string;
    public To: string[];
    public From: string;
    public Cc: string[];
    public Cco: string[];
    public Subject: string;
    public Body: string;

    constructor(item: any) {
        this.Codigo = item.Codigo || '';
        this.Flujo = item.Flujo || '';
        this.To = item.TO ? item.TO.split(",").map((email: string) => email.trim()) : [];
        this.From = item.FROM || '';
        this.Cc = item.CC ? item.CC.split(",").map((email: string) => email.trim()) : [];
        this.Cco = item.CCO ? item.CCO.split(",").map((email: string) => email.trim()) : [];
        this.Subject = item.SUBJECT || '';
        this.Body = item.BODY || '';

    }

}