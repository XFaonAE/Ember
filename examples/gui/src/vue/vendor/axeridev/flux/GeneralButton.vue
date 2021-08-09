<template>
    <button class="root">
        <slot></slot>
    </button>
</template>

<style lang="less" scoped>
@import "./Config";

.root {
    border: none;
    background: @layer3;
    color: @text;
    border-radius: 3px;
    padding: 8px 10px;
    cursor: pointer;
    font-size: 12px;
    min-width: 100px;
    transition: 300ms;
    font-family: @mainFont;

    &:hover {
        transition: 100ms;
        background: @layer2;
    }

    &.mode-primary {
        background: @accent;
        color: @layer0;
    }

    &.size-fill {
        width: 100%;
    }
}
</style>