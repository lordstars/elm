<template>
	<div class="goods">
		<!--对于需要滚动的元素在方法中需要获取DOM元素,vue2.0中提供了一个绑定元素的属性 ref='元素名' 方法中通过this.$refs.元素名即可获取到当前DOM对象 元素名要用驼峰不能用中划线-->
		<!--获取DOM元素，也可以有一个方法v-el,调用时用this.$els.名字.子元素-->
		<div class="menu-wrapper" ref="menuWrapper">
			<ul>
				<!--动态绑定一个current的类名 因为每个li遍历时都会有一个index值,所以当index值和下面的方法中currentIndex返回的值相同时  代表正在显示当前切换卡的内容即高亮显示-->
				<!--给li绑定一个点击事件 实现当点击左侧切换卡的时候右侧内容变动  因为会产生多个子li所以需要给事件传一个特定的index,且传入一个$event对象-->
				<li v-for="(item,index) in goods" class="menu-item" :class="{'current':currentIndex===index}" @click="selectMuen(index,$event)"> <span class="text border-1px">
					<!--这里是活动图标 根据后台返回的type数值,如果大于0则显示图标 并且定义一个样式数组 根据type的下标取到对应的样式类名进行绑定-->
					<span v-show="item.type>0" class="icon" :class="classMap[item.type]"></span> <span>{{item.name}}</span> </span>
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
							<div class="icon"> <img :src="food.icon" alt="" width="57px" /> </div>
							<div class="content">
								<h2 class="name">{{food.name}}</h2>
								<p class="desc">{{food.description}}</p>
								<div class="extra"> <span class="count">月售{{food.sellerCount}}份</span> <span>好评率{{food.rating}}</span> </div>
								<div class="price"> <span class="now">￥{{food.price}}</span>
									<!--通过是否有降价字段来控制显示是否有降价内容--><span v-show="food.oldPrice" class="old">￥{{food.oldPrice}}</span> </div>
								<!--这里是购物加减按钮组件 需要给按钮定位 所以给组件外层套一个容器-->
								<div class="cartcontrol-wrapper">
									<!--这个组件是对单个的food进行操作  所以需要传入food-->
									<cartcontrol :food="food"></cartcontrol>
								</div>
							</div>
						</li>
					</ul>
				</li>
			</ul>
		</div>
		<!--因为组件中需要用到配送费和起送价  所以传入两个参数-->
		<shopcart :deliveryPrice="seller.deliveryPrice" :minPrice="seller.minPrice" :selectFoods="selectFoods"></shopcart>
	</div>
