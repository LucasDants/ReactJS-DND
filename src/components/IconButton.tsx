import React from 'react';
import { Button, ButtonProps } from '@chakra-ui/react';
import { AddIcon, EditIcon, DeleteIcon } from '@chakra-ui/icons';

type Props = ButtonProps & {
    iconType: 'add' | 'edit' | 'delete'
}

const icons = {
    add: AddIcon,
    edit: EditIcon,
    delete: DeleteIcon,
}

export function IconButton({ iconType, ...rest }: Props) {
    const Icon = icons[iconType]

    return (
        <Button bg="transparent" m="1" size="sm" {...rest}>
            <Icon  />
        </Button>
    );
}