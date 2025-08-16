export const API = {
	getGlobals: () => {
		return new Promise((resolve, reject) => {
			google.script.run.withSuccessHandler(resolve).withFailureHandler(reject).GetGlobals();
		});
	},

	getRecords: () => {
		return new Promise((resolve, reject) => {
			google.script.run
				.withSuccessHandler((res) => {
					resolve(JSON.parse(res));
				})
				.withFailureHandler(reject)
				.GetRecords();
		});
	},

	saveRecord: (data) => {
		if (!data) return { ok: false };

		return new Promise((resolve, reject) => {
			google.script.run.withSuccessHandler(resolve).withFailureHandler(reject).SaveRecord(data);
		});
	},

	updateRecord: (data) => {
		if (!data) return { ok: false };

		return new Promise((resolve, reject) => {
			google.script.run.withSuccessHandler(resolve).withFailureHandler(reject).UpdateRecord(data);
		});
	},

	deleteRecord: (id) => {
		if (!id) return { ok: false, message: "ID it's not defined" };

		return new Promise((resolve, reject) => {
			google.script.run.withSuccessHandler(resolve).withFailureHandler(reject).DeleteRecord(id);
		});
	},

	userSession: (method = 'get', key, value) => {
		if (['get', 'set', 'delete'].indexOf(method) === -1)
			return { ok: false, message: `Method error. Only "get", "set", and "delete" are accepted as valid methods.` };

		return new Promise((resolve, reject) => {
			google.script.run.withSuccessHandler(resolve).withFailureHandler(reject).UserSession(method, key, value);
		});
	},

	getTaxonomies: (taxonomyName) => {
		if (!taxonomyName) return { ok: false, message: 'Taxonomy name not defined' };

		return new Promise((resolve, reject) => {
			google.script.run.withSuccessHandler(resolve).withFailureHandler(reject).HandleTaxonomy('GET', taxonomyName);
		});
	},

	postTaxonomy: (taxonomyName, data) => {
		if (!taxonomyName) return { ok: false, message: 'Taxonomy name not defined' };
		if (!data) return { ok: false, message: 'Data not defined' };

		return new Promise((resolve, reject) => {
			google.script.run.withSuccessHandler(resolve).withFailureHandler(reject).HandleTaxonomy('POST', taxonomyName, data);
		});
	},

	updateTaxonomy: (id, taxonomyName, data) => {
		if (!data) return { ok: false, message: 'Data not defined' };
		if (!id) return { ok: false, message: 'ID taxonomy not defined' };
		if (!taxonomyName) return { ok: false, message: 'Taxonomy name not defined' };

		return new Promise((resolve, reject) => {
			google.script.run.withSuccessHandler(resolve).withFailureHandler(reject).HandleTaxonomy('UPDATE', taxonomyName, data, id);
		});
	},

	deleteTaxonomy: (id) => {
		if (!id) return { ok: false, message: 'ID taxonomy not defined' };

		return new Promise((resolve, reject) => {
			google.script.run.withSuccessHandler(resolve).withFailureHandler(reject).HandleTaxonomy('DELETE', null, null, id);
		});
	},
};
