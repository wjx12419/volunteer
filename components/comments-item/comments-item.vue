<template>
	<view>
		<view class="comments" @click="goReply">
			<view class="item">
				<view class="left">
					<view class="avatar">
						<image :src="getAvatar(item)" mode="aspectFill"></image>
					</view>

				</view>
				<view class="right">
					<view class="name_good_province">


						<view class="name_province">
							<view class="name">
								<text>{{getName(item)}}</text>
							</view>

						</view>

						<view class="good" v-if="!closebtn">
						<!-- 	<text class="iconfont icon-a-106-xihuan"></text><text>112</text>
							<text class="iconfont icon-a-106-xihuan bad"></text> -->
							<text class="iconfont icon-a-123-cuowu" @click.stop="delComment"></text>
						</view>
					</view>
					<view class="user_comment">
						<text>{{item.comment_content}}</text>
					</view>
					<view class="more_comment_comment_date">
						<view class="more_comment" v-if="!childState">
							{{item.commenttotal || ""}}回复>
						</view>
						<view class="comment_date">
							<uni-dateformat :date="item.comment_date" format="MM月dd hh:mm"
								:threshold="[60000,3600000*24*30]"></uni-dateformat>
						</view>
						<view class="province">
							<text>{{item.province}}</text>
						</view>
					</view>
				</view>


			</view>

		</view>
	</view>
</template>

<script>
	const db = uniCloud.database();
	import {
		getName,
		getAvatar,
	} from '../../utils/tools';
	const utilsObj = uniCloud.importObject("utilsObj", {
		customUI: true
	});
	export default {
		name: "comments-item",
		props: {
			//评论列表数据
			item: {
				type: Object,
				default: () => {
					return {

					}
				}
			},
			//是否是二级评论状态，true隐藏回复和点击事件
			childState:{
				tyep:Boolean,
				default:false
			},
			//是否显示删除评论按钮
			closebtn:{
				type:Boolean,
				default:false
			}
		},
		data() {
			return {
				
			};
		},
		onLoad() {
			
		},
		methods: {
			getAvatar,
			getName,
			//跳转到二级回复页面
			goReply(){
				if(this.childState)return;
				uni.setStorageSync("replyItem",this.item)
				uni.navigateTo({
					url:"/pages/reply/reply"
				})
			},
			//点击叉号删除
			delComment(){
				console.log(this.item)
				let uid = uniCloud.getCurrentUserInfo().uid;
				if(uid==this.item.user_id[0]._id || this.uniIDHasRole('admin') || this.uniIDHasRole('webmaster')){
					uni.showModal({
						title:"是否删除评论",
						
						success:(res)=> {
							console.log(res)
							if(res.confirm){
								//点击确定
								db.collection("quanzi_comments").doc(this.item._id).remove().then(res=>{
									console.log(res)
									uni.showToast({
										title:"删除成功",
										icon:"none"
									})
									this.$emit("removeCommentEnv",{_id:this.item._id})
									utilsObj.operation("quanzi_article","comment_count",this.item.article_id,-1)
								})
							}
						}
					})
				}else{
					uni.showToast({
						title:"未授权",
						icon:"none"
					})
				}
				
			},
			
		}
	}
</script>

<style lang="scss" scoped>
	.comments {
		padding: 30rpx;
		border-bottom: 1rpx solid #9acafc;
		

		.item {
			display: flex;
			justify-content: flex-start;
			align-items: flex-start;
			
			.left {
				margin-right: 20rpx;

				.avatar {
					width: 50rpx;
					height: 50rpx;

					image {
						width: 100%;
						height: 100%;
						border-radius: 50%;
					}
				}
			}

			.right {
				display: flex;
				flex-direction: column;
				width: 90%;

				.name_good_province {
					display: flex;
					justify-content: space-between;
					align-items: center;

					.name_province {
						display: flex;

						.name {
							font-size: 25rpx;
							// margin-left: 15rpx;
						}

						.province {
							margin-left: 20rpx;
							font-size: 25rpx;
						}
					}


					.good {
						.iconfont{
							font-size: 40rpx;
							
							padding: 5rpx;
						}
						.bad {
							margin-left: 20rpx;
						}
					}
				}

				.user_comment {
					padding: 20rpx 0;
					
				}

				.more_comment_comment_date {
					// margin-left: 75rpx;
					// margin: 20rpx 0 20rpx 65rpx;

					display: flex;
					justify-content: flex-start;
					align-items: center;
					font-size: 25rpx;

					.more_comment {
						display: flex;
						align-items: center;
						justify-content: center;
						width: 100rpx;
						height: 40rpx;
						line-height: 40rpx;
						
						border-radius: 30rpx;
						background-color: #e4e4e4;
						margin-right: 20rpx;

					}

					.comment_date {
						display: flex;
						align-items: center;
						justify-content: center;
						// color: #e4e4e4;
						height: 40rpx;
						line-height: 40rpx;
						margin-right: 10rpx;
					}

				}
			}

		}
	}
</style>