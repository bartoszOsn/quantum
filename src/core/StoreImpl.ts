import { Atom } from './api/atom';
import { Store } from './Store';

export class StoreImpl extends Store {

    getValue<T>(atom: Atom<T>): T {
        throw new Error('Method not implemented.');
    }

    subscribe<T>(atom: Atom<T>, listener: (value: T) => void): () => void {
        throw new Error('Method not implemented.');
    }


    getSubscribedAtoms(): Array<Atom<unknown>> {
        throw new Error('Method not implemented.');
    }

    subscribeToSubscribedAtoms(listener: (atoms: Array<Atom<unknown>>) => void): () => void {
        throw new Error('Method not implemented.');
    }


	atomExecutorAsHook(atom: Atom<unknown>): () => void {
		throw new Error('Method not implemented.');
	}
}