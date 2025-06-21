'use strict';
const db = uniCloud.database();
const dbCmd = db.command;
exports.main = async (event, context) => {
	let {skip=0} = event;
	let res = db.collection("article").limit(8).skip(skip).orderBy("_id","desc").get();
	return res;
};
