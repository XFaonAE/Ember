<template>
    <label class="root">
        <input type="checkbox" />

        <div class="switch">
            <div class="inner"></div>
        </div>
    </label>
</template>

<style lang="less" scoped>
@import "./Config";

.root {
    .switch {
        display: flex;
        align-items: center;
        border-radius: 25px;
        width: 35px;
        height: 16px;
        background: transparent;
        border: 1px solid @text;
        cursor: pointer;
        transition: 300ms;

        .inner {
            border-radius: 100%;
            width: 10px;
            height: 10px;
            margin: 5px 2px;
            background: @text;
            transition: 300ms;
        }
    }

    input {
        opacity: 0;
        width: 0;
        height: 0;
        overflow: hidden;
        position: absolute;
    }

    input:checked ~ .switch {
        background: @accent;
        border-color: @accent;
        transition: 100ms;
        
        .inner {
            background: @layer0;
            transition: 100ms;
            margin-left: calc(100% - 13px);
        }
    }
}
</style>