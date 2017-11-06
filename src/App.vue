<template>
	<div id="app">
		<headed></headed>
		<div id="tab" class="border-1px">
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
	export default {
		name: 'app',
		components: {
			headed
		}
	}
</script>

<style lang="scss">
	/*移动端1px实现公共样式方法*/
	@mixin bordered($color){
	position: relative;
	&:after{
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