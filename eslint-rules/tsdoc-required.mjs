import { getExportedFromLib } from './util/getExportedFromLib.mjs';

const exportedFromLib = getExportedFromLib();

export const tsdocRequired = {
	meta: {},
	create(context) {
		const exportedAll = exportedFromLib.exportAllFiles.some((file) => context.filename.startsWith(file + '.'));
		const exportedNamed = exportedFromLib.exportNamed.find((file) => context.filename.startsWith(file.file + '.'));

		if (exportedAll) {
			return createExportedAll(context);
		} else if (exportedNamed) {
			return createExportedNamed(context, exportedNamed.symbols);
		} else {
			return {};
		}
	}
}

function createExportedAll(context) {
	return {
		ExportNamedDeclaration(node) {
			assertDocumented(node, context)
		}
	};
}

function createExportedNamed(context, exportedSymbols) {
	return {
		ExportNamedDeclaration(node) {
			if (exportedSymbols.includes(node.declaration?.id?.name) || exportedSymbols.includes(node.declaration?.declarations?.[0]?.id?.name)) {
				assertDocumented(node, context)
			}
		}
	};
}

function assertDocumented(node, context) {
	const comments = context.getSourceCode().getCommentsBefore(node);
	const hasDoc = comments.some((comment) => comment.type === 'Block' && comment.value.startsWith('*'));
	if (!hasDoc) {
		context.report({
			node,
			message: 'Missing TSDoc comment'
		});
	}
}