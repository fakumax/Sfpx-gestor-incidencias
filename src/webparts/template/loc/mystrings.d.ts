declare interface ITemplateWebPartStrings {
	PropertyPaneDescription: string;
	BasicGroupName: string;
	DescriptionFieldLabel: string;
	ListFieldLabel: string;
	LoadingText: string;
	SuccessText: string;
	ErrorText: string;
}

declare module 'TemplateWebPartStrings' {
	const strings: ITemplateWebPartStrings;
	export = strings;
}
