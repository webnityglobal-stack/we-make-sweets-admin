import axios from "axios"

export const stateAndCitiesService = {
    getAllState: async(c)=>{
        const {data} = await axios.post('https://countriesnow.space/api/v0.1/countries/states',{
              country: `${c}`
        })
        return data.data.states;
    },

    getAllCity: async(ctry, state)=>{
        const {data} = await axios.post('https://countriesnow.space/api/v0.1/countries/state/cities',{
            country: `${ctry}`,
            state: `${state}`
        })
        return data
    }
    
}