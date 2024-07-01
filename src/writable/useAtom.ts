import { useAtomValue } from '../core/api/useAtomValue';
import { WritableAtom } from './writableAtom';

export function useAtom<T>(atom: WritableAtom<T>): [value: T, setter: (value: T) => void] {
	const value = useAtomValue(atom);
	const setter = useAtomValue(atom.observerAtom);

	return [value, (value: T) => setter.set(value)];
}
