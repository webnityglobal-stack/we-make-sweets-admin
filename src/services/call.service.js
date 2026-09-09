import api from "@/api/axios"

export const callService = {

    createCall: async(payload)=>{
        const response = await api.post('/call/create-call', payload);
        console.log("this is call updatedstatus ", response );
        return response ;
    }

}