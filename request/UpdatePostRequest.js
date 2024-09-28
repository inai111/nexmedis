import {z} from 'zod';

const UpdatePostRequestParse =  z.object({
    caption: z.string(),
    images: z.array(z.string()),
})

export default UpdatePostRequestParse;