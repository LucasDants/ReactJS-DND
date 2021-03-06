import { useEffect, useState } from 'react'
import type { GetServerSideProps } from 'next'

import { useDrop } from 'react-dnd'
import { Flex, Heading, Link as ChakraLink, SimpleGrid } from '@chakra-ui/react'

import { Todo } from '../components/Todo'
import { PreviewTodo } from '../components/PreviewTodo'
import { IconButton } from '../components/IconButton'

import { addDoc, collection, doc, setDoc, onSnapshot, query, updateDoc, arrayRemove } from 'firebase/firestore'
import { db } from '../services/firebaseConfig'
import { Unsubscribe } from '@firebase/util'

import { TodoProps } from '../dtos/Todo'
import { TaskProps } from '../dtos/Task'
import Link from 'next/link'

type Props = {
  todoListID: string
}

export default function Todos({ todoListID }: Props) {
  const [todos, setTodos] = useState<TodoProps[]>([])
  const [addingNewTodo, setAddingNewTodo] = useState(false)

  const [_, drop] = useDrop(() => ({
    accept: 'task',
    drop(_item: TaskProps, monitor) {
      const didDrop = monitor.didDrop()
      if (didDrop || !_item.todoID) {
        return
      }
      const docRef = doc(db, `routes/${todoListID}/todos/${_item.todoID}`)

      updateDoc(docRef, { tasks: arrayRemove(_item) })
        .then(() => {
          const dbInstance = collection(db, `routes/${todoListID}/todos`)

          addDoc(dbInstance, {
            description: _item.description,
            checked: _item.checked,
            tasks: []
          })
        })
    },
   
  }))

  function addTodo(description: string) {
    const dbInstance = collection(db, `routes/${todoListID}/todos`)

    setAddingNewTodo(false)
    addDoc(dbInstance, {
      description,
      checked: false,
      tasks: []
    })
  }

  function handleAddTodo() {
    setAddingNewTodo(true)
    window.scrollTo(0, document.body.scrollHeight + 1000);
  }

  useEffect(() => {
    let unsubscribe: Unsubscribe = () => null
    if (todoListID) {

      const q = query(collection(db, `routes/${todoListID}/todos`))

      unsubscribe = onSnapshot(q, (querySnapshot) => {
        const todoList: TodoProps[] = []

        querySnapshot.forEach(doc => todoList.push({
          ...doc.data() as TodoProps,
          id: doc.id
        }))

        setTodos(todoList)
      })
    }

    return () => unsubscribe()
  }, [todoListID])

  return (
    <Flex direction="column">
      <Flex as="header"
        justifyContent="space-between"
        alignItems="center"
        bg="orange"
        position="fixed"
        left={0}
        right={0}
        zIndex={1}
        py="2"
        px="24"
      >
        <Link href="/" passHref>
          <ChakraLink>
            <Heading color="white">Todo List</Heading>
          </ChakraLink>
        </Link>
        <IconButton iconType="add" onClick={handleAddTodo} color="white" size="lg" />
      </Flex>
      <SimpleGrid ref={drop} spacing="8" pb="10" bg="white" px="24" py="12" pt="28">
        {
          todos.map((todo) => <Todo key={todo.id} todo={todo} />)
        }
        {
          addingNewTodo && <PreviewTodo handleAddTodo={addTodo} handleCancel={() => setAddingNewTodo(false)} />
        }
        {
          todos.length === 0 && !addingNewTodo && <Heading textAlign="center" color="blue.600">Add some todos to organize your tasks!</Heading>
        }
      </SimpleGrid>
    </Flex>
  )
}

type ContextParams = {
  todoListID: string
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { todoListID } = ctx.params as ContextParams

    const docRef = doc(db, 'routes', todoListID as string)

    setDoc(docRef, {}, { merge: true })

  return {
    props: {
     todoListID
    }
  }
}