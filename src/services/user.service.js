import api from "@/api/axios"

export const userService = {

    getAllUsers:async()=>{
        const response = await api.get('/user/get-all-user');
        console.log("get all user servcie called ", response);
        return response.data;
    }
}