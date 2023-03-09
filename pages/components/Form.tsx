import { useFormik } from "formik";
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Text,
  Textarea,
  Select,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  VStack,
  useToast,
  Accordion,
  AccordionIcon,
} from "@chakra-ui/react";
import axios from "axios";
import CodeOutput from "./Inputs";
import { useEffect, useState } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";
import GPT3Tokenizer from "gpt3-tokenizer";

interface LanguageFormValues {
  fromLanguage: string;
  toLanguage: string;
  code: string;
}

function Form() {
  const [fromLgSelectId, setFromLgSelectId] = useState("");
  const [toLgSelectId, setToLgSelectId] = useState("");
  const [origCode, setOrigCode] = useState("");
  const [convertedCode, setConvertedCode] = useState<string>("");
  const [tokenCount, setTokenCount] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  useEffect(() => {
    setTokenCount(currentTokenCount(origCode));
  }, [origCode])

  const toast = useToast();
  const formik = useFormik<LanguageFormValues>({
    initialValues: {
      fromLanguage: "",
      toLanguage: "",
      code: "",
    },
    onSubmit: async (values) => {
      setIsSubmitting(true);
      if(currentTokenCount(values.code) > 500) {
        return toast({
          title: 'Too many tokens in use',
          description: "Code is too long. Please shorten it to 500 tokens or less.",
          status: 'error',
          duration: 8000,
          isClosable: true,
        })
      }
      const { data: openaiResponse } = await axios.post("/api/convert-code", {
        from: values.fromLanguage,
        to: values.toLanguage,
        code: values.code,
      });
      const convertedCodeChoice = openaiResponse.data.choices[0].text;
      setConvertedCode(convertedCodeChoice);
      setIsSubmitting(false);
    },
  });

  const currentTokenCount = (codeValue: string): number => {
    const tokenizer = new GPT3Tokenizer({ type: 'gpt3' }); // or 'codex'
    return tokenizer.encode(codeValue).bpe.length;
}

  return (
    <form onSubmit={formik.handleSubmit} style={{ width: "100%" }}>
      <FormControl id="code" isInvalid={!!formik.errors.code} position='relative'>
        <FormLabel>Code</FormLabel>
        <Textarea
          fontFamily="mono"
          placeholder="Enter code"
          onChange={e => {
            formik.setFieldValue("code", e.target.value);
            setOrigCode(e.target.value);
          }}
          value={formik.values.code}
          userSelect="none"
          textDecoration="none"
          textDecorationColor="transparent"
          position='relative'
          />
          <Text textAlign='right' colorScheme={tokenCount > 500 ? 'red' : 'blackAlpha'}>Tokens In Use: {tokenCount}</Text>
          <FormErrorMessage>{formik.errors.code}</FormErrorMessage>
      </FormControl>
      <FormControl id="fromLanguage" isInvalid={!!formik.errors.fromLanguage}>
        <FormLabel>From</FormLabel>
        <Select
          placeholder="Select language"
          onChange={(event) => {
            if (
              event.currentTarget.options &&
              event.currentTarget.options.length &&
              event.currentTarget.options[
                event.currentTarget.options.selectedIndex
              ]
            ) {
              setFromLgSelectId(
                event.currentTarget.options[
                  event.currentTarget.options.selectedIndex
                ].id
              );
            }
            formik.setFieldValue("fromLanguage", event.target.value);
          }}
          value={formik.values.fromLanguage}
          id={fromLgSelectId}
        >
          <option id="js" value="javascript">
            JavaScript
          </option>
          <option id="ts" value="typescript">
            TypeScript
          </option>
          <option id="php-bg" value="php">
            PHP
          </option>
          <option id="py" value="python">
            Python
          </option>
          <option id="rby" value="ruby">
            Ruby
          </option>
          <option id="go" value="go">
            Go
          </option>
          <option id="jv" value="java">
            Java
          </option>
        </Select>
        <FormErrorMessage>{formik.errors.fromLanguage}</FormErrorMessage>
      </FormControl>

      <FormControl id="toLanguage" isInvalid={!!formik.errors.toLanguage}>
        <FormLabel>To</FormLabel>
        <Select
          placeholder="Select language"
          onChange={(event) => {
            if (
              event.currentTarget.options &&
              event.currentTarget.options.length &&
              event.currentTarget.options[
                event.currentTarget.options.selectedIndex
              ]
            ) {
              setToLgSelectId(
                event.currentTarget.options[
                  event.currentTarget.options.selectedIndex
                ].id
              );
            }
            formik.setFieldValue("toLanguage", event.target.value);
          }}
          value={formik.values.toLanguage}
          id={toLgSelectId}
        >
          <option id="js" value="javascript">
            JavaScript
          </option>
          <option id="ts" value="typescript">
            TypeScript
          </option>
          <option id="php-bg" value="php">
            PHP
          </option>
          <option id="py" value="python">
            Python
          </option>
          <option id="rby" value="ruby">
            Ruby
          </option>
          <option id="go" value="go">
            Go
          </option>
          <option id="jv" value="java">
            Java
          </option>
        </Select>
        <FormErrorMessage>{formik.errors.toLanguage}</FormErrorMessage>
      </FormControl>
      <Button isLoading={isSubmitting} type="submit" mt={4} colorScheme="green" mb={4}>
        Convert
      </Button>
      <Accordion allowToggle={true}>
        <AccordionItem>
          {({ isExpanded }) => (
            <>
              <h2>
                <AccordionButton paddingLeft="0">
                  <Box
                    paddingLeft="0"
                    as="span"
                    flex="1"
                    textAlign="left"
                    fontFamily="mono"
                    fontWeight="900"
                  >
                    Result
                  </Box>
                  {isExpanded ? (
                    <FaMinus fontSize="12px" />
                  ) : (
                    <FaPlus fontSize="12px" />
                  )}
                </AccordionButton>
              </h2>{" "}
              <AccordionPanel>
                <CodeOutput
                  toLanguage={formik.values.toLanguage ?? "Javascript"}
                  fromLanguage={formik.values.fromLanguage ?? "Python"}
                  code={formik.values.code}
                  convertedCode={convertedCode}
                />
              </AccordionPanel>
            </>
          )}
        </AccordionItem>
      </Accordion>
    </form>
  );
}

export default Form;
