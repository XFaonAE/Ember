<template>
    <div class="_root">
        <TitleBar />
    </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import TitleBar from "./vendor/axeridev/flux/TitleBar.vue";

@Options({
    components: {
        TitleBar
    }
})
export default class Main extends Vue {
}
</script>

<style lang="less" scoped>
    
</style>