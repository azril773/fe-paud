import { UUID } from "./common"

export type ClaimJWT = {
    user_id: UUID;
    username: string
    paud_id: UUID
    paud_name: string
    role_id: UUID
    role_name: string
    subdomain: string
    status: string
}