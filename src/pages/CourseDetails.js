import { Box, Container } from "@chakra-ui/layout";

import { useParams } from "react-router-dom";

import { readFromIPFS } from "../utils/ipfs";

import { useEffect, useState } from 'react';

import { Heading, Text } from '@chakra-ui/react';

import { Steps, Step } from 'chakra-ui-steps';

import { FaBook } from 'react-icons/fa';
import { ImLab } from 'react-icons/im';
import { BsQuestion } from 'react-icons/bs';

import {
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
} from '@chakra-ui/react';

import { Link } from '@chakra-ui/react';
import { Link as ReactLink } from "react-router-dom";
 



export default function CourseDetails() {
    let params = useParams();

    const [courseInfo, setCourseInfo] = useState({});

    useEffect( () => {
        const fn = async () => {
            console.log(params.ipfscid);
            let rawManifest = await readFromIPFS("/ipfs/" + params.ipfscid + "/manifest.json");
            console.log(rawManifest);
            setCourseInfo(JSON.parse(rawManifest));
        };
        fn();
    }, [params.ipfscid]);

    const displayIcon = (type) => {
        if (type == "reading_material") {
            return FaBook;
        } else if (type == "quiz") {
            return BsQuestion;
        } else if (type == "lab") {
            return ImLab;
        }
    }

    return (
        <Box>
            <Box>Testing {params.ipfscid}</Box>
            <Heading size='xl'>{courseInfo["course_title"]}</Heading>
            <Heading as='h4'>Course Description:</Heading>
            <Text>{courseInfo["course_desc"]}</Text>
            <Heading as='h4'>Learning Outcome:</Heading>
            <Text>{courseInfo["course_obj"]}</Text>
            <Accordion defaultIndex={[0]} allowMultiple>
            {courseInfo["table_of_content"] ? courseInfo["table_of_content"].map((section) => {
                return (
                    <AccordionItem>
                        <h2>
                        <AccordionButton>
                            <Box flex='1' textAlign='left'>
                            {section.title}
                            </Box>
                            <AccordionIcon />
                        </AccordionButton>
                        </h2>
                        <AccordionPanel pb={4}>
                            <Steps orientation="vertical">
                                {section.units.map((unit) => {
                                    return (
                                        <Step label={unit.title} icon={displayIcon(unit.types)}>
                                            <Link as={ReactLink} to={"/course/" + params.ipfscid + "/content?path=" + unit.path}>Hi</Link>
                                        </Step>
                                    )
                                })}
                            </Steps>
                        </AccordionPanel>
                    </AccordionItem>
                    )
            }) : ""}
            </Accordion>
        </Box>
    );
}

/*
            <Container width="100%">
                <Steps activeStep="0" width="100%">
                    <Step width="100%">More test</Step>
                    <Step>Test</Step>
                </Steps>
            </Container>
            
*/