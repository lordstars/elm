<template>
<div class="goods">
	<div class="menu-wrapper">
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
	<div class="foods-wrapper">
	
	</div>
</div>
	
</template>

<script>
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
					console.log(this.goods)
				}
			})
		}
	}
</script>

<style  lang="scss">
@mixin bg-image($url)
{
    background-image: url($url+'@2x.png');
    @media(-webkit-min-device-pixel-ratio:3),(min-device-pixel-ratio:3)
    {
       background-image: url($url+'@3x.png'); 
    }
}
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
	html,body{
		width: 100%;
		height: 100%;
		padding: 0;
		margin: 0;
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
					/*padding: 0 12px;*/
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
		}
	}
	
</style>