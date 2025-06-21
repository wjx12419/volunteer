<template>
	<view class="home">
		<view class="ipt">
			学校名<input v-model="schoolData.school_name" type="text" placeholder="学校名" />
			学校类型：公办或民办<input v-model="schoolData.type" type="text" placeholder="学校类型：公办或民办" />
			<view style="margin: 20rpx;">
				学校id：{{majorData.school_id}}
			</view>
			专业名<input v-model="majorData.major_name" type="text" placeholder="专业名" />
			<view style="margin: 20rpx;">
				专业id：{{majorScoreData.major_id}}
			</view>
			类型：0普通，1退役士兵，2建档立卡<input v-model="majorScoreData.species" type="text" placeholder="类型：0普通，1退役士兵，2建档立卡" />
			数据年份<input v-model="majorScoreData.year" type="text" placeholder="数据年份" />
			分数<input v-model="majorScoreData.scores" type="text" placeholder="1:分数未公布，0:当年没有招生计划" />

		</view>
		<view class="" style="padding: 20rpx;">
			<button style="margin-bottom: 10rpx;" @click="updates" type="primary">提交</button>
			<button @click="clear" type="warn">清空</button>
		</view>
	</view>
</template>

<script>
	const db = uniCloud.databaseForJQL();

	export default {

		data() {
			return {

				schoolData: {
					school_name: "",
					type: ""
				},
				majorData: {
					major_name: "",
					school_id: "",
				},
				majorScoreData: {
					major_id: "",
					year: "",
					scores: "",
					species: ""
				}

			};
		},
		onLoad() {
		
		},
		methods: {
			
			async updates() {
				if(this.schoolData.school_name=="" || this.schoolData.type=="" || this.majorData.major_name=="" || this.majorScoreData.scores==""||this.majorScoreData.species==""||this.majorScoreData.year==""){
						uni.showToast({
							title:"内容不能为空",
							icon:"none"
						})
						return;
				}
				let schoolId = await db.collection("school").where(`school_name=="${this.schoolData.school_name}"`)
					.field("_id")
					.get()
				console.log(schoolId)
				if (schoolId.data.length) {
					this.majorData.school_id = schoolId.data[0]._id
				} else {
					this.addSchoolData(this.schoolData)
				}
				let majorId = await db.collection("major").where(
					`school_id=="${this.majorData.school_id}"&&major_name=="${this.majorData.major_name}"`).field(
					"_id").get();
				console.log(majorId)
				if (majorId.data.length) {
					this.majorScoreData.major_id = majorId.data[0]._id;
				} else {
					this.addMajorData(this.majorData);
				}
				db.collection("major_scores").where(
					`major_id=="${this.majorScoreData.major_id}"&&species=="${this.majorScoreData.species}"&&year=="${this.majorScoreData.year}"`).field(
					"_id").get().then(res=>{
						console.log(res)
						if(!res.data.length){
							this.addMajorScoreYearData(this.majorScoreData);
						}else{
							uni.showModal({
								content:"数据重复，是否更新？",
								success: (r) => {
									console.log(r)
									if(r.confirm){
										db.collection("major_scores").doc(res.data[0]._id).update({...this.majorScoreData}).then((re)=>{
											uni.showToast({
												title:"数据更新成功！",
												icon:"none"
											})
										})
										
									}
								}
							})
						}
					})
			

			},
			//添加学校
			async addSchoolData(schoolData) {
				let addSchool = await db.collection("school").add({
					...schoolData
				})
				console.log(addSchool)
				this.majorData.school_id = addSchool.id
			},
			//添加学校的专业
			async addMajorData(majorData) {
				let addMajor = await db.collection("major").add({
					...majorData
				})
				console.log(addMajor)
				this.majorScoreData.major_id = addMajor.id
			},
			//添加学校专业的类型与分数，数据年度
			async addMajorScoreYearData(majorSY){
				let addMSY = await db.collection("major_scores").add({...majorSY})
				console.log(addMSY)
				
			},
			clear(){
				this.majorData.school_id=""
				this.majorScoreData.major_id=""
				uni.showToast({
					title:"已清空id"
				})
			},
			adadc(){
				//记录一下数据库
				let schoolbiao=[
					{name:"华北水利水电大学",id:"67d8115ca09a9b5aa5c85a04",major:["计算机科学与技术"]},
					{name:"河南科技学院",id:"67d8e79cfe975fc54f8fa6cb"},
					{name:"河南理工大学",id:"67d942ce9755e37462f081d0",major:["计算机科学与技术"]},
					{name:"",id:""},
					{name:"",id:""},
					{name:"",id:""},
					{name:"",id:""},
					{name:"",id:""},
					{name:"",id:""},
					{name:"",id:""},
					
				]
			},
			shujchuli() {
				let data = {
					"searchFrequency": 32665,
					"status": 0,
					"plan": [{
							"name": "华北水利水电大学",
							"code": "10078",
							"type": "公办",
							"score": [
								"2017:211",
								"2018:227",
								"2019:244",
								"2020:234",
								"2021:244\t",
								"2022:247",
								"2023:216",
								"2024:227"
							]
						},
						{
							"name": "华北水利水电大学(建档立卡)",
							"code": "10078",
							"type": "公办",
							"score": [
								"2021:227",
								"2022:252",
								"2023:195",
								"2024:225"
							]
						},
						{
							"name": "华北水利水电大学(退役士兵)",
							"code": "10078",
							"type": "公办",
							"score": [
								"2021:169",
								"2022:",
								"2023:78",
								"2024:"
							]
						}
					]
				}
				console.log(data)

			},
			getFenshu() {
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
				let a = zhuanye.trim().replace(/[\r\n\t]/g, "").split(",")
				let test = ["商务英语", "人工智能", "高分子材料与工程"]
				let dataArr = []
				let json = ""
				console.log(a)
				for (let i = 0; i < test.length; i++) {
					uni.request({
						url: "https://www.hnzsb.cn/api/select/ajax_school_score?zhuanye=" + test[i],
						success: (res) => {
							console.log(res)
							dataArr.push(res)
							console.log(dataArr)

						}
					})
					if (i == 2) {
						json = JSON.stringify(dataArr)
						console.log(json)
					}
				}


			},
			getCloudDemo() {
				db.collection("cloudDemo").where(`school=="河南科技学院"`).get().then((res) => {
					console.log(res)
				})
			},
			getData() {
				// return
				let name = ["计算机网络技术", "计算机应用技术", "测绘地理信息技术"]

				for (let i = 0; i < name.length; i++) {
					uni.request({
						url: "https://h5.offcnzsb.com/api/mini/specialContrast?pageSize=30&page=1&special_name_zk=" +
							name[i],
						success: (res) => {
							console.log(res)

							this.data.push(...res.data.data.data)
							this.showData = true
						}
					})
				}
			},
			getD() {
				let schoolArr = [""]
				uni.request({
					url: "https://www.hnzsb.cn/api/select/school_plan?school=华北水利水电大学&year=2024",
					success: (res) => {
						this.data = res.data
						console.log(res)
					}
				})
			},
			a() {

				let data1 = {
					_id: "addaddxax",
					school: "学校",
					major: "专业[]",
					address: "学校地址"

				}
				this.json = JSON.stringify(this.data)
				console.log(this.json)
			}
		}
	}
</script>

<style lang="scss">
	.home {
		padding: 20rpx;
		box-sizing: border-box;

		.ipt {
			input {
				border: 1rpx solid;
				padding: 10rpx;
				margin: 10rpx;
			}
		}

	}
</style>