<template>
    <div class="root">
        <div class="header">
            <h1>
                {{ title }}
            </h1>
        </div>

        <form class="body">
            <label v-for="input in inputs">
                <div :class="'error ' + (input.error ? '' : 'hide')">{{ input.error }}</div>

                <input :autofocus="input.autoFocus ? true : false" :value="input.value" :placeholder="input.placeholder"
                    :class="'text ' + (input.error ? 'has-error' : '')" 
                    type="text" v-if="input.type == 'text'" 
                />
            </label>
        </form>
    </div>
</template>

<script lang="ts">
import { Vue, Options } from "vue-class-component";

@Options({
  props: [ "title", "inputs" ],
})
export default class FormCard extends Vue {}
</script>

<style lang="less" scoped>
@import "./Config";

.root {
    width: 100vw;
    max-width: 400px;

    .header {
        padding: 10px 10px 0 10px;

        h1 {
            margin: 0;
            padding: 0;
            font-size: 20px;
            font-family: @mainFont;
            font-weight: lighter;
        }
    }

    .body label {
        display: flex;
        flex-direction: column;
        width: 100%;
        padding: 10px;

        * {
            font-family: @mainFont;
            color: @text;
            font-size: 12px;
            transition: 300ms;

            &:hover {
                transition: 100ms;
            }
        }

        .error {
            color: @error;
            overflow: hidden;
            height: 24px;

            &.hide {
                opacity: 0;
                height: 0;
            }
        }

        .text {
            border: none;
            border-bottom: 1px solid @medium;
            background: transparent;
            padding: 6px 0;

            &:focus {
                border-color: @accent;
            }

            &.has-error {
                border-color: @error;
            }
        }
    }
}
</style>
