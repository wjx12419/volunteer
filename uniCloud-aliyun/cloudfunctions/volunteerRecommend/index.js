'use strict';
const db = uniCloud.database();
exports.main = async (event, context) => {
	//专业名字和分数
	let {
		majorName,
		score,
		rank,
		number,
		count
	} = event;
	//专业名字搜索返回的数据
	let searchMajorRes = await db.collection("cloudDemo").where({
		major: majorName
	}).get()
	// 添加安全校验
	if (!searchMajorRes.data || searchMajorRes.data.length === 0) {
	    return { code: 404, message: '未找到相关专业数据' }
	}
	const schoolScoreArr = searchMajorRes.data[0]?.plan || []
	
	//数据处理分类
	let type0Arr = [] //普通
	let type1Arr = [] //退役士兵
	let type2Arr = [] //建档立卡
	schoolScoreArr.forEach(item => {
		const name = item.name;
		if (name.includes("退役士兵")) {
			type1Arr.push(item);
		} else if (name.includes("建档立卡")) {
			type2Arr.push(item);
		} else {
			type0Arr.push(item);
		}
	});

	//处理学校三年最低录取分数线
	// if(){
	changeScore(type0Arr);
	// }

	//存在近三年分数线
	let trueScore = []
	//不存在近三年分数线
	let falseScore = []
	for (let i = 0; i < type0Arr.length; i++) {
		if (type0Arr[i].schoolThreeYearScore) {
			trueScore.push(type0Arr[i])
		} else {
			falseScore.push(type0Arr[i])
		}
	}
	//查询该专业一分一段表
	let scoresRankData = await db.collection("scores-rank").where({
		major: majorName,
		year: "2024"
	}).get()
	// let scoresRankArr = scoresRankData.data[0].data
	// 预处理分数列表用于二分查找（按分数降序排序）
	const sortedScores = [...scoresRankData.data[0].data]
		.sort((a, b) => b.score - a.score)
		.map(item => item.score);
	const scoresRankMap = new Map(scoresRankData.data[0].data.map(item => [item.score, item.count]));
	
	for (const school of trueScore) {
	    // 计算有效年份的平均分
	    const validYears = [
	        school.schoolThreeYearScore.score2022,
	        school.schoolThreeYearScore.score2023,
	        school.schoolThreeYearScore.score2024
	    ].filter(score => score > 0);
	
	    if (validYears.length === 0) {
	        school.schoolAverageScore = 0;
	        school.schoolMinRank = 0;
	        continue;
	    }
	
	    school.schoolAverageScore = Math.ceil(validYears.reduce((a, b) => a + b, 0) / validYears.length);
	
	    // 二分查找定位分数段
	    let low = 0, high = sortedScores.length - 1;
	    let targetScore = school.schoolAverageScore;
	    
	    while (low <= high) {
	        const mid = Math.floor((low + high) / 2);
	        if (sortedScores[mid] >= targetScore) {
	            low = mid + 1;
	        } else {
	            high = mid - 1;
	        }
	    }
	
	    // 处理边界情况
	    const foundScore = sortedScores[high] ?? sortedScores[0];
	    school.schoolMinRank = scoresRankMap.get(foundScore) || 0;
	
	    // 找不到时的兜底逻辑（可选）
	    if (!school.schoolMinRank) {
	        school.schoolMinRank = scoresRankMap.get(sortedScores[sortedScores.length - 1]) || 0;
	    }
		
		// let score_diff = parseInt(score) - school.schoolAverageScore //分数差
		// let rank_diff = parseInt(rank) - school.schoolMinRank //位次法
		// let schoolMatch=0;
		// if(number>20){
		// 	schoolMatch = 0.4 * score_diff + 0.6 * (-rank_diff) //位次越低越好
		// }else{
		//  schoolMatch = 0.5 * score_diff + 0.5 * (-rank_diff) //位次越低越好
		// }
		// school.schoolMatch=Math.ceil(schoolMatch)
		// const p = parseInt(rank) - school.schoolMinRank //位次法
		let score_diff = parseInt(score,10) - school.schoolAverageScore //分数差
		let rank_school = school.schoolMinRank /count
		let rank_diff = parseInt(rank,10) / count //位次法
		 let  p = Math.floor((rank_diff - rank_school) * 100) / 100
		let schoolMatch=0;
		  if (rank_diff < 0.1) {    // 前10%考生
				schoolMatch = 0.4 * score_diff + 0.6 * (1-p)
		  } else if (rank_diff < 0.3) { // 前10%-30%考生
		    schoolMatch = 0.5 * score_diff + 0.5 * (1-p)
			
		  } else {                          // 其他考生
		    schoolMatch = 0.6 * score_diff + 0.4 * (1-p)
		  }
		school.schoolMatch=Math.floor(schoolMatch*100) / 100
		
		
	}
	// for(let i =0;i<trueScore.length;i++){
	// 	//和平均分相差30分的直接过滤
	// 	if(trueScore[i].schoolAverageScore-parseInt(score)>30){
	// 		trueScore.splice([i],1)
	// 	}
	// }
	trueScore.sort((a,b)=>{
		return   a.schoolMatch - b.schoolMatch
	})
	
	return trueScore



	
	




	
};

function changeScore(type0Arr) {
	for (let i = 0; i < type0Arr.length; i++) {
		// 确保数据索引对齐
		if (!type0Arr[i]?.score) continue;
		// 为每个学校创建新的分数对象
		const scoreData = {
			score2022: 0,
			score2023: 0,
			score2024: 0,
		};

		let validCount = 0;
		const scoreEntries = type0Arr[i].score;

		// 使用更安全的解析方式
		scoreEntries.forEach(entry => {
			const [year, score] = entry.split(':'); // 分割年份和分数
			if (!year || !score) return; // 跳过无效条目

			const numericScore = parseInt(score, 10);
			if (isNaN(numericScore)) return; // 过滤无效数字

			// 使用switch处理年份匹配
			switch (year) {
				case '2022':
					scoreData.score2022 = numericScore;
					validCount++;
					break;
				case '2023':
					scoreData.score2023 = numericScore;
					validCount++;
					break;
				case '2024':
					scoreData.score2024 = numericScore;
					validCount++;
					break;
			}
		});

		// 仅当有有效数据时才添加属性
		if (validCount > 0) {
			type0Arr[i].schoolThreeYearScore = scoreData;
			type0Arr[i].scoreLen = validCount;
		}
	}
	// return type0Arr
}