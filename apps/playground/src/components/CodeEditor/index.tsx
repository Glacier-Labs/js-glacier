import CodeMirror from '@uiw/react-codemirror'
import { json } from '@codemirror/lang-json'
import { vscodeDark } from '@uiw/codemirror-theme-vscode'

interface Props {
  height?: string
  editable?: boolean
  value?: string
  onChange?: (value: string) => void
}

export default function CodeEditor(props: Props) {
  return (
    <CodeMirror
      editable={props.editable}
      height={props.height}
      theme={vscodeDark}
      extensions={[json()]}
      value={props.value}
      onChange={props.onChange}
    />
  )
}
