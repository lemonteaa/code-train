import { db } from "../integrations/db"
import { DateTime, Interval } from "luxon";
import { useEffect } from "react";

import { useLiveQuery } from "dexie-react-hooks"

import { formURL } from "./bookmarks"

import {
    List,
    ListItem,
    ListIcon,
    OrderedList,
    UnorderedList,
} from '@chakra-ui/react'

import { Link } from "@chakra-ui/react"
import { Link as ReactLink } from "react-router-dom"

import { Heading, Text } from "@chakra-ui/react"

import { HStack, Box } from "@chakra-ui/react"

async function getDailyGoals() {
    const nowDT = DateTime.now();
    //Note the reverse: `...where("startDT").belowOrEqual(nowDT.toJSDate())` will be inefficient
    const res = await db.dailygoals.where("endDT").above(nowDT.toJSDate()).and((candidate) => {
        return true; //TODO
    }).toArray();
    if (!res || res.length == 0) {
        return { found: false };
    } else {
        return { found: true, goal: res[0] };
    }
}

async function generateDialGoalItems(timeLimit) {
    //TODO: what about unenrolled course?
    var sumTime = 0;
    const items = await db.learningunit.orderBy('[sectionNum+unitNum]').filter((unit) => {
        return !unit.completed;
    }).until((unit) => {
        sumTime += parseInt(unit.timeest, 10); //TODO: fix schema so we don't need this
        return sumTime >= timeLimit;
    }).toArray();
    return items;
}

async function generateDailyGoal(timeLimit) {
    //TODO
    const maxGoal = await db.dailygoals.orderBy('endDT').reverse().limit(1).toArray();
    console.log(maxGoal);
    if (!maxGoal || maxGoal.length == 0) {
        //Generate the first daily goal
        const nowDT = DateTime.now().set({ millisecond: 0 });
        const nextDT = nowDT.plus({ days: 1 });

        const items = await generateDialGoalItems(timeLimit);
        console.log(items);

        await db.dailygoals.add({
            startDT: nowDT.toJSDate(),
            endDT: nextDT.toJSDate(),
            items: items
        });
        return items;
    } else {
        const nowDT = DateTime.now().set({ millisecond: 0 });
        var myduration = Interval.fromDateTimes(maxGoal[0].endDT, nowDT).toDuration(['hours', 'minutes', 'seconds']).toObject();
        myduration.hours = myduration.hours % 24;
        const startDT = nowDT.minus(myduration);
        const endDT = startDT.plus({ days: 1 });

        const items = await generateDialGoalItems(timeLimit);

        await db.dailygoals.add({
            startDT: startDT.toJSDate(),
            endDT: endDT.toJSDate(),
            items: items
        });
        return items;
    }
}

async function hydrateLearningUnits(units) {
    var newUnits = [];
    for (const unit of units) {
        const course = await db.courses.get(unit.ipfscid);
        newUnits.push({...unit,
            courseTitle: course.title
        })
    }
    return newUnits;
}

export function DailyGoal() {
    const dailyGoalItems = useLiveQuery(async () => {
        const res = await getDailyGoals();
        console.log(res);
        if (!res.found) {
            const newGoal = await generateDailyGoal(60);
            return await hydrateLearningUnits(newGoal);
        } else {
            return await hydrateLearningUnits(res.goal.items);
        }
    });

    useEffect(async () => {
        console.log(dailyGoalItems);
    });

    return (
        <Box bg="gray.300" w="400px" borderRadius="md" boxShadow="md" p="6">
            <List spacing={3}>
                {dailyGoalItems.map((item) => {
                    return (
                        <ListItem>
                            <Link as={ReactLink} to={formURL(item.ipfscid, item.path, item.sectionNum, item.unitNum)}>
                                <Box>
                                    <Heading as='h2' size='md'>
                                        {item.title}
                                    </Heading>
                                    <Text>
                                        In: <Text as='i' color='gray.500' isTruncated>
                                            {item.courseTitle}
                                        </Text>
                                    </Text>
                                </Box>
                            </Link>
                        </ListItem>
                    )
                })}
            </List>
        </Box>
    )
}