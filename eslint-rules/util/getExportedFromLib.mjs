import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { parser } from 'typescript-eslint';
import esquery from 'esquery';

const indexPath = resolve(import.meta.dirname, '../../src/index.ts');
const indexDir = dirname(indexPath);

export function getExportedFromLib() {
	const indexTSContent = readFileSync(indexPath, 'utf-8');
	const parsed = parseEslint(indexTSContent);

	const exportAllFiles = esquery(parsed, 'ExportAllDeclaration')
		.filter((node) => !!node.source)
		.map((node) => node.source.value)
		.map((file) => resolve(indexDir, file));

	const exportNamed = esquery(parsed, 'ExportNamedDeclaration')
		.filter((node) => !!node.source)
		.map((node) => {
			const file = resolve(indexDir, node.source.value);
			const symbols = node.specifiers.map((specifier) => specifier.exported.name);
			return {file, symbols};
		});

	return {
		exportAllFiles,
		exportNamed
	};
}

function parseEslint(code) {
	if ('parseForESLint' in parser) {
		return parser.parseForESLint(code, {}).ast;
	} else {
		return parser.parse(code, {});
	}
}