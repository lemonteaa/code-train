import { Box, Container } from "@chakra-ui/layout";
import { Button } from "@chakra-ui/react";

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

import { useNavigate } from "react-router-dom";
 
import { db } from "../integrations/db";
import { useLiveQuery } from "dexie-react-hooks";

export default function CourseDetails() {
    let navigate = useNavigate();

    let params = useParams();

    const [courseInfo, setCourseInfo] = useState({});

    useEffect( () => {
        const fn = async () => {
            console.log(params.ipfscid);
            let rawManifest = await readFromIPFS("/ipfs/" + params.ipfscid + "/manifest.json");
            console.log(rawManifest);
            const courseInfo = JSON.parse(rawManifest);
            console.log(courseInfo);
            setCourseInfo(courseInfo);
        };
        fn();
    }, [params.ipfscid]);

    const isEnrolled = useLiveQuery( async () => {
        const course = await db.courses.get(params.ipfscid);
        console.log(course);
        return course ? course.enrolled : false;
    }, [params.ipfscid])

    // Using partial index support in dexie >= 3.x only
    const unitCompleted = useLiveQuery(async () => {
        return await db.learningunit.where('ipfscid').equals(params.ipfscid).toArray()
    }, [params.ipfscid])

    const displayIcon = (type) => {
        if (type == "reading_material") {
            return FaBook;
        } else if (type == "quiz") {
            return BsQuestion;
        } else if (type == "lab") {
            return ImLab;
        }
    }

    const enroll = async () => {
        await db.courses.put({
            ipfscid: params.ipfscid,
            title: courseInfo["course_title"],
            enrolled: true
        });

        for (const [i, section] of courseInfo["table_of_content"].entries()) {
            console.log(section);
            console.log(i);
            for (const [j, unit] of section.units.entries()) {
                try {
                    // Using add and not put as it could be an re-enroll with pre-existing entries
                    // and we don't want to overwrite previous progress (completed units)
                    await db.learningunit.add({
                        ipfscid: params.ipfscid,
                        sectionNum: i,
                        unitNum: j,
                        title: unit.title,
                        url: unit.path,
                        completed: false,
                        timeest: unit["time_needed"]
                    })
                } catch (err) {
                    console.log(err);
                }
            }
        }

        //[ipfscid, sectionNum, unitNum], [sectionNum, unitNum]' // { title, url, completed }
        /*courseInfo["table_of_content"].forEach(async (section, i) => {
            section.units.forEach( async (unit, j) => {
                try {
                    await db["learning_unit"].add({
                        id: i*100 + j,
                        courseId: params.ipfscid,
                        title: unit.title,
                        url: unit.path,
                        sectionNum: i,
                        unitNum: j,
                        completed: false
                    })
                } catch (err) {
                    //
                }
            })
        })*/
    }
    const unenroll = async () => {
        await db.courses.update(params.ipfscid, {
            enrolled: false
        })
    }

    return (
        <Box>
            <Box>Testing {params.ipfscid}, enrolled? {isEnrolled}</Box>
            {isEnrolled ? 
                <Button onClick={unenroll} color="red" >Unenroll from this course</Button> : 
                <Button onClick={enroll} color="blue" >Enroll in this course</Button> }
            <Heading size='xl'>{courseInfo["course_title"]}</Heading>
            <Heading as='h4'>Course Description:</Heading>
            <Text>{courseInfo["course_desc"]}</Text>
            <Heading as='h4'>Learning Outcome:</Heading>
            <Text>{courseInfo["course_obj"]}</Text>
            <Accordion defaultIndex={[0]} allowMultiple>
            {courseInfo["table_of_content"] ? courseInfo["table_of_content"].map((section, i) => {
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
                            <Steps orientation="vertical" onClickStep={(step) => { navigate( "/course/" + params.ipfscid + "/content?path=" + section.units[step].path + "&i=" + i + "&j=" + step ) }}>
                                {section.units.map((unit, j) => {
                                    return (
                                        <Step label={unit.title} icon={displayIcon(unit.types)} 
                                            isCompletedStep={unitCompleted?.find((u) => { return u.sectionNum == i && u.unitNum == j})?.completed}>
                                            <Link as={ReactLink} to={"/course/" + params.ipfscid + "/content?path=" + unit.path + "&i=" + i + "&j=" + j}>Hi</Link>
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