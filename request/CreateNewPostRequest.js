import {z} from 'zod';

const CreateNewPostRequestParse =  z.object({
    caption: z.string(),
    images: z.array(z.string()),
})

export default CreateNewPostRequestParse;