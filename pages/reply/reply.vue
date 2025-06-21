<template>
	<view class="reply"> 
		<view class="top">
			<comments-item  :item="replyItem" :childState="true" :closebtn="true"></comments-item>
		</view>
		<view class="list">
			<view class="row"  v-for="(item,index) in userCommentList" :key="index">
				<comments-item @removeCommentEnv="removeCommentEnv" :item="item" :childState="true"></comments-item>
			</view>
			
		</view>
		<view>
			<comments-frame @commentEnv="commentEnv"  :placeholder="placeholder" :commentObj="commentObj"></comments-frame>
		</view>
		<view class="uniMore">
			<uni-load-more :status="uniMore" ></uni-load-more>
		</view>
		
	</view>
</template>

<script>
	import {getName}  from "../../utils/tools.js";
	const db  = uniCloud.database();
	export default {
		data() {
			return {
				replyItem:null,
				commentObj: {
					comment_type: 1,
					article_id: "",
					reply_user_id:"",
					reply_comment_id:"",
				},
				userCommentList:[],
				uniMore:"more",//uni-loading-more状态标识
			};
		},
		computed:{
			placeholder(){
				return "回复："+this.getName(this.replyItem);
			}
			
		},
		onLoad() {
			this.replyItem = uni.getStorageSync("replyItem")
			if(!this.replyItem){
				uni.showToast({
					title:"参数错误",
					icon:"none"
				})
				setTimeout(()=>{
					uni.reLaunch({
						url:"/pages/index/index"
					})
				},1000)
			}
			this.commentObj.article_id = this.replyItem.article_id;
			this.commentObj.reply_user_id = this.replyItem.user_id[0]._id;
			this.commentObj.reply_comment_id = this.replyItem._id
			this.getUserCommentList()
		},//监听页面卸载
		onUnload() {
			uni.removeStorageSync("replyItem")
		},
		onPullDownRefresh() {
			
			
		},
		onReachBottom() {
			
			if(this.uniMore=="noMore"){
				return
			}
			this.getUserCommentList()
		},
		methods:{
			getName,
			//评论成功回调函数
			commentEnv(e){
				this.userCommentList =[];
				this.getUserCommentList();
			},
			getUserCommentList(){
				this.uniMore = "loading"
			let commentTemp=	db.collection("quanzi_comments").where(`comment_type==1
				&&article_id=="${this.replyItem.article_id}"
				&&reply_user_id=="${this.replyItem.user_id[0]._id}"
				&&reply_comment_id=="${this.replyItem._id}"`).orderBy("comment_date desc").getTemp()
			let userTemp = db.collection("uni-id-users").field("username,nickname,avatar_file,_id").getTemp()
			db.collection(commentTemp,userTemp).skip(this.userCommentList.length).limit(5).get().then((res)=>{
				console.log(res)
				
				let newList =  res.result.data
				let oldList = []
				if(this.userCommentList.length>0){
					 oldList = this.userCommentList
				}
				this.userCommentList =[...oldList,...newList]
				this.uniMore = "more"
				if(res.result.data.length<5){
					this.uniMore = "noMore"
					return
				};
			})
			},
			//删除评论
			removeCommentEnv(){
				this.userCommentList = [];
				this.getUserCommentList();
			}
		}
	}
</script>

<style lang="scss" scoped>
	.reply{
		.top{
			border-bottom: 20rpx solid #eee;
		}
		.list{
			// padding-bottom: 100rpx;
		}
		.uniMore{
			padding-bottom: 120rpx;
		}
	}
</style>
