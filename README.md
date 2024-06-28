# quantum

Yet another react state management library. It is atomic, reactive, and simple.

It is atomic state management in the vein of Jotai or React Recoil. Only difference is that it takes different approach to creating an atom.

## Philosophy

The core of this library is only three items:
- `QuantumRoot` - Component which wraps your app and provides context for atoms.
it is similar to `RecoilRoot` or `Provider` from react-redux.
- `useAtomValue` - Hook to read value of an atom.
- `atom` - Function to create atom.

The difference between this library and jotai or recoil is that atom is created
in a way inspired by an rxjs observable or a promise.

```typescript
const myAtom = atom((observer) => {
	useEffect(() => {
		let value = 0;
		const intervalId = setInterval(() => observer.set(value++), 1000);
		return () => clearInterval(intervalId);
	}, []);
})
```

To the atom function you pass a function which takes an observer as an argument.
This observer has a single method `set` which you can call to set the value of the atom.

This callback is executed for the first time when you subscribe to the atom for the first time.
Then, End of its lifecycle (so, for example, when a callback returned from `useEffect` is called) is when all the subscribers are unsubscribed.

It can be called multiple times, each time an atom is subscribed to when it was not subscribed right before.

Inside the function you can use any hooks you want. You can use it the same way you would use a normal react hook.
The hook is executed at the level of `QuantumRoot` component.

All the other features are built on top of this simple concept.

If something cannot be done with this  simple concept, then the core API should be made more flexible to allow it.

## Installation

```bash
npm install @quantum/quantum
```

or

```bash
yarn add @quantum/quantum
```

That's it. You are ready to go.

## Documentation

[//]: # (TODO: document all exported symbols and auto-generate API documentation)

## Roadmap

- [ ] Create more utility functions to work with atoms, such as:
  - [ ] `debounceAtom`
  - [ ] `mapAtoms`
  - [ ] `suspenceAtom`
  - [ ] `persistantAtom`
- [ ] Add examples.
- [ ] Add performance tests.
- [ ] Add a way to inspect atoms in devtools.

## Contributing

Feel free to contribute to this project. Just create a pull request.

## License

MIT