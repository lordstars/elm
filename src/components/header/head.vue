<template>
	<div class="header">
		<!--上部内容区-->
		<div class="content-wrapper">
			<!--左面图片区域-->
			<div class="avatar">
				<img width="64" height="64" :src="seller.avatar" alt="" />
				<!--对于dpi为2的设计稿 图片宽高为设计稿标注的二分之一-->
				<!--vue中写图片路径必须使用:src不能直接写src-->
			</div>
			<!--右边详情区域-->
			<div class="content">
				<div class="title">
					<span class="brand"></span>
					<span class="name">{{seller.name}}</span>
				</div>
				<div class="description">
					{{seller.description}}/{{seller.deliveryTime}}分钟送达
				</div>
				<!--运用v-if的原因:
				1:支持的活动 活动不一定会有  所有用v-if控制
				2:因为seller是从父组件传过来的对象,而seller是在created发送ajax请求的时候获取的,是异步的,所以在一开始渲染seller时是一个空对象所以这里自然也获取不到数据-->
				<div v-if="seller.supports" class="support">
					<!--图标显示不同 根据后台返回的type不同显示不同图片定义不同的class  所以动态绑定一个class即:class 因为数据中是返回type,而type是0-4的数字,所以定义一个数组按照0-4对应的图片写一个类名的数组，即获取到type值时就获取到了数组中对应下标的值即类名-->
					<span class="icon" :class="classMap[seller.supports[0].type]"></span>
					<!--头部只显示一条支持的活动数据  所以只去数组中第一条数据-->
					<span class="text">{{seller.supports[0].description}}</span>
				</div>
				
			</div>
			<div class="support-count" v-if="seller.supports" @click="showDetail">
				<span class="count">{{seller.supports.length}}个</span>
				<!--运用icon生成的图标示范-->
				<i class="icon-keyboard_arrow_right"></i>
			</div>
		</div>
		<!--底部公告区-->
		<div class="bulletin-wrapper" @click="showDetail">
			<span class="bulletin-title"></span><span class="bulletin-text">{{seller.bulletin}}</span>
			<i class="icon-keyboard_arrow_right"></i>
		</div>
		<div class="background">
			<img :src="seller.avatar" alt="" width="100%" height="100%" />
		</div>
		<!--通过标签内transition实现css过度动画-->
		<transition name="fade">
			<div class="detail" v-show="detailShow">
			<!--通过detailShow来控制遮罩层的显示隐藏-->
			<!--Css Sticky Footer的布局套路-->
			<div class="detail-wrapper clearfix">
				<!--clearfix是一个公共样式 利用伪类清楚浮动-->
				<div class="detail-main">
					<h1 class="name">{{seller.name}}</h1>
					<!--有关组件位置的样式问题不要写在star组件内 否则别的地方就不能用,可以在组件外面包一个div对其进行设置-->
					<div class="star-wrapper">
						<!--在组件上传入需要接收的值-->
						<star :size='48' :score="seller.score"></star>
					</div>
					<div class="title">
						<div class="line"></div>
						<div class="text">优惠信息</div>
						<div class="line"></div>
					</div>
					
					<ul v-if="seller.supports" class="supports">
						<!--遍历出每一个li  (item,index)index表示每一个下标-->
						<li class="support-item" v-for="(item,index) in seller.supports">
							<!--动态绑定类名 根据type返回的值获取对应下标的类名-->
							<span class="icon" :class="classMap[seller.supports[index].type]"></span>
							<span class="text">{{seller.supports[index].description}}</span>
						</li>
					</ul>
					<div class="title">
						<div class="line"></div>
						<div class="text">商家公告</div>
						<div class="line"></div>
					</div>
					<div class="bulletin">
						<p class="content">
							{{seller.bulletin}}
						</p>
					</div>
				</div>
			</div>
			<div class="detail-close" @click="hideDetail">
				<i class="icon-close"></i>
			</div>
		</div>
		</transition>
		
	</div>
</template>

<script>
	import star from '@/components/star/star'
	export default {
		name:'headed',
//		通过props属性接收父组件中传过来的值(只要用了这个组件的组件就是它的父组件)
		props:{
			seller:{
				type:Object  //可以指定值的类型为对象(这里因为seller是一个对象)
			}
		},
		created(){
			this.classMap=['decrease','discount','special','invoice','guarantee'];
		},
		data(){
			return{
				detailShow:false
			}
		},
		methods:{
			showDetail(){
				this.detailShow=true
			},
			hideDetail(){
				this.detailShow=false
				
			}
		},
		components:{
			star
		}
	}
</script>

