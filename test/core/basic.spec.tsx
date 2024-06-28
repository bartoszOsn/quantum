import { ReactNode, useEffect } from 'react';
import { act, renderHook } from '@testing-library/react';
import { atom, QuantumRoot, useAtomValue } from '../../src';
import { Repository } from '../../src/inner-util/Repository';

const Wrapper = ({children}: {children: ReactNode}) => {
	return (
		<QuantumRoot>
			{children}
		</QuantumRoot>
	)
}

describe('core', () => {
	it('basic', async () => {
		const repository = new Repository<string>('first');
		const testedAtom = atom((observer) => {
			useEffect(() => {
				return repository.subscribe((value) => { observer.set(value) });
			}, []);
		}, 'first');
		const hook = renderHook(() => useAtomValue(testedAtom), {wrapper: Wrapper});

		expect(hook.result.current).toBe('first');

		act(() => {
			repository.setValue('second');
		});

		expect(hook.result.current).toBe('second');
	});

	it('different roots', async() => {
		const repository = new Repository<string>('first');
		const testedAtom = atom((observer) => {
			useEffect(() => {
				return repository.subscribe((value) => { observer.set(value) });
			}, []);
		}, 'first');
		const hook1 = renderHook(() => useAtomValue(testedAtom), {wrapper: Wrapper});
		const hook2 = renderHook(() => useAtomValue(testedAtom), {wrapper: Wrapper});

		expect(hook1.result.current).toBe('first');
		expect(hook2.result.current).toBe('first');

		act(() => {
			repository.setValue('second');
		});

		expect(hook1.result.current).toBe('second');
		expect(hook2.result.current).toBe('second');
	});
});