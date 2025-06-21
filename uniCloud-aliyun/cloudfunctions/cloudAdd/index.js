'use strict';
const db = uniCloud.database();
const dbCmd = db.command;
exports.main = async (event, context) => {
	let{title,author,content,posttime,imgUrl} =event;
	let res = await db.collection("article").add({
		title,
		author,
		content,
		posttime,
		imgUrl
	});
	return res;
};
