<template>
    <div class="_root">
        <TitleBar />
        <NavigationRow />

        <RouterView />
        <GeneralButton @click="toggleError">Open Modal Window</GeneralButton>

        <ModalWindow>
            <DescribeContainer title="Test Form Modal" description="Microsoft Corporation is an American multinational technology corporation which produces computer software, consumer electronics, personal computers, and related services">
                <FormCard title="Text Form" :inputs="[
                    {
                        label: 'User Name',
                        type: 'text',
                        placeholder: 'Mr. Hacker',
                        error: errorMsg,
                        autoFocus: true
                    },
                    {
                        label: 'Password',
                        type: 'text',
                        placeholder: 'Your Account Password',
                        error: errorMsg
                    }
                ]"></FormCard>
            </DescribeContainer>

            <GeneralButton @click="toggleError">Toggle Errors</GeneralButton>
            <GeneralButton @click="zoomOut">-</GeneralButton>
            <GeneralButton @click="zoomIn">+</GeneralButton>
        </ModalWindow>
    </div>
</template>

<script lang="ts">
    import { Options, Vue } from "vue-class-component";

    @Options({
    })
    export default class Main extends Vue {
        public errorMsg = "";

        public created() {
            document.body.classList.add("_scheme_dark");
            this.$electron.webFrame.setZoomFactor(1);
        }

        public toggleError() {
            if (this.errorMsg) {
                this.errorMsg = "";
                return;
            }

            this.errorMsg = "This is an error message from a variable";
        }

        public zoomIn() {
            this.$electron.webFrame.setZoomFactor(this.$electron.webFrame.getZoomFactor() + 0.1);
        }

        public zoomOut() {
            this.$electron.webFrame.setZoomFactor(this.$electron.webFrame.getZoomFactor() - 0.1);
        }
    }
</script>

<style lang="less">
    @import "./vendor/axeridev/flux/Config";
</style>