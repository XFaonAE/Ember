<template>
    <div class="root">
        <RouterLink to="/">Home</RouterLink>

        <RouterLink to="/tests">Tests</RouterLink>

        <RouterLink to="/github">GitHub</RouterLink>
    </div>
</template>

<style lang="less" scoped>
@import "./Config";

.root {
    width: 100%;
    height: 40px;
    background: @layer0;
    display: flex;
    align-items: center;

    a {
        padding: 0 10px;
        height: 20px;
        transition: 300ms;
        border-radius: 3px;
        margin-left: 5px;
        display: flex;
        align-items: center;
        text-decoration: none;
        color: @text;
        font-family: @mainFont;
        font-size: 11px;
        position: relative;

        &:after {
            position: absolute;
            display: flex;
            content: "";
            width: calc(100% - 20px);
            height: 2px;
            transition: 300ms;
            border-radius: 10px;
            bottom: 0;
        }

        &:hover {
            transition: 100ms;
        }

        &.router-link-active {
            &:after {
                transition: 100ms;
                background: @accent;
            }
        }
    }
}
</style>