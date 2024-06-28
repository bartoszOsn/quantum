export class Repository<T> {
	private readonly listeners: Set<(value: T) => void> = new Set();
	private value: T;

	constructor(value: T) {
		this.value = value;
	}

	setValue(value: T) {
		this.value = value;
		this.listeners.forEach(listener => listener(value));
	}

	getValue(): T {
		return this.value;
	}

	subscribe(listener: (value: T) => void): () => void {
		this.listeners.add(listener);
		return () => {
			this.listeners.delete(listener);
		};
	}
}