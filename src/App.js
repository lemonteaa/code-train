import logo from './logo.svg';
import './App.css';

import { ChakraProvider } from '@chakra-ui/react'
import { Flex, Spacer, Box, Container, VStack, SimpleGrid, Center } from '@chakra-ui/react'
import { Input, InputGroup, InputLeftElement, InputRightElement, IconButton, Button } from '@chakra-ui/react'

import { SearchIcon, TriangleDownIcon, ChevronDownIcon } from '@chakra-ui/icons'

import { Text, Divider, Heading, Link } from '@chakra-ui/react'

import { Badge } from '@chakra-ui/layout';

import { Checkbox, List, ListItem } from '@chakra-ui/react'

import elasticlunr from 'elasticlunr'

import { useState } from 'react';

const dhive = require('@hiveio/dhive');

let opts = {
  addressPrefix: 'TST',
  chainId:
      '18dcf0a285365fc58b71f18b3d3fec954aa0c141c44e4e5cb4cf777b9eab274e',
};

const client = new dhive.Client("http://127.0.0.1:8090", opts);

const hive_query = {
  tag: "course",
  limit: 20
};

var index = elasticlunr(function () {
  this.addField('title')
  this.addField('description')
  this.addField('objective')
  this.setRef('permalink')
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

//index.addDoc(doc1);
//index.addDoc(doc2);

function App() {
  const [result, setResult] = useState()
  const handleChange = (event) => {
    setResult(index.search(event.target.value))
  }

  const [courses, setCourses] = useState([]);

  const grabPosts = async () => {
    client.database
        .getDiscussions("created", hive_query)
        .then(result => {
            console.log('Response received:', result);
            if (result) {
                var posts = [];
                result.forEach(post => {
                    const json = JSON.parse(post.json_metadata);
                    const image = json.image ? json.image[0] : '';
                    const title = post.title;
                    const author = post.author;
                    const permlink = post.permlink;
                    const created = new Date(post.created).toDateString();

                    posts.push({
                      title: json["course_title"],
                      link: json["ipfs_uri"],
                      category: json.category,
                      difficulty: json.difficulty,
                      timecost: json["time_cost_est"],
                      units: json["unit_breakdown"]
                    });

                    index.addDoc({
                      "permalink": "@" + post.author + "/" + post.permlink,
                      "title": json["course_title"],
                      "description": json["course_desc"],
                      "objective": json["course_obj"]
                    })
                });

                setCourses(posts);
            } else {
                setCourses([]);
            }
        })
        .catch(err => {
            console.log(err);
            alert(`Error:${err}, try again`);
        });
  }

  

  return (
    <div className="App">
      <ChakraProvider>
        <h3>Hello!</h3>
        <Button onClick={grabPosts}>Get Posts</Button>
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
                  {courses.map((course) => {
                    return (
                      <Link maxW='sm' borderWidth='1px' borderRadius='lg' overflow='hidden'>

                        <Box p='6'>
                          <Box display='flex' alignItems='baseline'>
                          <Badge borderRadius='full' px='2' colorScheme='teal'>
                            {course.category}
                          </Badge>
                          </Box>

                          <Box
                            mt='1'
                            fontWeight='semibold'
                            as='h4'
                            lineHeight='tight'
                            isTruncated
                          >
                            {course.title}
                          </Box>
                        
                        </Box>
                      </Link>
                    )
                  })}
                </SimpleGrid>
                <Text>Search result test: {JSON.stringify(result)}</Text>
                <Text>Courses: {JSON.stringify(courses)}</Text>
              </VStack>
            </Box>
          </Flex>
        </Container>
      </ChakraProvider>
    </div>
  );
}

export default App;
