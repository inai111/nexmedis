import cookieParser from "cookie-parser"

export default Auth = (to, from, next)=>{
    console.log(`; ${document.cookie}`)
    next();
}