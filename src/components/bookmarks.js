import {
    List,
    ListItem,
    ListIcon,
    OrderedList,
    UnorderedList,
} from '@chakra-ui/react'

import { Link } from "@chakra-ui/react"
import { Link as ReactLink } from "react-router-dom"

import { FiBookmark } from "react-icons/fi"

import { Heading, Text } from "@chakra-ui/react"

import { HStack, Box } from "@chakra-ui/react"

function formURL(ipfscid, path, sectionNum, unitNum) {
    //'/course/' + '/content/?path=' + '&i=' + '&j=' + ;
    return `/course/${ipfscid}/content?path=${path}&i=${sectionNum}&j=${unitNum}`;
}

export function ToolbarBookmark({ bookmarks }) {
    return (
        <List spacing={3}>
            {bookmarks?.map((bookmark) => {
                return (
                    <ListItem>
                        <Link as={ReactLink} to={formURL(bookmark.ipfscid, bookmark.path, bookmark.sectionNum, bookmark.unitNum)}>
                            <HStack>
                                <ListIcon as={FiBookmark} color='green.500' />
                                <Box>
                                    <Heading as='h2' size='md'>
                                        {bookmark.unitTitle}
                                    </Heading>
                                    <Text>
                                        In: <Text as='i' color='gray.500' isTruncated>
                                            {bookmark.courseTitle}
                                        </Text>
                                    </Text>
                                </Box>
                            </HStack>
                        </Link>
                    </ListItem>
                );
            })}                            
        </List>
    )
}
