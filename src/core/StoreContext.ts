import { createContext, useContext } from 'react';
import { Store } from './Store';

export const StoreContext = createContext<Store | null>(null);

export function useStore(): Store {
	const store = useContext(StoreContext);

	if (!store) {
		throw new Error('No store found in context');
	}

	return store;
}