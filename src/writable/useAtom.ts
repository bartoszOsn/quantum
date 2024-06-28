import { WritableAtom } from './writableAtom';
import { useAtomValue } from '../core/api/useAtomValue';

export function useAtom<T>(atom: WritableAtom<T>): [value: T, setter: (value: T) => void] {
	const value = useAtomValue(atom);
	const setter = useAtomValue(atom.observerAtom);

	return [value, (value: T) => setter.set(value)];
}