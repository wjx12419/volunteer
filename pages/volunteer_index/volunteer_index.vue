<template>
	<view class="volunteer">

		<view class="banner">
			<image src="/static/index.png" mode="aspectFill"></image>
		</view>


		<view class="req">
			<text style="font-size: 40rpx;font-weight: bold; text-align: center;">志愿推荐查询</text>
			<view style="display: flex; justify-content: space-between;align-items: center;">
				<view class=""
					style="padding: 10rpx;font-size: 28rpx;  display: flex;justify-content: center;align-items: center;">
					<view class="avatar">
						<image v-if="hasLogin&&userInfo.avatar_file&&userInfo.avatar_file.url"
							:src="userInfo.avatar_file.url" mode="aspectFill"></image>
						<image v-else src="/static/user-default.jpg" mode="aspectFill"></image>
					</view>
					<view class="">
						<text v-if="volunteer.benke">河南-{{volunteer.benke}}</text>
						<text v-else>河南-未填写专业</text>
					</view>
				</view>
				<view class="" style="font-size: 28rpx;" @click="navEditInfo">
					<text class="iconfont icon-a-24-bianji" style="color: blue;"></text>
					<text style="color: blue;">编辑信息</text>
				</view>
			</view>
			<view class=""
				style="font-size: 30rpx;padding: 0 20rpx; width: 80%;height: 80rpx;background-color: #F8F7F8;border: 1rpx solid #eee;border-radius: 50rpx;margin:  auto auto 50rpx auto;">
				<view class=""
					style="display: flex;justify-content: space-around;line-height: 80rpx; align-items: center;">
					<view class="" style="border-right:1rpx solid #eee ;flex: 1;text-align: center;color: #666666;">
						<text>分数：</text>
						<text v-if="volunteer.score">{{volunteer.score}}分</text>
						<text v-else>未填写</text>
					</view>

					<view class="" style="flex: 1;text-align: center;color: #666666;">
						<text>排名：</text>
						<text v-if="volunteer.rank">{{volunteer.rank}}名</text>
						<text v-else>未填写</text>
					</view>
					<view class="" style="font-size: 20rpx;">
						<text v-if="volunteer.number">({{volunteer.number}}人)</text>
					</view>
				</view>

			</view>
			<button
				style=" border-radius: 50rpx;font-siz e: 30rpx; width: 80%;background-color: #2177E2;margin-bottom: 20rpx; "
				@click="SearchTest" type="primary">智能分析报考院校</button>
		</view>

		<!-- <view>
			<button @click="clickJSON">转换json</button>
		</view> -->
		<view class="grid">
			<view class="item" v-for="ite in grid" @click="navGrid(ite.num)">

				<view style=" display: flex;justify-content: center;align-items: center;">
					<image :src="ite.img"></image>
					<text style="margin-left: 10rpx; font-weight: bold;font-size: 28rpx;">{{ite.name}}</text>
				</view>


				<view class="">
					<text style="color: #808080;">{{ite.des}}</text>
				</view>
			</view>

		</view>
		<view class="" v-if="searchFlag==-1" style="height: 300rpx;">

		</view>
		<u-loading-icon style="height: 300rpx;" v-if="searchFlag==0" text="院校匹配中..."></u-loading-icon>
		<view class="" v-else-if="searchFlag==1">

			<view
				style="width: 90%; height: 100rpx;border-radius: 20rpx;font-size: 25rpx; color: #666690; display: flex; justify-content:space-around;line-height: 50rpx	; padding: 20rpx;background-color: #fff;margin: -35rpx auto 30rpx auto;">
				<view style="display: flex;flex-direction: column;">
					<text>专业最高分：{{scoreMax}}</text>
					<text >总过线人数：{{count}}</text>
				</view>
				<view style="display: flex;flex-direction: column;">
					<text>专业最低分：{{scoreMin}}</text>

				</view>
			</view>
			<button type="primary" style="width: 300rpx;height: 80rpx;" @click="saveVolunteer()">保存推荐志愿</button>
			<view class="dataShow">
				<view class="title" style="color: red;">
					冲刺院校
				</view>
				<view class="schoolName" v-for="(item,index) in volunteerArr.rush" :key="item.code">
					<view class="" style="display: flex;justify-content: space-between;align-items: center;">
						<view class="">
							<text class="tit">{{item.name}}</text>
							<!-- <text>{{item.schoolMatch}}</text> -->
						</view>
						<view>
							<button class="btn" size="mini" @click="navSchoolDetails(item)">院校详情</button>
						</view>
					</view>
					<view class="box1">
						<view class="box1_1" v-if="item.schoolThreeYearScore.score2024">
							<text>2024年录取最低分</text>
							<text>{{item.schoolThreeYearScore.score2024}}</text>
						</view>
						<view class="box1_1" v-else-if="item.schoolThreeYearScore.score2023">
							<text>2023年录取最低分</text>
							<text>{{item.schoolThreeYearScore.score2023}}</text>
						</view>
						<view class="box1_1" v-else-if="item.schoolThreeYearScore.score2022">
							<text>2022年录取最低分</text>
							<text>{{item.schoolThreeYearScore.score2022}}</text>
						</view>
					</view>
				</view>

				<view class="title" style="color: blue;">
					稳妥院校
				</view>
				<view class="schoolName" v-for="(item,index) in volunteerArr.stable" :key="item.code">
					<view class="" style="display: flex;justify-content: space-between;align-items: center;">
						<view class="">
							<text class="tit">{{item.name}}</text>
							<!-- <text>{{item.schoolMatch}}</text> -->
						</view>
						<view>
							<button class="btn" size="mini" @click="navSchoolDetails(item)">院校详情</button>
						</view>
					</view>
					<view class="box1">
						<view class="box1_1" v-if="item.schoolThreeYearScore.score2024">
							<text>2024年录取最低分</text>
							<text>{{item.schoolThreeYearScore.score2024}}</text>
						</view>
						<view class="box1_1" v-else-if="item.schoolThreeYearScore.score2023">
							<text>2023年录取最低分</text>
							<text>{{item.schoolThreeYearScore.score2023}}</text>
						</view>
						<view class="box1_1" v-else-if="item.schoolThreeYearScore.score2022">
							<text>2022年录取最低分</text>
							<text>{{item.schoolThreeYearScore.score2022}}</text>
						</view>
					</view>
				</view>
				<view class="title" style="color: green;">
					保底院校
				</view>
				<view class="schoolName" v-for="(item,index) in volunteerArr.safe" :key="item.code">
					<view class="" style="display: flex;justify-content: space-between;align-items: center;">
						<view class="">
							<text class="tit">{{item.name}}</text>
							<!-- <text>{{item.schoolMatch}}</text> -->
						</view>
						<view>
							<button class="btn" size="mini" @click="navSchoolDetails(item)">院校详情</button>
						</view>
					</view>
					<view class="box1">
						<view class="box1_1" v-if="item.schoolThreeYearScore.score2024">
							<text>2024年录取最低分</text>
							<text>{{item.schoolThreeYearScore.score2024}}</text>
						</view>
						<view class="box1_1" v-else-if="item.schoolThreeYearScore.score2023">
							<text>2023年录取最低分</text>
							<text>{{item.schoolThreeYearScore.score2023}}</text>
						</view>
						<view class="box1_1" v-else-if="item.schoolThreeYearScore.score2022">
							<text>2022年录取最低分</text>
							<text>{{item.schoolThreeYearScore.score2022}}</text>
						</view>
					</view>
				</view>

			</view>


		</view>


	</view>

