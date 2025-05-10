'use client';

import { EllipsisVertical } from 'lucide-react';
import Image from 'next/image';
export function ChatInfo() {
    const files = [
        {
            name: 'i9.pdf',
            type: 'PDF',
            size: '9mb',
            icon: '/chatinfo/pdf.svg',
            color: '#fff5f5'
        },
        {
            name: 'Screenshot-3817.png',
            type: 'PNG',
            size: '4mb',
            icon: '/chatinfo/png.svg',
            color: '#f0fff4'
        },
        {
            name: 'sharefile.docx',
            type: 'DOC',
            size: '555kb',
            icon: '/chatinfo/docx.svg',
            color: '#ebf8ff'
        },
        {
            name: 'Jerry-2020_I-9_Form.xxl',
            type: 'XXL',
            size: '24mb',
            icon: '/chatinfo/xxl.svg',
            color: '#faf5ff'
        }
    ]
    return (
        <div className='w-full'>
            <div className='flex items-center justify-between p-5 border-b  border-[#00000014]'>
                <h2 className='text-xl'>Directory</h2>
                <button className='p-2  rounded-full bg-[#EFEFFD]'> <EllipsisVertical className='text-[#615EF0]' /></button>
            </div>
            <div className='my-6 px-4'>
                <h4 className='text-sm flex items-center gap-x-2'>Files<span className="py-[2px] px-2 text-xs bg-gray-200 rounded-3xl">125</span></h4>
                <ul className='flex flex-col  gap-y-2'>
                    {files.map((file, index) => (
                        <li className='flex items-center p-3' key={index}>
                            <div className='flex items-center gap-x-4'>

                                <Image className="p-3 rounded-xl" style={{ backgroundColor: file.color }} src={file.icon} width={24} height={24} alt="" />

                                <div>
                                    <h6 className='text-sm'>{file.name}</h6>
                                    <div className="flex items-center gap-x-[10px]"> <p className='text-xs text-[#00000066]'>{file.type}</p>
                                        <p className='text-xs text-[#00000066]'>{file.size}</p></div>

                                </div>
                            </div>
                            <button className='ml-auto'>
                                <Image src="/download.svg" width={24} height={24} alt="" />
                            </button>
                        </li>
                    ))}


                </ul>
            </div>
        </div>
    )
}