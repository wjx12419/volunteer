<template>
	<view class="home">
		<u-loading-icon :show="dataShow!=2"></u-loading-icon>
		<view v-if="dataShow==2">
			<view class="title">
				<text>{{schoolData.name}}</text>
			</view>
			<view style="text-align: end;">
				<text style="color:#fff;padding: 5rpx;" :class="typeColor==2?'mb':'gb'">{{schoolData.type}}</text>
			</view>
			<view style="text-align: end;">
				<text>{{schoolData.major}}专业</text>
			</view>
				
			<view class="charts-box" >
				<qiun-data-charts type="line" :opts="opts" :chartData="chartData" />
			</view>
				<view v-if="majorPlan.length">
					<view>招生计划</view>
					
					<u-collapse>
						<u-collapse-item title="2024年">
							<view style="border: 1rpx solid;padding: 10rpx;box-sizing: border-box;border-radius: 20rpx;" >
								<view style="display: flex;justify-content: space-between;align-items: center;text-align: center;border-bottom: 1rpx solid;">
									<text class="fle">招生类型</text>
									<text class="fle">计划数</text>
									<text class="fle">学制</text>
									<text class="fle">学费</text>
									<text class="fle">住宿费</text>
								</view>
								<view v-for="item in majorPlan[0]" style=" display: flex;justify-content: space-between;text-align: center;align-items: center;"  >
										<text class="fle">{{special(item.special)}}</text>
										<text class="fle">{{item.plan}}</text>
										<text class="fle">{{item.length}}</text>
										<text class="fle">{{item.study_fee}}</text>
										<text class="fle">{{item.room_fee}}</text>
										
								</view>
							</view>
						</u-collapse-item>
						<u-collapse-item title="2023年">
							<view style="border: 1rpx solid;padding: 10rpx;box-sizing: border-box;border-radius: 20rpx;" >
								<view style="display: flex;justify-content: space-between;align-items: center;text-align: center;border-bottom: 1rpx solid;">
									<text class="fle">招生类型</text>
									<text class="fle">计划数</text>
									<text class="fle">学制</text>
									<text class="fle">学费</text>
									<text class="fle">住宿费</text>
								</view>
								<view v-for="item in majorPlan[1]" style=" display: flex;justify-content: space-between;text-align: center;align-items: center;"  >
										<text class="fle">{{special(item.special)}}</text>
										<text class="fle">{{item.plan}}</text>
										<text class="fle">{{item.length}}</text>
										<text class="fle">{{item.study_fee}}</text>
										<text class="fle">{{item.room_fee}}</text>
										
								</view>
							</view>
						</u-collapse-item>
						<u-collapse-item title="2022年">
							<view style="border: 1rpx solid;padding: 10rpx;box-sizing: border-box;border-radius: 20rpx;" >
								<view style="display: flex;justify-content: space-between;align-items: center;text-align: center;border-bottom: 1rpx solid;">
									<text class="fle">招生类型</text>
									<text class="fle">计划数</text>
									<text class="fle">学制</text>
									<text class="fle">学费</text>
									<text class="fle">住宿费</text>
								</view>
								<view v-for="item in majorPlan[2]" style=" display: flex;justify-content: space-between;text-align: center;align-items: center;"  >
										<text class="fle">{{special(item.special)}}</text>
										<text class="fle">{{item.plan}}</text>
										<text class="fle">{{item.length}}</text>
										<text class="fle">{{item.study_fee}}</text>
										<text class="fle">{{item.room_fee}}</text>
										
								</view>
							</view>
						</u-collapse-item>
					</u-collapse>
				
					
				</view>
			
		</view>
	</view>
</template>

