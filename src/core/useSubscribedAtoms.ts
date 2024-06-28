import { Atom } from './api/atom';
import { Store } from './Store';
import { useCallback, useSyncExternalStore } from 'react';

export function useSubscribedAtoms(store: Store): Array<Atom<unknown>> {
	const getSnapshot = useCallback(() => store.getSubscribedAtoms(), [store]);

	const subscribe = useCallback(
		(listener: (atoms: Array<Atom<unknown>>) => void) => {
			return store.subscribeToSubscribedAtoms(listener);
		},
		[store]
	);

	return useSyncExternalStore(
		subscribe,
		getSnapshot
	);
}
