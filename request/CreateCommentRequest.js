import { z } from "zod";

const CreateCommentRequest = z.object({
    body: z.string().min(1, "The body field is required")
});

export default CreateCommentRequest;