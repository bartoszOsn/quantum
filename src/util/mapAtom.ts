import { atom, Atom } from '../core/api/atom';
import { ATOM_INITIAL_VALUE_SYMBOL } from '../core/atom-symbols';
import { useAtomValue } from '../core/api/useAtomValue';
import { useEffect } from 'react';

export function mapAtom<TIn, TOut>(initialAtom: Atom<TIn>, mapper: (value: TIn) => TOut): Atom<TOut> {
	return atom((observer) => {
		const value = useAtomValue(initialAtom);

		useEffect(() => {
			observer.set(mapper(value));
		}, [value]);
	}, mapper(initialAtom[ATOM_INITIAL_VALUE_SYMBOL])); // TODO if I need to use this, maybe it needs to be exported?
}