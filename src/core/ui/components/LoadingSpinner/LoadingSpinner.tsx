import * as React from "react";
import { Spinner, SpinnerSize } from '@fluentui/react/lib/Spinner';

const LoadingSpinner: React.FunctionComponent = () => (
	<Spinner size={SpinnerSize.large} label='Por favor espere...' ariaLive='assertive' />
);
export default LoadingSpinner;
