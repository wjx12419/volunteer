<template>
	<view class="home">
		<view class="artRevise" v-if="dataGet">
			<view class="title">
				<textarea v-model="artData.title" auto-height></textarea>
		
			</view>
			<u-line></u-line>
			<view class="content" >
				<editor  class="editor" 
				show-img-size show-img-toolbar show-img-resize 
				@statuschange="onStatuschange" 
				@ready="onReadyEditor" 
				@focus="showTools=true"></editor>
			</view>
			<view class="btn">
				<button type="primary" @click="uploud">提交修改</button>
			</view>
		<view class="tools" v-if="showTools">
			<view class="item" @click="clickHead"><text class="iconfont icon-zitibiaoti"
					:class="utils.showHeader?'active':''"></text></view>
			<view class="item" @click="clickBold"><text class="iconfont icon-zitijiacu"
					:class="utils.showBold?'active':''"></text></view>
			<view class="item" @click="clickItalic"><text class="iconfont icon-zitixieti"
					:class="utils.showItalic?'active':''"></text></view>
			<view class="item" @click="clickDivider"><text class="iconfont icon-fengexian"
					:class="utils.showDivider?'active':''"></text></view>
			<view class="item" @click="clickImg"><text class="iconfont  icon-charutupian"></text></view>
			<view class="item" @click="hideTools"><text class="iconfont icon-duigou_kuai"></text></view>
		
		</view>
		</view>
		<view v-if="!dataGet">
			<u-loading-icon  text="数据加载中..."></u-loading-icon>
		</view>
			
	</view>
	
</template>

<script>
	import {
		getImgSrc,
		getProvince
	} from "@/utils/tools.js"
	const db = uniCloud.databaseForJQL();
	export default {
		data() {
			return {
				artId: "",
				artData: {},
				editorCtx:"",
				dataGet:false,
				showTools:false,
				utils:{
					showHeader: false,
					showBold: false,
					showItalic: false,
					showDivider: false,
					showTools: false,
				},
				artObj: {
					title: "",
					content: "",
					description: "",
					picUrls: [],
					province: ""
				}
			};
		},
		onLoad(option) {
			if(!option.id){
				
			this.errFun();
			}else{
				console.log(option)
				this.artId = option.id;
				this.getArtData();
			}
			
			
		},
		methods: {
			getArtData() {
				db.collection("quanzi_article").doc(this.artId).get({
					getOne: true
				}).then((res) => {
					console.log(res);
					this.artData = res.data;
					this.artObj.title = res.data.title
					this.artObj.content = res.data.content
					this.artObj.description = res.data.description
					this.artObj.picUrls = res.data.picUrls
					this.artObj.picUrls = res.data.picUrls
					this.dataGet = true
				})
			},
			onReadyEditor() {
				
		uni.createSelectorQuery().in(this).select('.editor').fields({
					context:true,
					size:true
				},(res) => {
					console.log("111")
					console.log(res)
					this.editorCtx = res.context
					let data = this.artData.content
					this.editorCtx.setContents({
						html: data,
						// delta:data
					})
				}).exec()
				
				
				
				
			},
			checkStatus(name, detail, obj) {
				if (detail.hasOwnProperty(name)) {
					this[obj] = true;
				} else {
					this[obj] = false;
				}
			},
			onStatuschange(e) {
				console.log(e.detail)
				let detail = e.detail;
				this.checkStatus("header", detail, "showHeader");
				this.checkStatus("bold", detail, "showBold");
				this.checkStatus("italic", detail, "showItalic");
			
			},
			//添加大标题
			clickHead() {
				this.utils.showHeader = !this.utils.showHeader;
				this.editorCtx.format("header", this.showHeader ? "H2" : false);
			},
			//加粗
			clickBold() {
				this.utils.showBold = !this.utils.showBold;
				this.editorCtx.format("bold");
			},
			//斜体
			clickItalic() {
				this.utils.showItalic = !this.utils.showItalic;
				this.editorCtx.format("italic")
			},
			//点击插入分割线
			clickDivider() {
				this.editorCtx.insertDivider();
			},
			//插入图片
			clickImg() {
				uni.chooseImage({
					success: async (res) => {
						console.log(res.tempFiles)
						uni.showLoading({
							title: "图片上传中...",
							mask: true
						})
						let imgFile = res.tempFiles;
						for (let item of imgFile) {
							let res = await uniCloud.uploadFile({
								cloudPath: item.size + "",
								filePath: item.path
							})
							console.log(res)
							this.editorCtx.insertImage({
								src: res.fileID
							})
						}
						uni.hideLoading();
			
					}
				})
			},
			//隐藏工具条
			hideTools() {
				this.showTools = false;
			},
			//点击按钮发布
			uploud() {
				this.editorCtx.getContents({
					success: res => {
						console.log(res);
			
						this.artObj.description = res.text.slice(0, 80);
						this.artObj.content = res.html;
						this.artObj.picUrls = getImgSrc(res.html, 3);
						// let re = /<img src="(.+?)">/g;
						// let picUrl =	re.exec(res.html);
						// let picArr = picUrl.splice(".")
						// console.log(picUrl);
						console.log(this.artObj);
						uni.showLoading({
							title: "数据提交中..."
						})
						this.addData();
			
					}
				})
			},
			//提交数据到数据库
			addData() {
				db.collection("quanzi_article").doc(this.artId).update({
					...this.artObj
				}).then((res) => {
					console.log(res)
					uni.hideLoading();
					uni.showToast({
						title: "修改成功！"
					})
					setTimeout(() => {
						uni.reLaunch({
							url: "/pages/index/index"
						})
					}, 800)
				}).catch((err)=>{
					uni.showToast({
						title:err,
						icon:"none"
					})
					console.log(err)
				})
			},
			errFun(){
				uni.showToast({
					title:"参数有误",
					icon:"none"
				})
				setTimeout(() => {
					uni.reLaunch({
						url: "/pages/index/index"
					})
				}, 1000)
			}
		}
	}
</script>

<style lang="scss" scoped>
	
	.home{
		
		// height:calc(100vh - 500rpx) ;
		display: flex;
		justify-content: center;
	
		.loding{
			
			align-items: center;
		}
	}
	.artRevise {
		padding: 30rpx;

		.title {
			// font-size: 60rpx;
			font-weight: bold;
			// width: 100%;
			
			padding-bottom: 20rpx;
			input {
				height: 120rpx;
				font-size: 46rpx;
				border-bottom: 1rpx solid #e4e4e4;
				margin-bottom: 30rpx;
				color: #000;
			}
		}
		.content{
			width: 690rpx;
			.editor{
				
				// padding: 20rpx 0;
				height:calc(100vh - 500rpx);
				margin-bottom: 50rpx;
			}
			
		}
		.tools {
			width: 100%;
			height: 80rpx;
		
			position: fixed;
			bottom: 0;
			left: 0;
			display: flex;
			justify-content: space-around;
			align-items: center;
			border-top: 1rpx solid #f4f4f4;
			background-color: #fff;
		
		
			.iconfont {
				font-size: 36rpx;
				color: #333;
		
				&.active {
					color: #0199FE;
				}
			}
		
		}
	}
</style>