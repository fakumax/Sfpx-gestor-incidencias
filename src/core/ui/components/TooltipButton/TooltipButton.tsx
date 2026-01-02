
import * as React from 'react';
import { TooltipHost, ITooltipHostStyles, Icon } from '@fluentui/react';

import styles from './TooltipButton.module.scss';

export interface ITooltipButtonProps {
	title: string;
	iconName: string;
	onClick?: () => void;
	className?: string;
}

const hostStyles: Partial<ITooltipHostStyles> = { root: { display: 'inline-block' } };

const TooltipButton: React.FunctionComponent<ITooltipButtonProps> = ({ title, iconName, onClick, className }) => (
	<TooltipHost content={title} styles={hostStyles}>
		<button className={`${styles.tooltipButton} ${className}`} onClick={onClick}>
			<Icon className={styles.icon} iconName={iconName} />
		</button>
	</TooltipHost>
);

export default TooltipButton;
