import { ReactNode, useState } from 'react';
import { Store } from '../Store';
import { StoreImpl } from '../StoreImpl';
import { StoreContext } from '../StoreContext';
import { useSubscribedAtoms } from '../useSubscribedAtoms';
import { ATOM_ID_STRINGIFIED_SYMBOL } from '../atom-symbols';
import { getExecutorComponentForStoreAndAtom } from '../getExecutorComponentForStoreAndAtom';

export const QuantumRoot = (props: { children: ReactNode }): ReactNode => {
	const [store] = useState(() => new StoreImpl() as Store);

	const subscribedAtoms = useSubscribedAtoms(store);

	const components = subscribedAtoms
		.map(atom => {
			const Component = getExecutorComponentForStoreAndAtom(store, atom);

			return <Component key={atom[ATOM_ID_STRINGIFIED_SYMBOL]} />;
		});

	return (
		<StoreContext.Provider value={store}>
			{components}
			{props.children}
		</StoreContext.Provider>
	);
}
