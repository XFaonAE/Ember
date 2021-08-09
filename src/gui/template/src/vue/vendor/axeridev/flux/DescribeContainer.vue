<template>
    <div class="root">
        <div class="header">
            <h1>{{ title }}</h1>

            <p v-if="description">{{ description }}</p>
        </div>

        <div class="body">
            <slot></slot>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

@Options({
    props: [ "title", "description" ]
})
export default class DescribeContainer extends Vue {}
</script>

<style lang="less" scoped>
@import "./Config";

.root {
    max-width: 400px;

    .header {
        padding: 10px;

        h1 {
            font-size: 25px;
            font-weight: lighter;
            font-family: @mainFont;
        }

        p {
            font-size: 11px;
            color: @textDim;
            font-family: @mainFont;
        }
    }
}
</style>