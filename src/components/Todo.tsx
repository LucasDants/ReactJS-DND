import { Box, Button, Flex, SimpleGrid } from '@chakra-ui/react';
import React, { memo, useState } from 'react';
import { DropTargetMonitor, useDrop } from 'react-dnd';
import { AddButton } from './AddButton';
import { TodoData, TodoItem } from './TodoItem';
import { v4 as uuidv4 } from 'uuid';
import { doc, updateDoc, deleteDoc, arrayUnion, arrayRemove } from 'firebase/firestore'
import { db } from '../services/firebaseConfig';
import { useRouter } from 'next/router';
import { DeleteIcon } from '@chakra-ui/icons'
import { PreviewTodoItem } from './PreviewTodoItem';


type Props = {
    todo: TodoData
}

type TodoItemData = TodoData & {
  primary: boolean;
}

function TodoComponent({ todo }: Props) {
  const router = useRouter()
  const [addingNewTodo, setAddingNewTodo] = useState(false)

  const { todoID } = router.query

    const [{ isOver }, drop] = useDrop(() => ({
        accept: 'todo',
        drop(_item: TodoItemData, monitor) {
            if(_item.primary && _item.todos.length) {
                return
            } else if(_item.primary) {
                const docRef = doc(db, `routes/${todoID}/todos/${_item.id}`)
                deleteDoc(docRef)
                updateDoc(doc(db, `routes/${todoID}/todos/${todo.id}`), {
                    todos: arrayUnion({checked: _item.checked, description: _item.description, fatherID: todo.id, id: _item.id})
                })
            } else if(!_item.primary) {
                updateDoc(doc(db, `routes/${todoID}/todos/${_item.fatherID}`), {
                    todos: arrayRemove({checked: _item.checked, description: _item.description, fatherID: _item.fatherID, id: _item.id})
                })
                updateDoc(doc(db, `routes/${todoID}/todos/${todo.id}`), {
                    todos: arrayUnion({checked: _item.checked, description: _item.description, fatherID: todo.id, id: _item.id})
                })
            }

        },
        collect: (monitor: DropTargetMonitor) => {
            return {
                isOver: monitor.isOver(),
            }
        },
    }))


    function handleAddTodo(description: string) {
        if (!description) {
            return
        }
        const docRef = doc(db, `routes/${todoID}/todos/${todo.id}`)
        const newTodo = {
            id: uuidv4(),
            checked: false,
            description,
            fatherID: todo.id
        }
        setAddingNewTodo(false)
        updateDoc(docRef, { todos: arrayUnion(newTodo) })
    }


    return (
        <Box ref={drop}  border="1px solid" bg={isOver ? "orange.100" : 'blue.50'} borderRadius="4" p="4">
            <TodoItem todo={todo} primary />
            <SimpleGrid py="4" pl="8" columns={1} spacing="1">
                {
                    todo.todos.map(_todo => <TodoItem key={_todo.id} todo={_todo}/>)
                }
                {
                    addingNewTodo &&  <PreviewTodoItem handleAddTodo={handleAddTodo} handleCancel={() => setAddingNewTodo(false)} />
                }
            </SimpleGrid>
            <Flex justifyContent="flex-end">
                <AddButton onClick={() => setAddingNewTodo(true)} />
                <Button bg="transparent" onClick={() => {
                    const docRef = doc(db, `routes/${todoID}/todos/${todo.id}`)
                    deleteDoc(docRef)
                }}>
                    <DeleteIcon />
                </Button>
            </Flex>
        </Box>
    );
}

export const Todo = memo(TodoComponent)