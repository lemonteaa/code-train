import { Box, Text, Button } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useSearchParams, useParams } from 'react-router-dom';

import { readFromIPFS } from '../utils/ipfs';


import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dark } from "react-syntax-highlighter/dist/esm/styles/prism";

import "katex/dist/katex.min.css"; // `rehype-katex` does not import the CSS for you

import { db } from "./CourseDetails";

export default function CourseViewer() {
    let params = useParams();
    let [searchParams, setSearchParams] = useSearchParams();

    const [reader, setReader] = useState("Loading...");

    useEffect( () => {
        const fn = async () => {
            console.log(params.ipfscid);
            let rawContent = await readFromIPFS("/ipfs/" + params.ipfscid + searchParams.get("path"));
            console.log(rawContent);

            setReader(rawContent);
        };
        fn();
    }, [params.ipfscid]);

    const markComplete = async () => {
        let i = parseInt(searchParams.get("i"));
        let j = parseInt(searchParams.get("j"));
        console.log(i*100 + j);

        await db["learning_unit"].update(i * 100 + j, { completed: true });
    };

    const toggleBookmark = async () => {
        let i = parseInt(searchParams.get("i"));
        let j = parseInt(searchParams.get("j"));
        console.log(i*100 + j);

        await db.transaction('rw', db.bookmarks, async () => {
            const existing = await db.bookmarks.get({ unitId: i * 100 + j});
            if (existing) {
                await db.bookmarks.delete(existing.id);
            } else {
                await db.bookmarks.add({ unitId: i * 100 + j });
            }
        })
    }

    return (
        <Box>
            <Button onClick={markComplete}>Mark Completed</Button>
            <Button onClick={toggleBookmark}>BookMark</Button>
        <Text>
            <ReactMarkdown
                remarkPlugins={[remarkMath, remarkGfm]}
                rehypePlugins={[rehypeKatex]}
                children={reader}
                components={{
                code({ node, inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || "");
                    return !inline && match ? (
                    <SyntaxHighlighter children={String(children).replace(/\n$/, "")} style={dark} language={match[1]} PreTag="div" {...props} />
                    ) : (
                    <code className={className} {...props}>
                        {children}
                    </code>
                    );
                }
                }}
            />
        </Text>
        </Box>
    )
}