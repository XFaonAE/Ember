<template>
	<div class="root">
		<nav>
			<router-link to="/">Home</router-link>
			<router-link to="/about">About</router-link>
		</nav>

		<hr />

		<router-view />
	</div>
</template>

<style lang="less">
* {
	box-sizing: border-box
	color: #000
	background: #fff
	font-family: sans-serif
	font-weight: lighter
	font-size: 12px
	transition: 100ms
}

nav {
	a {
		padding: 6px 10px

		&:hover {
			background: rgba(0, 0, 0, 0.05)
		}
	}

	a.router-link-active {
		color: #74bddd
	}
}

hr {
	border: none
	border-bottom: 1px solid #f1f1f1
}
</style>