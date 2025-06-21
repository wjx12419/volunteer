<template>
	<view class="home">
		<view class="list">
			<view class="item" v-for="(item,index) in data" :key="index" @click="navDetails(item.article_id[0]._id)">
				<view class="content">
					<view class="title">
						<text>{{item.article_id[0].title}}</text>
					</view>
					<view class="icon">
						<text class="iconfont icon-a-10-you"></text>
					</view>
				</view>

			</view>
		</view>
		<u-loadmore :status="status" :loading-text="loadingText" :loadmore-text="loadmoreText" :nomore-text="nomoreText"></u-loadmore>
	</view>
</template>

<script>
	const db = uniCloud.databaseForJQL();
	export default {
		data() {
			return {
				data: [],
				status: 'loadmore',
				loadingText: '努力加载中',
				loadmoreText: '下拉刷新',
				nomoreText: '没有更多了...'
			};
		},
		onLoad() {
			this.getData()
		},
		 onPullDownRefresh() {
			 this.status=="loadmore"
			this.data = [];
			 this.getData()
		
		},
		onReachBottom() {
			if(this.status=="nomore")return
			this.getData()
		},
		methods: {
			async getData() {
				this.status = "loading";
				const likeTemp = db.collection("quanzi_like").where(`user_id==$cloudEnv_uid`).field(
					"_id,publish_date,article_id").getTemp();
				const arcTemp = db.collection("quanzi_article").where(`delState != true`).field("_id,title").getTemp();
				let arr = [likeTemp, arcTemp];
				let res = await db.collection(...arr).orderBy("publish_date desc").skip(this.data.length).limit(15).get()
					console.log(res.data)
					let oldList=this.data;
					let newList = res.data;
					
					this.data  = [...oldList,...newList]
					if(res.data.length<15){
						this.status="nomore";
						uni.stopPullDownRefresh();
						return;
					}
					uni.stopPullDownRefresh();
				this.status = "loadmore"
			},
			navDetails(id){
				uni.navigateTo({
					url:"/pages/detail/detail?id="+id
				})
			}
		}
	}
</script>

<style lang="scss">
	.home {

		.list {

			// margin: 20rpx;
			.item {
				// width: 100%;
				padding: 20rpx;
				border-bottom: 5rpx #eee solid;

				.content {
					display: flex;
					justify-content: space-between;
					padding: 0 20rpx;
					align-items: center;

					.icon {
						color: rgb(187, 187, 187);

					}

				}
			}
		}
	}
</style>