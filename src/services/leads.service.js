import api from "@/api/axios"

export const leadService = {
    getAllLeads: async (status = "ALL") => {

        const { data } = await api.get(
            `/lead/get-all-lead?status=${status}`
        );

        return data.data;
    },

    updateLead: async (id, lead) => {
        const { data } = await api.put(`/lead/update-lead/${id}`,{lead});
        console.log(data);
        return data;
    },

    createLead: async (leadToCreate) => {
        console.log("lead to create", leadToCreate)
        const { data } = await api.post('/lead/create-lead', { leadToCreate });
        console.log("Lead Service", data);
        return data;
    },

    deleteLead: async (id) => {
        const { data } = await api.delete(`/lead/delete-lead/${id}`);
        console.log(data);
        return data;
    },

     assignMultipleLeads: async (userId, leadIds) => {
        const { data } = await api.patch('/lead/assign-multiple-leads', {
            userId,
            leadIds
        });
        return data; // { success, message, data: { userId, assignedLeads } }
    }
}