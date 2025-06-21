<template>
	<view>
		<view class="tp">
			<view class="left">
				<view class="avatar">
					<image :src="getAvatar(item)" mode="aspectFill"></image>
				</view>

				<view class="user">
					{{getName(item)}}
				</view>
				<view class="posttime">
					<uni-dateformat :date="item.publish_date" format="MM月dd hh:mm"
						:threshold="[60000,3600000*24*30]"></uni-dateformat>
				</view>
			</view>

			<text class="iconfont icon-ellipsis" @click="clickSheet()"></text>
		</view>
		<view class="in" @click="clickNavDetail(item._id)">
			<view class="title" v-if="item.title">
				{{item.title}}
			</view>
			<view class="detail" v-if="item.description">
				{{item.description}}
			</view>
			<view class="piclist" v-if="item.picUrls.length">
				<view class="imglist" :class="item.picUrls.length==1?'only':''" v-for="(ite,index) in item.picUrls"
					:key="index">
					<image @click="previewImage(index)" :src="ite" mode="aspectFill"></image>
				</view>
			</view>

		</view>
		<view class="btm">
			<view class="liulan" @click="clickNavDetail(item._id)">
				<text class="iconfont icon-a-27-liulan"></text> <text>{{item.view_count}}</text>
			</view>
			<view class="pinglun" @click="clickNavDetail(item._id)">
				<text class="iconfont icon-a-5-xinxi"></text>
				<text>{{!item.comment_count==0?item.comment_count:"评论"}}</text>
			</view>
			<view class="dianzan "  :class="item.isLike?'active':''" @click="clickLike">
				<text class="iconfont icon-a-106-xihuan " ></text>
				<text>{{!item.like_count==0?item.like_count:"点赞"}}</text>
				
			</view>
		</view>
		<u-action-sheet :actions="list"  :show="sheetShow" cancelText="取消"
		:closeOnClickOverlay="true" :closeOnClickAction="true" @select="sheetSelect" @close="sheetClose"
		></u-action-sheet>
	</view>
</template>

