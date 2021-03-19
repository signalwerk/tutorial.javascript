import React, { useContext, useRef, useState, useEffect } from "react";
import {
  Context as SessionContext,
  Action as SessionAction,
  Selection,
} from "../../context/session";

import "./styles.css";

const Editor = () => {
  const { state, dispatch } = useContext(SessionContext);

  const inputEl = useRef<HTMLTextAreaElement>(null);

  const [selection, setSelection] = useState<Selection>();

  useEffect(() => {
    if (!selection) return; // prevent running on start
    const { start, end } = selection;
    inputEl?.current?.focus();
    inputEl?.current?.setSelectionRange(start, end);
  }, [selection]);

  useEffect(() => {
    const start = state.current.editor.content.length;
    inputEl?.current?.focus();
    inputEl?.current?.setSelectionRange(start, start);
  }, []);

  const pushValue = (value: string) => {
    dispatch({
      type: SessionAction.SET_EDITOR_CONTENT,
      payload: {
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

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    console.log("handle change");
    pushValue(e.target.value);

    // dispatch({
    //   type: SessionAction.SET_EDITOR_CONTENT,
    //   payload: {
    //     value: e.target.value,
    //   },
    // });
  };

  const handleSelection = (
    e:
      | React.MouseEvent<HTMLTextAreaElement>
      | React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    const start = inputEl?.current?.selectionStart || 0;
    const end = inputEl?.current?.selectionEnd || start;

    pushSelection({ start, end });

    // other code within selection handler as per original

    // inputEl?.current?.focus();
    // // the line below doesn't work!
    // // inputEl?.current?.setSelectionRange(start + e.native.length, end + e.native.length)

    // //this one does, but is not good practice..
    // setTimeout(
    //   () =>
    //     inputEl?.current?.setSelectionRange(
    //       start + e.native.length,
    //       end + e.native.length
    //     ),
    //   10
    // );
    setSelection({
      start: start,
      end: end,
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key == "Tab") {
      e.preventDefault();
      const el = inputEl?.current;
      const start = el?.selectionStart || 0;
      const end = el?.selectionEnd || start;

      // set textarea value to: text before caret + tab + text after caret
      const value =
        el?.value.substring(0, start) + "\t" + el?.value.substring(end);

      pushValue(value);

      // dispatch({
      //   type: SessionAction.SET_EDITOR_CONTENT,
      //   payload: {
      //     value: value,
      //   },
      // });

      // put caret at right position again
      setSelection({ start: start + 1, end: end + 1 });
    }
  };

  return (
    <div className="editor">
      <textarea
        className="editor__textarea"
        ref={inputEl}
        name="text"
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        value={state.current.editor.content}
        onSelect={handleSelection}
        spellCheck="false"
        autoCorrect="off"
        autoCapitalize="off"
      />
    </div>
  );
};

export default Editor;
