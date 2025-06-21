<template>
	<view class="home">
		<u-picker :show="showPick" @cancel="showPick=false" @confirm="pickFirm" :columns="columns"></u-picker>
				
		<view class="title" style="color: red;">
			冲刺院校
		</view>
		<view v-for="(item,index) in volunteerList.rush" :key="item.id"  style=" display: flex;margin: 10rpx 0; justify-content: center;align-self: center;">

			<view style="width:400rpx ;text-align: center;background-color: #eee; height: 80rpx;line-height: 80rpx;border-radius: 20rpx;">
				<text  style="font-weight: bold;">{{item.name}}</text>
				<text v-if="item.name==''"style="color: burlywood;" @click="changeSchool3(item,index)">点击添加志愿</text>
			</view>
			<text @click="deleteSchool3(item,index)" class="iconfont icon-a-123-cuowu" style="line-height: 80rpx;font-size: 50rpx;color: red;"></text>
			
		</view>
		<view class="title" style="color: blue;">
			稳妥院校
		</view>
		<view v-for="(item,inde) in volunteerList.stable" :key="item.id"  style=" display: flex;margin: 10rpx 0; justify-content: center;align-self: center;">
		
			<view style="width:400rpx ;text-align: center;background-color: #eee; height: 80rpx;line-height: 80rpx;border-radius: 20rpx;">
				<text  style="font-weight: bold;">{{item.name}}</text>
				<text v-if="item.name==''"style="color: burlywood;" @click="changeSchool2(item,index)">点击添加志愿</text>
			</view>
			<text @click="deleteSchool2(item,index)" class="iconfont icon-a-123-cuowu" style="line-height: 80rpx;font-size: 50rpx;color: red;"></text>
			
		</view>
		<view class="title" style="color: green;">
			保底院校
		</view>
		<view v-for="(item,ind) in volunteerList.safe" :key="item.id"  style=" display: flex;margin: 10rpx 0; justify-content: center;align-self: center;">
		
			<view style="width:400rpx ;text-align: center;background-color: #eee; height: 80rpx;line-height: 80rpx;border-radius: 20rpx;">
				<text  style="font-weight: bold;">{{item.name}}</text>
				<text v-if="item.name==''" style="color: burlywood;" @click="changeSchool1(item,index)">点击添加志愿</text>
			</view>
			<text @click="deleteSchool1(item,index)" class="iconfont icon-a-123-cuowu" style="line-height: 80rpx;font-size: 50rpx;color: red;"></text>
			
		</view>
			<button type="primary" @click="saveVolunteer" style="margin-top: 20rpx;">保存志愿</button>
	</view>
</template>

