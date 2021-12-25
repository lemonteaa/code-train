import logo from './logo.svg';
import './App.css';

import { ChakraProvider } from '@chakra-ui/react'
import { Flex, Spacer, Box, Container, VStack, SimpleGrid, Center } from '@chakra-ui/react'
import { Input, InputGroup, InputLeftElement, InputRightElement, IconButton } from '@chakra-ui/react'

import { SearchIcon, TriangleDownIcon, ChevronDownIcon } from '@chakra-ui/icons'

import { Text, Divider, Heading } from '@chakra-ui/react'

import { Checkbox, List, ListItem } from '@chakra-ui/react'

import elasticlunr from 'elasticlunr'

import { useState } from 'react';

var index = elasticlunr(function () {
  this.addField('title')
  this.addField('body')
});

var doc1 = {
  "id": 1,
  "title": "Oracle released its latest database Oracle 12g",
  "body": "Yestaday Oracle has released its new database Oracle 12g, this would make more money for this company and lead to a nice profit report of annual year."
}

var doc2 = {
  "id": 2,
  "title": "Oracle released its profit report of 2015",
  "body": "As expected, Oracle released its profit report of 2015, during the good sales of database and hardware, Oracle's profit of 2015 reached 12.5 Billion."
}

index.addDoc(doc1);
index.addDoc(doc2);

function App() {
  const [result, setResult] = useState()
  const handleChange = (event) => {
    setResult(index.search(event.target.value))
  }

  return (
    <div className="App">
      <ChakraProvider>
        <h3>Hello!</h3>
        <Container maxW="container.xl">
          <Flex>
            <Box w="300px">
              <VStack>
                <Flex w='100%'>
                  <Heading size="sm">Filter by Category</Heading>
                  <Center flex="1">
                    <Divider />
                  </Center>
                  <ChevronDownIcon />
                </Flex>
                <List align="left">
                  <ListItem>
                    <Checkbox>Backend</Checkbox>
                  </ListItem>
                  <ListItem>
                    <Checkbox>Frontend</Checkbox>
                  </ListItem>
                  <ListItem>
                    <Checkbox>DevOps</Checkbox>
                  </ListItem>
                </List>
              </VStack>
            </Box>
            <Box flex="1">
              <VStack spacing={4} align='stretch'>
                <Center h='70px'>
                  <InputGroup w='600px'>
                    <InputLeftElement>
                      <SearchIcon />
                    </InputLeftElement>
                    <Input placeholder="Search..." onChange={handleChange}></Input>
                    <InputRightElement>
                      <IconButton colorScheme='teal' icon={<TriangleDownIcon/>} />
                    </InputRightElement>
                  </InputGroup>
                </Center>
                <SimpleGrid columns={3} spacing={10}>
                  <Box>Card 1</Box>
                  <Box>Card 2</Box>
                  <Box>Card 3</Box>
                  <Box>Card 4</Box>
                  <Box>Card 5</Box>
                  <Box>Card 6</Box>
                  <Box>Card 7</Box>
                  <Box>Card 8</Box>
                </SimpleGrid>
                <Text>{JSON.stringify(result)}</Text>
              </VStack>
            </Box>
          </Flex>
        </Container>
      </ChakraProvider>
    </div>
  );
}

export default App;
