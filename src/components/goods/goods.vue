<template>
<div class="goods">
	<!--对于需要滚动的元素在方法中需要获取DOM元素,vue2.0中提供了一个绑定元素的属性 ref='元素名' 方法中通过this.$refs.元素名即可获取到当前DOM对象 元素名要用驼峰不能用中划线-->
	<div class="menu-wrapper" ref="menuWrapper">
		<ul>
			<li v-for="item in goods" class="menu-item">
				<span class="text border-1px">
					<!--这里是活动图标 根据后台返回的type数值,如果大于0则显示图标 并且定义一个样式数组 根据type的下标取到对应的样式类名进行绑定-->
					<span v-show="item.type>0" class="icon" :class="classMap[item.type]"></span>
					<span>{{item.name}}</span>
				</span>
				
			</li>
		</ul>
	</div>
	<div class="foods-wrapper" ref="foodsWrapper">
		<ul>
			<li v-for="item in goods" class="food-list">
				<!--先取到第一级的商品名称 也就是商品分类-->
				<h1 class="title">{{item.name}}</h1>
				<!--每一类商品下都有多种商品  遍历它下面的foods-->
				<ul>
					<li v-for="food in item.foods" class="food-item border-1px">
						<div class="icon">
							<img :src="food.icon" alt="" width="57px"/>
						</div>
						<div class="content">
							<h2 class="name">{{food.name}}</h2>
							<p class="desc">{{food.description}}</p>
							<div class="extra">
								<span class="count">月售{{food.sellerCount}}份</span>
								<span>好评率{{food.rating}}</span>
							</div>
							<span class="price">
								<span class="now">￥{{food.price}}</span>
								<!--通过是否有降价字段来控制显示是否有降价内容-->
								<span v-show="food.oldPrice" class="old">￥{{food.oldPrice}}</span>
							</span>
						</div>
					</li>
				</ul>
			</li>
		</ul>
	</div>
</div>
</template>

<script>
	import BScroll from 'better-scroll';
	const ERR_ok=0 
	export default{
		name:'goods',
		props:{
			seller:
			{
				type:Object
			}
		},
		data(){
			return{
				goods:[]
			}
		},
		created(){
			this.classMap=['decrease','discount','special','invoice','guarantee'];
			this.$http.get('/api/goods').then((res)=>{
				res=res.body 
				if(res.errno===ERR_ok){
					this.goods=res.data
					//console.log(this.goods)
					//创建时调用初始化滚动的方法 ,但是初始化better-scroll时,因为dom更新是异步的,所以滚动监测到的DOM高度没有改变
					//DOM异步更新是在$nexTick()这个回调里  所以调用滚动方法需要放在这个异步的回调函数里
					this.$nextTick(()=>{
						this.initScroll()
					})
				}
			})
		},
		//初始化需要有滚动效果的元素,new一个better-scroll对象   这个方法在创建时调用
		methods:{
			initScroll(){
				//better-scroll接收两个参数,第一个参数是 DOM元素(需要滚动的元素),第二个参数是一个jso对象
				//通过this.$refs.元素名可以获取到DOM对象
				this.menuScroll=new BScroll(this.$refs.menuWrapper,{});
				this.foodsScroll=new BScroll(this.$refs.foodsWrapper,{});
			}
		}
	}
</script>

<style  lang="scss">
	*{
		padding: 0;
		margin: 0;
		font-size: 12px;
		font-weight: normal;
	}
	html,body
	{
		width: 100%;
		height: 100%;
		padding: 0;
		margin: 0;
	}
	ul
	{
		padding: 0;
		margin: 0;
	}
	li
	{
		list-style: none;
	}
@mixin bg-image($url)
{
    background-image: url($url+'@2x.png');
    @media(-webkit-min-device-pixel-ratio:3),(min-device-pixel-ratio:3)
    {
       background-image: url($url+'@3x.png'); 
    }
}
/*1像素下边框*/
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
/*去除一像素边框*/
@mixin bordered-none()
{
	&:after
	{
		display: none;
	}
}
	
	/*商品区域有一定的可视区域  但是超出部分会隐藏且会滚动并没有滚动条所以需要绝对定位*/
	.goods
	{
		display: flex;
		position: absolute;
		top: 174px;
		bottom: 46px;
		width: 100%;
		overflow: hidden;
		.menu-wrapper
		{
			flex:0 0 80px; 
			/*flex有三个属性  此属性代表不会自动撑开和缩放 固定只有80px*/
			width: 80px;
			background: #f3f5f7;
				.menu-item
				{
					/*display:table单行或多行都可以垂直居中  将里面的元素设置为table-cell*/
					display: table;
					width: 56px;
					height: 54px;
					line-height: 14px;
					padding: 0 12px;
					.text
					{
						font-size: 12px;
						display: table-cell;
						width: 56px;
						vertical-align: middle;
						@include bordered(rgba(7,17,27,0.1))
					}
					.icon
					{
						display: inline-block;
						width: 12px;
						height: 12px;
						margin-right: 2px;
						background-size: 12px;
						background-repeat: no-repeat;
						vertical-align: top;
						&.decrease{
							@include bg-image('decrease_3');
						}
						&.discount{
							@include bg-image('discount_3');
						}
						&.guarantee{
							@include bg-image('guarantee_3');
						}
						&.invoice{
							@include bg-image('invoice_3');
						}
						&.special{
							@include bg-image('special_3');
						}
					}
					
				}
		}
		.foods-wrapper
		{
			flex: 1;
			/*右侧随着手机宽度自动撑开*/
			.title
			{
				padding-left: 14px;
				height: 26px;
				line-height: 26px;
				border-left: 2px solid #d9dde1;
				font-size: 12px;
				color: rgb(147,153,159);
				background: #f4f5f7;
			}
			.food-item
			{
				display: flex;
				margin: 18px;
				padding-bottom: 18px;
				@include bordered(rgba(7,17,27,0.1))
				&:last-child
				{
					@include bordered-none();
					margin-bottom: 0;
				}
				.icon
				{
					flex: 0 0 57px ;
					margin-right: 10px;
				}
				.content
				{
					flex: 1;
					.name
					{
						margin: 2px 0 8px 0;
						height: 14px;
						line-height: 14px;
						font-size: 14px;
						color: rgb(7,17,27);
						
					}
					.desc
					{
						margin-bottom: 8px;
						line-height: 12px;
						font-size: 10px;
						color: rgb(147,153,159);
					}
					.extra
					{
						line-height: 10px;
						font-size: 10px;
						color: rgb(147,153,159);
						.count
						{
							margin-right: 12px;
						}
					}
					.price
					{
						font-weight: 700;
						line-height: 24px;
						.now
						{
							margin-right: 8px;
							font-size: 14px;
							color: rgb(240,20,20);
							
						}
						.old
						{
							text-decoration: line-through;
							font-size: 10px;
							color: rgb(147,153,159);
						}
					}
				}
			}
		}
	}
</style>