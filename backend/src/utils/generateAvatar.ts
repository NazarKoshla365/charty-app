import { createAvatar } from "@dicebear/core"
import { initials } from '@dicebear/collection';
import { toJpeg } from '@dicebear/converter';

export const generateAvatar = async (username: string) => {
    const avatar = createAvatar(initials,{seed:username}).toString()
    const jpeg = toJpeg(avatar)
   
    const dataUri = jpeg.toDataUri();  // Отримуємо Data URI
    return dataUri;
}
