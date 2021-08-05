<template>
    <div class="_root">
        <TitleBar />
        <NavigationRow />

        <RouterView />
    </div>
</template>

<script lang="ts">
    import { Options, Vue } from "vue-class-component";
    import TitleBar from "./vendor/axeridev/flux/TitleBar.vue";
    import NavigationRow from "./vendor/axeridev/flux/NavigationRow.vue";
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