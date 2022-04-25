import { Box, Button, Checkbox, Flex, Input } from '@chakra-ui/react';
import { EditIcon, AddIcon, DeleteIcon } from '@chakra-ui/icons'
import React, { memo, useState } from 'react';
import { DragSourceMonitor, useDrag } from 'react-dnd';
import { arrayRemove, arrayUnion, doc, runTransaction, updateDoc } from 'firebase/firestore';
import { db } from '../services/firebaseConfig';
import { useRouter } from 'next/router';

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

function TodoItemComponent({ todo, primary = false }: Props) {
    const [editing, setEditing] = useState(false)
    const [description, setDescription] = useState(todo.description)

    const router = useRouter()
    const { todoID } = router.query


    const [{ isDragging }, drag] = useDrag(() => ({
        type: 'todo',
        item: { ...todo, primary },
        canDrag: true,
        collect: (monitor: DragSourceMonitor) => ({
            isDragging: monitor.isDragging()
        })
    }))

    function handleToggleCheckbox() {
        const docRef = doc(db, `routes/${todoID}/todos/${primary ? todo.id : todo.fatherID}`)
        if (primary) {
            updateDoc(docRef, { checked: !todo.checked })
        } else {
            runTransaction(db, async (transaction) => {
                transaction.update(docRef, {
                    todos: arrayRemove({ checked: todo.checked, description: todo.description, fatherID: todo.fatherID, id: todo.id })
                })

                transaction.update(docRef, {
                    todos: arrayUnion({ checked: !todo.checked, description: todo.description, fatherID: todo.fatherID, id: todo.id })
                })
            })
        }
    }

    function handleRemoveTodo() {
        if (primary) {
            return;
        }
        const docRef = doc(db, `routes/${todoID}/todos/${primary ? todo.id : todo.fatherID}`)
        updateDoc(docRef, {
            todos: arrayRemove({ checked: todo.checked, description: todo.description, fatherID: todo.fatherID, id: todo.id })
        })
    }

    function handleEditDescription() {
        setEditing(true)
    }

    function handleSaveDescription() {
        if (!description) {
            return
        }

        const docRef = doc(db, `routes/${todoID}/todos/${primary ? todo.id : todo.fatherID}`)
        if (primary) {
            updateDoc(docRef, { description })
        } else {
            runTransaction(db, async (transaction) => {
                transaction.update(docRef, {
                    todos: arrayRemove({ checked: todo.checked, description, fatherID: todo.fatherID, id: todo.id })
                })

                transaction.update(docRef, {
                    todos: arrayUnion({ checked: todo.checked, description, fatherID: todo.fatherID, id: todo.id })
                })
            })
        }
        setEditing(false)
    }

    return (
        <Flex ref={drag}
            justifyContent="space-between"
            alignItems="center"
            w="100%"
            border="1px dashed"
            borderColor="blue.500"
            borderRadius="4"
            p="4"
            bg="white"
            cursor="move"
            opacity={isDragging ? 0.4 : 1}
        >
            {
                editing ? (
                    <>
                        <Input
                            value={description}
                            borderTop="none"
                            borderX="none"
                            borderRadius="none"
                            maxLength={120}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                        <Button bg="transparent" onClick={handleSaveDescription}>
                            <AddIcon />
                        </Button>
                    </>
                ) : (
                    <>
                        <Checkbox isChecked={todo.checked} onChange={handleToggleCheckbox}>
                            {todo.description}
                        </Checkbox>
                        <Box>
                            <Button bg="transparent" onClick={handleEditDescription}>
                                <EditIcon />
                            </Button>
                            {
                                !primary && (
                                    <Button bg="transparent" onClick={handleRemoveTodo}>
                                        <DeleteIcon />
                                    </Button>
                                )
                            }

                        </Box>
                    </>
                )
            }
        </Flex>
    );
}

export const TodoItem = memo(TodoItemComponent)