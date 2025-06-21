'use strict';
const db = uniCloud.database();
exports.main = async (event, context) => {
	let {obj}  =event;
	let id = obj._id;
	delete obj._id;
	
	let res = await db.collection("article").doc(id).update(obj);
	return res;
};
