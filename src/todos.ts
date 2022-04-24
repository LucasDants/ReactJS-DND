
type Todo = {
    id: string
    description: string
    checked: boolean
    todos: Todo[]
}

export const todosData: Todo[] = [
    {
        id: '1',
        description: 'TODO1',
        checked: false,
        todos: []
    },
    {
        id: '2',
        description: 'TODO2',
        checked: false,
        todos: [
            {
                id: '1',
                description: 'TODO2-1',
                checked: false,
                todos: []
            },
        ]
    },
    {
        id: '3',
        description: 'TODO3',
        checked: false,
        todos: [
            {
                id: '1',
                description: 'TODO3-1',
                checked: false,
                todos: []
            },
            {
                id: '2',
                description: 'TODO3-2',
                checked: true,
                todos: []
            },
        ]
    },
]