import { Box } from "@chakra-ui/react"

import { db } from "../integrations/db";
import { useLiveQuery } from "dexie-react-hooks";
import { useEffect } from "react";

import { DailyGoalProgress } from "../components/gamify";
import { InspirationalQuotes } from "../components/inspirational";

export default function Dashboard(props) {
    
    //.where('id').aboveOrEqual(0).
    const bookmarks = useLiveQuery( async () => {
        const res = await db.bookmarks.toArray();
        for (const r of res) {
            const course = await db.courses.get(r.ipfscid);
            const unit = await db.learningunit.get({ ipfscid: r.ipfscid, sectionNum: r.sectionNum, unitNum: r.unitNum });

            r.courseTitle = course.title;
            r.unitTitle = unit.title;
            r.path = unit.url;
        }
        console.log(res);
        return res;
    });

    useEffect(() => {
        console.log(bookmarks);
    }, [bookmarks]);

    return (
        <>
        <DailyGoalProgress/>
        <InspirationalQuotes />
        <Box>Hi {bookmarks?.map((bookmark) => {
            return (<Box>{bookmark.courseTitle}, {bookmark.unitTitle}, {bookmark.path}</Box>);
        })}</Box>
        </>
    )
}