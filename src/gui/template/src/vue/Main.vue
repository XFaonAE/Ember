<template>
    <div class="_root">
        <TitleBar />
        <MenuBar />
        <Switch />

        <video></video>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
// @ts-ignore
import TitleBar from "./vendor/axeridev/flux/TitleBar.vue";
// @ts-ignore
import MenuBar from "./vendor/axeridev/flux/MenuBar.vue";
// @ts-ignore 
import Switch from "./vendor/axeridev/flux/Switch.vue";

@Options({
    components: {
        TitleBar,
        MenuBar,
        Switch
    }
})
export default class Main extends Vue {
    public created() {
        document.body.classList.add("_scheme_dark");
    }
}
</script>

<style lang="less">
@import "./vendor/axeridev/flux/Config";
</style>