<script>
	const db = uniCloud.database();
	import {
		getName,
		getAvatar,
		likeFun
	} from '../../utils/tools'
	import { store } from '../../uni_modules/uni-id-pages/common/store';
	export default {
		name: "blog-item",
		props: {
			item: {
				type: Object,
				default () {
					return {
						
					}
				}
			},
			isLike:{
				type:Boolean,
			},
			like_count:{
				type:Number
			}

		},
		data(){
			return{
				list: [{
					name: '修改',
					fontSize: '20',
					type:"edit",
					disabled:true
				}, {
					name: '删除',
					color: '#f56c6c',
					fontSize: '20',
					type:"del",
					disabled:true
				}],
				sheetShow: false,
				
			}
		},
		onLoad() {
			
		},
		methods: {
			getName,
			getAvatar,
			previewImage(index) {
				uni.previewImage({
					urls: this.item.picUrls,
					count: index,
					current: index
				})
			},
			clickNavDetail(id) {
				uni.navigateTo({
					url: "/pages/detail/detail?id=" + id
				})
			},
			//点击更多
			clickSheet() {
				if(!store.hasLogin){
					uni.showToast({
						title:"未登录，请先登录",
						icon:"none"
					})
					return
				}
				let uid = uniCloud.getCurrentUserInfo().uid
				console.log(uid==this.item.user_id[0]._id)
				console.log(this.uniIDHasRole('admin') )
				if(uid==this.item.user_id[0]._id || this.uniIDHasRole('admin') || this.uniIDHasRole('webmaster')){
					this.list.forEach((item)=>{
						item.disabled = false
						console.log(item)
					})
				
				}
				
				this.sheetShow = true;
			},
			//点击ActionSheet列表项时触发
			sheetSelect(e){
				console.log(e)
				if(e.type=="edit"){
					console.log(this.item)
					uni.navigateTo({
						url:"/pages/revise/revise?id="+this.item._id
					})
				}else if(e.type=="del"){
					this.delFun();
				}
				this.sheetShow = false;
			},
			//点击删除列表项
			delFun(){
				uni.showLoading({
					title:"删除中..."
				})
				db.collection("quanzi_article").doc(this.item._id).update({
					delState:true
				}).then((res)=>{
					uni.hideLoading();
					uni.showToast({
						title:"删除成功！",
						icon:"none"
					})
					this.$emit("delEvent",true)
				}).catch(err=>{
					uni.hideLoading();
					uni.showToast({
						title:err
					})
				})
			},
			//点击取消按钮时触发
			sheetClose(){
				this.sheetShow =false;
			},
			clickLike(){
					if(!store.hasLogin){
						uni.showToast({
							title:"未登录",
							icon:"none"
						})
						return;
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
					
					this.liketime = time;
					
					let like_count = this.item.like_count
					
					this.item.isLike?like_count--:like_count++;
					let isLike = !this.item.isLike
					
					this.$emit("update:isLike",isLike)
					this.$emit("update:like_count",like_count)
					// if(this.item.isLike){
					// 	this.item.like_count--
					// }else{
					// 	this.item.like_count++
					// }
					// this.item.isLike = !this.item.isLike
					
					likeFun(this.item._id);
			}
		},
		computed: {
			// avatar(){
			// 	return this.item.user_id[0].avatar_file?this.item.user_id[0].avatar_file.url : '../../static/user-default.jpg'
			// },
			// userName(){
			// 	return this.item.user_id[0].nickname?this.item.user_id[0].nickname:this.item.user_id[0].username
			// }
		},
	}
</script>

<style lang="scss" scoped>
	.tp {
		display: flex;
		justify-content: space-between;

		.left {
			display: flex;
			justify-content: flex-start;
			font-size: 25rpx;
			line-height: 40rpx;

			.avatar {
				image {
					width: 40rpx;
					height: 40rpx;
					overflow: hidden;
					border-radius: 50%;
				}
			}

			.user {
				padding: 0 15rpx;

			}

			.posttime {}
		}



		.iconfont {
			font-size: 50rpx;
		}
	}

	.in {
		padding: 10rpx 0;

		.title {
			font-size: 35rpx;
			font-weight: bold;
			padding-bottom: 10rpx;
		}

		.detail {
			color: #888;
			font-size: 25rpx;
			// 注意，不要设置此标签的高度，下方代码设置了行数，会自动根据行数进行计算高度的。
			//整体超出部分隐藏
			overflow: hidden;
			//文本超出部分以...形式展示，同第一行样式代码
			text-overflow: ellipsis;
			//display 块级元素展示
			display: -webkit-box;
			//设置文本行数为2行
			-webkit-line-clamp: 2;
			//设置文本行数为2行
			line-clamp: 2;
			//从上到下垂直排列子元素（设置伸缩盒子的子元素排列方式）
			-webkit-box-orient: vertical;
			word-break: break-all;
			text-indent: 1em;

		}

		.piclist {
			display: flex;
			margin-top: 10rpx;

			.imglist {
				// padding-top: 10rpx;
				width: 225rpx;
				height: 225rpx;
				overflow: hidden;
				margin-right: 6rpx;

				image {
					// padding: 0 5rpx ;

					width: 100%;
					height: 100%;

				}

				&:first-child {
					border-radius: 20rpx 0 0 20rpx;
				}

				&:last-child {
					border-radius: 0 20rpx 20rpx 0;
				}

				&.only {
					border-radius: 20rpx;
				}
			}
		}

	}

	.btm {
		display: flex;
		justify-content: space-around;
		padding: 15rpx 0 5rpx;
		align-items: center;

		.iconfont {
			font-size: 35rpx;
			padding-right: 10rpx;
		}


		.liulan {}

		.pinglun {}

		.dianzan {
		
		}
		.dianzan.active{
			color: rgb(1,153,254);
			
		}
	}
</style>