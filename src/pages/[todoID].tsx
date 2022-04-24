import { Flex, SimpleGrid } from '@chakra-ui/react'
import type { NextPage } from 'next'

import Container  from '../components/examples/example'
import { Todo } from '../components/Todo'
import { AddButton } from '../components/AddButton'
import { todosData } from '../todos'
import { useDrop } from 'react-dnd'
import { useState } from 'react'
import { TodoData } from '../components/TodoItem'

type TodoItemData = TodoData & {
  primary: boolean;
  fatherID: string;
}

const Todos: NextPage = () => {
  const [todos, setTodos] = useState(todosData)

    const [_, drop] = useDrop(() => ({
        accept: 'todo',
        drop(_item: TodoItemData, monitor) {
            if(_item.primary) {
              return
            }

            const newTodos = todos.map(todo => {
              if(todo.id !== _item.fatherID) {
                return todo
              }

              return {
                ...todo,
                todos: todo.todos.filter(todo => todo.id !== _item.id)
              }
            })

            const newTodo = {
              id: _item.id,
              description: _item.description,
              checked: _item.checked,
              todos: []
            }

            setTodos([...newTodos, newTodo])
        }
    }))

  return (
      <Flex direction="column" px="24" py="12">
				{/* <Container /> */}
        <SimpleGrid ref={drop} spacing="8" pb="10">
          {
            todos.map((todo) =>  <Todo key={todo.id} todo={todo} />)
          }
        </SimpleGrid>
        <AddButton />
      </Flex>
  )
}

export default Todos
