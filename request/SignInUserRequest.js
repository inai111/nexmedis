import { z } from "zod";

const SignInUserRequestParse = z.object({
    username: z.string()
        .min(1, "Username field is required"),
    password: z.string()
        .min(1, 'Password field is required')
})

export default SignInUserRequestParse;