<template>
	<view class="detail">
		<u-loading-page :loading="!showLoading" loading-text="数据加载中..."></u-loading-page>
		<view class="box" v-if="showLoading">
			<view class="title">
				<text>{{detailData.title}}</text>
			</view>
			<view class="userInfo">
				<view class="avatar">
					<image :src="getAvatar(detailData)" mode="aspectFill"></image>
				</view>
				<view class="nameProvince">
					<view class="userName">
						<text>{{getName(detailData)}}</text>
					</view>
					<view class="province">
						<view class="posttime">
							<uni-dateformat :date="detailData.publish_date"
								format="yyyy年MM月dd hh:mm:ss"></uni-dateformat>
						</view>
						<text>发布于{{detailData.province}}</text>
					</view>
				</view>

			</view>
			<view class="content">
				<u-parse :tagStyle="tagStyle" :content="detailData.content"></u-parse>
			</view>
			<view class="like">
				<view class="like_count" :class="detailData.isLike?'active':''" @click="clickLike">
					<text class="iconfont icon-good-fill"></text>
					<text v-if="like_count>0">{{like_count}}</text>
				</view>
			</view>
			<view class="comment_avatar">

				<view class="img" v-if="showAvatar">
					<template v-for="(item,index) in avatarArr">
						<image v-if="item" :src="item" mode="aspectFill"></image>
					</template>


				</view>
				<view class="count">
					<text class="num">{{detailData.view_count}}</text>
					<text>人看过</text>
				</view>
			</view>
		</view>
		<view class="comments" v-if="showLoading">
			<view v-if="noComment && !commentData.length" class="noComments">

				<u-empty text="暂无评论" icon="/static/details/sofa.jpg">
				</u-empty>

			</view>
			<view v-else class="">
				<view class="titleHot">
					<view class="line"></view>
					<text>热门评论</text>
				</view>
				<comments-item :item="item" v-for="(item,index) in commentData" :key="index"
					@removeCommentEnv="P_removeCommentEnv"></comments-item>
				<view class="uniMore">
					<uni-load-more :status="uniMore"></uni-load-more>
				</view>
			</view>



			<comments-frame :commentObj="commentObj" @commentEnv="P_commentEnv"></comments-frame>

		</view>

	</view>
</template>

