import {z} from "zod";

export const workspaceSchema = z.object({
    name: z.string().min(3).max(50),
    description: z.string().max(50).optional()  
})


export const addMemberToWorkspaceSchema = z.object({
    memberId : z.string().min(3)
})

export const addChannelToWorkspaceSchema = z.object({
    channelName : z.string()
})