<style  lang="scss" scoped="scoped">
html,body{
	width: 100%;
	height: 100%;
	margin: 0;
	padding: 0;
}
/*2x和3x下自动切换背景图片的方法*/
@mixin bg-image($url)
{
    background-image: url($url+'@2x.png');
    @media(-webkit-min-device-pixel-ratio:3),(min-device-pixel-ratio:3)
    {
       background-image: url($url+'@3x.png'); 
    }
}
	.header
	{
		position: relative;
		color: white;
		background: rgba(7,17,27,0.5);
		overflow: hidden;
		/*因为图片设置blur 这里要设置overflow:hidden 否则会有阴影露出来*/
		.content-wrapper
		{
			position: relative;
			padding: 24px 12px 18px 24px;
			font-size:0px;  
			/*头部图片和字之间有缝隙  是因为有空白字符  所以给父元素设置字体为0  子元素字体单独进行设计*/
			.avatar
			{
				display: inline-block;
				vertical-align: top;
				img
				{
					border-radius: 2px;
				}
			}
			.content
			{
				display: inline-block;
				margin-left: 14px;
				.title
				{
					margin: 2px 0px 8px 0px;
					.brand
					{
						display: inline-block; 
						vertical-align: top; 
						width: 30px;
						height: 18px;
						@include bg-image('brand');  
						/*设置背景图片 因为在2x和3x下背景不同  所以写一个公共方法 样式中调用*/
						background-size: 30px 18px;
						background-repeat: no-repeat;
					}
					.name
					{
						margin-left: 6px;
						font-size: 16px;
						line-height: 18px;
						font-weight: bold;
						
					}
				}
				.description
				{
					margin-bottom: 10px;
					line-height: 12px;
					font-size: 12px;
				}
				.support
				{
					.icon
					{
						display: inline-block;
						width: 12px;
						height: 12px;
						margin-right: 4px;
						background-size: 12px;
						background-repeat: no-repeat;
						vertical-align: top;
						&.decrease{
							@include bg-image('decrease_1');
						}
						&.discount{
							@include bg-image('discount_1');
						}
						&.guarantee{
							@include bg-image('guarantee_1');
						}
						&.invoice{
							@include bg-image('invoice_1');
						}
						&.special{
							@include bg-image('special_1');
						}
					}
					.text
					{
						line-height: 12px;
						font-size: 10px;
					}
				}
			}
			.support-count
			{
				position: absolute;
				right: 12px;
				bottom: 14px;
				padding: 0px 8px;
				height: 24px;
				line-height: 24px;
				border-radius: 14px;
				background-color: rgba(0,0,0,0.2);
				text-align: center;
				.count
				{
					
					font-size: 10px;
					vertical-align: top;
				}
				i{
					line-height: 24px;
					margin-left: 2px;
					font-size: 10px;
				}
			}
		}
		.bulletin-wrapper
		{
			position: relative;
			height: 28px;
			line-height: 28px;
			padding: 0px 22px 0px 12px;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
			background: rgba(7,17,27,0.2);
			/*font-size: 0px;*/ 
			/*如果这里加了fontsize=0可能会影响到后面省略号会没有,所以如果想消除两个span之间的空白字符可以在html内将两个span标签贴合*/
			.bulletin-title
			{
				display: inline-block;
				vertical-align: top;
				margin-top: 8px;
				height: 12px;
				width: 22px;
				@include bg-image('bulletin');
				background-size: 22px 12px;
				background-repeat: no-repeat;
			}
			.bulletin-text
			{
				vertical-align: top;
				font-size: 10px;
				margin: 0px 4px;
			}
			i
			{
				position: absolute;
				font-size: 10px;
				right: 12px;
				top: 8px;
			}
			
		}
		.background
		{
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			z-index: -1;
			filter: blur(10px);
		}
		.detail
		{
			position: fixed;
			top: 0;
			left: 0;
			z-index: 100;
			width: 100%;
			height: 100%;
			overflow: auto;
			background: rgba(7,17,27,0.8);
			/*背景模糊 是一种渐进增强的效果 在iphone手机上效果明显*/
			backdrop-filter:blur(10px);
			&.fade-enter-active, &.fade-leave-active 
			{
				opacity:1;
				background: rgba(7,17,27,0.8);
  				transition: all 2s
			}
			/*fade-leave-to是离开时的样式*/
			&.fade-enter, &.fade-leave-to
			{
				opacity: 0;
				background: rgba(7,17,27,0);
				transition: all 2s;
			}
			.detail-wrapper
			{
				/*外部容器的最小高度必须和视口一样*/
				width: 100%;
				min-height: 100%;
				.detail-main
				{
					margin-top: 64px;
					/*这种布局必须要设置padding 这里的padding实际是给关闭按钮留出空间 否则按钮会覆盖在文字上面*/
					padding-bottom:64px;
					.name
					{
						line-height: 16px;
						text-align: center;
						font-size: 16px;
						font-weight:700 ;
					}
					.star-wrapper
					{
						margin-top: 18px;
						text-align: center;
						padding: 2px 0;
					}
					.title
					{
						display: flex;
						width: 80%;
						margin: 28px auto 24px auto;
					}
					.line
					{
						flex: 1;
						position: relative;
						top: -6px;
						border-bottom: 1px solid rgba(255,255,255,0.2);
					}
					.text
					{
						padding: 0px 12px;
						font-size: 14px;
						font-weight: 700;
					}
					.supports
					{
						width: 80%;
						margin: 0 auto;
						.support-item
						{
							padding: 0 12px;
							margin-bottom: 12px;
							font-size: 0;
							&:last-child
							{
								margin-bottom: 0;
							}
							.icon
							{
								display: inline-block;
								width: 16px;
								height: 16px;
								vertical-align: top;
								margin-right: 6px;
								background-size: 16px 16px;
								background-repeat: no-repeat;
								&.decrease {
									@include bg-image('decrease_2');
								}
								
								&.discount {
									@include bg-image('discount_2');
								}
								
								&.guarantee {
									@include bg-image('guarantee_2');
								}
								
								&.invoice {
									@include bg-image('invoice_2');
								}
								&.special {
									@include bg-image('special_2');
								}
							}
							.text
							{
								line-height: 16px;
								font-size: 12px;
							}
						}
					}
					.bulletin
					{
						width: 80%;
						margin: 0 auto;
						.content
						{
							padding: 0 12px;
							line-height: 24px;
							font-size: 12px;
						}
					}
				}
			}
			.detail-close
			{
				position: relative;
				width: 32px;
				height: 32px;
				margin: -64px auto 0 auto;
				clear: both;
				font-size: 32px;
				
			}
		}
	}
</style>