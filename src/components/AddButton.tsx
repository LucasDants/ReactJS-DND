import { AddIcon } from '@chakra-ui/icons';
import { Button, ButtonProps } from '@chakra-ui/react';
import React from 'react';

export function AddButton(props: ButtonProps){
  return (
    <Button m="1" size="xs" {...props}>
        <AddIcon />
    </Button>
  );
}