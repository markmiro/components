import React, { Component } from "react";
import AceEditor from "react-ace";
import brace from "brace";
import "brace/mode/javascript";
import "brace/theme/github";

function onChange(newValue) {
  console.log("change", newValue);
}

class CodeEditor extends Component {
  render() {
    return (
      <div style={{ borderBottom: "1px solid black" }}>
        <AceEditor
          mode="javascript"
          theme="github"
          onChange={onChange}
          name="UNIQUE_ID_OF_DIV"
          editorProps={{ $blockScrolling: true }}
        />
      </div>
    );
  }
}

export default CodeEditor;
