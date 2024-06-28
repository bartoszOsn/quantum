import { ReactNode, useState } from 'react';
import { Store } from '../Store';
import { StoreImpl } from '../StoreImpl';
import { StoreContext } from '../StoreContext';
import { useSubscribedAtoms } from '../useSubscribedAtoms';
import { ATOM_ID_STRINGIFIED_SYMBOL } from '../atom-symbols';

export const QuantumRoot = (props: { children: ReactNode }): ReactNode => {
	const [store] = useState(() => new StoreImpl() as Store);

	const subscribedAtoms = useSubscribedAtoms(store);

	const components = subscribedAtoms
		.map(atom => {
			const useExecutor = store.atomExecutorAsHook(atom);

			const Component = () => {
				useExecutor();
				return null;
			}

			return <Component key={atom[ATOM_ID_STRINGIFIED_SYMBOL]} />;
		});

	return (
		<StoreContext.Provider value={store}>
			{components}
			{props.children}
		</StoreContext.Provider>
	);
}