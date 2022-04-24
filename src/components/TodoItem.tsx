import { Box, Checkbox } from '@chakra-ui/react';
import React, { memo } from 'react';
import { DragSourceMonitor, useDrag } from 'react-dnd';

export type TodoData = {
    id: string
    fatherID?: string;
    description: string
    checked: boolean
    todos: TodoData[]
}

type Props = {
    todo: TodoData
    primary?: boolean
}

function TodoItemComponent({ todo, primary = false }: Props){
    const [{ isDragging }, drag] = useDrag(() => ({
        type: 'todo',
        item: {...todo, primary},
        canDrag: true,
        collect: (monitor: DragSourceMonitor) => ({
            isDragging: monitor.isDragging()
        })
    }))

  return (
    <Box 
        ref={drag} 
        w="100%" 
        border="1px dashed" 
        borderColor="blue.500"
        borderRadius="4" 
        p="4" 
        bg="white"
        cursor="move"
        opacity={isDragging ? 0.4 : 1}
    >
        <Checkbox checked={todo.checked} onClick={() => {}}>
            {todo.description}
        </Checkbox>
    </Box>
  );
}

export const TodoItem = memo(TodoItemComponent)