</template>


<script>
	const db = uniCloud.databaseForJQL();
	import {
		store,
		mutations
	} from "@/uni_modules/uni-id-pages/common/store.js";
	import search from '../../uni_modules/uview-ui/libs/config/props/search';
	import {
		getJsonstr,
		getZhuanke
	} from '../../utils/tools';
	export default {
		data() {
			return {

				volunteer: [],
				searchTest: "", //测试志愿推荐
				majorName: "", //测试专业名字
				rank: "", //位次
				scoreMax: 0,
				scoreMin: 0,
				peopleNumber: 0,
				searchFlag: -1,
				count:"",
				volunteerArr: {
					rush: [{
						name: "河南科技学院"
					}],
					stable: [{
						name: "河南科技学院"
					}],
					safe: [{
						name: "河南科技学院"
					}]
				},

				search: "",

				yunxing1: false,
				schoolData: {
					school_name: "",
					type: "",
					major: [],
					species: "",
					scores: "",
					year: ""
				},
				majorA: [],
				grid: [{
					name: "录取分数线",
					img: "../../static/score.png",
					num: "1",
					des: "输入专业查询院校最低录取分数线"
				}, {
					name: "招生计划",
					img: "../../static/schoolInfo.png",
					num: "2",
					des: "按专业查询院校招生计划"
				}, ]
			};
		},
		onLoad() {
			// this.getData();
			// this.getMajorData()

			// this.getData1()
			// this.testa()
			// this.testJson()
			// getZhuanke()

		},
		onShow() {
			return
			if (this.hasLogin) {
				uni.showLoading({
					title: "数据加载中..."
				})
				this.getVoluUserInfo()
			} else {
				this.volunteer = {}
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
		async	saveVolunteer() {

				//保存推荐志愿
				const id = this.userInfo._id;
			let userInfo=await	db.collection("volunteer-list").where(`user_id=="${id}"`).get()
			// console.log(userInfo.data[0]._id)
			// const userInfoId=userInfo.data[0]._id
			
			
			if(userInfo.data.length==0){
				db.collection("volunteer-list").add({
					"volunteerSafe":this.volunteerArr.safe||[],
					"volunteerStable":this.volunteerArr.stable||[],
					"volunteerRush":this.volunteerArr.rush||[],
				}).then((res)=>{
					console.log(res)
					uni.showToast({
						title:"保存成功！",
						icon:"none"
					})
				})
			}else if(userInfo.data.length==1){
				const id = userInfo.data[0]._id
				db.collection("volunteer-list").doc(id).update({
					"volunteerSafe":this.volunteerArr.safe||[""],
					"volunteerStable":this.volunteerArr.stable||[""],
					"volunteerRush":this.volunteerArr.rush||[""],
				}).then((res)=>{
					console.log(res)
					uni.showToast({
						title:"保存成功！",
						icon:"none"
					})
				})
			}
			},
			navGrid(num) {
				if (num == "1") {
					uni.navigateTo({
						url: "/pages/majorScore/majorScore"
					})
				} else if (num == "2") {
					uni.navigateTo({
						url: "/pages/majorPlan/majorPlan"
					})
				}
			},
			navSchoolDetails(item) {
				console.log(item)
				item.major = this.volunteer.benke

				let da = JSON.stringify(item)
				uni.navigateTo({
					url: "/pages/schoolDetails/schoolDetails?data=" + da
				})
			},
			async getScoreRank() {
				//获取专业最高最低分
				let scoreRank = await db.collection("scores-rank").where(`major=="${this.volunteer.benke}"`).get()
				console.log(scoreRank)
				const scoreRankArr = scoreRank.data[0].data
				this.count = scoreRankArr[scoreRankArr.length - 1].count
				
				console.log(this.volunteer)
				//获取最高分最低分
				this.scoreMax = scoreRankArr[0].score
				this.scoreMin = scoreRankArr[scoreRankArr.length - 1].score
				let majorPlan = await db.collection("majorPlan").where(`major=="${this.volunteer.benke}"`).get()
				console.log(majorPlan)
				let num = 0
				majorPlan.data[0].plan.forEach((item) => {
					num += item.plan
				})
				this.peopleNumber = num
			},
			async getVoluUserInfo() {
				const user_id = this.userInfo._id
				let count = await db.collection("volunteer-userinfo").where(`user_id=="${user_id}"`).count();
				console.log(count)
				if (count.total == 0) {
					uni.hideLoading()
					return
				}
				//获取用户志愿信息
				let dat = await db.collection("volunteer-userinfo").where(`user_id=="${user_id}"`).get()
				this.volunteer = dat.data[0]
				console.log(this.volunteer)
				this.getScoreRank()


				uni.hideLoading()
			},
			navEditInfo() {
				//编辑页面跳转
				if (this.hasLogin) {
					uni.navigateTo({
						url: "/pages/userinfo/userinfo"
					})
				} else {
					uni.showModal({
						content: "检测到您未登录，请先登录",
						success: (res) => {
							console.log(res.confirm)
							if (res.confirm) {
								uni.switchTab({
									url: "/pages/self/self"
								})
							}
						}
					})
				}

			},
			SearchTest() {
				if (!this.hasLogin) {
					uni.showToast({
						title: "请先登录",
						icon: "none"
					})
					return
				}
				console.log(this.volunteer)
				const volunteer = JSON.stringify(this.volunteer)
				if (this.volunteer.length == 0 || this.volunteer.score == "" || this.volunteer.benke == "" || this.volunteer.rank ==
					"" || this.volunteer
					.number == "") {
					uni.showToast({
						title: "请编辑信息",
						icon: "none"
					})
					return
				}

				this.searchFlag = 0


				uniCloud.callFunction({
					name: "volunteerRecommend",
					fail: (err) => {
						console.log(err)
						uni.hideLoading()
					},
					data: {
						score: this.volunteer.score,
						majorName: this.volunteer.benke,
						rank: this.volunteer.rank,
						number: this.volunteer.number,
						count: this.count
					},
					success: (res) => {
						console.log(res)
						this.volunteerArr = {
							rush: [],
							stable: [],
							safe: []
						}
						console.log(res.result[0])
						
						let volData = res.result

						volData.forEach((item, index) => {

							if (item.schoolMatch > 10 && this.volunteerArr.safe.length < 3) {
								this.volunteerArr.safe.push(item)
							} else if (item.schoolMatch < 10 && item.schoolMatch > -5 && this
								.volunteerArr.stable.length < 3) {
								this.volunteerArr.stable.push(item)
							}
						})
						const reversed = [...volData].reverse();
						reversed.forEach((item) => {
							if (item.schoolMatch < -5 && item.schoolMatch > -15 && this.volunteerArr
								.rush.length < 3) {
								this.volunteerArr.rush.push(item)
							}
						})
						// this.getScoreRank()
						this.searchFlag = 1
					}
				})
			},


			testJson() {
				let str = getJsonstr()
				let c = ""
				console.log(str)
				for (let i = 0; i < str.length; i++) {
					c += JSON.stringify(str[i]).replace(/\s/g, "") + "\n"
				}
				console.log(c)
			},
			testa() {
				// return
				//json数据转换成一行（压缩）
				let a = getJsonstr()
				let majornam = []
				console.log(a)
				let c = "";
				for (let j = 0; j < a.length; j++) {
					// let b = JSON.stringify(a[j]).replace(/\s/g, "")
					let b = ""
					for (let i = 0; i < a[j].length; i++) {
						// c +=JSON.stringify(a[i]).replace(/\s/g,"")+"\n"
						b += JSON.stringify(a[j][i]).replace(/\s/g, "")
						if (i == a[j].length - 1) break
						b += ","
					}
					c += '{"major":"' + majornam[j] + '","year":"2024","data":[' + b + ']}\n'
					// console.log('{"major":"' + majornam[j] + '","year":"2024","data":[' + c + ']}')

				}
				console.log(c)

				// console.log(c)
			},

			async getData1() {
				// return
				//金融科技
				let zhuanye = `经济学,化学工程与工艺,临床医学,生物技术,经济统计学,食品科学与工程,口腔医学,翻译,金融学,食品质量与安全,医学检验技术,家政学,投资学
				,建筑学,医学影像技术,舞蹈学
				,国际经济与贸易
				,制药工程,眼视光学,金融工程
				,法学
				,药学,康复治疗学,康复治疗,金融科技
				,思想政治教育
				,中药学,口腔医学技术,知识产权
				,教育学
				,农学,护理学,护理,社会工作
				,学前教育
				,园艺,中医学	 ,运动康复
				 ,小学教育
				,植物保护	,针灸推拿学	,汉语国际教育
				,数学与应用数学
				,茶学	,体育教育	,地理信息科学
				,应用心理学
				
				,林学,社会体育指导与管理,心理学
				,地理科学
				,园林 ,音乐表演 ,工业设计
				 ,材料成型及控制工程	 ,动物科学	 ,音乐学	 ,城市地下空间工程
				,机械设计制造及其自动化,机械设计制造及自动化	 ,动物医学	 ,舞蹈编导	 ,水文与水资源工程
				 ,机械电子工程,机械电子工程技术	 ,信息管理与信息系统	 ,美术学	 ,安全工程
				 ,车辆工程	 ,工程管理	 ,绘画	,生物工程
				 ,汽车服务工程,汽车服务工程技术	,工程造价	,摄影	,智能医学工程
				 ,电气工程及其自动化	,工商管理	,视觉传达设计	,审计学
				 ,电子信息工程,电子信息工程技术	,市场营销	,环境设计,环境艺术设计	,财务会计教育
				 ,自动化	,物流管理,现代物流管理	,产品设计	,公共事业管理
				 ,通信工程	,会计学	,服装与服饰设计	,舞蹈表演
				 ,计算机科学与技术,计算机应用工程	,财务管理,大数据与财务管理	,动画	,表演
				 ,软件工程	,统计学	,酒店管理	,数字媒体艺术
				 ,网络工程,网络工程技术	,人力资源管理	,物流工程	,互联网金融
				 ,物联网工程	,行政管理	 ,会展经济与管理	 ,宝石及材料工艺学
				 ,数字媒体技术	,档案学	 ,网络与新媒体	 ,机械工程
				 ,土木工程,建筑工程	 ,电子商务	 ,新能源材料与器件	 ,包装工程
				 ,建筑环境与能源应用工程	,旅游管理	 ,机器人工程	 ,智能科学与技术
				 ,给排水科学与工程	 ,汉语言文学	 ,电缆工程	 ,国际商务
				 ,城乡规划	 ,日语	 ,健康服务与管理	 
				 ,道路桥梁与渡河工程
				 ,水利水电工程	 ,新闻学	 ,智能制造工程
				 ,测绘工程	 ,广播电视学	 ,光电信息科学与工程	
				 ,纺织工程	,广播电视编导	 ,数据科学与大数据技术	
				 ,交通运输	 ,播音与主持艺术	 ,特殊教育	
				 ,环境工程	 ,英语	 ,电子科学与技术	
				 ,高分子材料与工程	 ,商务英语	 ,人工智能	`
				let majorArr = zhuanye.trim().replace(/[\r\n\t]/g, "").split(",")
				console.log(majorArr)
				let test = []
				let majorData = []
				for (let i = 0; i < majorArr.length; i++) {
					// for (let i = 0; i < 2; i++) {
					test[i] = majorArr[i]
				}
				test=["保险实务","财富管理","财税大数据应用","大数据与财务管理","大数据与会计","大数据与审计","关务与外贸服务","国际金融","国际经济与贸易","国际商务","金融服务与管理","金融科技应用","跨境电子商务","农村电子商务","商务数据分析与应用","市场调查与统计分析","统计与大数据分析","证券实务","资产评估与管理","材料工程技术","储能材料技术","电厂化学与环保技术","非金属矿物材料技术","分析检验技术","复合材料智能制造技术","高分子材料智能制造技术","化工生物技术","化工装备技术","化学制药技术","化妆品技术","环境工程技术","精细化工技术","理化测试与质检技术","煤化工技术","煤炭清洁利用技术","氢能技术应用","生态环境修复技术","石油化工技术","数字化染整技术","陶瓷制造技术与工艺","小学科学教育","新能源材料应用技术","药品生产技术","应用化工技术","有色金属智能冶金技术","临床医学","茶叶生产与加工技术","茶艺与茶文化","风景园林设计","花卉生产与花艺","环境艺术设计","林业技术","林业信息技术应用","绿色生物制造技术","绿色食品生产技术","农产品加工与质量检测","农业生物技术","森林和草原资源保护","森林生态旅游与康养","设施农业与装备","生态农业技术","食品生物技术","水土保持技术","现代农业技术","休闲农业经营与管理","烟草栽培与加工技术","药品生物技术","野生动植物资源保护与利用","园林工程技术","园林技术","园艺技术","植物保护与检疫技术","中草药栽培与加工技术","中药材生产与加工","种子生产与经营","自然保护地建设与管理","作物生产与经营管理","公共卫生管理","粮食储运与质量安全","粮食工程技术与管理","烹饪工艺与营养","食品检验检测技术","食品药品监督管理","食品营养与健康","食品质量与安全","食品智能加工技术","食品贮运与营销","食用菌生产与加工技术","西式烹饪工艺","医学营养","营养配餐","中西面点工艺","口腔医学","旅游英语","商务英语","小学英语教育","应用英语","生物制药技术","药品经营与管理","药品质量与安全","药物制剂技术","药学","中药学","中药制药","卫生检验与检疫技术","医学检验技术","健康大数据管理与服务","健康管理","康复工程技术","老年保健与管理","美容美体艺术","社区康复","婴幼儿托育服务与管理","预防医学","智慧健康养老服务与管理","中医养生保健","城乡规划","古建筑工程技术","建筑动画技术","建筑设计","建筑室内设计","建筑装饰工程技术","装配式建筑工程技术","医学影像技术","表演艺术","钢琴调律","歌舞表演","国际标准舞","乐器制造与维护","曲艺表演","时尚表演与传播","舞蹈编导","舞蹈表演","舞蹈教育","戏剧影视表演","戏曲表演","戏曲音乐","现代流行音乐","现代魔术设计与表演","音乐表演","音乐教育","音乐剧表演","眼视光技术","安全防范技术","道路交通管理","法律事务","法律文秘","检察事务","经济犯罪侦查","警务指挥与战术","民航空中安全保卫","社区矫正","司法鉴定技术","司法警务","司法信息技术","网络安全与执法","刑事科学技术","刑事侦查","刑事侦查技术","刑事执行","行政执行","政治安全保卫","知识产权管理","治安管理","罪犯心理测量与矫正技术","呼吸治疗技术","康复辅助器具技术","康复治疗技术","言语听觉康复技术","中医康复技术","社会工作","社区管理与服务","小学道德与法治教育","小学教育","心理咨询","口腔卫生保健","口腔医学技术","美术教育","特殊教育","现代教育技术","小学数学教育","小学语文教育","学前教育","艺术教育","早期教育","护理","助产","中医骨伤","中医学","电子竞技运动与管理","高尔夫球运动与管理","健身指导与管理","民族传统体育","社会体育","体育保健与康复","体育教育","体育艺术表演","体育运营与管理","休闲体育","运动防护","运动健康指导","运动训练","针灸推拿","传播与策划","网络新闻与传播","现代文秘","新闻采编与制作","中文","体能训练","运动数据分析","宝玉石鉴定与加工","测绘地理信息技术","测绘工程技术","导航与位置服务","地籍测绘与土地管理","地球物理勘探技术","地下与隧道工程技术","地质调查与矿产普查","工程测量技术","工程地质勘查","国土空间规划与测绘","国土资源调查与管理","空间数字建模与应用技术","矿井建设工程技术","矿山机电与智能装备","煤矿智能开采技术","摄影测量与遥感技术","石油工程技术","水利水电建筑工程","水文与工程地质","通风技术与安全管理","无人机测绘技术","无人机应用技术","岩土工程技术","油气储运技术","油气智能开采技术","智慧水利技术","心理健康教育","城市轨道车辆应用技术","城市轨道交通车辆制造与维护","城市轨道交通机电技术","电机与电器技术","电力系统自动化技术","电气自动化技术","电梯工程技术","电线电缆制造技术","动车组检修技术","纺织机电技术","飞机部件修理","飞机电子设备维修","飞机机电设备维修","飞机结构修理","工业产品质量检测技术","工业工程技术","工业过程自动化技术","工业互联网技术","工业互联网应用","工业机器人技术","工业设计","光伏工程技术","机场电工技术","机电设备技术","机电一体化技术","机械设计与制造","机械制造及自动化","机械装备制造技术","轮机工程技术","模具设计与制造","数控技术","数字化设计与制造技术","铁道车辆技术","铁道机车运用与维护","通用航空航务技术","通用航空器维修","现代农业装备应用技术","印刷媒体技术","印刷设备应用技术","智能工程机械运用技术","智能光电制造技术","智能机电技术","智能机器人技术","智能控制技术","智能制造装备技术","材料成型及控制技术","建筑材料检测技术","建筑装饰材料技术","特种加工技术","现代造纸技术","新型建筑材料技术","智能焊接技术","宠物养护与驯导","宠物医疗技术","动物防疫与检疫","动物药学","动物医学","动物营养与饲料","兽药制药技术","水产养殖技术","特种动物养殖技术","畜牧兽医","畜禽智能化养殖","安全技术与管理","城市轨道交通工程技术","城市燃气工程技术","道路工程检测技术","道路工程造价","道路养护与管理","道路与桥梁工程技术","高速铁路施工与维护","工程造价","供热通风与空调工程技术","建设工程管理","建设工程监理","建筑电气工程技术","建筑钢结构工程技术","建筑工程技术","建筑设备工程技术","建筑消防技术","建筑智能化工程技术","市政工程技术","太阳能光热技术与应用","铁道工程技术","土木工程检测技术","智能建造技术","房地产智能检测与估价","给排水工程技术","水利工程","水利水电工程技术","水生态修复技术","水文与水资源技术","制冷与空调技术","治河与航道工程技术","大数据技术","动漫制作技术","计算机网络技术","计算机应用技术","区块链技术应用","人工智能技术应用","融媒体技术与运营","软件技术","数字媒体技术","卫生信息管理","物联网应用技术","信息安全技术应用","虚拟现实技术应用","移动互联应用技术","移动商务","移动应用开发","智慧城市管理技术","智慧旅游技术应用","包装策划与设计","包装工程技术","产品艺术设计","动漫设计","纺织品设计","服装陈列与展示设计","服装设计与工艺","服装与服饰设计","工艺美术品设计","公共艺术设计","广告艺术设计","家具艺术设计","民族传统技艺","民族服装与饰品","民族美术","皮具制作与工艺","人物形象设计","摄影摄像技术","摄影与摄像艺术","视觉传达设计","室内艺术设计","首饰设计与工艺","书画艺术","数字媒体艺术设计","陶瓷设计与工艺","舞台艺术设计与制作","艺术设计","影视动画","影视多媒体技术","游戏艺术设计","玉器设计与工艺","展示艺术设计","环境管理与评价","环境监测技术","绿色低碳技术","生态保护技术","水净化与安全技术","消防救援技术","应急救援技术","职业健康安全技术","智能环保装备技术","汽车电子技术","汽车技术服务与营销","汽车检测与维修技术","汽车造型与改装技术","汽车制造与试验技术","汽车智能技术","新能源汽车技术","新能源汽车检测与维修技术","智能网联汽车技术","城市轨道交通运营管理","房地产经营与管理","港口与航道工程技术","港口与航运管理","建筑经济信息化管理","水政水资源管理","现代物业管理"]
				console.log(test)
				for (let i = 0; i < test.length; i++) {
					await this.fetchData(i, test);
					// 设置500毫秒的延迟
					await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 300));
				}
			},

			async fetchData(index, name) {

				// 这里执行具体的接口请求逻辑
				const response = await uni.request({

					// 录取分数
					// url: "http://81.70.180.96:8080/search/schoolScore?name="+name[index],
					// url: "https://www.hnzsb.cn/api/select/ajax_plan?year=2024&zhuanye=" + name[index],
					// url: "https://www.hnzsb.cn/api/select/ajax_school_score?zhuanye=" + name[index],
					// url: "https://www.hnzsb.cn/api/select/ajax_plan?year=2022&zhuanye=" + name[index],
					// url: "https://www.hnzsb.cn/api/select/reverse_major?year=2025&benke=" + name[index],
					url: "http://81.70.180.96:8080/search/major?province='河南省'&name=" + name[index],

					method: 'GET'
				});
				console.log(response)
				let a = {}
				a.data = response.data
				// let a = response.data
				// let a = response.data.majors.major_name
				// a.searchFrequency = name[index]
				a.zhuanke = name[index]
				this.majorA.push(a)
				return a;
			},

			clickJSON() {
				console.log(this.majorA)
				console.log(JSON.stringify(this.majorA))
				let a = JSON.parse(JSON.stringify(this.majorA))
				console.log(a)
			},
			getMajorData() {
				let zhuanye = `经济学,化学工程与工艺,临床医学,生物技术,经济统计学,食品科学与工程,口腔医学,翻译,金融学,食品质量与安全,医学检验技术,家政学,投资学
				,建筑学,医学影像技术,舞蹈学
				,国际经济与贸易
				,制药工程,眼视光学,金融工程
				,法学
				,药学,康复治疗学（含康复治疗）, 金融科技
				,思想政治教育
				,中药学,口腔医学技术,知识产权
				,教育学
				,农学,护理学（含护理）,社会工作
				,学前教育
				,园艺,中医学	 ,运动康复
				 ,小学教育
				,植物保护	,针灸推拿学	,汉语国际教育
				,数学与应用数学
				,茶学	,体育教育	,地理信息科学
				,应用心理学
				
				,林学,社会体育指导与管理,心理学
				,地理科学
				,园林 ,音乐表演 ,工业设计
				 ,材料成型及控制工程	 ,动物科学	 ,音乐学	 ,城市地下空间工程
				,机械设计制造及其自动化（含机械设计制造及自动化）	 ,动物医学	 ,舞蹈编导	 ,水文与水资源工程
				 ,机械电子工程（含机械电子工程技术）	 ,信息管理与信息系统	 ,美术学	 ,安全工程
				 ,车辆工程	 ,工程管理	 ,绘画	, 生物工程
				 ,汽车服务工程（含汽车服务工程技术）	, 工程造价	, 摄影	, 智能医学工程
				 ,电气工程及其自动化	, 工商管理	, 视觉传达设计	, 审计学
				 ,电子信息工程（含电子信息工程技术）	, 市场营销	, 环境设计（含环境艺术设计）	, 财务会计教育
				 ,自动化	, 物流管理（含现代物流管理）	, 产品设计	, 公共事业管理
				 ,通信工程	, 会计学	, 服装与服饰设计	, 舞蹈表演
				 ,计算机科学与技术(含计算机应用工程)	, 财务管理（含大数据与财务管理）	, 动画	, 表演
				 ,软件工程	, 统计学	, 酒店管理	, 数字媒体艺术
				 ,网络工程（含网络工程技术）	, 人力资源管理	, 物流工程	, 互联网金融
				 ,物联网工程	, 行政管理	 ,会展经济与管理	 ,宝石及材料工艺学
				 ,数字媒体技术	, 档案学	 ,网络与新媒体	 ,机械工程
				 ,土木工程（含建筑工程）	 ,电子商务	 ,新能源材料与器件	 ,包装工程
				 ,建筑环境与能源应用工程	, 旅游管理	 ,机器人工程	 ,智能科学与技术
				 ,给排水科学与工程	 ,汉语言文学	 ,电缆工程	 ,国际商务
				 ,城乡规划	 ,日语	 ,健康服务与管理	 
				 ,道路桥梁与渡河工程
				 ,水利水电工程	 ,新闻学	 ,智能制造工程
				 ,测绘工程	 ,广播电视学	 ,光电信息科学与工程	
				 ,纺织工程	, 广播电视编导	 ,数据科学与大数据技术	
				 ,交通运输	 ,播音与主持艺术	 ,特殊教育	
				 ,环境工程	 ,英语	 ,电子科学与技术	
				 ,高分子材料与工程	 ,商务英语	 ,人工智能	`
				let majorArr = zhuanye.trim().replace(/[\r\n\t]/g, "").split(",")
				console.log(majorArr)
				let test = []
				let majorData = []
				for (let i = 0; i < 3; i++) {
					test[i] = majorArr[i]
				}
				console.log(test)

				for (let i = 0; i < test.length; i++) {

					uni.request({
						url: "http://81.70.180.96:8080/search/schoolScore?name=" + test[i],
						success: (res) => {
							console.log(res)
							if (res.statusCode == 200) {
								this.majorA.push(res.data.plan)
							} else {
								// 请求失败，处理错误信息
								console.error('请求失败:', res.data);
							}

							console.log(this.majorA)
						}
					})



				}


			},



		}
	}