<script>
	const db = uniCloud.databaseForJQL();
	import {
		store,
		mutations
	} from "@/uni_modules/uni-id-pages/common/store.js";
	export default {
		data() {
			return {
				volunteerList: {
					safe: [{name:""},{name:""},{name:"",}],
					stable: [{name:"",},{name:""},{name:""}],
					rush: [{name:""},{name:""},{name:""}],
				},
				showPick:false,
				columns:[],
				schoolList:[],
				volunteer:{},
				index:"",//记录修改那条,
				index1:""//记录修改那条
			};
		},
		onLoad() {
			 this.volunteerList.safe.forEach((item, index) => {
			      item.id =  index+12;
			    });
				this.volunteerList.stable.forEach((item, index) => {
			      item.id = index+23
			    });
				this.volunteerList.rush.forEach((item, index) => {
			      item.id = index+42
			    });
			if (this.hasLogin) {
				uni.showLoading({
					title: "数据加载中..."
				})
				console.log(this.userInfo)
				this.getVolunteerList()
				this.getVoluUserInfo()
				
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
			
			
			 if(userInfo.data.length==1){
				const id = userInfo.data[0]._id
				db.collection("volunteer-list").doc(id).update({
					"volunteerSafe":this.volunteerList.safe,
					"volunteerStable":this.volunteerList.stable,
					"volunteerRush":this.volunteerList.rush,
				}).then((res)=>{
					console.log(res)
					uni.showToast({
						title:"保存成功！",
						icon:"none"
					})
				})
			}else if(userInfo.data.length==0){
				
				db.collection("volunteer-list").add({
					"volunteerSafe":this.volunteerList.safe,
					"volunteerStable":this.volunteerList.stable,
					"volunteerRush":this.volunteerList.rush,
				}).then((res)=>{
					console.log(res)
					uni.showToast({
						title:"保存成功！",
						icon:"none"
					})
				})
			}
			},
			forSchool(name){
				for(let i =0;i<3;i++){
					if(this.volunteerList.safe[i].name==name){
						return -1
					}
					if(this.volunteerList.stable[i].name==name){
						
						return -1
					}
					if(this.volunteerList.rush[i].name==name){
						return -1
					}
					
				}
				return 1
				
			},
			pickFirm(e){
				console.log(e)
				if(this.arr=="safe"){
				let num=	this.forSchool(e.value[0])
				console.log(num)
				console.log(this.volunteerList)
				if(num==-1){
					uni.showToast({
						title:"请勿重复添加学校",
						icon:"none"
					})
					return
				}
					this.volunteerList.safe[this.index].name=e.value[0]
					// this.volunteerList.safe[this.index].type=Math.floor(Math.random() * (140041 - 9 + 1)) + 9
					
				}else if(this.arr=="stable"){
					let num=	this.forSchool(e.value[0])
					if(num==-1){
						uni.showToast({
							title:"请勿重复添加学校",
							icon:"none"
						})
						return
					}
					this.volunteerList.stable[this.index].name=e.value[0]
					// this.volunteerList.stable[this.index].type=Math.floor(Math.random() * (140041 - 9 + 1)) + 9
				}else if(this.arr=="rush"){
					let num=	this.forSchool(e.value[0])
					if(num==-1){
						uni.showToast({
							title:"请勿重复添加学校",
							icon:"none"
						})
						return
					}
					this.volunteerList.rush[this.index].name=e.value[0]
					// this.volunteerList.rush[this.index].type=Math.floor(Math.random() * (140041 - 9 + 1)) + 9
				}
				this.showPick=false
			},
		async	getSchoolPlan(){
				//获取招生计划
			let plan=await	db.collection("majorPlan").where(`year==2024&&major=="${this.volunteer.benke}"`).get()
			console.log(plan)
			let schoolPlan= plan.data[0].plan
			let schoolList=[]
			schoolPlan.forEach((item)=>{
				if(item.special=="0"){
					schoolList.push(item.school)
				}
			})
			this.schoolList=schoolList
			this.columns.push(schoolList)
			console.log(this.columns)
			},
			async getVoluUserInfo(){
				const user_id = this.userInfo._id
				let count = await db.collection("volunteer-userinfo").where(`user_id=="${user_id}"`).count();
				console.log(count)
				if (count.total == 0) {
					this.volunteerList.safe.forEach((item, index) => {
					     item.id = `${index+12}`;
					   });
									this.volunteerList.stable.forEach((item, index) => {
					     item.id = `${index+23}`;
					   });
									this.volunteerList.rush.forEach((item, index) => {
					     item.id = `${index+42}`;
					   });
					uni.hideLoading()
					return
				}
				
				let dat = await db.collection("volunteer-userinfo").where(`user_id=="${user_id}"`).get()
				this.volunteer = dat.data[0]
				console.log(this.volunteer)
				this.getSchoolPlan()
				uni.hideLoading()
			},
			changeSchool1(item,index){
				console.log(item)
				console.log(index)
				if(item.name==""){
					this.showPick=true
					this.index=item.id-12
					this.arr ="safe"
				}
			},
			deleteSchool1(item,index){
				console.log(index)
				console.log(item)
				
				this.volunteerList.safe[item.id-12].name = ""
			},
			changeSchool2(item,index){
				console.log(item)
				console.log(index)
				if(item.name==""){
					this.showPick=true
					this.index=item.id-23
					this.arr ="stable"
				}
			},
			deleteSchool2(item,index){
				console.log(index)
				console.log(item)
				
				this.volunteerList.stable[item.id-23].name = ""
			},
			changeSchool3(item,index){
				console.log(item)
				console.log(index)
				if(item.name==""){
					this.showPick=true
					this.index=item.id-42
					this.arr ="rush"
				}
			},
			deleteSchool3(item,index){
				console.log(index)
				console.log(item)
				
				this.volunteerList.rush[item.id-42].name = ""
			},
			async getVolunteerList() {
				
				const id = this.userInfo._id;
				let userInfo = await db.collection("volunteer-list").where(`user_id=="${id}"`).get()
				if(userInfo.data.length==0)return
				console.log(userInfo)
				console.log(userInfo.data[0]._id)
				
				
				const list = userInfo.data[0]
				console.log(this.volunteerList)
				let safe = [...list.volunteerSafe]
				let stable = [...list.volunteerStable]
				let rush = [...list.volunteerRush]
				 
				
				
				  // 3. 补全至三个元素
				  while(safe.length < 3) {
					  
				    safe.push({
				     name:"",
					 
				    });
					
				  }
				  while(stable.length < 3) {
					  
				    stable.push({
				     name:"",
					 
				    });
				  }
				  while(rush.length < 3) {
					  
				    rush.push({
				    name:"",
					
				    });
				  }
				  
				  for(let i=0;i<3;i++){
					  safe[i].id=i+12
					  stable[i].id=i+23
					  rush[i].id=i+42
				  }
				this.volunteerList.safe=safe
				this.volunteerList.stable=stable
				this.volunteerList.rush=rush
				console.log(this.volunteerList)
				
				
				uni.hideLoading()
			}
		}
	}
</script>

<style lang="scss">
	.home {
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		align-items: center;
		padding: 20rpx;
		box-sizing: border-box;

		.title {
			color: #3c9cff;
			font-weight: bold;
			// font-weight: bold;
			font-size: 35rpx;
			margin-bottom:10rpx ;
		}
	}
</style>