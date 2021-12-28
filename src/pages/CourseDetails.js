import { Box, Container } from "@chakra-ui/layout";

import { useParams } from "react-router-dom";

import { create } from "ipfs-http-client";

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
  } from '@chakra-ui/react'

const readFromIPFS = async (path) => {
    const client = create({
        host: "ipfs.infura.io",
        port: 5001,
        protocol: "https"
    });

    const res = [];
    const data = await client.cat(path);
    for await (let byte of data) {
        const thisRound = Array.from(byte)
        .map((x) => {
            return String.fromCharCode(x);
        })
        .join("");
        res.push(thisRound);
    }
    return res.join("");
    //console.log(String.fromCharCode(72));
}

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
            {courseInfo["table_of_content"].map((section) => {
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
                                        <Step label={unit.title} icon={displayIcon(unit.types)}></Step>
                                    )
                                })}
                            </Steps>
                        </AccordionPanel>
                    </AccordionItem>
                    )
            })}
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