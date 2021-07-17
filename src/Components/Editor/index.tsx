import "prismjs/components/prism-clike";
import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-javascript";
import "prismjs/themes/prism.css"; //Example style, you can use another
import React, { useContext, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import {
  Action as SessionAction,
  Context as SessionContext,
  Selection,
} from "../../context/session";
import { RouterParams } from "../../index";
import SimpleEditor, { styles } from "./editor";
import "./styles.css";

export type editorProps = {
  content: string;
};

const Editor = ({ content }: editorProps) => {
  const { dispatch } = useContext(SessionContext);
  let { chapter, step } = useParams<RouterParams>();

  const inputEl = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    inputEl?.current?.focus();
  }, []);

  const pushValue = (value: string) => {
    dispatch({
      type: SessionAction.SET_EDITOR_CONTENT,
      payload: {
        chapter,
        step,
        value,
      },
    });
  };

  const pushSelection = (value: Selection) => {
    dispatch({
      type: SessionAction.SET_EDITOR_SELECTION,
      payload: {
        value,
      },
    });
  };

  // const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
  //   pushValue(e.target.value);
  // };
  const handleInputChange = (val: string) => {
    pushValue(val);
  };

  const handleSelection = (
    e:
      | React.MouseEvent<HTMLTextAreaElement>
      | React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    const start = e.target.selectionStart || 0;
    const end = e.target.selectionEnd || start;

    pushSelection({ start, end });
  };

  // const handleSelection = (start: number, end: number) => {
  //   console.log("handleSelection", start, end);
  //   pushSelection({ start, end });

  //   // other code within selection handler as per original

  //   // inputEl?.current?.focus();
  //   // // the line below doesn't work!
  //   // // inputEl?.current?.setSelectionRange(start + e.native.length, end + e.native.length)

  //   // //this one does, but is not good practice..
  //   // setTimeout(
  //   //   () =>
  //   //     inputEl?.current?.setSelectionRange(
  //   //       start + e.native.length,
  //   //       end + e.native.length
  //   //     ),
  //   //   10
  //   // );
  //   // setSelection({
  //   //   start: start,
  //   //   end: end,
  //   // });
  // };

  // const handleKeyDown = (e: React.KeyboardEvent) => {
  //   if (e.key == "Tab") {
  //     e.preventDefault();
  //     const el = inputEl?.current;
  //     const start = el?.selectionStart || 0;
  //     const end = el?.selectionEnd || start;

  //     // set textarea value to: text before caret + tab + text after caret
  //     const value =
  //       el?.value.substring(0, start) + "\t" + el?.value.substring(end);

  //     pushValue(value);

  //     // dispatch({
  //     //   type: SessionAction.SET_EDITOR_CONTENT,
  //     //   payload: {
  //     //     value: value,
  //     //   },
  //     // });

  //     // put caret at right position again
  //     setSelection({ start: start + 1, end: end + 1 });
  //   }
  // };

  const setFocus = () => {
    dispatch({
      type: SessionAction.SET_EDITOR_FOCUS,
      payload: {
        value: true,
      },
    });
  };

  const setBlur = () => {
    dispatch({
      type: SessionAction.SET_EDITOR_FOCUS,
      payload: {
        value: false,
      },
    });
  };

  return (
    <div className="editor">
      <SimpleEditor
        className="editor__editor code"
        preClassName="editor__textarea-pre"
        textareaClassName="editor__textarea-textarea"
        onFocus={setFocus}
        onBlur={setBlur}
        onSelect={handleSelection}
        onValueChange={handleInputChange}
        value={content}
        highlight={(code) => highlight(code, languages.js)}
        style={
          {
            // fontFamily: '"Fira code", "Fira Mono", monospace',
            // fontSize: 12,
          }
        }
      />

      <div className="editor__solution">
        <div className="editor__solution-show">Lösung anschauen</div>
        <div className="editor__solution-text editor__editor code">
          <pre
            className="editor__textarea-pre"
            aria-hidden="true"
            style={{ ...styles.editor, ...styles.highlight }}
          >
            <div
              dangerouslySetInnerHTML={{
                __html: highlight(content, languages.js),
              }}
            />
          </pre>
        </div>
      </div>
    </div>
  );
};

export default Editor;
