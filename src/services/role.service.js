import api from "@/api/axios"

export const roleService = {

    getAllRole: async () => {
        const { data } = await api.get('/role/get-all-roles');
        return data.data;

    },

    getRoleById: async (id) => {
        const { data } = await api.get(`/role/get-role/${id}`);
        return data.data
    },

    deleteRolePermission: async (id, p) => {
        const { data } = await api.delete(`/role/delete-role-permission/${id}`, {
            data: {
                permission: p
            }
        });

        return data.data;
    },

    fetchAllPermissions: async () => {
        const { data } = await api.get('/role/get-all-permission');
        return data.data
    },

    createRole: async (roleName, permissionsToAssign) => {
        const { data } = await api.post('/role/create-role', {
            roleName, permissionsToAssign
        })

        return data
    },

    deleteRole: async(roleId)=>{
        const {data}= await api.delete(`/role/delete-role/${roleId}`);
        console.log("deleted", data)
        return data;
    }

}