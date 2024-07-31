import { defineStore } from 'pinia';

interface ObjectList {
	[key: string]: string[];
}
// 菜单权限列表
export const usePermissStore = defineStore('permiss', {
	state: () => {
		const keys = sessionStorage.getItem('ms_keys');
		return {
			key: keys ? JSON.parse(keys) : <string[]>[],
		};
	},
	actions: {
		handleSet(val: string[]) {
			this.key = val;
		}
	}
});
