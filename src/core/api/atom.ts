import { ATOM_EXECUTOR_SYMBOL, ATOM_ID_STRINGIFIED_SYMBOL, ATOM_ID_SYMBOL, ATOM_INITIAL_VALUE_SYMBOL } from '../atom-symbols';

const counter = (() => {
	let count = 0;
	return () => count++;
})();

export interface Atom<T> {
	readonly [ATOM_ID_SYMBOL]: symbol;
	readonly [ATOM_ID_STRINGIFIED_SYMBOL]: string;
	readonly [ATOM_EXECUTOR_SYMBOL]: (observer: AtomObserver<T>) => void;
	readonly [ATOM_INITIAL_VALUE_SYMBOL]: T;
}

export interface AtomObserver<T> {
	set(value: T): void;
}

export function atom<T>(callback: (observer: AtomObserver<T>) => void, initialValue: T): Atom<T> {
	const stringifiedId = `atom-${counter()}`;
	const id = Symbol(stringifiedId);

	return {
		[ATOM_ID_SYMBOL]: id,
		[ATOM_ID_STRINGIFIED_SYMBOL]: stringifiedId,
		[ATOM_EXECUTOR_SYMBOL]: callback,
		[ATOM_INITIAL_VALUE_SYMBOL]: initialValue,
	};
}