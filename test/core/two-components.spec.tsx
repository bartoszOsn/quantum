import { ReactNode, useEffect } from 'react';
import { act, render } from '@testing-library/react';
import { atom, QuantumRoot, useAtomValue } from '../../src';
import { Repository } from '../../src/inner-util/Repository';

const Wrapper = ({children}: {children: ReactNode}) => {
	return (
		<QuantumRoot>
			{children}
		</QuantumRoot>
	)
}

const repository = new Repository<string>('first');

const testedAtom = atom((observer) => {
	useEffect(() => {
		return repository.subscribe((value) => { observer.set(value) });
	}, []);
}, 'first');

const TestComponent1 = () => {
	const value = useAtomValue(testedAtom);
	return <div>TestComponent1: {value}</div>
}

const TestComponent2 = () => {
	const value = useAtomValue(testedAtom);
	return <div>TestComponent2: {value}</div>
}

const TestApp = () => {
	return (
		<QuantumRoot>
			<TestComponent1 />
			<TestComponent2 />
		</QuantumRoot>
	)
}

describe('core', () => {
	it('two components', async () => {
		const result = render(<TestApp />);

		expect(result.getByText('TestComponent1: first')).toBeTruthy();
		expect(result.getByText('TestComponent2: first')).toBeTruthy();

		act(() => {
			repository.setValue('second');
		});

		expect(result.getByText('TestComponent1: second')).toBeTruthy();
		expect(result.getByText('TestComponent2: second')).toBeTruthy();
	});
});