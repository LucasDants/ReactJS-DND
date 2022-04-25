import { Button, Flex, Input } from '@chakra-ui/react';
import { AddIcon, DeleteIcon } from '@chakra-ui/icons'
import React, { useState } from 'react';

export type TodoData = {
    id: string
    fatherID?: string;
    description: string
    checked: boolean
    todos: TodoData[]
}

type Props = {
    handleAddTodo: (description: string) => void
    handleCancel: () => void
}

export function PreviewTodoItem({  handleAddTodo, handleCancel }: Props) {
    const [description, setDescription] = useState('')

    return (
        <Flex
            justifyContent="space-between"
            alignItems="center"
            w="100%"
            border="1px dashed"
            borderColor="blue.500"
            borderRadius="4"
            p="4"
            bg="white"
        >
            <Input
                value={description}
                borderTop="none"
                borderX="none"
                borderRadius="none"
                maxLength={120}
                onChange={(e) => setDescription(e.target.value)}
            />
            <Button bg="transparent" onClick={() => handleAddTodo(description)}>
                <AddIcon />
            </Button>
             <Button bg="transparent" onClick={handleCancel}>
                <DeleteIcon />
            </Button>
        </Flex>
    );
}