<script>
	//引入登录页面路由
	import pageJson from "@/pages.json";
	import {
		getName,
		getAvatar,
		likeFun,
		getProvince
	} from '../../utils/tools';
	import {
		store
	} from '../../uni_modules/uni-id-pages/common/store';
	const db = uniCloud.database();
	const dbCmd = db.command;
	const utilsObj = uniCloud.importObject("utilsObj", {
		customUI: true
	});
	export default {
		data() {
			return {
				detailId: "",
				detailData: {},
				showLoading: false,
				tagStyle: {
					p: "font-size:16px;margin-bottom:10px;",
					img: "margin:10px 0"
				},
				showAvatar: false,
				avatarArr: [
					"../../static/ybmq.jpg",
					"../../static/ybmq.jpg",
					"../../static/ybmq.jpg"
				],
				commentObj: {
					comment_type: 0,
					article_id: "",
				},
				commentData: [],
				noComment: true, //文章是否有评论
				uniMore: "more", //uni-loading-more状态标识

			};
		},
		async onLoad(option) {


			if (!option.id) {
				this.errFun();
			} else {
				console.log(option);
				this.detailId = option.id;
				this.getDetail(option.id)
				this.readUpdate()
				this.getAvatarArr()
				this.commentObj.article_id = option.id
				console.log(this.userInfo)
				this.getComments()

			}

		},
		onReachBottom() {
			if (this.uniMore == "noMore") return
			this.getComments()
		},
		computed: {
			// name(){
			// 	return this.detailData.user_id[0].nickname?this.detailData.user_id[0].nickname:this.detailData.user_id[0].username
			// },
			// avatar(){
			// 	return this.detailData.user_id[0].avatar_file?this.detailData.user_id[0].avatar_file.url : '../../static/ybmq.jpg'
			// },
			like_count() {
				return this.detailData.like_count;
			},
			userInfo() {
				return store.userInfo;
			}

		},
		methods: {
			getAvatar,
			getName,
			//删除评论回调函数
			P_removeCommentEnv(e) {
				console.log(e)
				let index = this.commentData.findIndex((item) => {
					return item._id == e._id
				})
				this.commentData.splice(index, 1)
			},
			//评论成功回调函数
			async P_commentEnv(e) {
				console.log(e)
				e.user_id = [];
				e.user_id.push(this.userInfo);
				this.commentData.unshift({
					...e,
					...this.commentObj,
					comment_date: Date.now(),
				})
				console.log(this.commentData)

			},
			//修改阅读量
			readUpdate() {
				utilsObj.operation("quanzi_article", "view_count", this.detailId, 1)
			},
			//id错误处理
			errFun() {
				uni.showToast({
					title: "参数有误",
					icon: "none"
				})
				setTimeout(() => {
					uni.reLaunch({
						url: "/pages/index/index"
					})
				}, 1000)
			},
			getDetail(id) {
				let artData = db.collection("quanzi_article").where(`_id=="${id}"`).field(
					"user_id,view_count,like_count,comment_count,publish_date,title,content,province,_id").getTemp();
				let userData = db.collection("uni-id-users").field("username,nickname,avatar_file,_id").getTemp();
				let likeData = db.collection("quanzi_like").where(
					`article_id=="${this.detailId}" && user_id==$cloudEnv_uid`).getTemp();
				let arr = [artData, userData];
				console.log(store.hasLogin)
				if (store.hasLogin) arr.push(likeData)

				let isLike = false;
				db.collection(...arr).get({
					getOne: true
				}).then((res) => {
					console.log(res)
					if (!res.result.data) {
						this.errFun();
						return;
					}
					uni.setNavigationBarTitle({
						title: res.result.data.title
					})
					if (store.hasLogin) isLike = res.result.data._id?.quanzi_like?.length ? true : false;

					res.result.data.isLike = isLike;
					this.detailData = res.result.data;
					console.log(this.detailData);
					this.showLoading = true
					console.log(this.getAvatar(this.detailData))
				}).catch((err) => {
					this.errFun();
				})

			},
			//点赞操作
			async clickLike() {
				if (!store.hasLogin) {
					uni.showModal({
						title: "未登录无法操作，是否登录？",
						success: (res) => {
							if (res.confirm) {
								uni.navigateTo({
									url: "/" + pageJson.uniIdRouter.loginPage
								})
							}
						}
					})
					return
				}
				//防止恶意点击
				let time = Date.now();
				if (time - this.liketime < 2000) {
					uni.showToast({
						title: "操作频繁，请稍后再试",
						icon: "none"
					})
					return;
				}
				this.showAvatar = false;
				this.liketime = time;
				if (this.detailData.isLike) {
					this.detailData.like_count--;
					let index = this.avatarArr.findIndex(item => {
						return item == this.userInfo.avatar_file.url
					})
					console.log(index)
					if (index != -1) {
						this.avatarArr.splice(index, 1)
					}
					console.log(this.avatarArr)

				} else {
					this.detailData.like_count++;
					if (this.avatarArr.length == 3) {
						this.avatarArr.pop()
					}

					this.avatarArr.push(this.userInfo.avatar_file.url)

				}
				this.showAvatar = true
				this.detailData.isLike = !this.detailData.isLike;

				likeFun(this.detailId)
				console.log(this.avatarArr)

			},
			//获取最新点赞用户前三名头像数组
			async getAvatarArr() {
				// let artTemp=await	db.collection("quanzi_article").where(`_id=="${this.detailId}"`).field("_id,user_id").getTemp();
				let arttLikeTemp = await db.collection("quanzi_like").where(`article_id=="${this.detailId}"`).field(
					"_id,user_id,publish_date").getTemp();
				let userTemp = await db.collection("uni-id-users").field("_id,avatar_file").getTemp();

				// console.log(artTemp)
				db.collection(arttLikeTemp, userTemp).orderBy('publish_date desc').limit(3).get().then(res => {
					console.log(res)

					let arr = res.result.data.map(item => {
						// console.log(item.user_id[0]?.avatar_file||'../../static/ybmq.jpg')
						return item.user_id[0]?.avatar_file?.url || false;
					})

					this.avatarArr = arr.reverse();
					this.showAvatar = true
				})

			},
			//获取评论列表
			async getComments() {
				this.uniMore = "loading"
				let commentTemp = await db.collection("quanzi_comments").where(
						`article_id=="${this.detailId}"&&comment_type==0`)
					.orderBy("comment_date desc").skip(this.commentData.length).limit(5).getTemp()
				let userTemp = await db.collection("uni-id-users").field("username,nickname,avatar_file,_id").getTemp()
				//评论数据res
				let res = await db.collection(commentTemp, userTemp).get()
				let commentDataArr = res.result.data
				console.log(res)
				//页面展示的评论id列表
				let commentIdArr = commentDataArr.map(item => {
					return item._id;
				})
				console.log(commentIdArr)
				//用页面展示的id列表去请求查询回来的根据回复id分组条数
				let commentTotal= await db.collection("quanzi_comments")
				 .where({"reply_comment_id":dbCmd.in(commentIdArr)})
				 .groupBy('reply_comment_id')
				 .groupField('count(*) as total').get()
				console.log(commentTotal)
				
				commentDataArr.forEach((item)=>{
					let index = commentTotal.result.data.findIndex((i)=>{
						return i.reply_comment_id==item._id
					})
					console.log(index)
					if(index!=-1)item.commenttotal = commentTotal.result.data[index].total
					
				})
				
				let oldList = this.commentData;
				let newList = commentDataArr;

				if (commentDataArr.length > 0) {
					this.commentData = [...oldList, ...newList];
					this.noComment = false
					this.uniMore = "more"
				}
				if (commentDataArr.length < 5) {
					this.uniMore = "noMore"
				}


			}
		}
	}
