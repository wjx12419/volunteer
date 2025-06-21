<template>
	<view>
		<view class="commentFrame">
			<uni-easyinput ref="uipt" @confirm="goComment" suffixIcon="paperplane" v-model="replyContent"
				:placeholder="placeholder" @iconClick="goComment">
			</uni-easyinput>
		</view>
	</view>
</template>

<script>
	import {getProvince} from "@/utils/tools.js"
	const db = uniCloud.database();
	const utilsObj = uniCloud.importObject("utilsObj", {
		customUI: true
	});
	export default {
		name:"comments-frame",
		props:{
			commentObj:{
				type:Object,
				default:()=>{
					return {
						
					}
				}
			},
			placeholder:{
				type:String,
				default:"评论点什么吧"
			}
		},
		data() {
			return {
				replyContent:"",
			};
		},
		methods:{
		async goComment(){
			if(this.replyContent.trim()==""){
				uni.showToast({
					title:"请输入评论内容",
					icon:"none"
				})
				this.replyContent=""
				return
			}
				let province =await getProvince();
				console.log(this.replyContent);
				db.collection("quanzi_comments").add({
					...this.commentObj,
					"comment_content":this.replyContent,
					"province":province
				}).then((res)=>{
					console.log(res)
					
					uni.showToast({
						title:"评论成功！",
						icon:"none"
					})
					this.$emit("commentEnv",{
						_id:res.result.id,
						"comment_content":this.replyContent,
						"province":province
					})
					this.replyContent=""
					utilsObj.operation("quanzi_article","comment_count",this.commentObj.article_id,1)
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
.commentFrame {
		width: 100%;
		background: #fff;
		padding: 20rpx 30rpx;
		box-sizing: border-box;
		position: fixed;
		bottom: 0;
		left: 0;
		z-index: 100;
	}
</style>