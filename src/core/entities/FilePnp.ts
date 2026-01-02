export default class FilePnp {

    public Name: string;
    public Extension: string;
    public ServerRelativeUrl: string;
    public DecodedUrl: string;
    public Length: number;
    public added: boolean = false;
    public deleted: boolean = false;

    constructor(item?: any) {

        this.Name = item?.FileName ?? "";
        this.Extension = item?.FileName?.split('.').pop() ?? "";
        this.ServerRelativeUrl = item?.ServerRelativeUrl ?? "";
        this.DecodedUrl = item?.ServerRelativePath?.DecodedUrl ?? item?.FileNameAsPath?.DecodedUrl ?? "";
        this.Length = 0;
    }



}