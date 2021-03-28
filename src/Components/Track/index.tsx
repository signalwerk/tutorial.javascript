import React, { useContext, MouseEvent, useState } from "react";
import { Range } from "react-range";
import "./styles.css";

type TrackProps = {
  max: number;
  value: number;
  // max?: number;
  // formatFn?: Function;
  onChange: Function;
};

const Track = ({ max, value, onChange }: TrackProps) => {
  // const [value, setValue] = useState(0);

  return (
    <div className="track">
      <Range
        step={0.1}
        min={0.0}
        max={Math.round(max * 10) / 10}
        values={[value]}
        onChange={(values) => onChange(values[0])}
        renderTrack={({ props, children }) => (
          <div {...props} className="track__range">
            <div
              className="track__played"
              style={{
                width: `${(100 / max) * value}%`,
              }}
            />
            {children}
          </div>
        )}
        renderThumb={({ props }) => <div {...props} className="track__thumb" />}
      />
    </div>
  );
};

export default Track;
