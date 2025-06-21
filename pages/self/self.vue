<template>
	<view class="self">

		<view class="top" @click="toUserinfo">
			<view class="userInfo">
				<view class="avatar">
					<image v-if="hasLogin&&userInfo.avatar_file&&userInfo.avatar_file.url"
						:src="userInfo.avatar_file.url" mode="aspectFill"></image>
					<image v-else src="/static/user-default.jpg" mode="aspectFill"></image>
				</view>
				<view class="nameTime" v-if="hasLogin">
					<view class="name">
						<text>{{userInfo.nickname||userInfo.username||userInfo.mobile}}</text>
					</view>
					<view class="time">
						<uni-dateformat :date="userInfo.register_date"
							:threshold="[3600,1000*60*60*24*365*99]"></uni-dateformat>
					</view>
				</view>
				<view class="name" v-else>
					点击登录
				</view>
			</view>

			<view class="tip">
				<text class="iconfont icon-a-10-you"></text>
			</view>
			<view class="bg">
				<image v-if="hasLogin&&userInfo.avatar_file&&userInfo.avatar_file.url" :src="userInfo.avatar_file.url"
					mode="aspectFill"></image>
				<image v-else src="/static/user-default.jpg" mode="aspectFill"></image>
			</view>
		</view>
		
		<view class="con">
			<view class="count" v-if="isTotal">
				<text class="item">{{totalObj.artLikeNum||0}}</text><text>获赞</text>
				<text class="item">{{totalObj.commentsNum||0}}</text><text>评论</text>
				<text class="item">{{totalObj.artNum||0}}</text><text>发文</text>
			</view>
			
			<view class="list">
				<view class="group" v-for="(group,index) in listName" :key="index">
					<template v-if="hasLogin || group[0].num!=6">
						<view class="item" v-for="(item,inde) in group" :key="inde" @click="clickOn(item.num)">
							<view class="content">
								<text class="iconfont" :class="item.icon"></text>
								<text>{{item.title}}</text>
							</view>
							<view class="tip">
								<text class="iconfont icon-a-10-you"></text>
							</view>
						</view>
					</template>
				</view>



			</view>


		</view>
		<!-- <navigator url="/pages/test/test">
			<button>测试页面</button>
		</navigator> -->
	</view>
</template>

<script>
	import pageJson from "@/pages.json"
	import {
		store,
		mutations
	} from "@/uni_modules/uni-id-pages/common/store.js"
	const db = uniCloud.database();
	export default {
		data() {
			return {
				totalObj: {
					artNum: 0, //发文数
					artLikeNum: 0, //点赞数
					commentsNum: 0, //评论数
				},
				isTotal:false,
				listName: {
					group1: [
						{
							title: "志愿列表",
							icon: "icon-a-21-xiugai",
							num: 3
						},{
							title: "我的长文",
							icon: "icon-a-24-bianji",
							num: 1
						},
						{
							title: "我的点赞",
							icon: "icon-a-106-xihuan",
							num: 2
						}
						
					],
					group2: [
						{
							title: "意见反馈",
							icon: "icon-a-5-xinxi",
							num: 5
						}
					],
					group3: [{
						title: "退出登录",
						icon: "icon-a-73-tuichu",
						num: 6
					}]
				}

			};
		},
		onLoad() {
			if(store.hasLogin){
				this.getNum()
			}
		
		
		},
		onShow() {
			this.isTotal=false
			if(store.hasLogin){
				this.getNum()
				
			}
			
		},
		computed: {
			userInfo() {
				return store.userInfo;
			},
			hasLogin() {
				return store.hasLogin;
			},

		},
		methods: {
			toUserinfo() {
				// uni.navigateTo({
				// 	url:"/pages/userinfo/userinfo"
				// })
				
				if(store.hasLogin){
					uni.navigateTo({
						url: '/uni_modules/uni-id-pages/pages/userinfo/userinfo'
					})
				}else{
					let route = this.$mp.page.route;
					uni.navigateTo({
						url: '/uni_modules/uni-id-pages/pages/login/login-withpwd?uniIdRedirectUrl=/'+route
					})
				}
				
			},
			async getNum() { //获取发文数，点赞数，评论数
				
				let artCount = await db.collection("quanzi_article").where(
					`user_id==$cloudEnv_uid && delState != true`).count();
				this.totalObj.artNum = artCount.result.total;
				console.log(artCount.result.total)
				//直接可以数据库计算，不用拿回来计算
				let artLikeCount = await db.collection("quanzi_article").where(
						`user_id==$cloudEnv_uid && delState != true`)
					.groupBy("user_id") //数据库指定名称分组
					.groupField("sum(like_count) as totalScore") //数据库根据分组计算数据 totalScore为设置的计算后返回值
					.get({
						getOne: true
					});
				console.log(artLikeCount)
				this.totalObj.artLikeNum = artLikeCount.result.data?.totalScore||0;
				console.log(this.totalObj)
				this.isTotal=true

			},
			clickOn(num) {
				console.log(num)
				/**
				 * * 1跳转志愿信息
				 * 2跳转长文列表
				 * 3跳转点赞列表
				 * 4跳转关于页面
				 * 5跳转意见反馈页面
				 * 6退出登录
				 */
				if (num == 1) {
					if (this.goLoginPage()) return;
					uni.navigateTo({
						url: "/pages/quanzi_article/list"
					})
				} else if (num == 2) {
					if (this.goLoginPage()) return;
					uni.navigateTo({
						url: "/pages/quanzi_like/list"
					})
				} else if (num == 3) {
					uni.navigateTo({
						url:"/pages/volunteerList/volunteerList"
					})
				}  else if (num == 5) {
					if (this.goLoginPage()) return;
					uni.navigateTo({
						url: "/uni_modules/uni-feedback/pages/opendb-feedback/opendb-feedback"
					})
				} else if (num == 6) {
					

					//用户退出登录
					this.logout();
				}
			},
			//退出登录
			logout() {

				uni.showModal({
					title: "是否退出登录",
					success: (res) => {
						console.log(res)
						if (res.confirm) {
							//清空获赞，评论数，发文数
							this.totalObj.artNum = 0;
							this.totalObj.artLikeNum = 0;
							this.totalObj.commentsNum = 0;
							mutations.logout();
						}
					}
				})
			},
			//判断是否登录
			goLoginPage() {
				if (!this.hasLogin) {
					uni.showToast({
						title: "未登录",
						icon: "none"
					})
					return true;
				}
				return false
			}
		}
	}
