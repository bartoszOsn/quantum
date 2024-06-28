import { ReactNode, useEffect } from 'react';
import { act, renderHook } from '@testing-library/react';
import { atom, mapAtom, QuantumRoot, useAtomValue } from '../../src';
import { Repository } from '../../src/inner-util/Repository';

const Wrapper = ({children}: {children: ReactNode}) => {
	return (
		<QuantumRoot>
			{children}
		</QuantumRoot>
	)
}

describe('util - mapAtom', () => {
	it('basic', async () => {
		const repository = new Repository<string>('first');
		const testedAtom = atom((observer) => {
			useEffect(() => {
				return repository.subscribe((value) => { observer.set(value) });
			}, []);
		}, 'first');

		const mappedAtom = mapAtom(testedAtom, (value) => value + ' mapped');

		const hook = renderHook(() => useAtomValue(mappedAtom), {wrapper: Wrapper});

		expect(hook.result.current).toBe('first mapped');

		act(() => {
			repository.setValue('second');
		});

		expect(hook.result.current).toBe('second mapped');
	});
});