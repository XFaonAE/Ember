<template>
    <div class="root">
        <theme-controller ref="E"></theme-controller>
        <title-bar title="Test App" />

        <general-button>Hello Flux!</general-button>
    </div>
</template>

<script lang="ts">
export default {
    mounted() {
        console.log(this.$refs.E)
        this.$refs.E.loadTheme("Dark");
    }
}
</script> 

<style lang="less">
</style>