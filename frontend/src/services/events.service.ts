import { api } from "./api"

export const getEvents = ()=>{

    return api.get("/events")

}