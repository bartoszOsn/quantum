import { useEffect } from 'react';
import { act, render } from '@testing-library/react';
import { atom, QuantumRoot, useAtomValue } from '../../src';
import { Repository } from '../../src/inner-util/Repository';

const repository = new Repository<string>('first');

const testedAtom = atom((observer) => {
	useEffect(() => {
		return repository.subscribe((value) => { observer.set(value) });
	}, []);
}, 'first');

let testComponentRenderCount = 0;

const TestComponent = () => {
	const value = useAtomValue(testedAtom);
	testComponentRenderCount++;
	return <div>TestComponent: {value}</div>
}

const TestApp = () => {
	return (
		<QuantumRoot>
			<TestComponent />
		</QuantumRoot>
	)
}

describe('core', () => {
	it('no render same value', async () => {
		const result = render(<TestApp />);

		expect(result.getByText('TestComponent: first')).toBeTruthy();
		expect(testComponentRenderCount).toBe(1);

		act(() => {
			repository.setValue('second');
		});

		expect(result.getByText('TestComponent: second')).toBeTruthy();
		expect(testComponentRenderCount).toBe(2);

		act(() => {
			repository.setValue('second');
		});

		expect(result.getByText('TestComponent: second')).toBeTruthy();
		expect(testComponentRenderCount).toBe(2);
	});
});