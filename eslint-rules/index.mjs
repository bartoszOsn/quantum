import { tsdocRequired } from './tsdoc-required.mjs';
import { apiFolderExport } from './api-folder-export.mjs';

export const CustomRulesPlugin = {
	meta: {
		name: 'custom-rules',
	},
	rules: {
		tsdocRequired,
		apiFolderExport
	}
}