<script>
	const db = uniCloud.databaseForJQL()
	export default {
		data() {
			return {
				schoolData: {},
				majorScoreData: [],
				chartData: {},
				schoolInfo: {},
				majorPlanData:[],
				majorPlan:[],
				dataShow:0,
				typeColor:0,
				opts: {
					color: ["#1890FF", "#91CB74", "#FAC858", "#EE6666", "#73C0DE", "#3CA272", "#FC8452", "#9A60B4",
						"#ea7ccc"
					],
					padding: [15, 10, 0, 15],
					enableScroll: false,
					legend: {},
					xAxis: {
						disableGrid: true
					},
					yAxis: {
						gridType: "dash",
						dashLength: 2
					},
					extra: {
						line: {
							type: "straight",
							width: 2,
							activeType: "hollow"
						}
					}
				}
			};
		},
		onLoad(option) {
			
			let a = JSON.parse(option.data);
			this.schoolData = a;
			console.log(a)
			uni.setNavigationBarTitle({
				title: "院校详情"
			})
			console.log(a.type=="公办")
			if(a.type=="公办"){
				this.typeColor=2
			}
			// this.chuliData(a)
			this.getMajorPlan(a)
			this.getMajorScore(a)
			
			
		},
		
		methods: {
			special(ty){
				if(ty=="0"){
					return "普通计划"
				}else if(ty=="1"){
					return "退役士兵"
				}else{}
				return "建档立卡"
			},
		async	getMajorPlan(a){
				//获取招生计划
				const major  = a.major
			let dataArr=await	db.collection("majorPlan").where(`major=="${major}"`).get()
			// console.log(dataArr)
			const data= dataArr.data
			let majorPlan2022=[]
			let majorPlan2023=[]
			let majorPlan2024=[]
			data.forEach((item)=>{
				// console.log(item.year)
				if(item.year==2022){
					  majorPlan2022 = item.plan
				}else if(item.year==2023){
					  majorPlan2023 = item.plan
				}else if(item.year==2024){
					  majorPlan2024 =item.plan
				}
			})
			
			
			// console.log(majorPlan2022)
			// console.log(majorPlan2023)
			// console.log(majorPlan2024)
			setTimeout(()=>{
				this.chuliPlan(majorPlan2022,majorPlan2023,majorPlan2024)
			},1000)
			},
			chuliPlan(num1,num2,num3){
				//处理招生计划的数据
				const name= this.schoolData.name
				// console.log(num1)
				let index1=[],index2=[],index3=[];
				
				num1.forEach((item)=>{
					if(item.school==name){
						index1.push(item)
					}
				})	
				num2.forEach((item)=>{
					if(item.school==name){
						index2.push(item)
					}
				})	
				num3.forEach((item)=>{
					if(item.school==name){
						index3.push(item)
					}
				})
				// console.log(index1)
				// console.log(index2)
				// console.log(index3)
				
				this.majorPlan[0]=index3
				this.majorPlan[1]=index2
				this.majorPlan[2]=index1
				this.dataShow++
				// console.log(this.majorPlan)
			},
		async	getMajorScore(a) {
				//获取分数线
				const major = a.major

			let scoreData=await	db.collection("majorScore").where(`major=="${major}"`).get()
				//console.log(res)
				this.majorScoreData = scoreData.data[0]
				const majorShengKong = scoreData.data[0].min_score
				setTimeout(()=>{
					this.chuliSchoolInfo(scoreData.data[0].school_score, majorShengKong)
				},2000)
			},
			chuliSchoolInfo(school_score, shengkong) {
				//处理学校分数线信息
				const name = this.schoolData.name
				//console.log(name)
				// console.log(school_score)

				let index = school_score.findIndex((i) => {
					return i.name == name
				})

				//console.log(index)
				let schoolInfo = school_score[index]
				//console.log(schoolInfo)
				this.schoolInfo = schoolInfo
				this.chuliData(schoolInfo, shengkong)
			},
			chuliData(schoolInfo, shengkong) {
				//处理分数线，显示到折线图上
				let charData = {
					categories: ["2022", "2023", "2024"],
					series: [{
						name: "最低录取分数线",
						data: []
					}, {
						name: "专业省控线",
						data: []
					}]
				}
				let num2022;
				let num2023;
				let num2024;
				//console.log(schoolInfo)
				if(schoolInfo.score[2022]==-1){
					 num2022 = null
				}else{
					 num2022 = schoolInfo.score[2022]
				}
				if(schoolInfo.score[2023]==-1){
					 num2023 = null
				}else{
					 num2023 = schoolInfo.score[2023]
				}
				if(schoolInfo.score[2024]==-1){
					 num2024 = null
				}else{
					 num2024 = schoolInfo.score[2024]
				}
				
				
				
				charData.series[0].data.push(num2022, num2023, num2024)

				const min2022 = shengkong.score[2022]
				const min2023 = shengkong.score[2023]
				const min2024 = shengkong.score[2024]
				charData.series[1].data.push(min2022, min2023, min2024)
				this.chartData = charData
				this.dataShow++
				//console.log(charData)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.home {
		padding: 20rpx;
		box-sizing: border-box;

		.title {
			font-size: 40rpx;
			font-weight: bold;
			text-align: center;
			margin-bottom: 20rpx;
		}

		.charts-box {
			width: 100%;
			height: 300px;
		}

		.gongban {
			background-color: #DFF0D8;
		}

		.minban {
			background-color: #FCF8E3;
		}

		.gb {
			margin: auto;

			border-radius: 20rpx;
			background-color: #F3A73F;

		}

		.mb {
			margin: auto;
			border-radius: 20rpx;
			background-color: #18BC37;
		}
		.fle{
			flex:1;
		}
		.from {
			margin: 20rpx;
			padding: 5rpx;
			border-radius: 20rpx;
			border: 1rpx solid;
			font-size: 28rpx;

			.title {
				&.lable {
					background-color: #F5F5F5;
				}





			}

		}
	}
</style>