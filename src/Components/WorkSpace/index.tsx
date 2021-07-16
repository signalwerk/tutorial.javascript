import "./styles.css";
import Preview from "../Preview";

type WorkSpaceProps = {
  preview: string;
  check?: string;
  // filename: string;
  children: React.ReactNode;
  hideErrors?: boolean;
  focus?: boolean;
  solved: Function;
};

function WorkSpace({
  children,
  preview,
  check,
  hideErrors,
  focus,
  solved,
}: WorkSpaceProps) {
  return (
    <div className={`work-space work-space--${focus ? "focus" : "blur"}`}>
      <div className="work-space__file">{children}</div>
      <div className="work-space__canvas">
        <Preview
          code={preview}
          check={check}
          hideErrors={hideErrors}
          themeNetative={true}
          solved={solved}
        />
      </div>
    </div>
  );
}

export default WorkSpace;
