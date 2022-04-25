import React, { useState } from 'react';

import { Button, Flex, Input } from '@chakra-ui/react';
import { AddIcon, DeleteIcon } from '@chakra-ui/icons'

type Props = {
    handleAddTask: (description: string) => void
    handleCancel: () => void
}

export function PreviewTask({  handleAddTask, handleCancel }: Props) {
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
                onKeyDown={(e) => {
                    if(e.key === 'Enter') {
                        handleAddTask(description)
                    }
                    if(e.key === 'Escape') {
                        handleCancel()
                    }
                }}
                onChange={(e) => setDescription(e.target.value)}
            />
            <Button bg="transparent" onClick={() => handleAddTask(description)}>
                <AddIcon />
            </Button>
             <Button bg="transparent" onClick={handleCancel}>
                <DeleteIcon />
            </Button>
        </Flex>
    );
}
