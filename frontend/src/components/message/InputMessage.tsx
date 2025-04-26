'use client'
import Image from "next/image"
import { useRef, useEffect,useState } from "react";
import { SmilePlus } from 'lucide-react';
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'

interface InputMessageProps {
  newMessageAction: string;
  setNewMessageAction: (message: string) => void;
  onSendMessageAction: () => void;
};
export function InputMessage({ newMessageAction, setNewMessageAction, onSendMessageAction }: InputMessageProps) {

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

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

  const handleSmilePicker = () => {
    setShowEmojiPicker(!showEmojiPicker);
  }
  return (
    <div className="flex items-center gap-x-6 p-6">
      <div className="flex items-center gap-x-4">
        <button><Image className="w-[24px] h-[24px]" src="/fileinput.svg" width={24} height={24} alt="" /></button>
        <button onClick={handleSmilePicker}><SmilePlus className="w-[24px] h-[24px]" /></button>
      </div>

      {showEmojiPicker && (
        <div className="absolute z-50 top-30 left-80">
          <Picker data={data} onEmojiSelect={(e: { native: string; }) => setNewMessageAction(newMessageAction + e.native)}  theme="light"/>
        </div>
      )}
      <div className="flex items-center gap-x-[30px] py-[10px] px-5 border border-gray-300 rounded-xl">
        <textarea
          ref={textareaRef}
          value={newMessageAction}
          onInput={handleResize}
          onChange={(e) => setNewMessageAction(e.target.value)}
          className="text-sm font-normal outline-0 w-[380px] resize-none break-words"
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
