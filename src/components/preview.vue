<template>
  <pre class="language-html">
    <code class="language-html">{{ sourceCode }}</code>
  </pre>
</template>

<script lang="ts" setup>
import Prism from "prismjs";
import "../assets/css/prism.css"; // 主题 CSS
import { onMounted, ref, nextTick } from "vue";

const props = defineProps({
  /** 组件名称 */
  compName: {
    type: String,
    default: "",
    require: true,
  },
  /** 要显示代码的组件 */
  demoName: {
    type: String,
    default: "",
    require: true,
  },
});

const sourceCode = ref("");

const init = async () => {
  const module = await import(
    /* @vite-ignore */ `../../packages/components/${props.compName}/src/index.vue?raw`
  );
  sourceCode.value = module.default;
  nextTick(() => {
    Prism.highlightAll();
  });
};

onMounted(() => {
  init();
});
</script>
