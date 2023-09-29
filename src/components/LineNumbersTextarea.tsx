// LineNumberedTextarea.tsx
import React, { useEffect, useRef } from "react";

interface LineNumberedTextareaProps {
  value: string;
  onChange: (newValue: string) => void;
  lines: string[];
  setLines: (newValue: string[]) => void;
}

const LineNumberedTextarea: React.FC<LineNumberedTextareaProps> = ({
  value,
  onChange,
  lines,
  setLines,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    setLines(value.split("\n"));
  }, [value]);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = event.target.value;
    onChange(newValue);
    setLines(newValue.split("\n"));
  };

  return (
    <div className="line-numbered-textarea">
      <div className="line-numbers">
        {lines.map((_, index) => (
          <div key={index + 1} className="line-number">
            {index + 1}
          </div>
        ))}
      </div>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleChange}
        className="text-area"
      />
    </div>
  );
};

export default LineNumberedTextarea;
