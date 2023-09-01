import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import Markdown from "vite-plugin-md";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { vitePluginForArco } from "@arco-plugins/vite-vue";
import Icons from "unplugin-icons/vite";
import IconsResolver from "unplugin-icons/resolver";
import {
  ElementPlusResolver,
  ArcoResolver,
} from "unplugin-vue-components/resolvers";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
      packages: resolve(__dirname, "./packages"),
    },
  },
  server: {
    port: 3000,
  },
  plugins: [
    vue({ include: [/\.vue$/, /\.md$/] }),
    Markdown(),
    AutoImport({
      // Auto import functions from Vue, e.g. ref, reactive, toRef...
      // 自动导入 Vue 相关函数，如：ref, reactive, toRef 等
      imports: ["vue"],
      resolvers: [
        ElementPlusResolver(),
        ArcoResolver({
          importStyle: "less", // 可以不写
          resolveIcons: true,
          // 这里必须设置为 true，否则 yarn build 不会将自动导入的 arco 组件的样式文件打包
          sideEffect: true,
        }),
        // 自动导入图标组件
        IconsResolver({
          prefix: "Icon",
        }),
      ],
    }),
    vitePluginForArco({
      //'填写主题包名，没有就不用配置这个属性',
      theme: "@arco-themes/vue-weixing",
      varsInjectScope: ["*"],
    }),
    Components({
      resolvers: [
        // 自动导入 Element Plus 组件
        ElementPlusResolver(),
        ArcoResolver({
          sideEffect: true,
        }),
        // 自动注册图标组件
        IconsResolver({
          enabledCollections: ["ep"],
        }),
      ],
    }),
    // 让unplugin-icons自动安装图标库, 使用,无需再次引入，在官方图标集合中标识的图标名前追加前缀IEp即可使用 ,例如: <Edit /> ==> <IEpEdit />
    Icons({
      autoInstall: true,
    }),
  ],
});
