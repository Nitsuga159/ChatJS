import { Field } from "@/components/Form/type";

const channelForm: Field[] = [
    { 
        key: "name", 
        name: "Channel Name", 
        type: "text", 
        validate: (v: string = "") => {
            const errors: string[] = []

            if(!v) errors.push("Channel Name is required")

            if(v.length < 5) errors.push("Channel Name must be greater or equal than 5")

            if(v.length > 30) errors.push("Channel Name must be less or equal than 30")

            return errors
        }, 
        optional: false 
    }, 
    { 
        key: "description", 
        name: "Description", 
        type: "text", 
        validate: (v: string = "") => {
            const errors: string[] = []

            if(v.length > 300) errors.push("Description must be less or equal than 300")

            return errors
        }, 
        optional: true
    },
    { 
        key: "photo", 
        name: "Photo", 
        type: "file", 
        validate: (v: any) => {
            const errors: string[] = []
            
            console.log(v)

            return errors
        }, 
        optional: true
    }
]

export default channelForm