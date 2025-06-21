'use strict';
const db = uniCloud.database();

exports.main = async (event, context) => {
	let {_id} = event;
	// let res = await db.collection("article").where({
	// 	_id:_id
	// }).get();
	let res = await db.collection("article").doc(_id).get();
	return res;
};
