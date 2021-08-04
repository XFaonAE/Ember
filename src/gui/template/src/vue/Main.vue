<template>
    <div class="_root">
        <TitleBar />
        <NavigationRow />
        <Switch />
    </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
// @ts-ignore
import TitleBar from "./vendor/axeridev/flux/TitleBar.vue";
// @ts-ignore
import NavigationRow from "./vendor/axeridev/flux/NavigationRow.vue";
// @ts-ignore 
import Switch from "./vendor/axeridev/flux/Switch.vue";

@Options({
    components: {
        TitleBar,
        NavigationRow,
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