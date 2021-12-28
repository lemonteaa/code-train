import { Box } from "@chakra-ui/layout";

import { useParams } from "react-router-dom";

import { create } from "ipfs-http-client";

import { useEffect, useState } from 'react';

import { Heading, Text } from '@chakra-ui/react';

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

    return (
        <Box>
            <Box>Testing {params.ipfscid}</Box>
            <Heading size='xl'>{courseInfo["course_title"]}</Heading>
            <Heading as='h4'>Course Description:</Heading>
            <Text>{courseInfo["course_desc"]}</Text>
            <Heading as='h4'>Learning Outcome:</Heading>
            <Text>{courseInfo["course_obj"]}</Text>
        </Box>
    );
}
