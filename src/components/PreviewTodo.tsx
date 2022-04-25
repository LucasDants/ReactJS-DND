import { Box, SimpleGrid } from '@chakra-ui/react';
import React, { memo } from 'react';


import { PreviewTodoItem } from './PreviewTodoItem';


type Props = {
    handleAddTodo: (description: string) => void
    handleCancel: () => void
}

function NewTodoComponent({ handleAddTodo , handleCancel }: Props) {
    return (
        <Box border="1px solid" bg="blue.50" borderRadius="4" p="4">
             <PreviewTodoItem handleAddTodo={handleAddTodo} handleCancel={handleCancel} /> 
            <SimpleGrid py="4" pl="8" columns={1} spacing="1" />
        </Box>
    );
}

export const PreviewTodo = memo(NewTodoComponent)