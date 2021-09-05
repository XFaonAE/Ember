<template>
    <div class="root">
        <theme-controller ref="e"></theme-controller>
        <title-bar title="Bisma Gamer" />

        <app>
            <template v-slot:sidebar>
                <side-rail>
                    <template v-slot:top>
                        <side-rail-button icon="home"></side-rail-button>

                        <side-rail-button href="/about" icon="info"></side-rail-button>
                    </template>
                </side-rail>

                <side-bar>
                    <side-bar-link>
                        <template v-slot:icon>
                            <icon icon="home"></icon>
                        </template>

                        Home
                    </side-bar-link>

                    <side-bar-link href="/about">
                        <template v-slot:icon>
                            <icon icon="info"></icon>
                        </template>

                        About
                    </side-bar-link>
                </side-bar>
            </template>

            <template v-slot:default>
                <router-view></router-view>
            </template>
        </app>
    </div>
</template>

<script lang="ts">
import { Vue } from "vue-class-component";

export default class Main extends Vue {
    public mounted() {
        this.$refs.e.loadTheme("Dark");
    }
}
</script>