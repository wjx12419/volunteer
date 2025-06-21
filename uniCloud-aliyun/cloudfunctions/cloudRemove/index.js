'use strict';
const db = uniCloud.database();
exports.main = async (event, context) => {
	let {id} = event;
	let res = await db.collection("article").doc(id).remove();
	return res;
};
