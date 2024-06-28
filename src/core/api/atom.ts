import { ATOM_ID_SYMBOL } from '../ATOM_ID_SYMBOL';

export interface Atom<_T> {
	readonly [ATOM_ID_SYMBOL]: symbol;
}

interface AtomObserver<T> {
	set(value: T): void;
}

function atom<T>(callback: (observer: AtomObserver<T>) => void, initialValue: T): Atom<T> {
	// TODO: Implement
}