<template>
	<view class="home">

		<view class="item">
			<view class="leftName">
				<text>我的姓名：</text>
			</view>
			<view class="ipt">
				<input type="text" placeholder="请输入姓名" v-model="volunteer.name" />
			</view>
		</view>
		<view class="item">
			<view class="leftName">
				<text>我的手机号：</text>
			</view>
			<view class="ipt">
				<input type="text" placeholder="请输入手机号" v-model="volunteer.phone" />
			</view>
		</view>
		<view class="item">
			<view class="leftName">
				<text>专升本省份：</text>
			</view>
			<view class="ipt">

				<text>{{volunteer.province}}</text>
			</view>
		</view>
		<view class="item">
			<view class="leftName">
				<text>请输入专科专业：</text>
			</view>
			<view class="ipt" style="display: flex;flex-direction: column;">
				<input @input="ipt" type="text" placeholder="输入专科专业" v-model="volunteer.zhuanke" />
				<view v-if="zhuankeArr.length"
					style="background-color: #eee; display: flex;flex-direction: column;position: absolute; z-index: 100; justify-content: center;border: 1rpx solid;  width: 300rpx;margin:50rpx 0 0 -20rpx;">
					<view class="item"
						style=" display: flex;flex-direction: column;width: 200rpx;  padding: 10rpx 10rpx 10rpx 20rpx;margin-left: 20rpx;margin-top: 5rpx	;border-bottom:1rpx solid #fff ; font-size: 20rpx;"
						v-for="item in zhuankeArr">
						<text @click="searchInput(item)">{{item}}</text>
					</view>
				</view>
			</view>
		</view>

		<view class="item">
			<view class="leftName">
				<text>请选择本科专业：</text>
			</view>
			<view class="ipt" @click="getBenka"
				style="display: flex;justify-content: space-between;align-items: center;">
				<text>{{volunteer.benke}}</text>
				<text class="iconfont icon-a-10-you"></text>
			</view>
		</view>
		<u-picker :show="benkeFlag" :columns="columns" @cancel="pickCan" @close="pickClose"
			@confirm="pickCon"></u-picker>

		<view class="item">
			<view class="leftName">
				<text>我的分数：</text>
			</view>
			<view class="ipt" style="display: flex;justify-content: flex-end;">
				<input type="text" placeholder="我的分数" v-model="volunteer.score" />
				<text v-show="volunteer.score">分</text>
			</view>
		</view>
		<view class="item">
			<view class="leftName">
				<text>排名：</text>
			</view>
			<view class="ipt" style="display: flex;justify-content: flex-start;">
				<text v-if="!volunteer.rank" style="color: rgb(128,144,181);">根据分数自动确定排名</text>
				<text v-else>{{volunteer.rank}}名</text>

			</view>
		</view>
		<view class="item">
			<view class="leftName">
				<text>同分人数：</text>
			</view>
			<view class="ipt" style="display: flex;justify-content: flex-start;">
				<text v-if="!volunteer.number" style="color: rgb(128,144,181);">根据分数自动确定同分人数</text>
				<text v-else>{{volunteer.number}}人</text>

			</view>
		</view>
		<button type="primary" @click="updateInfo">保存</button>

	</view>

</template>

