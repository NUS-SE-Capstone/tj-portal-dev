<template>
  <div
    id="code-editor"
    ref="codeEditorRef"
    style="min-width: 300px;min-height: 400px;"
  />
  <!--  <a-button @click="fillValue">填充值</a-button>-->
</template>

<script setup>
import * as monaco from "monaco-editor";
import { onMounted, ref, toRaw, withDefaults, defineProps, watch } from "vue";

const DEFAULT_CODE = `public class Main {
    public static void main(String[] args) {
        
    }
}`

// /**
//  * 定义组件属性类型
//  */
// interface Props {
//   value: string;
//   language?: string;
//   handleChange?: (v: string) => void;
//   readonly?: boolean
// }

// /**
//  * 给组件指定初始值
//  */
// const props = withDefaults(defineProps<Props>(), {
//   value: () => "",
//   language: () => "java",
//   handleChange: (v: string) => {
//     console.log(v);
//   },
//   readonly: () => false
// });

const props = withDefaults(defineProps(), {
  value: () => "",
  language: () => "java",
  handleChange: (v) => {
    console.log(v);
  },
  readonly: () => false
});

const codeEditorRef = ref();
const codeEditor = ref();

// const fillValue = () => {
//   if (!codeEditor.value) {
//     return;
//   }
//   // 改变值
//   toRaw(codeEditor.value).setValue("新的值");
// };

// watch(
//   () => props.language,
//   () => {
//     codeEditor.value = monaco.editor.create(codeEditorRef.value, {
//       value: props.value,
//       language: props.language,
//       automaticLayout: true,
//       colorDecorators: true,
//       minimap: {
//         enabled: true,
//       },
//       readOnly: false,
//       theme: "vs-dark",
//       // lineNumbers: "off",
//       // roundedSelection: false,
//       // scrollBeyondLastLine: false,
//     });
//   }
// );

onMounted(() => {
  if (!codeEditorRef.value) {
    return;
  }
  // Hover on each property to see its docs!
  codeEditor.value = monaco.editor.create(codeEditorRef.value, {
    value: props.value === '' ? DEFAULT_CODE : props.value,
    language: props.language,
    automaticLayout: true,
    colorDecorators: true,
    minimap: {
      enabled: true,
    },
    readOnly: props.readonly,
    theme: "vs-dark",
    // lineNumbers: "off",
    // roundedSelection: false,
    // scrollBeyondLastLine: false,
  });

  // 格式化
  codeEditor.value.getAction('editor.action.formatDocument').run();

  // 编辑 监听内容变化
  codeEditor.value.onDidChangeModelContent(() => {
    props.handleChange(toRaw(codeEditor.value).getValue());
  });
});
</script>

<style scoped></style>