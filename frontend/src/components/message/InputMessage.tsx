'use client'
import Image from "next/image"
import {  useRef, useEffect } from "react";
interface InputMessageProps {
  newMessageAction: string;
  setNewMessageAction: (message: string) => void;
  onSendMessageAction: () => void;
};
export function InputMessage({newMessageAction,setNewMessageAction,onSendMessageAction}:InputMessageProps) {

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
  }, [newMessageAction]);

  return (
    <div className="flex items-center gap-x-6 p-6">
      <button><Image src="/fileinput.svg" width={24} height={24} alt="" /></button>
      <div className="flex items-center gap-x-[30px] py-[10px] px-5 border border-gray-300 rounded-xl">
        <textarea
          ref={textareaRef}
          value={newMessageAction}
          onInput={handleResize}
          onChange={(e) => setNewMessageAction(e.target.value)}
          className="text-sm font-normal outline-0 w-[450px] resize-none break-words"
          placeholder="Type a message"
          style={{ minHeight: "20px", overflow: "hidden" }}
        />
        <button onClick={onSendMessageAction}>
          <Image src="/send.svg" width={20} height={20} alt="" />
        </button>
      </div>
    </div>
  )
}
