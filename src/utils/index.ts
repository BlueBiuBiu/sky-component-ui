import Clipboard from "clipboard";
import { Message } from "@arco-design/web-vue";

// 复制文本
export function copy(event: Event, text: string) {
  const currentTarget = event.target;
  console.log("currentTarget", currentTarget);

  const clipboard: any = new Clipboard(event.target as HTMLElement, {
    text: () => text,
  });

  clipboard.on("success", () => {
    Message.success("复制成功");
    clipboard.destroy();
  });

  clipboard.on("error", () => {
    Message.success("复制失败");
    clipboard.destroy();
  });

  clipboard.onClick({ currentTarget });
}
