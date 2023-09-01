<template>
  <a-layout class="layout">
    <a-layout-header class="header"> </a-layout-header>
    <a-layout>
      <a-layout-sider
        class="asider"
        hide-trigger
        collapsible
        :resize-directions="['right']"
      >
        <a-menu>
          <a-menu-item
            v-for="(link, index) in data.links"
            :key="index + ''"
            @click="linkClick(link)"
          >
            {{ link.name }}
          </a-menu-item>
        </a-menu>
      </a-layout-sider>
      <a-layout class="content">
        <a-layout-content>
          <router-view />
          <div class="operate">
            <a-tooltip :content="isShowSource ? '收起代码' : '展开代码'">
              <a-button class="icon" shape="circle" @click="viewSource">
                <icon-code />
              </a-button>
            </a-tooltip>
            <a-tooltip content="复制代码">
              <a-button
                class="icon"
                shape="circle"
                @click.self.prevent="copySource"
              >
                <icon-copy />
              </a-button>
            </a-tooltip>
          </div>
          <Preview
            class="preview"
            v-bind="currentPreview.data"
            v-if="isShowSource"
          />
        </a-layout-content>
      </a-layout>
    </a-layout>
  </a-layout>
</template>

<script lang="ts" setup>
import { ref, reactive } from "vue";
import Preview from "./components/preview.vue";
import ComponentList from "/packages/list.json";
import { copy } from "./utils/index";
import router from "./router/index";

const isShowSource = ref(false);
const data = reactive({
  links: ComponentList.map((item: any) => ({
    path: `/components/${item.compName}`,
    name: item.compZhName,
    compName: item.compName,
  })),
});

// 当前组件
const currentPreview = reactive({
  data: {
    compName: "waterMask",
    demoName: "demo",
  },
});

// 侧边栏链接点击
const linkClick = (link: any) => {
  router.push(link.path);
  isShowSource.value = false;
  currentPreview.data = {
    compName: link.compName,
    demoName: "demo",
  };
};

const viewSource = async () => {
  isShowSource.value = !isShowSource.value;
};

const copySource = async (e: Event) => {
  const module = await import(
    /* @vite-ignore */ `/packages/components/${currentPreview.data.compName}/src/index.vue?raw`
  );

  copy(e, module.default);
};
</script>

<style lang="less" scoped>
.layout {
  height: 100vh;
  box-sizing: border-box;
  background: var(--color-fill-2);
  border: 1px solid var(--color-border);
  background-color: #f5f5f5;
  .asider {
    box-sizing: border-box;
    height: 100%;
    overflow-y: auto;
  }
  .header {
    display: flex;
    align-items: center;
    height: 56px;
    background-color: #fff;
    margin-bottom: 2px;
  }
  .content {
    display: flex;
    background-color: #fff;
    margin: 10px;
    padding: 20px;
    .operate {
      display: flex;
      justify-content: flex-end;
      cursor: pointer;
      margin-top: 10px;
      .icon {
        margin-left: 8px;
      }
    }
  }
}
</style>
