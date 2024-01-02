import axios from "axios"

let withAuth = axios.create({
    baseURL: "https://localhost:3500/",
    withCredentials: true
})

export const setAuthorization = (authorizationToken) => {
    withAuth.defaults.headers["Authorization"] = `Bearer ${authorizationToken}`
    return withAuth
}



withAuth.interceptors.response.use((resp)=>{
    return resp
}, async (err)=>{
    if(err.response.status===403){
        const originalRequest = err.config;
        if (err.response.status === 403 && !originalRequest._retry){
            originalRequest._retry = true;
            
            const resp = await withAuth.get("/auth/refresh")
            try{
                originalRequest.headers["Authorization"] = `Bearer ${resp.data.accessToken}`
                withAuth = setAuthorization(resp.data.accessToken)
                return withAuth(originalRequest)
            }
            catch {
                console.log("Error")
            }            
        }
   }
   else{
    return err
   }
})


export {withAuth}







