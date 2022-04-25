import React, { useState } from 'react';
import { useRouter } from 'next/router';

import { Box, Flex, SimpleGrid } from '@chakra-ui/react';
import { DropTargetMonitor, useDrop } from 'react-dnd';

import { PreviewTask } from './PreviewTask';
import { IconButton } from './IconButton';
import { Task } from './Task';

import { doc, updateDoc, deleteDoc, arrayUnion, arrayRemove, runTransaction } from 'firebase/firestore'
import { db } from '../services/firebaseConfig';
import { v4 as uuidV4 } from 'uuid';

import { TodoProps } from '../dtos/Todo';
import { TaskProps } from '../dtos/Task';

type Props = {
    todo: TodoProps
}

type DroppableItem = TaskProps & {
    tasks?: TaskProps[]
}

export function Todo({ todo }: Props) {
    const router = useRouter()
    const { todoListID } = router.query

    const [addingNewTask, setAddingNewTask] = useState(false)

    const [{ isOver }, drop] = useDrop(() => ({
        accept: ['todo', 'task'],
        drop(_item: DroppableItem, _) {
            if (_item.id === todo.id || (!_item.todoID && _item.tasks?.length)) {
                return
            } else if (!_item.todoID) {
                const docRef = doc(db, `routes/${todoListID}/todos/${_item.id}`)

                updateDoc(doc(db, `routes/${todoListID}/todos/${todo.id}`), {
                    tasks: arrayUnion({ checked: _item.checked, description: _item.description, todoID: todo.id, id: _item.id })
                })

                deleteDoc(docRef)

            } else if (_item.todoID) {
                runTransaction(db, async transaction => {
                    const oldTodoRef = doc(db, `routes/${todoListID}/todos/${_item.todoID}`)
                    const newTodoRef = doc(db, `routes/${todoListID}/todos/${todo.id}`)

                    transaction.update(oldTodoRef, { tasks: arrayRemove(_item) })
                    transaction.update(newTodoRef, { tasks: arrayUnion({..._item, todoID: todo.id}) })

                })
            }

        },
        collect: (monitor: DropTargetMonitor) => {
            return {
                isOver: monitor.isOver(),
            }
        },
    }))

    function handleDeleteTodo() {
        const docRef = doc(db, `routes/${todoListID}/todos/${todo.id}`)
        deleteDoc(docRef)
    }

    function handleAddTask(description: string) {
        const docRef = doc(db, `routes/${todoListID}/todos/${todo.id}`)
        const newTask = {
            id: uuidV4(),
            checked: false,
            description: description,
            todoID: todo.id
        }
        updateDoc(docRef, { tasks: arrayUnion(newTask) })

        setAddingNewTask(false)
    }

    return (
        <Box ref={drop} border="1px solid" bg={isOver ? "orange.100" : 'blue.50'} borderRadius="4" p="4">
            <Task task={todo} hasSubTasks={todo.tasks.length} />
            <SimpleGrid py="4" pl="8" columns={1} spacing="1">
                {
                    todo.tasks.map(task => <Task key={task.id} task={task} />)
                }
                {
                    addingNewTask && <PreviewTask handleAddTask={handleAddTask} handleCancel={() => setAddingNewTask(false)} />
                }
            </SimpleGrid>
            <Flex justifyContent="flex-end">
                <IconButton iconType="add" onClick={() => setAddingNewTask(true)} />
                <IconButton iconType="delete" onClick={handleDeleteTodo} />
            </Flex>
        </Box>
    );
}