</template>
<script>
	import BScroll from 'better-scroll';
	//引入子组件 后面要写相对路径
	import shopcart from '@/components/shopcart/shopcart';
	import cartcontrol from '@/components/cartcontrol/cartcontrol'
	const ERR_ok = 0
	export default
	{
		name: 'goods',
		props:
		{
			seller:
			{
				type: Object
			}
		},
		data()
		{
			return {
				goods: [],
				//定义一个数组存放高度,因为获取的是不同区域的高度,即递增的li的区间高度,而且这个数组的个数可以和左边切换卡个数相对应
				listHeight: [],
				//定义一个scrollY 用来存储滚动时实时的高度 用来和区间高度进行比较 从而和左侧的切换卡进行映射 
				scrollY: 0
			}
		},
		//计算属性中 通过这个方法确定左侧切换卡当前应该在那一个上高亮显示(因为这个方法返回的是一个下标值  他返回的下标值代表他右侧显示的是左侧这个下标对应的区域)
		//把这个方法放在计算属性中   因为当DOM在滚动时  他会重新计算高度 实时更新
		computed:
		{
			currentIndex()
			{
				for(var i = 0; i < this.listHeight.length; i++)
				{
					//获取当前索引值对应的高度和下一个索引值的高度
					let height1 = this.listHeight[i]
					let height2 = this.listHeight[i + 1]
					//判断实时滚动的y轴坐标是否在当前区间内
					//还要考虑当遍历到最后一个时  已经超出了数组长度  那么height2将返回undefined 此时也应该返回i
					if(!height2 || (this.scrollY >= height1 && this.scrollY < height2))
					{
						//如果是在当前区间内就返回当前下标,即对应左侧的第几个切换卡
						return i
						console.log(i)
					}
				}
				//没有滚动就返回0
				return 0
			},
			//购物车组件中要用到对商品的选择(实际就是返回一个选择的商品的数组)
			selectFoods()
			{
				//首先定义这个返回值是一个数组
				let foods = []
				//首先遍历一级菜单goods  即左侧不同切换卡的大类
				this.goods.forEach((good) =>
				{
					//再遍历goods进到二级菜单的foods 即取到每一个单品
					good.foods.forEach((food) =>
					{
						//判断商品的count是否存在  如果存在则证明商品已经被选择 就把这个选择的商品对象添加到定义好的数组中
						if(food.count)
						{
							foods.push(food)
						}
					})
				})
				return foods
			}
		},
		created()
		{
			this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
			this.$http.get('/api/goods').then((res) =>
			{
				res = res.body
				if(res.errno === ERR_ok)
				{
					this.goods = res.data
					//console.log(this.goods)
					//创建时调用初始化滚动的方法 ,但是初始化better-scroll时,因为dom更新是异步的,所以滚动监测到的DOM高度没有改变
					//DOM异步更新是在$nexTick()这个回调里  所以调用滚动方法需要放在这个异步的回调函数里
					this.$nextTick(() =>
					{
						this.initScroll()
						//DOM更新后计算高度(只要遇到一些计算DOM的方法都放在$nextTick这个异步函数中)
						this.caculateHeight()
					})
				}
			})
		},
		//初始化需要有滚动效果的元素,new一个better-scroll对象   这个方法在异步更新DOM时(this.$nextTick 的回调函数中)调用
		methods:
		{
			initScroll()
			{
				//better-scroll接收两个参数,第一个参数是 DOM元素(需要滚动的元素 这个元素一定要是外面的一层),第二个参数是一个jso对象
				//通过this.$refs.元素名可以获取到DOM对象
				this.menuScroll = new BScroll(this.$refs.menuWrapper,
				{
					//参数里需要传一个clcik参数  否则左侧不可点击
					click: true
				});
				this.foodsScroll = new BScroll(this.$refs.foodsWrapper,
				{
					click: true,
					probeType: 3 //better-scroll内置的一个属性,传入此参数的目的是 表示 实时监测滚动的位置
				});
				//better-scroll的监听事件(滚动事件,第二个参数传一个位置的参数,这个参数具有x,y两个属性  表示 x y轴坐标)
				this.foodsScroll.on('scroll', (pos) =>
				{
					//将实时滚动的位置的y值赋给定义好的scrollY并且取整取正 (因为滚动的Y值会有负的)
					this.scrollY = Math.abs(Math.round(pos.y))
				})
			},
			//实现左右联动,左侧点击右侧自动滑到相应区块
			//定义一个计算高度的方法
			//获取每个区块的高度,即右侧每一个li的累加高度()
			caculateHeight()
			{
				//根据类名获取所有的li
				let foodListH = this.$refs.foodsWrapper.getElementsByClassName('food-list')
				//因为之后要累加,故先定义一个高度初始化为0
				let height = 0;
				//将第一个高度放进data里定义好的高度数组里面去
				this.listHeight.push(height)
				//因为获取的是每个li的累加高度   所以遍历li的长度
				for(var i = 0; i < foodListH.length; i++)
				{
					//每循环一次都将li的高度累加一次,并且将这个高度依次存进data里定义好的数组里面,即可产生一个递增的区间高度的数组
					height += foodListH[i].clientHeight
					this.listHeight.push(height)
				}
			},
			selectMuen(index, $event)
			{
				//此时 因为better-scroll初始化时设置了click:true,因为浏览器本身派生了一个点击事件  所以在pc端下会出现重复的事件 ,所以解决这个问题需要传入一个$event,与浏览器派发的事件做区别
				//如果不是我们派发的事件而是浏览器本身派发的事件(浏览器事件没有_constructed这个属性) 就return  不执行  如果是我们派发的事件才让他继续执行滚动到相应位置
				if(!event._constructed)
				{
					return
				}
				//通过对应的index滚动到右侧相应的区块
				console.log(index)
				//获取到所有的右侧列表
				let foodListH = this.$refs.foodsWrapper.getElementsByClassName('food-list')
				//根据索引值取到相应的DOM元素
				let el = foodListH[index]
				//运用better-scroll提供的一个接口scrollToElement(滚动到的DOM元素,滚动时间)实现右侧滚动
				this.foodsScroll.scrollToElement(el, 300)
			},
			_drop(target)
			{
				
			}
		},
		components:
		{
			shopcart,
			cartcontrol
		},
		//接收cartcontrol组件中的派发事件,调用一个方法
		events:
		{
			'cart.add' (target)
			{
				this._drop(target)
			}
		}
	}
