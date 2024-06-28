import { Store } from './Store';
import { Atom } from './api/atom';
import { ReactNode } from 'react';

const map: Map<Store, Map<Atom<unknown>, () => ReactNode>> = new Map();

export function getExecutorComponentForStoreAndAtom(store: Store, atom: Atom<unknown>): () => ReactNode {
	let storeMap = map.get(store);
	if (!storeMap) {
		storeMap = new Map();
		map.set(store, storeMap);
	}

	let executorComponent = storeMap.get(atom);
	if (!executorComponent) {
		const useExecutor = store.atomExecutorAsHook(atom);
		executorComponent = () => {
			useExecutor();
			return null;
		}
		storeMap.set(atom, executorComponent);
	}

	return executorComponent;
}