'use client'
import Image from "next/image"
import { useState, useRef, useEffect } from "react";

export function InputMessage() {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleResize = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto'; 
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  useEffect(() => {
    handleResize(); 
  }, [value]); 

  return (
    <div className="flex items-center gap-x-6 p-6">
      <button><Image src="/fileinput.svg" width={24} height={24} alt="" /></button>
      <div className="flex items-center gap-x-[30px] py-[10px] px-5 border border-gray-300 rounded-xl">
        <textarea
          ref={textareaRef}
          value={value}
          onInput={handleResize}
          onChange={(e) => setValue(e.target.value)}
          className="text-sm font-normal outline-0 w-[450px] resize-none break-words"
          placeholder="Type a message"
          style={{ minHeight: "20px", overflow: "hidden" }}
        />
        <Image src="/send.svg" width={20} height={20} alt="" />
      </div>
    </div>
  )
}