</script>
<style lang="scss">
	* {
		padding: 0;
		margin: 0;
		font-size: 12px;
		font-weight: normal;
	}
	html, body {
		width: 100%;
		height: 100%;
		padding: 0;
		margin: 0;
	}
	ul {
		padding: 0;
		margin: 0;
	}
	li {
		list-style: none;
	}
	@mixin bg-image($url) {
		background-image: url($url+'@2x.png');
		@media(-webkit-min-device-pixel-ratio: 3), (min-device-pixel-ratio:3) {
			background-image: url($url+'@3x.png');
		}
	}
	/*1像素下边框*/
	
	@mixin bordered($color) {
		position: relative;
		&:after {
			display: block;
			position: absolute;
			left: 0;
			bottom: 0;
			width: 100%;
			border-top: 1px solid $color;
			content: '';
		}
	}
	/*去除一像素边框*/
	
	@mixin bordered-none() {
		&:after {
			display: none;
		}
	}
	/*商品区域有一定的可视区域  但是超出部分会隐藏且会滚动并没有滚动条所以需要绝对定位*/
	
	.goods {
		display: flex;
		position: absolute;
		top: 174px;
		bottom: 46px;
		width: 100%;
		overflow: hidden;
		.menu-wrapper {
			flex: 0 0 80px;
			/*flex有三个属性  此属性代表不会自动撑开和缩放 固定只有80px*/
			width: 80px;
			background: #f3f5f7;
			.menu-item {
				/*display:table单行或多行都可以垂直居中  将里面的元素设置为table-cell*/
				display: table;
				width: 56px;
				height: 54px;
				line-height: 14px;
				padding: 0 12px;
				&.current {
					/*因为高亮时要把上面的下边框盖着 所以要向上移1像素*/
					position: relative;
					margin-top: -1px;
					background: #FFFFFF;
					font-weight: 700;
					.text {
						@include bordered-none();
					}
				}
				.text {
					font-size: 12px;
					display: table-cell;
					width: 56px;
					vertical-align: middle;
					@include bordered(rgba(7, 17, 27, 0.1))
				}
				.icon {
					display: inline-block;
					width: 12px;
					height: 12px;
					margin-right: 2px;
					background-size: 12px;
					background-repeat: no-repeat;
					vertical-align: top;
					&.decrease {
						@include bg-image('decrease_3');
					}
					&.discount {
						@include bg-image('discount_3');
					}
					&.guarantee {
						@include bg-image('guarantee_3');
					}
					&.invoice {
						@include bg-image('invoice_3');
					}
					&.special {
						@include bg-image('special_3');
					}
				}
			}
		}
		.foods-wrapper {
			flex: 1;
			/*右侧随着手机宽度自动撑开*/
			.title {
				padding-left: 14px;
				height: 26px;
				line-height: 26px;
				border-left: 2px solid #d9dde1;
				font-size: 12px;
				color: rgb(147, 153, 159);
				background: #f4f5f7;
			}
			.food-item {
				display: flex;
				margin: 18px;
				padding-bottom: 18px;
				@include bordered(rgba(7, 17, 27, 0.1)) &:last-child {
					@include bordered-none();
					margin-bottom: 0;
				}
				.icon {
					flex: 0 0 57px;
					margin-right: 10px;
				}
				.content {
					flex: 1;
					.name {
						margin: 2px 0 8px 0;
						height: 14px;
						line-height: 14px;
						font-size: 14px;
						color: rgb(7, 17, 27);
					}
					.desc {
						margin-bottom: 8px;
						line-height: 12px;
						font-size: 10px;
						color: rgb(147, 153, 159);
					}
					.extra {
						line-height: 10px;
						font-size: 10px;
						color: rgb(147, 153, 159);
						.count {
							margin-right: 12px;
						}
					}
					.price {
						font-weight: 700;
						line-height: 24px;
						.now {
							margin-right: 8px;
							font-size: 14px;
							color: rgb(240, 20, 20);
						}
						.old {
							text-decoration: line-through;
							font-size: 10px;
							color: rgb(147, 153, 159);
						}
					}
					.cartcontrol-wrapper {
						position: absolute;
						right: 0;
						bottom: 12px;
					}
				}
			}
		}
	}
</style>