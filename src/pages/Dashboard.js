import { Box } from "@chakra-ui/react"

import { db } from "../integrations/db";
import { useLiveQuery } from "dexie-react-hooks";
import { useEffect } from "react";

import { DailyGoalProgress } from "../components/gamify";
import { InspirationalQuotes } from "../components/inspirational";

export default function Dashboard(props) {
    const bookmarks = useLiveQuery( async () => {
        const res = await db.bookmarks.where('id').aboveOrEqual(0).with({ unit: 'unitId' });
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
            return (<Box>{bookmark.unit.title}</Box>);
        })}</Box>
        </>
    )
}