import * as React from "react";
import { Spinner, SpinnerSize } from '@fluentui/react/lib/Spinner';
import styles from "./LoadingSpinner.module.scss";

interface ILoadingSpinnerProps {
	isLoading: boolean;
}

const LoadingSpinner: React.FunctionComponent<ILoadingSpinnerProps> = ({ isLoading }) => {
	if (isLoading) {
		return (
			<div className={styles.Loading}>
				<Spinner 
					size={SpinnerSize.large} 
					label='Por favor espere...' 
					ariaLive='assertive' 
					styles={{
							label:{
								color:"white"
							}, 
							circle:{
								borderTopColor: "white",
								borderRightColor: "white",
								borderBottomColor: "white",
								borderLeftColor: "transparent"
							}
					}}
				/>
			</div>
		)
	}
	return null;
};
export default LoadingSpinner;
