import { Button, ButtonProps } from '@chakra-ui/react';
import React from 'react';

type Props = ButtonProps

export function AddButton(props: ButtonProps){
  return (
    <Button m="1" size="xs" {...props}>
        +
    </Button>
  );
}