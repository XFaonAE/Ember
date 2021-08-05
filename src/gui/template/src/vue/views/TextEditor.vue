<template>
    <div class="root">
        <textarea placeholder="Type Here..."></textarea>
    </div>
</template>

<style lang="less" scoped>
    @import "../vendor/axeridev/flux/Config";

    .root {
        textarea {
            color: @text;
            width: 100vw;
            height: calc(100vh - 30px - 40px);
            display: flex;
            background: transparent;
            border: none;
            outline: none;
            resize: none;
            font-family: @mainFont;
            font-size: 13px;
        }
    }
</style>