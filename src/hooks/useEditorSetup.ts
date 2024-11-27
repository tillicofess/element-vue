import {useEditor} from "@tiptap/vue-3";
import {StarterKit} from "@tiptap/starter-kit";
import {Image as TiptapImage} from "@tiptap/extension-image";
import CodeBlock from "@tiptap/extension-code-block";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import {all, createLowlight} from "lowlight";
import css from "highlight.js/lib/languages/css";
import js from "highlight.js/lib/languages/javascript";
import ts from "highlight.js/lib/languages/typescript";
import html from "highlight.js/lib/languages/xml";
import powershell from "highlight.js/lib/languages/powershell";


const lowlight = createLowlight(all);

lowlight.register("html", html);
lowlight.register("css", css);
lowlight.register("js", js);
lowlight.register("ts", ts);
lowlight.register("shell", powershell);

/**
 * 编辑器初始化
 * @param content 初始内容
 * @param editable 是否可编辑
 */
export function useEditorSetup(content: string = '', editable: boolean = false) {
    return useEditor({
        content: content, // 初始内容
        editable: editable, // 设置为只读模式
        extensions: [
            StarterKit,
            TiptapImage,
            CodeBlock,
            CodeBlockLowlight.configure({
                lowlight,
                HTMLAttributes: {
                    class: "my-custom-class",
                },
                languageClassPrefix: "language-",
                defaultLanguage: "javascript",
            }),
        ],
    });
}
