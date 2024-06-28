import { Atom } from './atom';
import { useStore } from '../StoreContext';
import { useCallback, useSyncExternalStore } from 'react';

export function useAtomValue<T>(atom: Atom<T>): T {
	const store = useStore();

	const subscribe: (onStoreChange: () => void) => () => void
		= useCallback((onStoreChange) => {
			const unsub = store.subscribe(atom, onStoreChange);
			return unsub;
		}, [store, atom]);

	const getSnapshot = useCallback(() => store.getValue(atom), [store, atom]);

	return useSyncExternalStore(
		subscribe,
		getSnapshot
	);
}