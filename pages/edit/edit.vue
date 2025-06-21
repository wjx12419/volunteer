<template>
	<view class="edit">
		<view class="title">
			<input type="text" v-model="artObj.title" placeholder="请输入一个完整的标题" placeholder-class="pasceholderclass" />
		</view>
		<!-- <view class="line"></view> -->
		<view class="content">
			<editor class="edtor" 
			placeholder="写点什么吧~" 
			show-img-size show-img-toolbar show-img-resize
			@ready="onEditReady" 
			@focus="onFocus" 
			@statuschange="onStatuschange"></editor>
		</view>
		<view class="btnGroup">
			<u-button @click="uploud" type="primary" text="发表文章" :disabled="!artObj.title.length"></u-button>
		</view>

		<view class="tools" v-if="showTools">
			<view class="item" @click="clickHead"><text class="iconfont icon-zitibiaoti"
					:class="showHeader?'active':''"></text></view>
			<view class="item" @click="clickBold"><text class="iconfont icon-zitijiacu"
					:class="showBold?'active':''"></text></view>
			<view class="item" @click="clickItalic"><text class="iconfont icon-zitixieti"
					:class="showItalic?'active':''"></text></view>
			<view class="item" @click="clickDivider"><text class="iconfont icon-fengexian"
					:class="showDivider?'active':''"></text></view>
			<view class="item" @click="clickImg"><text class="iconfont  icon-charutupian"></text></view>
			<view class="item" @click="hideTools"><text class="iconfont icon-duigou_kuai"></text></view>

		</view>
		<!-- <button @click="test">ces</button> -->
	</view>
</template>

<script>
	import {
		getImgSrc,
		getProvince
	} from "@/utils/tools.js"
	const db = uniCloud.database();
	export default {
		data() {
			return {
				showHeader: false,
				showBold: false,
				showItalic: false,
				showDivider: false,
				showTools: false,
				editorCtx: "",
				artObj: {
					title: "",
					content: "",
					description: "",
					picUrls: [],
					province: ""
				}
			};
		},
		onLoad() {
		
			getProvince().then((res) => {
				console.log(res)
				this.artObj.province = res;
			});

		},
		methods: {
			// test(){
			// 	let a = 'https://mp-3a726716-b5d0-48b2-8dfd-a58d778e4fae.cdn.bspapp.com/cloudstorage/8a5f3618-09a6-4def-9074-c7dc544381f6.https://mp-3a726716-b5d0-48b2-8dfd-a58d778e4fae.cdn.bspapp.com/cloudstorage/ce760697-81f2-470a-9a03-1cce868c1105.https://mp-3a726716-b5d0-48b2-8dfd-a58d778e4fae.cdn.bspapp.com/cloudstorage/cba0ec5b-92db-465a-8ee1-853e78296700.https://mp-3a726716-b5d0-48b2-8dfd-a58d778e4fae.cdn.bspapp.com/cloudstorage/6be8e571-33f5-4c81-9dad-94f0711e24b2.'

			// 	let b = a.split(".")
			// 	console.log(b)
			// },
			//离开焦点
			onFocus() {
				this.showTools = true;
			},
			//初始化
			onEditReady() {

				uni.createSelectorQuery().in(this).select('.edtor').fields({
					size: true,
					context: true
				}, (res) => {
					console.log(res)
					this.editorCtx = res.context
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
				this.showHeader = !this.showHeader;
				this.editorCtx.format("header", this.showHeader ? "H2" : false);
			},
			//加粗
			clickBold() {
				this.showBold = !this.showBold;
				this.editorCtx.format("bold");
			},
			//斜体
			clickItalic() {
				this.showItalic = !this.showItalic;
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
				db.collection("quanzi_article").add({
					...this.artObj
				}).then((res) => {
					console.log(res)
					uni.hideLoading();
					uni.showToast({
						title: "发布成功！"
					})
					setTimeout(() => {
						uni.reLaunch({
							url: "/pages/index/index"
						})
					}, 800)
				})
			},
			//隐藏工具条
			hideTools() {
				this.showTools = false;
			}
		}
	}
</script>

<style lang="scss" scoped>
	/deep/ .ql-blank::before {
		font-style: normal;
		color: #e0e0e0;
	}
	
	.edit {
		padding: 30rpx;

		.title {
			input {
				height: 120rpx;
				font-size: 46rpx;
				border-bottom: 1rpx solid #e4e4e4;
				margin-bottom: 30rpx;
				color: #000;
			}

			.pasceholderclass {
				color: #e0e0e0;
			}
		}

		.line {
			width: 100%;
			height: 5rpx;
			background-color: #eee;
			margin: 20rpx 0;
		}

		.content {
			
			.edtor {
				height: calc(100vh - 500rpx);
				margin-bottom: 30rpx;
			}

		}

		.btnGroup {}

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