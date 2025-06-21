<template>
	<view class="home">
		<view class="search">
			<u-search @search="searchT" v-model="searchTitle" placeholder="请输入文章标题" :showAction="false"></u-search>
		</view>
		<view class="topnav">
			<u-tabs :activeStyle="{
            color: '#303133',
            fontWeight: 'bold',
            transform: 'scale(1.05)'
			}" :list="navlist" @click="navclick($event)"></u-tabs>
		</view>
		<view v-if="!loadingState">
			<view class="content" v-for="(ite,index) in dataList" :key="index"
				:style="index==dataList.length-1?'border:none':''">
				<blog-item @delEvent="P_delEvent" @click="onclickImg" :item="ite" :isLike.sync="ite.isLike" :like_count.sync="ite.like_count"></blog-item>

			</view>
		</view>



		<view class="edit" @click="goEdit">
			<text class="iconfont icon-a-21-xiugai"></text>
		</view>
		<view class="loadingState" v-show="loadingState">
			<u-skeleton rows="3" title avatar :loading="loadingState"></u-skeleton>
		</view>

		
		<uni-load-more :status="uniMore"></uni-load-more>

	</view>
</template>

<script>
	const db = uniCloud.database();
	const dbCmd = db.command;
	import {
		store
	} from '../../uni_modules/uni-id-pages/common/store';
	export default {
		data() {
			return {
				navlist: [{
						"name": "最新",
						type: "publish_date"
					},
					{
						"name": "热门",
						type: "view_count"
					},

				],
				navActive: 0,//最新热门索引
				loadingState: true,//遮罩层状态
				dataList: [],//列表数据
				uniMore:"more",//uni-loading-more状态标识
				noMore:false,//true为数据加载完全
				searchTitle:""
			}
		},
		computed: {

		},
		onLoad() {
			this.getListData();

		},
		onShow() {
			// this.getListData();
		},
		onReachBottom() {
			if(this.noMore){
				this.uniMore = "noMore"
				return
			}
			this.uniMore = "loading"
			this.getListData();
		},
		onPullDownRefresh() {
			this.dataList =[];
			this.noMore = false;
			this.uniMore = "more";
			this.loadingState = true;
			this.getListData()
		},
		methods: {
			async searchT(){
				// const res = await db.collection('quanzi_article').where(`${new RegExp(this.searchTitle, 'i')}.test(title)`).get()
				// console.log(res)
				// this.dataList = res.result.data
				// return
				this.dataList =[]
				this.noMore = false;
				this.uniMore = "more";
				this.loadingState = true;
				
				let artData = db.collection("quanzi_article").where(`delState != true&&${new RegExp(this.searchTitle, 'i')}.test(title)`).field(
						"description,picUrls,province,publish_date,title,user_id,view_count,comment_count,like_count")
					.getTemp()
					console.log(artData)
				let userData = db.collection("uni-id-users").field("username,nickname,avatar_file,_id").getTemp()
				let listData = await db.collection(artData, userData)
					.orderBy(this.navlist[this.navActive].type +" desc")
					.skip(this.dataList.length)
					.limit(5)
					.get();
					
				let oldDataArr = this.dataList;
				if(listData.result.data.length<5)this.noMore =true;
				console.log(listData)
				//给数据中各个对象加isLike属性，方便判断点赞
				let resDataArr = listData.result.data;
				resDataArr.map(item => {
					return item.isLike = false
				})
				
				if (store.hasLogin) {
				
					//获取到的文章id列表
					let artIdArr = [];
					resDataArr.forEach(item => {
						// console.log(item)
						artIdArr.push(item._id)
					})
					this.userArtLike(artIdArr, resDataArr,oldDataArr)
			
				} else {
					this.dataList = [...oldDataArr,...resDataArr];
					this.loadingState = false;
					uni.stopPullDownRefresh();
				}
			},
			//最新热门加载
			navclick(e) {
				console.log(e)
				this.dataList=[];
				this.noMore = false;
				this.uniMore = "more";
				this.loadingState = true;
				this.navActive = e.index
				this.getListData();
			},
			P_delEvent() {
				this.loadingState = true;
				this.getListData();
			},
			goEdit() {
				uni.navigateTo({
					url: "/pages/edit/edit"
				})
			},
			async getListData() {
				let artData = db.collection("quanzi_article").where(`delState != true`).field(
						"description,picUrls,province,publish_date,title,user_id,view_count,comment_count,like_count")
					.getTemp()
				let userData = db.collection("uni-id-users").field("username,nickname,avatar_file,_id").getTemp()
				let listData = await db.collection(artData, userData)
					.orderBy(this.navlist[this.navActive].type +" desc")
					.skip(this.dataList.length)
					.limit(5)
					.get();
					
				let oldDataArr = this.dataList;
				if(listData.result.data.length<5)this.noMore =true;
				console.log(listData)
				//给数据中各个对象加isLike属性，方便判断点赞
				let resDataArr = listData.result.data;
				resDataArr.map(item => {
					return item.isLike = false
				})

				if (store.hasLogin) {

					//获取到的文章id列表
					let artIdArr = [];
					resDataArr.forEach(item => {
						// console.log(item)
						artIdArr.push(item._id)
					})
					this.userArtLike(artIdArr, resDataArr,oldDataArr)

				} else {
					this.dataList = [...oldDataArr,...resDataArr];
					this.loadingState = false;
					uni.stopPullDownRefresh();
				}

			},
			async userArtLike(artIdArr, resDataArr,oldDataArr) {
				// console.log(artIdArr)
				// console.log(uniCloud.getCurrentUserInfo())
				let resLike = await db.collection("quanzi_like").where({
					article_id: dbCmd.in(artIdArr),
					user_id: uniCloud.getCurrentUserInfo().uid
				}).get()
				console.log(resLike)
				resLike.result.data.forEach(item => {
					let findIndex = resDataArr.findIndex(find => {
						return item.article_id == find._id
					})
					console.log(findIndex)
					resDataArr[findIndex].isLike = true;
				})
				this.dataList = [...oldDataArr,...resDataArr]
				this.loadingState = false;
				uni.stopPullDownRefresh();


			},
			

		}
	}
</script>

<style lang="scss" scoped>
	.home {
		box-sizing: border-box;
		.search{
			padding: 20rpx;
		}
		// #ifdef APP-PLUS

		// #endif
		// #ifdef MP-WEIXIN
		height: calc(100vh - 500rpx);
		// #endif

		.topnav {
			margin-bottom: 10rpx;
		}

		.content {
			padding: 20rpx;
			border-bottom: #f7f7f7 10rpx solid;
			// #ifdef H5

			// #endif

		}

		.loadingState {

			padding: 30rpx;
		}

		.edit {
			width: 100rpx;
			height: 100rpx;
			border-radius: 50%;
			background-color: #0199FE;
			position: fixed;
			z-index: 100;

			bottom: 150rpx;
			// #ifdef H5
			bottom: 250rpx;
			// #endif
			right: 50rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			box-shadow: 0 0 20rpx rgba(1, 153, 254, 0.8);

			.iconfont {
				font-size: 50rpx;
				color: white;
			}
		}

	}
</style>