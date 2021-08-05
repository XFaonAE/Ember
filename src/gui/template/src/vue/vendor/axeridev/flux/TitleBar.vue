<template>
    <div class="root">
        <div class="title">
            <div class="icon">
                <i class="ms-Icon ms-Icon--Game"></i>
            </div>

            <span class="text">Test Application</span>
        </div>

        <div class="buttons">
            <button @click="minimizeWindow">
                <i class="ms-Icon ms-Icon--ChromeMinimize"></i>
            </button>

            <button @click="sizeWindow" v-if="windowMaximized">
                <i class="ms-Icon ms-Icon--ChromeRestore"></i>
            </button>

            <button @click="sizeWindow" v-if="!windowMaximized">
                <i class="ms-Icon ms-Icon--Checkbox"></i>
            </button>

            <button @click="closeWindow" >
                <i class="ms-Icon ms-Icon--ChromeClose"></i>
            </button>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue } from "vue-class-component";
const { ipcRenderer } = window.require("electron");

export default class TitleBar extends Vue {
    public windowMaximized: boolean = false;

    public created() {
        ipcRenderer.on("electron:isMaximized", (event: any, answer: any) => {
            this.windowMaximized = answer;
        });
    }

    public closeWindow() {
        ipcRenderer.send("electron:close");
    }

    public minimizeWindow() {
        ipcRenderer.send("electron:minimize");
    }

    public sizeWindow() {
        ipcRenderer.send("electron:size");
        ipcRenderer.send("electron:isMaximized");
    }
}
</script>

<style lang="less" scoped>
@import "./Config";

.root {
    width: 100%;
    height: 30px;
    -webkit-app-region: drag;
    background: @layer0;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .title {
        color: @text;
        display: flex;
        flex-direction: row;
        align-items: center;
        font-size: 11px;
        font-family: @mainFont;
        padding-left: 15px;

        .icon {
            margin-right: 15px;
        }

        .text {
            margin-right: 15px;
        }
    }

    .buttons button {
        -webkit-app-region: no-drag;
        height: 30px;
        padding: 0 15px;
        border: none;
        color: @text;
        background: transparent;
        transition: 300ms;
        cursor: pointer;

        &:hover {
            background: @layer1;
            transition: 100ms;
        }

        .ms-Icon {
            transform: scale(0.7);
        }
    }
}
</style>