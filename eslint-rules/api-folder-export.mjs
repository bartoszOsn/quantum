import { parse } from 'path';
import { getExportedFromLib } from './util/getExportedFromLib.mjs';

const exportedFromLib = getExportedFromLib();

export const apiFolderExport = {
	meta: {
		docs: {
			description: 'Enforces that all members exported outside of the lib must lie within the api folder and that everything in the api folder is exported'
		}
	},
	create(context) {
		if (context.filename.endsWith('src/index.ts')) {
			return createIndexTs(context);
		} else if (inAPIDir(context.filename)) {
			return createApiFolder(context);
		} else {
			return {};
		}
	}
}

function createIndexTs(context) {
	return {
		ExportAllDeclaration(node) {
			if (!node.source) {
				return;
			}

			if (!inAPIDir(node.source.value)) {
				context.report({
					node,
					message: 'All exports must be from the api folder'
				});
			}
		},
		ExportNamedDeclaration(node) {
			if (!node.source) {
				return;
			}

			if (!inAPIDir(node.source.value)) {
				context.report({
					node,
					message: 'All exports must be from the api folder'
				});
			}
		}
	};
}

function createApiFolder(context) {
	return {
		Program(node) {
			if (!inAPIDir(context.filename)) {
				return;
			}

			const exportedAll = exportedFromLib.exportAllFiles.some((file) => context.filename.startsWith(file + '.'));
			const exportedNamed = exportedFromLib.exportNamed.find((file) => context.filename.startsWith(file.file + '.'));
			if (!exportedAll && !exportedNamed) {
				context.report({
					node,
					message: 'Everything in the api folder must be exported'
				});
			}
		}
	};
}

function inAPIDir(path) {
	const parsedPath = parse(path);
	return parsedPath.dir.endsWith('api');
}