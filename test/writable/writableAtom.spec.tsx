import { ReactNode, useEffect } from 'react';
import { act, renderHook } from '@testing-library/react';
import { atom, QuantumRoot, useAtomValue, writableAtom } from '../../src';
import { Repository } from '../../src/inner-util/Repository';
import { useAtom } from '../../src/writable/useAtom';

const Wrapper = ({children}: {children: ReactNode}) => {
	return (
		<QuantumRoot>
			{children}
		</QuantumRoot>
	)
}

describe('writable', () => {
	it('basic', async () => {
		const testedAtom = writableAtom('first');
		const hook = renderHook(() => useAtom(testedAtom), {wrapper: Wrapper});

		expect(hook.result.current[0]).toBe('first');

		act(() => {
			hook.result.current[1]('second');
		});

		expect(hook.result.current[0]).toBe('second');
	});
});