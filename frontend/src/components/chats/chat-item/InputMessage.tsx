'use client'
import Image from "next/image"
import { useRef, useEffect, useState } from "react";
import { SmilePlus } from 'lucide-react';
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'


interface InputMessageProps {
  newMessageAction: string;
  setNewMessageAction: (message: string) => void;
  onSendMessageAction: () => void;
  replyedMessageAction: { id: string; text: string } | null;
  setReplyedMessageAction: (message: { id: string; text: string }| null) => void;
 
};
export function InputMessage({ newMessageAction, setNewMessageAction, onSendMessageAction, replyedMessageAction, setReplyedMessageAction }: InputMessageProps) {

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const inputFileRef = useRef<HTMLInputElement>(null);
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
  const handleInputFile = () => {
    if (inputFileRef.current) {
      inputFileRef.current.click();
    }
  }
  const handleCancelReply = () => {
    setReplyedMessageAction(null)
  }
  return (
    <div className="flex items-end gap-x-6 p-6">
      <div className="flex items-center gap-x-4 mb-5">
        <button onClick={handleInputFile}><Image className="w-[24px] h-[24px]" src="/fileinput.svg" width={24} height={24} alt="" /><input ref={inputFileRef} className="hidden" type="file" /></button>
        <button onClick={handleSmilePicker}><SmilePlus className="w-[24px] h-[24px]" /></button>
      </div>

      {showEmojiPicker && (
        <div className="absolute z-50 top-30 left-80">
          <Picker data={data} onEmojiSelect={(e: { native: string; }) => setNewMessageAction(newMessageAction + e.native)} theme="light" />
        </div>
      )}

      <div className="flex flex-col">
        {replyedMessageAction && (
          <div className="bg-gray-100 p-2 rounded-lg mb-2 w-114 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600">Replying to:</p>
              <p className="text-sm text-gray-800">{replyedMessageAction.text}</p>
            </div>
            <button onClick={handleCancelReply} className="text-xs text-blue-500 hover:text-blue-700">
              Cancel
            </button>
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

    </div>
  )
}
