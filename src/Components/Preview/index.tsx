import React, { useState, useEffect } from "react";
import "./stopExecutionOntimeout";
import { addInfiniteLoopProtection } from "./addInfiniteLoopProtection";
import "./styles.css";

type PreviewProps = {
  code: string;
  check?: string;
  match?: string;
  hideErrors?: boolean;
  themeNetative?: boolean;
  solved?: Function;
};

type Box = {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
};

type Text = string;

let boxList: Box[] = [];
let textList: Text[] = [];
let renderError = "";

function Preview({
  code,
  check,
  match,
  hideErrors,
  themeNetative,
  solved,
}: PreviewProps) {
  const [boxes, setBoxes] = useState<Box[]>([]);
  const [texts, setTexts] = useState<Text[]>([]);
  const [error, setError] = useState("");

  function Box(x = 0, y = 0, width = 100, height = 100) {
    boxList = [
      ...boxList,
      {
        x: x,
        y: y,
        width,
        height,
      },
    ];
  }

  function print(text = "") {
    textList = [...textList, text];
  }

  const conzole = {
    log: (text = "") => {
      textList = [...textList, text];
    },
  };

  function hasBox(x?: number, y?: number, width?: number, height?: number) {
    console.log("hasBox", boxList);
    return boxList.filter((item) => {
      let found = true;

      if (x) {
        found = item.x === x && found;
      }
      if (y) {
        found = item.y === y && found;
      }
      if (width) {
        found = item.width === width && found;
      }
      if (height) {
        found = item.height === height && found;
      }

      return found;
    }).length;
  }

  function getBoxList() {
    console.log("getBoxList", boxList);
    return boxList;
  }
  function hasText(filter: any) {
    console.log("hasText", textList);

    if (typeof filter === "function") {
      return textList.filter(filter).length;
    } else {
      return textList.filter((item) => item === filter).length;
    }
  }

  function codeTester(code: string) {
    return (regex: RegExp) => {
      console.log("codeTester", regex.test(code), code, regex);
      return regex.test(code);
    };
  }

  function getTextList() {
    console.log("getTextList", textList);
    return textList;
  }

  function complete(status: boolean) {
    if (solved) {
      solved(status);
    }
  }

  const render = (code: string, check: string | undefined) => {
    if (!code) {
      solved && solved(false);
      return;
    }
    function runCodeWithDateFunction(sanitizedCode: string) {
      // return Function('"use strict";return (' + code + ")")()(Box);

      let execCode = `
return (
  function(Box, print, hasBox, getBoxList, hasText, getTextList, complete, console, codeTester){ 

    ${sanitizedCode}

    ${
      check
        ? `try { ( ${check} ) ? complete(true) : complete(false) } catch(e) { complete(false) }`
        : ""
    }
  }
)`;

      console.log({ execCode });
      try {
        // eslint-disable-next-line
        Function(execCode)()(
          Box,
          print,
          hasBox,
          getBoxList,
          hasText,
          getTextList,
          complete,
          conzole,
          codeTester(code)
        );
      } catch (e) {
        complete(false);
        renderError = e.name + ": " + e.message;
        // console.warn(renderError);
      }
    }

    let sanitizedCode = "";
    try {
      sanitizedCode = addInfiniteLoopProtection(code, { count: 500 });
    } catch (e) {
      var line = 1;
      console.log("-- error", e);
      renderError = e.name + ": " + e.message;

      try {
        line = e.lineNumber;
      } catch (err) {
        // go on with line number 1
      }

      console.log({
        code,
        error: e.description,
        line: line,
      });
    }

    // console.log({ execCode });

    // runCodeWithDateFunction(`\n${execCode}\n${check ? check : ""}\n`);

    // console.log({ end: "now" });

    // runCodeWithDateFunction(
    //   `function(Box, print, hasBox, getBoxList, hasText, getTextList, complete, console){ \n${execCode}\n${
    //     check ? check : ""
    //   }\n }`
    // );
    runCodeWithDateFunction(sanitizedCode);
  };

  useEffect(() => {
    boxList = [];
    textList = [];
    renderError = "";
    render(code, check);
    setBoxes(boxList);
    setTexts(textList);
    setError(renderError);
  }, [code, check]);

  return (
    <div className={themeNetative ? "preview preview--negative" : "preview"}>
      <div className="preview__view">
        <svg
          width="215"
          height="302"
          viewBox="-2.5 -2.5 215 302"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect className="svg__rect svg__paper" width="210" height="297" />

          <text className="svg__text code" textAnchor="end" x="205" y="18">
            A4
          </text>

          {boxes.map((item, index) => (
            <rect
              key={index}
              className="svg__rect"
              x={item.x}
              y={item.y}
              width={item.width}
              height={item.height}
            />
          ))}
        </svg>
        {/* 
        <pre>
          <code>{JSON.stringify(boxes, null, 2)}</code>
        </pre>
         */}
      </div>
      {texts.length > 0 && (
        <div className="preview__console code">
          <pre>
            {texts.map((text, index) => (
              <code key={index}>
                {JSON.stringify(text)}
                {"\n"}
              </code>
            ))}
          </pre>
        </div>
      )}
      {error && !hideErrors && (
        <div className="preview__error">
          <p>⚠️ Der Code hat im Moment noch Fehler.</p>
          <div className="preview__debug">
            <code>{error}</code>
          </div>
        </div>
      )}
    </div>
  );
}

export default Preview;
