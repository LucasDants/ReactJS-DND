import { Flex, SimpleGrid } from '@chakra-ui/react'
import type { NextPage } from 'next'

import Container  from '../components/examples/example'
import { Todo } from '../components/Todo'
import { AddButton } from '../components/AddButton'
import { todosData } from '../todos'
import { DropTargetMonitor, useDrop } from 'react-dnd'
import { useEffect, useState } from 'react'
import { TodoData } from '../components/TodoItem'
import { addDoc, collection, doc, setDoc, onSnapshot, query, updateDoc, arrayRemove} from 'firebase/firestore'
import { db } from '../services/firebaseConfig'
import {  useRouter } from 'next/router'
import { Unsubscribe } from '@firebase/util'
import { Item } from 'framer-motion/types/components/Reorder/Item'

type TodoItemData = TodoData & {
  primary: boolean;
}



const Todos: NextPage = () => {
  const [todos, setTodos] = useState<TodoData[]>([])
  const router = useRouter()

  const { todoID } = router.query


  useEffect(() => {
    let unsubscribe: Unsubscribe = () => null
    if(todoID) {
      const docRef = doc(db, 'routes', todoID as string)

      setDoc(docRef, {}, { merge: true })
      // .then(response => {

      //   getDocs(collection(db, `routes/${todoID}/todos`))
      //   .then(querySnapshot => {
      //     const backendTodos: TodoData[] = []
      //     querySnapshot.forEach(doc => backendTodos.push({
      //       ...doc.data() as TodoData,
      //       id: doc.id
      //     }))
      //     console.log(backendTodos)
      //   })
      // })
      const q = query(collection(db, `routes/${todoID}/todos`))
      unsubscribe = onSnapshot(q, (querySnapshot) => {
          const backendTodos: TodoData[] = []
            querySnapshot.forEach(doc => backendTodos.push({
            ...doc.data() as TodoData,
            id: doc.id
          }))
          setTodos(backendTodos)
      })
    }

    return () => unsubscribe()
  }, [todoID])

    const [{ isOver }, drop] = useDrop(() => ({
        accept: 'todo',
        drop(_item: TodoItemData, monitor) {
          const didDrop = monitor.didDrop()
            if (didDrop) {
              return
            }
            if(_item.primary) {
              return
            }
            console.log(_item.id)
            const docRef = doc(db, `routes/${todoID}/todos/${_item.fatherID}`)
            updateDoc(docRef, { todos: arrayRemove({ id: _item.id, checked: _item.checked, description: _item.description, fatherID: _item.fatherID})})
            .then(() => {
              const dbInstance = collection(db, `routes/${todoID}/todos`)
  
              addDoc(dbInstance, {
                  description: _item.description,
                  checked: _item.checked,
                  todos: []
              })
            })
        },
        collect: (monitor: DropTargetMonitor) => {
            return {
                isOver: monitor.isOver(),
            }
        },
    }))

  return (
      <Flex direction="column" px="24" py="12">
        <SimpleGrid ref={drop} spacing="8" pb="10" bg={isOver ? 'red' : 'white'}>
          {
            todos.map((todo) =>  <Todo key={todo.id} todo={todo} />)
          }
        </SimpleGrid>
        <AddButton onClick={async () => {
        const dbInstance = collection(db, `routes/${todoID}/todos`)

        await addDoc(dbInstance, {
              description: 'secondary',
              checked: true,
              todos: []
          })

        }} />
      </Flex>
  )
}

export default Todos
