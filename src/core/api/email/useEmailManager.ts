import { useReducer } from 'react';
import { createReducer } from '../../../core/utils';
import Email from "../../entities/Email";
import EmailManager from './EmailManager';
import IEmailManager from './IEmailManager';
import { IAcciones, IAnormalidades, IForm } from '../../../webparts/obiras/components/Formulario/IFormulario';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { Proveedor } from '../../entities';
import { useUserContext } from '../../context/UserContext';

const LOAD = 'LOAD';
const ERROR = 'ERROR';
const SEND = 'SEND';

export interface IDatasourceState {
	isLoading: boolean;
	error: {
		hasError: boolean;
		errorCode: number;
	};
}

export type DatasourceHook = [
	IDatasourceState,
	(codigo: string, obira: IForm, acciones: IAcciones[], anormalidades: IAnormalidades[], obiraId: number, context: WebPartContext, proveedor: Proveedor) => Promise<void>,
	(codigo: string, to: string[], obira: IForm, acciones: IAcciones[], anormalidades: IAnormalidades[], obiraId: number, context: WebPartContext, proveedor: Proveedor) => Promise<void>
];

export default function useEmailManager(): DatasourceHook {
	const {sendEmailObj} = useUserContext();
	const datasource: IEmailManager<Email> = new EmailManager(sendEmailObj);

	const datasourceReducer = createReducer<IDatasourceState>({
		[LOAD]: (state) => ({ ...state, isLoading: true, error: { hasError: false, errorCode: null } }),
		[ERROR]: (state, action) => ({ ...state, error: { hasError: true, errorCode: action.payload }, isLoading: false }),
		[SEND]: (state, action) => ({ ...state, error: { hasError: false, errorCode: null }, isLoading: false }),
	});

	const [datasourceState, dispatch] = useReducer(datasourceReducer, { isLoading: false, error: { hasError: false, errorCode: null } });

	const handleAsync = (asyncFn: (...args: any[]) => Promise<void>) => (
		async (...args: any[]) => {
			try {
				await asyncFn(...args);
			} catch (error) {
				console.log(error)
				dispatch({ type: ERROR, payload: error.status });
			}
		}
	);

	const send = handleAsync(async (codigo: string, obira: IForm, acciones: IAcciones[], anormalidades: IAnormalidades[], obiraId: number, context: WebPartContext, proveedor: Proveedor) => {
		dispatch({ type: LOAD });
		const nivelIdResult = await datasource.sendEmail(codigo, obira, acciones, anormalidades, obiraId, context, proveedor);
		dispatch({ type: SEND, payload: send });
	});

	const sendTo = handleAsync(async (codigo: string, to: string[], obira: IForm, acciones: IAcciones[], anormalidades: IAnormalidades[], obiraId: number, context: WebPartContext, proveedor: Proveedor) => {
		dispatch({ type: LOAD });
		const nivelIdResult = await datasource.sendEmailTo(codigo, to, obira, acciones, anormalidades, obiraId, context, proveedor);
		dispatch({ type: SEND, payload: sendTo });
	});

	return [datasourceState, send, sendTo];
}
