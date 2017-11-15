<template>
	<div class="cartcontrol">
		<!--如果food的数量大于0才让减号按钮显示-->
		<!--让按钮位移和旋转的动画-->
		<transition name="move">
			<!--外层控制位移 内层控制旋转-->
			<div class="cart-decrease" v-show="food.count>0" @click="decreaseCart($event)">
				<i class="icon-remove_circle_outline inner"></i>
			</div>
		</transition>
		<div class="cart-count" v-show="food.count>0">{{food.count}}</div>
		<!--给每一个加号加按钮添加点击事件 从而实现减号按钮和个数的变化-->
		<div class="cart-add" @click="addCart($event)">
			<i class="icon-add_circle"></i>
		</div>
	</div>
</template>

<script>
	import Vue from 'vue'
	export default {
		//因为按钮都是对单个food进行加减 所以需要接收一个关于food的对象
		props: {
			food: {
				type: Object
			}
		},
		created() {
			console.log(this.food)
		},
		methods: {
			//			添加完事件以后发现页面点击并无效果 是因为这个组件是在goods组件内 而goods组件右侧运用了betterscroll所以不能点击,
			//			需要在betterScroll初始化的时候设置click才可以点击
			addCart($event) {
				//				这里同样是解决pc端下事件重复
				if(!event._constructed) {
					return
				}
				console.log("click")
				//初始化默认点击一次后显示数量为1
				if(!this.food.count) {
					//这里会发现点击页面count区域并不会发生任何变化
					//是因为food.count本来是没有的属性,在这种情况下并不会变化
					//这种情况下需要我们通过Vue的set(被添加的对象,'添加的属性名key','属性值value')方法手动添加这样一个属性,需要在js开始先引入vue
					Vue.set(this.food, 'count', 1)
				} else {
					//每点击数量++
					this.food.count++

				}
			},
			decreaseCart() {
				if(!event._constructed) {
					return
				}
				if(this.food.count) {
					this.food.count--
				}
			}

		}
	}
</script>

<style lang="scss">
	.cartcontrol {
		font-size: 0;
		.cart-decrease{
			display: inline-block;
			padding: 6px;
			/*设置动画时间*/
			transition: all 0.4s linear;
			.inner {
				font-size: 24px;
				line-height: 24px;
				color: rgb(0, 160, 220);
				display: inline-block;
				transition: all 0.4s linear;
				/*刚开始旋转是0*/
				transform: rotate(0);
			}
			&.move-enter,
			&.move-leave-to{
				opacity: 0;
				/*translate3D内值分别表示x y z三个方向上的位移距离 第一个值是正数代表他的位移是表示从又到左的  负数则是从左到右*/
				transform: translate3D(24px, 0, 0);
				.inner{
					/*动画完成后旋转是360deg*/
					transform: rotate(360deg);
				}
			}
		}
		.cart-count {
			display: inline-block;
			vertical-align: top;
			width: 12px;
			padding-top: 6px;
			line-height: 24px;
			text-align: center;
			font-size: 10px;
			color: rgb(147, 153, 159);
		}
		.cart-add {
			display: inline-block;
			padding: 6px;
			i{
				font-size: 24px;
				line-height: 24px;
				color: rgb(0, 160, 220);
			}
		}
	}
</style>