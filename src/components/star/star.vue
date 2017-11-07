<template>
	<!--绑定动态类名starType是因为返回不同的图片大小(通过size返回48 36 24)-->
	<div class="star" :class="starType">	
	<!--绑定动态类名itemClass是因为返回不同状态的星星(通过score返回on half off)-->
		<span v-for="itemClass in itemClasses" :class="itemClass" class="star-item" track-by='index'></span>
	</div>
</template>

<script>
	const length=5
	const cls_on='on'
	const cls_half='half'
	const cls_off='off'
	export default{
		name:'star',
//通过接收的参数(大小和分数)实现不同的星星样式
		props:{
			size:{
				type:Number
			},
			score:{
				type:Number
			}
		},
//通过接收到的参数映射出一个计算方法
		computed:{
			starType(){
				return 'star-'+this.size
			},
			itemClasses(){
				let result=[]
//				向下取整,这样使得到的分数要么是整数  要么是1.5类似的数
				let score=Math.floor(this.score*2)/2;
//				计算分数是否是小数(控制半星)
				let hasDecimal=score%1!==0
//				分数取整(控制全星)
				let integer=Math.floor(score)
//				遍历整数,有几个整数就在数组里加入全星的类名
				for(let i=0;i<integer;i++){
					result.push(cls_on)
				}
//				因为半星只可能有一个,所以判断是否有,有就在数组里加入半星的类名
				if(hasDecimal){
					result.push(cls_half)
				}
//				当数组长度小于5时,在数组里加入空星的类名
				while(result.length<length){
					result.push(cls_off)
				}
				return result
			}
		}
	}
</script>

<style lang="scss" scoped="scoped">
@mixin bg-image($url)
{
    background-image: url($url+'@2x.png');
    @media(-webkit-min-device-pixel-ratio:3),(min-device-pixel-ratio:3)
    {
       background-image: url($url+'@3x.png'); 
    }
}
.star
{
	font-size: 0;
	.star-item
	{
		display: inline-block;
		background-repeat: no-repeat;
	}
	&.star-48
	{
		.star-item
		{
			width: 20px;
			height: 20px;
			margin-right: 22px;
			background-size: 20px 20px;
			&:last-child
			{
				margin-right: 0;
			}
			&.on
			{
				@include bg-image('star48_on')
			}
			&.half
			{
				@include bg-image('star48_half')
			}
			&.off
			{
				@include bg-image('star48_off')
			}
		}
	}
	&.star-36
	{
		.star-item
		{
			width: 15px;
			height: 15px;
			margin-right: 6px;
			background-size: 15px 15px;
			&:last-child
			{
				margin-right: 0;
			}
			&.on
			{
				@include bg-image('star36_on')
			}
			&.half
			{
				@include bg-image('star36_half')
			}
			&.off
			{
				@include bg-image('star36_off')
			}
		}
	}
	&.star-24
	{
		.star-item
		{
			width: 10px;
			height: 10px;
			margin-right: 3px;
			background-size: 10px 10px;
			&:last-child
			{
				margin-right: 0;
			}
			&.on
			{
				@include bg-image('star24_on')
			}
			&.half
			{
				@include bg-image('star24_half')
			}
			&.off
			{
				@include bg-image('star24_off')
			}
		}
	}
	
}
</style>