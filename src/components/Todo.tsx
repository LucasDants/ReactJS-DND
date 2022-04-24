import { Box, Checkbox, Flex, SimpleGrid } from '@chakra-ui/react';
import React from 'react';
import { DropTargetMonitor, useDrop } from 'react-dnd';
import { AddButton } from './AddButton';
import { TodoData, TodoItem } from './TodoItem';
import { v4 as uuidv4 } from 'uuid';
import { addDoc, collection, doc, setDoc, onSnapshot, query, updateDoc, deleteDoc, arrayUnion, arrayRemove} from 'firebase/firestore'
import { db } from '../services/firebaseConfig';
import { useRouter } from 'next/router';
import { Item } from 'framer-motion/types/components/Reorder/Item';

type Props = {
    todo: TodoData
}

type TodoItemData = TodoData & {
  primary: boolean;
}

export function Todo({ todo }: Props) {
  const router = useRouter()

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
                console.log(_item.fatherID, todo.id)
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

    return (
        <Box ref={drop} bg="blue.50" border="1px solid" borderColor={isOver ? "orange" : 'blue.700'} borderRadius="4" p="4">
            <TodoItem todo={todo} primary />
            <SimpleGrid py="4" pl="8" columns={1} spacing="1">
                {
                    todo.todos.map(_todo => <TodoItem key={_todo.id} todo={_todo}/>)
                }
            </SimpleGrid>
            <Flex justifyContent="flex-end">
                <AddButton onClick={() => {
                    updateDoc(doc(db, `routes/${todoID}/todos/${todo.id}`), {
                    todos: arrayUnion({checked: true, description: 'subitem', fatherID: todo.id, id: uuidv4()})
                })
                }} />
            </Flex>
        </Box>
    );
}
