import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';

// Helper to replace only the text content with typing
const typeTextInNode = (
    node: React.ReactNode,
    typedChars: number,
    counter = { current: 0 }
): React.ReactNode => {
    if (typeof node === 'string') {
        if (counter.current >= typedChars) return '';
        const visible = node.slice(0, typedChars - counter.current);
        counter.current += node.length;
        return visible;
    }

    if (React.isValidElement(node)) {
        const children = (node as any).props.children as React.ReactNode;
        const newChildren = typeTextInNode(children, typedChars, counter);
        return React.cloneElement(node as any, { ...(node as any).props, children: newChildren });
    }

    if (Array.isArray(node)) {
        return node.map((child, idx) => (
            <React.Fragment key={idx}>
                {typeTextInNode(child, typedChars, counter)}
            </React.Fragment>
        ));
    }

    return node;
};

const TypeWriter = ({
    children,
    speed = 1,
    setIsCompleted,
}: {
    children: React.ReactNode;
    speed?: number;
    setIsCompleted?: Dispatch<SetStateAction<boolean>>;
}) => {
    const [typedChars, setTypedChars] = useState(0);
    const fullTextLength = countTextLength(children);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setTypedChars((prev) => prev + 1);
        }, speed);
        return () => clearTimeout(timeout);
    }, [typedChars, fullTextLength, speed]);

    useEffect(() => {
        if (typedChars >= fullTextLength) {
            setIsCompleted?.(true);
        }
    }, [typedChars, fullTextLength, setIsCompleted]);

    const rendered = typeTextInNode(children, typedChars);

    return <>
        {rendered}
    </>;
};

// Helper to count total characters in all text nodes
function countTextLength(node: React.ReactNode): number {
    if (typeof node === 'string') return node.length;

    if (Array.isArray(node)) return node.reduce((acc, child) => acc + countTextLength(child), 0);

    if (React.isValidElement(node)) return countTextLength((node as any).props.children as React.ReactNode);

    return 0;
}

export default TypeWriter;
