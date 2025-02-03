'use client';

import { useEffect, useRef, useState } from 'react';

interface PinInputProps {
  length?: number;
  onChange: (pin: string) => void;
}

export default function PinInput({ length = 4, onChange }: PinInputProps) {
  const [values, setValues] = useState<string[]>(Array(length).fill(''));
  const [activeInput, setActiveInput] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    onChange(values.join(''));
  }, [values, onChange]);

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      if (values[index]) {
        const newValues = [...values];
        newValues[index] = '';
        setValues(newValues);
      } else if (index > 0) {
        const newValues = [...values];
        newValues[index - 1] = '';
        setValues(newValues);
        setActiveInput(index - 1);
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handleChange = (index: number, value: string) => {
    const newValue = value.replace(/[^0-9]/g, '');
    if (!newValue) return;

    const newValues = [...values];
    newValues[index] = newValue[0];
    setValues(newValues);

    if (index < length - 1) {
      setActiveInput(index + 1);
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/[^0-9]/g, '');
    const newValues = [...values];
    
    for (let i = 0; i < Math.min(length, pastedData.length); i++) {
      newValues[i] = pastedData[i];
    }
    
    setValues(newValues);
    setActiveInput(Math.min(length - 1, pastedData.length - 1));
  };

  const handleFocus = (index: number) => {
    setActiveInput(index);
    inputRefs.current[index]?.focus();
  };

  return (
    <div className="flex gap-2 justify-center">
      {values.map((value, index) => (
        <div key={index} className="relative w-14 h-16">
          <input
            ref={el => inputRefs.current[index] = el}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={value}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onFocus={() => handleFocus(index)}
            className={`
              w-full h-full text-center text-2xl font-bold
              input input-bordered focus:input-primary
              ${index === activeInput ? 'input-primary' : ''}
            `}
            aria-label={`PIN digit ${index + 1}`}
            autoComplete="one-time-code"
          />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {value && '•'}
          </div>
        </div>
      ))}
    </div>
  );
} 