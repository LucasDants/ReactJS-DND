import { TaskProps } from "./Task"

export type TodoProps = {
    id: string;
    checked: boolean
    description: string
    tasks: TaskProps[]
}