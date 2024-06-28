import { Atom, AtomObserver } from './api/atom';
import { Store } from './Store';
import { Repository } from '../inner-utils/Repository';
import { ATOM_EXECUTOR_SYMBOL, ATOM_ID_SYMBOL, ATOM_INITIAL_VALUE_SYMBOL } from './atom-symbols';

export class StoreImpl extends Store {

	private readonly values: WeakMap<symbol, Repository<unknown>> = new WeakMap();
	private readonly subscribedAtoms: Repository<Array<Atom<unknown>>> = new Repository<Array<Atom<unknown>>>([]);
	private readonly subscriberCount: WeakMap<Atom<unknown>, number> = new WeakMap();

    getValue<T>(atom: Atom<T>): T {
        const valueRepository = this.getValueRepository(atom);
		return valueRepository.getValue();
    }

    subscribe<T>(atom: Atom<T>, listener: (value: T) => void): () => void {
		const valueRepository = this.getValueRepository(atom);
		const repositoryUnsub = valueRepository.subscribe(listener);
		this.addToSubscribedAtoms(atom);

		return () => {
			repositoryUnsub();
			this.removeFromSubscribedAtoms(atom);
		}
    }


    getSubscribedAtoms(): Array<Atom<unknown>> {
        return this.subscribedAtoms.getValue();
    }

    subscribeToSubscribedAtoms(listener: (atoms: Array<Atom<unknown>>) => void): () => void {
        return this.subscribedAtoms.subscribe(listener);
    }


	atomExecutorAsHook(atom: Atom<unknown>): () => void {
		return () => {
			const valueRepository = this.getValueRepository(atom);
			const observer: AtomObserver<unknown> = {
				set: (value: unknown) => {
					valueRepository.setValue(value);
				}
			}

			atom[ATOM_EXECUTOR_SYMBOL](observer);
		}
	}


	private getValueRepository<T>(atom: Atom<T>): Repository<T> {
		let valueRepository = this.values.get(atom[ATOM_ID_SYMBOL]) as Repository<T>;
		if (!valueRepository) {
			valueRepository = new Repository<T>(atom[ATOM_INITIAL_VALUE_SYMBOL]);
			this.values.set(atom[ATOM_ID_SYMBOL], valueRepository as Repository<unknown>);
		}
		return valueRepository;
	}

	private addToSubscribedAtoms(atom: Atom<unknown>): void {
		const atoms = this.subscribedAtoms.getValue();
		if (!atoms.includes(atom)) {
			this.subscribedAtoms.setValue([...atoms, atom]);
		}
		this.subscriberCount.set(atom, (this.subscriberCount.get(atom) ?? 0) + 1);
	}

	private removeFromSubscribedAtoms(atom: Atom<unknown>): void {
		const atoms = this.subscribedAtoms.getValue();

		const count = (this.subscriberCount.get(atom) ?? 1) - 1;
		if (count === 0) {
			this.subscriberCount.delete(atom);
			this.subscribedAtoms.setValue(atoms.filter(a => a !== atom));
		} else {
			this.subscriberCount.set(atom, count);
		}
	}
}