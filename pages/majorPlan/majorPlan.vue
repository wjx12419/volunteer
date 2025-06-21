<template>
	<view class="home">
		<view class="tit">
			<text>2022-2024河南专升本专业招生计划</text>
		</view>
		<view class="search">
			<view class="" style="display: flex;justify-content:space-between;">
				<view class="" style="display: flex;">
					<button style="width: 150rpx;" size="mini"  @click="showPick = true">{{year}}<text style="color:#896075" class="iconfont icon-a-12-xia"></text></button>
					<u-search style="" @search="getMajorPlan" :showAction="false" @custom="getMajorPlan" @change="changeIpt($event)" placeholder="请输入专业名称"
						v-model="search"></u-search>
				</view>
					<u-picker @confirm="pickFirm"  @cancel="showPick=false" :show="showPick" :columns="columns"></u-picker>
					
			</view>
			<button  style="margin-top: 30rpx;" size="mini" type="primary" @click="getMajorPlan">查询</button>
			<view v-if="benkeArr.length"
				style="background-color: #eee; display: flex;flex-direction: column;position: absolute; z-index: 100; justify-content: center;border: 1rpx solid;  width: 300rpx;margin:80rpx 0 0 200rpx;">
				<view class="item"
					style=" display: flex;flex-direction: column;width: 200rpx;  padding: 10rpx 10rpx 10rpx 20rpx;margin-left: 20rpx;margin-top: 5rpx	;border-bottom:1rpx solid #fff ; font-size: 20rpx;"
					v-for="item in benkeArr">
					<text @click="searchInput(item)">{{item.major}}</text>
				</view>
			</view>

		</view>
		
		
		
		
		<view class="from" v-if="majorPlanData.length">
			<view class="title lable">
				<view style="display: flex;justify-content: space-around;padding: 15rpx;">
					
						<text style="flex: 1;">计划数</text>
					
					
						<text style="flex: 1;">学制</text>
					
				
						<text style="flex: 1;">学费</text>
				
					
						<text style="flex: 1;">住宿费</text>
					
					
				</view>
		
		
		
		
			</view>
			<view v-for="item in majorPlanData" style="" class="title">
			<view style="padding: 15rpx;" :class="item.type==3?'minban':'gongban'">
				{{item.school}}
				<text style="color: #fff;padding: 5rpx;margin-left: 10rpx;" :class="item.type=='2'?'mb':'gb'">
					{{type(item.type)}}
				</text>
				<text v-if="item.special=='1'" style="color: #2E6FBB;">【退役士兵】</text>
					<text v-if="item.special=='2'" style="color: #2E6FBB;">【建档立卡】</text>
				
			</view>
			<view class="" style="display: flex;justify-content: space-around; padding: 15rpx;">
				<text style="flex: 1;">{{item.plan}}人</text>
				<text style="flex: 1;">{{item.length}}年</text>
				<text style="flex: 1;">{{item.study_fee}}/年</text>
				<text style="flex: 1;"> {{item.room_fee}}/年</text>
			</view>
		
			</view>
		
		</view>
	</view>
</template>

<script>
	const db =uniCloud.databaseForJQL();
	export default {
		
		data() {
			return {
				search: "",
				benkeArr: [],
				majorPlanData: [],
				dataLoad: false,
				close: true,
				showPick: false,
				columns: [
					[2022, 2023, 2024]
				],
				year:2024,
				
			};
		},
		onLoad() {
			// this.majorPlanData =JSON.parse(`[{"school":"郑州经贸学院","campus":null,"type":3,"plan":7,"length":"2","normal":0,"study_fee":"15000","room_fee":"1200","address":null,"special":0},{"school":"郑州经贸学院","campus":null,"type":3,"plan":4,"length":"2","normal":0,"study_fee":"15000","room_fee":"1200","address":null,"special":1}]`)
			// //console.log(this.majorPlanData)
		},
		methods: {
			type(ty) {
				if (ty == "2") {
					return "公办"
				} else if (ty == "3") {
					return "民办"
				}
				return ""
			},
			pickFirm(e){
				//选择年份
				this.year = e.value[0]
				//console.log(e.value)
				this.showPick=false
			},
			searchInput(item) {
				this.search = item.major
				this.close = false
				this.benkeArr = []

			},
			changeIpt(e) {
				//输入本科专业
				//console.log(e)
				if (!this.close) {
					this.close = true
					return
				}
				let time = Date.now()


				//console.log(time)
				//console.log(e.trim())
				//console.log(time - this.time)
				if (e == "") {
					this.benkeArr = []
					return
				}
				if (e.trim() == "" || time - this.time < 3000) {
					//防抖
					//console.log("防抖成功")
					this.benkeArr = []
					return
				}
				db.collection("majorPlan").where(`${new RegExp(this.search, 'i')}.test(major)&&year==${this.year}`).field("major").get().then(
					(
						res) => {
						//console.log(res)
						this.benkeArr = res.data
					})

				this.time = time
			},
			getMajorPlan() {
				if(this.search.trim()==""){
					
					uni.showToast({
						title:"请输入专业名称",
						icon:"none"
					})
					return
				}
				//获取院校分数线
				let time = Date.now()
				//console.log(time - this.time1 < 3000)
				if (time - this.time1 < 3000) {
					uni.showToast({
						title: "查询频繁，请稍后再试",
						icon: "none"
					})

					return
				}
				this.dataLoad = true
				this.scoreData = []
				// db.collection("cloudDemo").where(`major=="${this.search}"`).get().then((res) => {
				// 	//console.log(res)
				// 	this.scoreData = res.data[0].plan
				// 	// this.chuliData(res.data[0].plan)
				// 	//console.log(JSON.stringify(res.data[0].plan))
				// 	this.time1 = time
				// })
			
			
				
				db.collection("majorPlan").where(`major=="${this.search}"&&year==${this.year}`).get().then((res) => {
					//console.log(res)
					this.majorPlanData = res.data[0].plan
					// //console.log(JSON.stringify(this.majorPlanData))
					// //console.log(JSON.stringify(this.shengkong))
					this.dataLoad = false
				})

			},
		}
	}
</script>

<style lang="scss" scoped>
	.home {
		.tit {
			padding: 20rpx 20rpx 0 20rpx;
			font-weight: bold;
			text-align: center;
		}

		.search {
			padding: 20rpx 10rpx;
			display: flex;
			flex-direction: column;


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
		
		
				.content {
					padding: 10rpx;
					box-sizing: border-box;
					// margin: 10rpx;
					display: flex;
					justify-content: space-between;
					font-size: 28rpx;
					width: 100%;
					// border-radius: 20rpx;
					border-bottom: 1rpx solid;
		
					
		
					.schoolName {
						flex: 1;
						
					}
		
					.type {
						flex: 1;
						// text-align: center;
						display: flex;
						justify-content: center;
						align-items: center;
						margin-left: 10rpx;
						color: #fff;
		
						
					}
		
					.score {
						flex: 1;
						display: flex;
						flex-direction: column;
						justify-content: center;
						align-items: center;
		
					}
				}
		
			}
		}
	}
</style>