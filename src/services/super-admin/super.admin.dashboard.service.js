import api from "@/api/axios"

export const superAdminDashboard = {
    getDashboard: async()=>{
        const {data} = await api.get("/dashboard/super-admin");
        return  data.data;
    }
}

export const superAdminUser = {
    getUserData: async(tab)=>{
        
        const {data} = await api.post("/dashboard/super-admin/user",tab);
        
        return  data.data;
    }
}

export const superAdminRole = {
    getRoleSummary : async()=>{
        const {data} = await api.get('/dashboard/super-admin/roles');
        
        return data.data;
    }
}