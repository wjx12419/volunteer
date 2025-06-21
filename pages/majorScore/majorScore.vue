<template>
	<view class="home">
		<view class="tit">
			<text>2022-2024河南专升本院校最低录取分数线</text>
		</view>
		<view class="search">
			<u-search label="报考专业" @search="getMajorScore" @custom="getMajorScore" @change="changeIpt($event)"
				placeholder="请输入专业名称" action-text="查询" v-model="search"></u-search>
			<view v-if="benkeArr.length"
				style="background-color: #eee; display: flex;flex-direction: column;position: absolute; z-index: 100; justify-content: center;border: 1rpx solid;  width: 300rpx;margin:5rpx 0 0 160rpx;">
				<view class="item"
					style=" display: flex;flex-direction: column;width: 200rpx;  padding: 10rpx 10rpx 10rpx 20rpx;margin-left: 20rpx;margin-top: 5rpx	;border-bottom:1rpx solid #fff ; font-size: 20rpx;"
					v-for="item in benkeArr">
					<text @click="searchInput(item)">{{item.major}}</text>
				</view>
			</view>

		</view>
		<u-loading-icon v-if="dataLoad" text="数据加载中..."></u-loading-icon>

		<view class="from" v-if="scoreData.length">
			<view class="title lable">
				<view class="content">
					<view class="schoolName">
						<text>院校名称</text>
					</view>
					<view class="type" style="color: #000;">
						<text>类别</text>
					</view>
					<view class="score">
						<text>2022</text>
					</view>
					<view class="score">
						<text>2023</text>
					</view>
					<view class="score">
						<text>2024</text>
					</view>
				</view>




			</view>
			<view v-for="item in scoreData" style="" class="title">

				<view class="content" :class="item.type=='2'?'gongban':'minban'">
					<view class="schoolName">
						{{item.name}}
						<text v-if="item.special=='1'" style="color: #2E6FBB;">【退役士兵】</text>
						<text v-if="item.special=='2'" style="color: #2E6FBB;">【建档立卡】</text>
					</view>
					<view class="type" :class="item.type=='2'?'mb':'gb'">
						{{type(item.type)}}
					</view>
					<view class="score">
						<text v-if="item.score[2022]==null">-</text>
						<text v-else-if="item.score[2022]==-1" class="iconfont icon-a-15-lishi"></text>
						<text v-else>{{item.score[2022]}}</text>
					</view>
					<view class="score">

						<text v-if="item.score[2023]==null">-</text>
						<text v-else-if="item.score[2023]==-1" class="iconfont icon-a-15-lishi"></text>
						<text v-else>{{item.score[2023]}}</text>
					</view>
					<view class="score">

						<text v-if="item.score[2024]==null">-</text>
						<text v-else-if="item.score[2024]==-1" class="iconfont icon-a-15-lishi"></text>
						<text v-else>{{item.score[2024]}}</text>
					</view>
				</view>

			</view>
			<view class="title lable">
				<view class="content">
					<view class="schoolName">
						<text>省控线</text>
					</view>
					<view class="type" style="color: #000;">
						<text></text>
					</view>
					<view class="score">
						<text>{{shengkong.score[2022]}}</text>
					</view>
					<view class="score">
						<text>{{shengkong.score[2023]}}</text>
					</view>
					<view class="score">
						<text>{{shengkong.score[2024]}}</text>
					</view>
				</view>




			</view>
		</view>
		<view class="des" v-if="scoreData.length">
			<text style="font-weight: bold;">院校最低录取分数线说明：</text>
			<view class="" style="margin-top: 15rpx;">
				<text>符号：-表式未招生</text>
				<view class="">
					<text>符号：</text>
					<text class="iconfont icon-a-15-lishi"></text>
					<text>表示分数线暂未公布</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	const db = uniCloud.databaseForJQL();
	export default {
		data() {
			return {
				search: "",
				benkeArr: [],
				scoreData: [],
				shengkong: [],
				dataLoad: false,
				close: true
			};
		},
		onLoad() {

			// this.scoreData = JSON.parse(
			// 	`[{"name":"商丘工学院","campus":null,"code":"6206","special":"0","type":"3","score":{"2020":null,"2021":null,"2022":null,"2023":null,"2024":null,"2025":114}},{"name":"郑州财经学院","campus":null,"code":"6490","special":"2","type":"3","score":{"2020":null,"2021":null,"2022":null,"2023":null,"2024":null,"2025":-1}},{"name":"郑州财经学院","campus":null,"code":"6187","special":"0","type":"3","score":{"2020":null,"2021":null,"2022":null,"2023":-1,"2024":null,"2025":-1}},{"name":"郑州经贸学院","campus":null,"code":"6514","special":"0","type":"3","score":{"2020":null,"2021":null,"2022":194,"2023":141,"2024":107,"2025":null}},{"name":"郑州航空工业管理学院","campus":null,"code":"6091","special":"0","type":"2","score":{"2020":146,"2021":168,"2022":208,"2023":null,"2024":null,"2025":null}},{"name":"郑州航空工业管理学院","campus":null,"code":"6455","special":"2","type":"2","score":{"2020":-1,"2021":207,"2022":-1,"2023":null,"2024":null,"2025":null}}]`
			// )
			// this.shengkong = JSON.parse(
			// 	`{"score":{"2020":126,"2021":163,"2022":190,"2023":85,"2024":107,"2025":102},"note":null}`)
		},
		computed: {

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
				db.collection("majorScore").where(`${new RegExp(this.search, 'i')}.test(major)`).field("major")
				.get()
				.then(
					(
						res) => {
						//console.log(res)
						this.benkeArr = res.data
					})

				this.time = time
			},
			getMajorScore() {

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
				db.collection("majorScore").where(`major=="${this.search}"`).get().then((res) => {
					//console.log(res)
					this.scoreData = res.data[0].school_score
					this.shengkong = res.data[0].min_score
					// //console.log(JSON.stringify(this.scoreData))
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
			padding: 20rpx;



		}

		.from {
			margin: 20rpx;
			padding: 5rpx;
			border-radius: 20rpx;
			border: 1rpx solid;

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

					&.gongban {
						background-color: #DFF0D8;
					}

					&.minban {
						background-color: #FCF8E3;
					}

					.schoolName {
						flex: 3;
					}

					.type {
						flex: 1;
						// text-align: center;
						display: flex;
						justify-content: center;
						align-items: center;
						margin-left: 10rpx;
						color: #fff;

						&.gb {
							margin: auto;

							border-radius: 20rpx;
							background-color: #F3A73F;

						}

						&.mb {
							margin: auto;
							border-radius: 20rpx;
							background-color: #18BC37;
						}
					}

					.score {
						flex: 2;
						display: flex;
						flex-direction: column;
						justify-content: center;
						align-items: center;

					}
				}

			}
		}

		.des {
			margin: 20rpx;
			padding: 20rpx;
			box-sizing: border-box;
			background-color: #eee;
			border-radius: 20rpx;
			height: 180rpx;
			display: flex;
			flex-direction: column;
			justify-content: flex-start;
			align-items: flex-start;
		}


	}
</style>