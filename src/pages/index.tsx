import { Flex, Heading, Text } from '@chakra-ui/react'
import type { NextPage } from 'next'
import { PreviewTask } from '../components/PreviewTask'
import { PreviewTodo } from '../components/PreviewTodo'

const Home: NextPage = () => {
  return (
    <>
      <Flex as="header"
        justifyContent="space-between"
        alignItems="center"
        bg="orange"
        py="2"
        px="24"
        minH="72px"
      >
        <Heading color="white">Todo List</Heading>
      </Flex>
    <Flex flexDirection="column" px="24" py="8">

      <Heading my="2" size="lg">1. How to create a todo list?</Heading>
      <Text fontSize="lg">Digit after the url any name or number to create/access a todo list. Ex: example.com/<Text as="strong">somename</Text></Text>

      <Heading my="2" size="lg">2. How to create a todo item?</Heading>
      <Text fontSize="lg">Click on the plus button in the header on the right on todo list screen and the preview todo will appear on the bottom.</Text>
      <PreviewTodo handleAddTodo={(description) => alert(`Todo add: ${description}`)} handleCancel={() => alert('Action canceled')} />
      <Text fontSize="lg">Press enter or plus button to add a new todo. Press esc or trash button to cancel the action.</Text>

      <Heading my="2" size="lg">3. How to create a task item?</Heading>
      <Text fontSize="lg">Click on the plus button inside the todo on the bottom-right and the preview task will appear.</Text>
      <PreviewTask handleAddTask={(description) => alert(`Task add: ${description}`)} handleCancel={() => alert('Action canceled')} />
      <Text fontSize="lg">Press enter or plus button to add a new todo. Press esc or trash button to cancel the action.</Text>

      <Heading my="2" size="lg">4. How to edit or delete a todo?</Heading>
      <Text fontSize="lg">Click on the edit/trash button inside the todo on the bottom-right</Text>

      <Heading my="2" size="lg">5. How to edit or delete a task?</Heading>
      <Text fontSize="lg">Click on the edit/trash button inside the task on the right</Text>

      <Heading my="2" size="lg">6.What does the Drag and Drop?</Heading>
      <Text fontSize="lg">You can drag a subtask inside another todo.</Text>
      <Text fontSize="lg">You can drag a subtask to create another task</Text>
      <Text fontSize="lg">You can drag a todo (without tasks) inside another todo</Text>
    </Flex>
    </>
  )
}

export default Home
