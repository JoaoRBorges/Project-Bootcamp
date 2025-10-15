import { Key } from "react"

export type Place = {
    id: Key | null | undefined
    latitude: number
    longitude: number
    name: string
    description?: string
}