<script>
	const db = uniCloud.database();
	import {
		mutations,
		store
	} from "@/uni_modules/uni-id-pages/common/store.js";
	export default {
		data() {
			return {
				volunteer: {
					name: "",
					phone: "",
					province: "河南",
					zhuanke: "",
					benke: "",
					score: "",
					rank: "",
					number: ""
				},
				shengkongxian:[],
				zhuankeArr: [],
				benkeArr: [],
				columns: [],
				benkeFlag: false
			};
		},
		onLoad() {
			if(this.hasLogin){
				this.getUserInfo()
			}else{
				uni.showModal({
					content:"检测到您未登录，请先登录",
					success: (res) => {
						console.log(res.confirm)
						if(res.confirm){
							uni.switchTab({
								url:"/pages/self/self"
							})
						}else{
							uni.switchTab({
								url:"/pages/volunteer_index/volunteer_index"
							})
						}
					}
				})
			}
		},
		computed: {
			hasLogin() {
				return store.hasLogin;
			},
			userInfo() {
				return store.userInfo;
			}
		},
		methods: {
			query1(){
				uni.showLoading({
					title:"查询中..."
				})
			},
			getUserInfo(){
				const user_id= this.userInfo._id
				uni.showLoading({
					title:"查询中...",
					success: () => {
						db.collection("volunteer-userinfo").where(`user_id=="${user_id}"`).get().then((res)=>{
							console.log(res)
							if(res.result.data.length==0){uni.hideLoading();
							return}
							const da = res.result.data[0]
							this.volunteer.name =da.name;
							this.volunteer.phone =da.phone;
							this.volunteer.province =da.province;
							this.volunteer.zhuanke =da.zhuanke;
							this.volunteer.benke =da.benke;
							this.volunteer.score =da.score;
							this.volunteer.rank =da.rank;
							this.volunteer.number =da.number;
							
							uni.hideLoading()
							
						}).catch((err)=>{
							this.err1((err))
							uni.hideLoading()
						})
					}
				})
				
			
			},
			async updateInfo() {
				if(!this.hasLogin){return}
				if (this.volunteer.name == "" || this.volunteer.phone == "" || this.volunteer.zhuanke == "" || this
					.volunteer.benke == "" || this.volunteer.score == "") {
					uni.showToast({
						title: "信息不完整请检查",
						icon: "none"
					})
					return

				}
				console.log(this.volunteer)
				uni.showLoading({
					title: "查询中..."
				})
				let rankData = await db.collection("scores-rank").where(`major=="${this.volunteer.benke}"`).get()
				if (rankData.result.data.length == 0) {
					uni.hideLoading()
					uni.showToast({
						title: "查询不到数据，请检查",
						icon: "none"
					})
					return
				}
				console.log(rankData)
				let rankArr = rankData.result.data[0].data
				console.log(rankArr)
				let score = this.volunteer.score
				for (let i = 0; i < rankArr.length; i++) {
					if (rankArr[i].score == score) {
						this.volunteer.rank = rankArr[i].count + ""
						this.volunteer.number = rankArr[i].number + ""
						break
					}
				}
				if (this.volunteer.rank == "" || this.volunteer.number == "") {
					uni.hideLoading()
					uni.showToast({
						title: "查询不到数据，请检查",
						icon: "none"
					})
					return
				}

				uni.hideLoading()
				console.log(this.shengkongxian)
				this.shengkongxian.forEach((item)=>{	
					if(item.name==this.volunteer.benke){
						uni.setStorageSync("shengkongxian",item)
						console.log(item)
					}
				})
				
				uni.showToast({
					title: "查询成功！即将跳转回主页面",
					icon: "none",
					success: () => {
						const id = this.userInfo._id;
						db.collection("volunteer-userinfo").where(`user_id=="${id}"`).get().then((res) => {
							console.log(res)

							if (res.result.data.length == 0) {
								db.collection("volunteer-userinfo").add({
									"name": this.volunteer.name,
									"phone": this.volunteer.phone,
									"province": this.volunteer.province,
									"benke": this.volunteer.benke,
									"zhuanke": this.volunteer.zhuanke,
									"score": this.volunteer.score,
									"rank": this.volunteer.rank,
									"number": this.volunteer.number,
								}).then((re) => {
									console.log(re)
									setTimeout(()=>{
										uni.switchTab({
											url:"/pages/volunteer_index/volunteer_index"
										})
									},2500)
								}).catch((er)=>{
									this.err1((er))
								})
							} else {
								db.collection("volunteer-userinfo").where(`user_id=="${id}"`).update({
									"name": this.volunteer.name,
									"phone": this.volunteer.phone,
									"province": this.volunteer.province,
									"benke": this.volunteer.benke,
									"zhuanke": this.volunteer.zhuanke,
									"score": this.volunteer.score,
									"rank": this.volunteer.rank,
									"number": this.volunteer.number,
								}).then((da)=>{
									console.log(da)
									setTimeout(()=>{
										uni.switchTab({
											url:"/pages/volunteer_index/volunteer_index"
										})
									},2500)
								}).catch((err)=>{
									this.err1((err))
								})
							}
						}).catch((e)=>{
									this.err1((e))
								})
						
					}
				})
			},
			err1(er){
				//报错信息
				uni.showToast({
					title:"查询错误",
					icon:"none"
				})
				console.log(er)
			},
			pickCon(e) {
				//选择器点击确定
				console.log(e)
				this.volunteer.benke = e.value[0]
				this.benkeFlag = false
			},
			pickCan() {
				//选择器点击取消
				this.benkeFlag = false
			},
			pickClose() {
				//选择器取消
				this.benkeFlag = false
			},
		async	ipt(e) {
				//输入专科专业
				console.log(e.detail.value)

				let time = Date.now()

				console.log(e)
				console.log(time)
				console.log(e.detail.value.trim())
				console.log(time - this.time)
				if(e.detail.value==""){this.zhuankeArr=[]
				return}
				if (e.detail.value.trim() == "" || time - this.time < 3000) {
					//防抖
					console.log("防抖成功")
					
					return
				}
				
				let zhuanke = e.detail.value.trim()
			let zhuankeArr = await db.collection("zhuanke-benke")
			  .where(`${new RegExp(zhuanke, 'i')}.test(zhuanke)`)
			  .field("zhuanke")
			  .get();
			console.log(zhuankeArr.result.data)
			let zhuankeA = zhuankeArr.result.data
			let zhuankeNameArr=[]
			zhuankeA.forEach((item)=>{
				zhuankeNameArr.push(item.zhuanke)
			})
			this.zhuankeArr = zhuankeNameArr
				this.time = time
			},
			searchInput(item) {
				this.volunteer.zhuanke = item
				this.zhuankeArr = []
			},
		async	getBenka() {
				//获取本科专业
				if (this.volunteer.zhuanke == "") {
					uni.showToast({
						title: "请输入专科专业",
						icon: "none"
					})
					return
				}
				this.columns = []
				//获取本科专业
				
				let benkeArr=await db.collection("zhuanke-benke").where(`zhuanke=="${this.volunteer.zhuanke}"`).get()
				console.log(benkeArr.result.data[0].data)
				let benkeArr1 = benkeArr.result.data[0].data
						let arr = []
						benkeArr1.forEach((item) => {
							arr.push(item.name)
						})
						this.columns.push(arr)
						this.benkeArr = benkeArr
						
				this.benkeFlag = true
			}

		}
	}
</script>

<style lang="scss" scoped>
	.home {
		padding: 20rpx;
		box-sizing: border-box;

		.item {
			display: flex;
			justify-content: space-between;

			border-bottom: 1rpx solid #eee;
			padding: 20rpx;

			.leftName {}

			.ipt {
				// width: 250rpx;

				input {
					width: 250rpx;
					text-align: right;
				}
			}
		}

		button {
			margin-top: 20rpx;
		}
	}
</style>