</script>

<style lang="scss" scoped>
	.self {


		.top {
			position: relative;
			z-index: 10;
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 20rpx;
			height: 300rpx;
			padding-top: var(--status-bar-height);
			background-color: #bbb;

			.tip {
				padding-right: 10rpx;

				.iconfont {
					color: #fff;

					font-size: 50rpx;
				}

			}

			.userInfo {
				display: flex;
				justify-content: flex-start;
				align-items: center;
				position: relative;
				z-index: 10;

				.avatar {
					width: 120rpx;
					height: 120rpx;
					overflow: hidden;
					border-radius: 50%;
					margin-right: 20rpx;

					image {
						width: 100%;
						height: 100%;

					}
				}
			}

			.name {
				color: #fff;
				font-size: 40rpx;
				font-weight: bold;
			}

			.nameTime {

				.name {
					color: #fff;
					font-size: 40rpx;
					font-weight: bold;
				}

				.time {
					color: #f4f4f4;
					font-size: 30rpx;
				}
			}

			.bg {
				position: absolute;
				width: 100%;
				height: 100%;
				overflow: hidden;
				left: 0;
				top: 0;

				image {
					width: 100%;
					height: 100%;
					filter: blur(40rpx);
					transform: scale(2);
					opacity: 0.5;
				}
			}
		}

		//中部
		.con {
			position: relative;
			z-index: 10;
			padding: 30rpx 0;
			//点赞评论发文统计
			background-color: #fff;
			width: 100%;

			border-radius: 40rpx 40rpx 0 0;
			transform: translateY(-30rpx);

			text {
				margin-left: 15rpx;
			}

			.count {
				// margin-bottom: 20rpx;
				padding: 20rpx;

				.item {
					color: blue;
				}
			}

			.list {


				.group {
					padding: 15rpx 20rpx;
					border-bottom: 15rpx solid #f4f4f4;

					.item {
						display: flex;
						justify-content: space-between;
						align-items: center;
						// margin-bottom: 20rpx;
						padding: 25rpx 0;
						font-size: 40rpx;
						border-bottom: 1rpx solid #f8f8f8;

						.content {

							.iconfont {
								font-size: 40rpx;
								margin-right: 10rpx;
							}

							.tip {}
						}
					}

					.item:last-child {
						border: none;
					}

					&:last-child {
						border: none;
					}
				}

			}

		}
	}
</style>