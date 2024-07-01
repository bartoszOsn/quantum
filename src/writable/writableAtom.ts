import { useEffect, useRef } from 'react';
import { atom, Atom, AtomObserver } from '../core/api/atom';
import { mapAtom } from '../util/mapAtom';

export interface WritableAtom<T> extends Atom<T> {
	readonly observerAtom: Atom<AtomObserver<T>>;
}

export function writableAtom<T>(initialValue: T): WritableAtom<T> {
	const initialObserver: AtomObserver<T> & { value: T | null; setValueAtLeastOnce: boolean } = {
		set: (value: T) => {
			initialObserver.value = value;
			initialObserver.setValueAtLeastOnce = true;
		},
		value: null,
		setValueAtLeastOnce: false
	};

	const protoAtom = atom<{ observer: AtomObserver<T>; value: T}>(protoSubscriber => {
		const initializedRef = useRef(false);

		function setValue(value: T): void {
			protoSubscriber.set({
				value,
				observer: {
					set: setValue
				}
			});
		}

		useEffect(() => {
			setValue(initialObserver.setValueAtLeastOnce ? initialObserver.value! : initialValue);
			initializedRef.current = true;
		}, []);
	}, {
		value: initialValue,
		observer: initialObserver
	});

	return {
		...mapAtom(protoAtom, (value) => value.value),
		observerAtom: mapAtom(protoAtom, value => value.observer)
	};
}
