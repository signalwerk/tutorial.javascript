import { useContext, useRef, useState, useEffect } from "react";
import {
  Context as SessionContext,
  Action as SessionAction,
} from "../../context/session";

import "./styles.css";

const Editor = ({ id }) => {
  const { state, dispatch } = useContext(SessionContext);

  const inputEl = useRef(null);

  const [selection, setSelection] = useState();

  useEffect(() => {
    if (!selection) return; // prevent running on start
    const { start, end } = selection;
    inputEl.current.focus();
    inputEl.current.setSelectionRange(start, end);
  }, [selection]);

  useEffect(() => {
    const start = state.current.editor.content.length;
    inputEl.current.focus();
    inputEl.current.setSelectionRange(start, start);
  }, []);

  const handleInputChange = (e) => {
    dispatch({
      type: SessionAction.SET_EDITOR_CONTENT,
      payload: {
        value: e.target.value,
      },
    });
  };

  const handleSelection = (e) => {
    const start = inputEl.current.selectionStart;
    const end = inputEl.current.selectionEnd;

    // other code within selection handler as per original

    // inputEl.current.focus();
    // // the line below doesn't work!
    // // inputEl.current.setSelectionRange(start + e.native.length, end + e.native.length)

    // //this one does, but is not good practice..
    // setTimeout(
    //   () =>
    //     inputEl.current.setSelectionRange(
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

  const handleKeyDown = (e) => {
    if (e.key == "Tab") {
      e.preventDefault();
      const el = inputEl.current;
      const start = el.selectionStart;
      const end = el.selectionEnd;

      // set textarea value to: text before caret + tab + text after caret
      const value =
        el.value.substring(0, start) + "\t" + el.value.substring(end);

      dispatch({
        type: SessionAction.SET_EDITOR_CONTENT,
        payload: {
          value: value,
        },
      });

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
        onSelect={(event) => {
          handleSelection(event);
        }}
      />
    </div>
  );
};

export default Editor;