</script>

<style lang="scss" scoped>
	.detail {
		box-sizing: border-box;
		// padding-bottom: 120rpx;
		min-height: calc(100vh - var(--window-top));
		background-color: #f8f8f8;

		.box {
			background-color: #fff;
			padding: 25rpx;

			.title {
				font-size: 40rpx;
				font-weight: bold;
				margin-bottom: 20rpx;
				line-height: 1.4em;
			}

			.userInfo {
				display: flex;
				justify-content: flex-start;
				align-items: center;
				margin-bottom: 30rpx;

				.avatar {
					width: 50rpx;
					height: 50rpx;

					image {
						width: 100%;
						height: 100%;
						border-radius: 50%;

					}
				}

				.nameProvince {
					display: flex;
					font-size: 25rpx;
					flex-direction: column;
					margin-left: 10rpx;

					.userName {
						color: #333;
					}

					.province {
						display: flex;
						color: #666;

						.posttime {
							margin-right: 10rpx;
						}
					}
				}

			}

			.content {

				margin-bottom: 40rpx;


			}

			.like {
				display: flex;
				justify-content: center;
				align-items: center;
				margin-bottom: 40rpx;

				.like_count {
					width: 300rpx;
					height: 150rpx;
					border-radius: 100rpx;
					background-color: #e4e4e4;
					// color: #fff;
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;
					font-size: 30rpx;
					color: #fff;

					&.active {
						background-color: #0199FE;
					}

					.iconfont {
						font-size: 45rpx;
						margin-bottom: 5rpx;

					}
				}

			}

			.comment_avatar {
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				width: 100%;
				height: 200rpx;

				.img {
					width: 100%;
					height: 80rpx;
					display: flex;
					// 	align-items: center;
					justify-content: center;

					image {
						border: 3px solid #fff;
						width: 60rpx;
						height: 60rpx;
						border-radius: 50%;

						margin-left: -20rpx;

					}


				}

				.count {
					font-size: 25rpx;

					.num {
						color: #0199FE;

					}
				}
			}

		}

		.titleHot {
			font-size: 40rpx;
			font-weight: bold;
			margin-bottom: 30rpx;
			padding: 30rpx 30rpx 0 30rpx;
			display: flex;
			justify-content: flex-start;
			align-items: center;

			.line {
				margin-right: 10rpx;
				width: 8rpx;
				height: 40rpx;
				background-color: #0199FE;
			}
		}

		.uniMore {
			padding-bottom: 120rpx;
		}
		.comments{
			.noComments{
				padding-bottom: 140rpx;
			}
		}
	}
</style>