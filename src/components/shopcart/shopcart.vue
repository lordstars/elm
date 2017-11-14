<template>
<div class="shopcart">
<div class="content">
	<div class="content-left">
		<div class="logo-wrapper">
			<div class="logo" :class="{'highlight':totalCount>0}">
				<i class="icon-shopping_cart" :class="{'highlight':totalCount>0}"></i>
			</div>
			<div class="number" v-show="totalCount>0">{{totalCount}}</div>
		</div>
		<!--动态绑定类名 当价格>0时 添加一个lighlight的类名-->
		<div class="price" :class="{'highlight':totalPrice>0}">￥{{totalPrice}}</div>
		<div class="desc">另需配送费￥{{deliveryPrice}}</div>
	</div>
	<div class="content-right">
		<!--动态的绑定两个类名  两个类名根据情况切换  传一个payClass计算属性  通过下面计算属性返回不同类名-->
		<div class="pay" :class="payClass">{{payDesc}}</div>
	</div>
</div>
</div>
</template>
<script>
	export default{
		name:"shopcart",
		props:{ 
			//从goods组件映射一些相应 的商品选择在shopcart组件内实现结算
			//selectFoods用来存储选择商品的价格和数量信息
			selectFoods:{
				type:Array,
			//如果传入的类型一个数组或对象 ,那么默认的状态也要返回一个数组或对象的函数
				default(){
					//返回一个数组  
					return [{price:10,count:3}];
				}
			},
			deliveryPrice:{
				type:Number,
				//在组件没有传进来之前可以设置默认的显示状态
				default:0
			},
			minPrice:{
				type:Number,
				default:0
			}
		},
		data(){
			return{
				
			}
		},
		//计算属性
		computed:{
			//计算总价
			totalPrice(){
				let total=0;
				this.selectFoods.forEach((food)=>{
					total+=food.price*food.count
				})
				return total;
			},
			//计算商品个数
			totalCount(){
				let count=0;
				this.selectFoods.forEach((food)=>{
					count+=food.count
				})
				return count;
			},
			//计算起送价和商品总价之间的差价返回不同的节点内容
			payDesc(){
				if(this.totalPrice===0){
					return "￥"+this.minPrice+"元起送"
				}else if(this.totalPrice<this.minPrice){
					let diff=this.minPrice-this.totalPrice
					return "还差￥"+diff+"元起送"
				}else{
					return "去结算"
				}
			},
			//切换类名的计算属性
			payClass(){
				if(this.totalPrice<this.minPrice){
					//返回的是类名
					return "not-enough"
				}else{
					return "enough"
				}
				
			}
		}
	}
</script>

<style lang="scss">
	.shopcart{
		position: absolute;
		left: 0;
		bottom: 0;
		z-index: 50;
		width: 100%;
		height: 48px;
		.content
		{
			display: flex;
			background: #141d27;
			font-size: 0;
			.content-left
			{
				flex: 1;
				.logo-wrapper
				{
					display: inline-block;
					position: relative;
					top: -10px;
					margin: 0px  12px;
					padding: 6px;
					width: 56px;
					height: 56px;
					/*表示宽高已经包含了content padding border值*/
					box-sizing: border-box;
					vertical-align: top;
					border-radius: 50%;
					background: #141d27;
					.logo
					{
						width: 100%;
						height: 100%;
						border-radius: 50%;
						background: #2b343c;
						text-align: center;
						&.highlight{
							background: rgb(0,160,220);
						}
						.icon-shopping_cart
						{
							font-size: 24px;
							line-height: 44px;
							color: #80858a;
							&.highlight{
								color: #FFFFFF;
							}
						}
					}
					.number{
						top: 0;
						right: 0;
						position: absolute;
						width: 24px;
						height: 16px;
						line-height: 16px;
						text-align: center;
						border-radius: 16px;
						font-size: 9px;
						color: white;
						font-weight: 700;
						background: rgb(240,20,20);
						box-shadow: 0 4px 8px 0 rgba(0,0,0,0.4);
					}
				}
				.price
				{
					display: inline-block;
					vertical-align: top;
					line-height:24px;
					margin-top: 10px;
					padding-right: 12px;
					box-sizing: border-box;
					border-right: 1px solid rgba(255,255,255,0);
					font-size: 16px;
					font-weight: 700;
					color: rgba(255,255,255,0.4);
					&.highlight
					{
						color: white;
					}
				}
				.desc
				{
					display: inline-block;
					vertical-align: top;
					margin: 12px 0 0 12px;
					line-height: 24px;
					color: rgba(255,255,255,0.4);
					font-size: 10px;
				}
			}
			.content-right
			{
				flex: 0 0 105px;
				.pay
				{
					height: 48px;
					line-height:48px;
					text-align: center;
					font-size: 12px;
					font-weight: 700;
					color: rgba(255,255,255,0.4);
					background: #2b333b;
					&.not-enough{
					background: #2b333b;
					}
					&.enough{
						background: #00b43c;
						color: white;
					}
				}
			}
		}
	}
</style>