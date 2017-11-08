<template>
	<div id="app">
		<headed :seller="seller"></headed>  
		<!--将seller对象传给headed组件     组件名不明 能header head等关键字-->
		<div id="tab" class="border-1px">
			<!--border-1px是一个公用样式 针对1px边框的dpi缩放-->
			<div class="tab-item">
				<router-link to='/goods'>商品</router-link>
			</div>
			<div class="tab-item">
				<router-link to='/ratings'>评价</router-link>
			</div>
			<div class="tab-item">
				<router-link to='/seller'>商家</router-link>
			</div>
		</div>
		<router-view></router-view>
	</div>
</template>

<script>
	import headed from '@/components/header/head.vue'  
//	用到的组件需要引入 在下面注册
	const ERR_ok=0 //成功时的状态码
	export default {
		name: 'app',
//		引入后,注册需要的组件
		components: {
			headed
		},
		data(){
			return{
				seller:{}
			}
		},
		created(){
//			在创建时发送ajax请求
			this.$http.get('/api/seller').then((response)=>{
				//response是一个属性 用body方法转化成json对象(更新后的body转化成json 如果用json方法转化成的是promise对象)
				response=response.body
				console.log(response)
				if(response.errno===ERR_ok){
					this.seller=response.data  
//					将获取到的数据赋值给定义号的seller对象
					console.log(this.seller)
				}
				
			}) 
		}
	}
</script>

<style lang="scss" scoped="scoped">
html,body{
	width: 100%;
	padding: 0;
	margin: 0;
}
	/*移动端1px实现公共样式方法*/
@mixin bordered($color)
{
	position: relative;
	&:after
	{
		display: block;
		position: absolute;
		left: 0;
		bottom: 0;
		width: 100%;
		border-top: 1px solid $color;
		content:'';
	}
}
	a{
		text-decoration: none;
	}
	#tab{
		display: flex;
		width: 100%;
		height: 40px;
		line-height: 40px;
		@include bordered(rgba(7,17,21,0.1))
		.tab-item {
			flex: 1;
			text-align: center;
			a {
				display: block;
				font-size: 14px;
				color: rgb(77, 85, 93);
			}
			.router-link-active {
				color: rgb(240, 20, 20);
			}
		}
	}
	
</style>