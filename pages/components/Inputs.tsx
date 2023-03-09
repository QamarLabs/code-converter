import { ChangeEvent, useEffect, useRef, useState } from "react";
import { Prism as ReactSyntaxHighlighter } from "react-syntax-highlighter";
import { IconButton, Text, useClipboard } from "@chakra-ui/react";
import { MdCheck, MdContentCopy } from "react-icons/md";

interface CodeOutputProps {
  fromLanguage: string;
  toLanguage: string;
  code: string;
  convertedCode: string;
}
const CodeOutputTitle = (props: React.PropsWithChildren<any>) => (
  <Text fontSize="0.75rem" fontFamily="mono">
    {props.children}
  </Text>
);
export function CodeOutput(props: CodeOutputProps) {
  const { fromLanguage, toLanguage, code, convertedCode } = props;
  const { hasCopied: originalHasCopied, onCopy: originalCodeCopy } =
    useClipboard(code);
  const { hasCopied: convertedHasCopied, onCopy: convertedCodeCopy } =
    useClipboard(convertedCode);
  const [style, setStyle] = useState({});

  useEffect(() => {
    import(
      "react-syntax-highlighter/dist/esm/styles/prism/material-light"
    ).then((mod) => setStyle(mod.default));
  });
  return (
    <div style={{ position: "relative" }}>
      <IconButton
        aria-label="Copy Original text"
        icon={originalHasCopied ? <MdCheck color="green" /> : <MdContentCopy />}
        onClick={originalCodeCopy}
        variant="ghost"
        size="sm"
        position="absolute"
        top="33"
        right="1"
        zIndex="100"
      />
      <IconButton
        aria-label="Copy Converted text"
        icon={
          convertedHasCopied ? <MdCheck color="green" /> : <MdContentCopy />
        }
        onClick={convertedCodeCopy}
        variant="ghost"
        size="sm"
        position="absolute"
        bottom="25"
        right="1"
        zIndex="100"
      />
      <CodeOutputTitle>Original Code</CodeOutputTitle>
      <ReactSyntaxHighlighter
        showLineNumbers={true}
        language={fromLanguage}
        style={style}
        lineNumberStyle={{ minWidth: "unset", width: "1.25em" }}
      >
        {code}
      </ReactSyntaxHighlighter>
      <CodeOutputTitle>Converted Code</CodeOutputTitle>
      <ReactSyntaxHighlighter
        showLineNumbers={true}
        language={toLanguage}
        style={style}
        lineNumberStyle={{ minWidth: "unset", width: "1.25em" }}
      >
        {convertedCode}
      </ReactSyntaxHighlighter>
    </div>
  );
}
