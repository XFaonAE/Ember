<template>
    <div class="root">
        <div class="background"></div>

        <div class="window">
            <slot></slot>
        </div>
    </div>
</template>

<style lang="less" scoped>
@import "./Config";

.root {
    position: fixed;
    top: 30px;
    left: 0;
    width: 100vw;
    height: calc(100vh - 30px);
    display: flex;
    align-items: center;
    justify-content: center;
    color: @text;
    font-family: @mainFont;
    font-size: 12px;

    .background {
        background: @level;
        width: 100vw;
        height: 100%;
        opacity: 0.3;
        -webkit-backdrop-filter: blur(5px);
    }

    .window {
        min-width: 300px;
        min-height: 50px;
        max-width: 500px;
        background: @layer1;
        position: absolute;
        border-radius: 3px;
    }
}
</style>