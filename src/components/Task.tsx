import React, { memo, useState } from 'react';
import { useRouter } from 'next/router';

import { Box, Checkbox, Flex, Input } from '@chakra-ui/react';
import { DragSourceMonitor, useDrag } from 'react-dnd';

import { IconButton } from './IconButton';

import { arrayRemove, arrayUnion, doc, runTransaction, updateDoc } from 'firebase/firestore';
import { db } from '../services/firebaseConfig';

import { TaskProps } from '../dtos/Task';

type Props = {
	task: TaskProps
	hasSubTasks?: number
}

function TaskComponent({ task, hasSubTasks = undefined }: Props) {
	const [editing, setEditing] = useState(false)
	const [description, setDescription] = useState(task.description)

	const router = useRouter()
	const { todoListID } = router.query

	const [{ isDragging }, drag] = useDrag(() => ({
		type: task.todoID ? 'task' : 'todo',
		item: task,
		canDrag: true,
		collect: (monitor: DragSourceMonitor) => ({
			isDragging: monitor.isDragging()
		})
	}))

	function handleToggleCheckbox() {
		const docRef = doc(db, `routes/${todoListID}/todos/${task.todoID ? task.todoID : task.id}`)

		if (!task.todoID) {
			updateDoc(docRef, { checked: !task.checked })
		} else {
			runTransaction(db, async (transaction) => {
				transaction.update(docRef, {
					tasks: arrayRemove(task)
				})

				transaction.update(docRef, {
					tasks: arrayUnion({ ...task, checked: !task.checked })
				})
			})
		}
	}

	function handleRemoveTask() {
		const docRef = doc(db, `routes/${todoListID}/todos/${task.todoID}`)

		updateDoc(docRef, {
			tasks: arrayRemove(task)
		})
	}

	function handleEditDescription() {
		setEditing(true)
	}

	function handleSaveDescription() {
		if (!description) {
			return
		}

		const docRef = doc(db, `routes/${todoListID}/todos/${task.todoID ? task.todoID : task.id}`)

		if (!task.todoID) {
			updateDoc(docRef, { description })
		} else {
			runTransaction(db, async (transaction) => {
				transaction.update(docRef, {
					tasks: arrayRemove(task)
				})

				transaction.update(docRef, {
					tasks: arrayUnion({ ...task, description })
				})
			})
		}
		setEditing(false)
	}

	return (
		<Flex ref={hasSubTasks || editing ? null : drag}
			justifyContent="space-between"
			alignItems="center"
			w="100%"
			border={`1px ${hasSubTasks ? 'solid' : 'dashed'}`}
			borderColor="blue.500"
			borderRadius="4"
			p="4"
			bg="white"
			cursor={hasSubTasks ? 'default' : "move"}
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
							onKeyDown={(e) => {
								if (e.key === 'Enter') {
									handleSaveDescription()
								}

								if (e.key === 'Escape') {
									setEditing(false)
									setDescription(task.description)
								}
							}}
						/>
						<IconButton iconType="add" onClick={handleSaveDescription} />
					</>
				) : (
					<>
						<Checkbox isChecked={task.checked} onChange={handleToggleCheckbox}>
							{task.description}
						</Checkbox>
						<Box>
							<IconButton iconType="edit" onClick={handleEditDescription} />
							{
								hasSubTasks === undefined && <IconButton iconType="delete" onClick={handleRemoveTask} />
							}
						</Box>
					</>
				)
			}
		</Flex>
	);
}

export const Task = memo(TaskComponent)