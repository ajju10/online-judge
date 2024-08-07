"use client";

import { Editor } from "@monaco-editor/react";
import * as monaco from "monaco-editor";
import { useRef, useState } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { RunRequestPayload, SubmitRequestPayload } from "@/lib/definitions";
import { runCode, submitCode } from "@/lib/action";

type EditorType = monaco.editor.IStandaloneCodeEditor;
type MonacoType = typeof import("monaco-editor");

export default function CodeEditor({ isLoggedIn, code }: { isLoggedIn: boolean; code: string }) {
  const editorRef = useRef<EditorType | null>(null);
  const [value, setValue] = useState("");
  const [language, _setLanguage] = useState("cpp");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [verdict, setVerdict] = useState("");

  const handleEditorDidMount = (editor: EditorType, _: MonacoType) => {
    editorRef.current = editor;
  };

  async function handleRun() {
    setOutput("");
    const payload: RunRequestPayload = {
      lang: language,
      source_code: value,
      stdin: input,
    };
    const response = await runCode(payload, code);
    if (response.success) {
      if (response.data.status === "Executed") {
        setOutput(response.data.stdout);
      } else if (response.data.status === "CompilerError") {
        alert(response.data.compiler_err);
      } else {
        alert(response.data.stderr);
      }
    } else {
      alert(response.message);
    }
  }

  async function handleSubmit() {
    setOutput("");
    const payload: SubmitRequestPayload = { lang: language, source_code: value };
    const response = await submitCode(payload, code);
    if (response.success) {
      alert(response.data.verdict);
      setOutput(response.data.verdict);
      setVerdict(response.data.verdict);
    } else {
      alert(response.message);
    }
  }

  return (
    <div className="grid grid-rows-[3fr_1fr] gap-4 h-screen">
      <div className="bg-muted rounded-md p-4">
        <div className="h-full">
          <Editor
            onMount={handleEditorDidMount}
            height="100%"
            theme="vs-light"
            defaultLanguage="cpp"
            language={language}
            defaultValue="// Enter your C++ code here"
            value={value}
            onChange={(newValue, _) => setValue(newValue!)}
            options={{
              tabSize: 4,
              padding: { top: 20 },
            }}
          />
        </div>
      </div>
      <div className="bg-muted rounded-md p-4">
        <div className="grid gap-2">
          <div>
            <Label htmlFor="custom-input">Custom Input</Label>
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              id="custom-input"
              rows={2}
            />
          </div>
          <div>
            <Label htmlFor="test-output">Test Output</Label>
            <Textarea value={output} id="test-output" rows={2} readOnly />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={handleRun} disabled={!isLoggedIn}>
              Run
            </Button>
            <Button onClick={handleSubmit} disabled={!isLoggedIn}>
              Submit
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
