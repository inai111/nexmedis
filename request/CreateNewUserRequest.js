import { z } from "zod";

const CreateNewUserRequestParse = z.object({
    username: z.string()
        .min(4, "Username field must be at least 4 character")
        .regex(/^[a-zA-Z0-9._]+$/, "Username can only contain letter, number, underscores and dots"),
    password: z.string()
        .min(8, 'Password must be at least 8 character')
        .regex(/[a-z]/, 'Password must be at least contain uppercase, lowercase and number')
        .regex(/[0-9]/, 'Password must be at least contain uppercase, lowercase and number')
        .regex(/[A-Z]/, 'Password must be at least contain uppercase, lowercase and number')
})

export default CreateNewUserRequestParse;