</script>

<style lang="scss" scoped>
	.volunteer {
		box-sizing: border-box;
		background-color: rgb(240, 240, 240);

		.grid {
			// width: 80%;
			display: flex;
			justify-content: space-around;
			padding: 20rpx;

			box-sizing: border-box;
			// align-items: center;
			margin: -50rpx auto 50rpx;

			// margin: auto;
			// flex-wrap: ;
			font-size: 25rpx;

			// background-color: #fff;
			// border: 1rpx solid;
			.item {
				display: flex;
				flex-direction: column;
				justify-content: space-around;
				align-items: center;
				border: 1rpx solid;
				padding: 20rpx;
				box-shadow: 3rpx 3rpx 3rpx #fff;
				background-color: #FFFFFF;
				border-radius: 20rpx;
				flex: 1;
				margin: 0 10rpx;

				image {
					width: 60rpx;
					height: 60rpx;
				}
			}
		}

		.charts-box {
			width: 100%;
			height: 300px;
			background-color: #fff;
			margin-bottom: 50rpx;

		}

		.banner {
			width: 100%;
			height: 300rpx;

			image {
				width: 100%;
				height: 300rpx;
			}
		}

		.search {
			padding: 20rpx;
		}

		.req {
			width: 90%;
			// height: 450rpx;
			margin: 20rpx auto;
			display: flex;
			flex-direction: column;
			justify-content: center;
			// align-items: center;
			background-color: #F8F7F8;
			border-radius: 20rpx;
			box-shadow: 0px 3px 3px #c8c8c8;
			padding: 10rpx;
			transform: translateY(-80rpx);

			.avatar {
				width: 60rpx;
				height: 60rpx;
				overflow: hidden;
				border-radius: 50%;
				margin-right: 20rpx;

				image {
					width: 100%;
					height: 100%;

				}
			}

			input {
				border-radius: 50rpx;
				margin: 10rpx 0;
			}
		}

		.dataShow {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			// background-color: #fff;
			// width: 90%;
			min-height: 300rpx;
			margin: auto;

			// border-radius: 50rpx;
			// box-shadow: 0px 3px 3px #c8c8c8;
			.title {
				color: #3c9cff;
				font-weight: bold;
				// font-weight: bold;
				font-size: 35rpx;
			}

			.tit {
				font-weight: bold;
				color: #333333;
				font-size: 35rpx;
			}

			.schoolName {
				width: 90%;
				height: 230rpx;
				padding: 20rpx;
				display: flex;
				flex-direction: column;
				justify-content: flex-start;
				border-radius: 10rpx;
				background-color: #fff;
				margin: 20rpx 0;

				.btn {
					border-radius: 20rpx;
					background-color: #3c9cff;
					color: #fff;

				}

				.box1 {
					width: 100%;
					margin: auto;
					display: flex;
					justify-content: center;
					padding: 20rpx;
					box-sizing: border-box;
					height: 150rpx;
					background-color: #F9FAFB;
					box-shadow: 1px 1px 1px #F7F7F7;
					border-radius: 20rpx;

					.box1_1 {
						display: flex;
						flex-direction: column;
						justify-content: center;
						align-items: center;

						text {
							margin: 5rpx 0;
						}
					}
				}

				text {}
			}
		}

		.schoolData {
			padding: 20rpx;

			.school {}

			.major {}
		}
	}
</style>