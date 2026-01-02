import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
	IPropertyPaneConfiguration,
	PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { escape } from '@microsoft/sp-lodash-subset';

import * as strings from 'TemplateWebPartStrings';
import Template, { ITemplateProps } from './components/Template/Template';
import { getSP } from '../../core/pnp/sp/pnpjs-presets';

export interface ITemplateWebPartProps {
	description: string;
	listTitle: string;
}

export default class TemplateWebPart extends BaseClientSideWebPart<ITemplateWebPartProps> {

	protected async onInit(): Promise<void> {
    	await super.onInit();
		getSP(this.context);
	}

	public render(): void {
		const element: React.ReactElement<ITemplateProps> = React.createElement(
			Template,
			{
				description: escape(this.properties.description),
				listTitle: this.properties.listTitle
			}
		);

		ReactDom.render(element, this.domElement);
	}

	protected onDispose(): void {
		ReactDom.unmountComponentAtNode(this.domElement);
	}

	protected get dataVersion(): Version {
		return Version.parse('1.0');
	}

	protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
		return {
			pages: [
				{
					header: {
						description: strings.PropertyPaneDescription
					},
					groups: [
						{
							groupName: strings.BasicGroupName,
							groupFields: [
								PropertyPaneTextField('description', {
									label: strings.DescriptionFieldLabel
								}),
								PropertyPaneTextField('listTitle', {
									label: strings.ListFieldLabel
								})
							]
						}
					]
				}
			]
		};
	}
}
