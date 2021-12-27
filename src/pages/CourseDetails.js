import { Box } from "@chakra-ui/layout";

import { useParams } from "react-router-dom";

export default function CourseDetails() {
    let params = useParams();
    return (
        <Box>Testing {params.ipfscid}</Box>
    );
}
