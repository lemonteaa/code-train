import { useEffect, useState } from "react";

import { Text, Box } from "@chakra-ui/react";

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

export function InspirationalQuotes() {
    const drawRandom = (a) => {
        return a[getRandomInt(a.length)];
    }

    const fillUnknownAuthor = (entry) => {
        if (!(entry.author)) {
            entry.author = "Unknown";
        }
        return entry
    }

    const [quote, setQuote] = useState();
    const [isLoaded, setLoaded] = useState(false);

    useEffect(async () => {
        const q = localStorage.getItem('inspire_quotes');
        if (q === null) {
            const newq = await fetch('https://type.fit/api/quotes');
            const cachedResJSON = await newq.json();

            console.log(cachedResJSON);

            localStorage.setItem('inspire_quotes', JSON.stringify(cachedResJSON));

            setQuote(fillUnknownAuthor(drawRandom(cachedResJSON)));
        } else {
            setQuote(fillUnknownAuthor(drawRandom(JSON.parse(q))));
        }

        setLoaded(true);
    }, [isLoaded]);

    return (
        <Box>
            <Text>{quote?.text}</Text>
            <Text>{quote?.author}</Text>
        </Box>
    )
}