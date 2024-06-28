import { Atom } from './api/atom';

export abstract class Store {
	abstract getValue<T>(atom: Atom<T>): T;
	abstract subscribe<T>(atom: Atom<T>, listener: (value: T) => void): () => void;

	abstract getSubscribedAtoms(): Array<Atom<unknown>>;
	abstract subscribeToSubscribedAtoms(listener: (atoms: Array<Atom<unknown>>) => void): () => void;

	abstract atomExecutorAsHook(atom: Atom<unknown>): () => void;
}
