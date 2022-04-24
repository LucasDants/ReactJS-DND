import { Box, Checkbox, Flex, SimpleGrid } from '@chakra-ui/react';
import React from 'react';
import { DropTargetMonitor, useDrop } from 'react-dnd';
import { AddButton } from './AddButton';
import { TodoData, TodoItem } from './TodoItem';



type Props = {
    todo: TodoData
}


export function Todo({ todo }: Props) {
    const [{ isOver }, drop] = useDrop(() => ({
        accept: 'todo',
        drop(_item, monitor) {
           
        },
        collect: (monitor: DropTargetMonitor) => {
            return {
                isOver: monitor.isOver(),
            }
        },
    }))

    return (
        <Box ref={drop} bg="blue.50" border="1px solid" borderColor={isOver ? "orange" : 'blue.700'} borderRadius="4" p="4">
            <TodoItem todo={todo} primary />
            <SimpleGrid py="4" pl="8" columns={1} spacing="1">
                {
                    todo.todos.map(_todo => <TodoItem key={_todo.id} todo={_todo} fatherID={todo.id} />)
                }
            </SimpleGrid>
            <Flex justifyContent="flex-end">
                <AddButton />
            </Flex>
        </Box>
    );
}