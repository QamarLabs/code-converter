import React from "react";
import { Text } from "@chakra-ui/react";
// import "./styles.css";
// //
interface HeaderTextProps {
    title: string;
}
export const HeaderText = ({title}: HeaderTextProps) => {
  return (
    <Text height='5rem' fontSize="4rem" bgGradient='linear-gradient(to right, #00c6ff, #0072ff)' backgroundClip='text' fontWeight='900'>
        <TypedText text={title} />
    </Text>
  );
};

interface TypedTextProps {
    text: string;
}
export const TypedText = ({ text }: TypedTextProps) => {
  const [typed, setTyped] = React.useState("");
  const [currentIndex, setCurrentIndex] = React.useState(0);

  React.useEffect(() => {
    const intervalId = setInterval(() => {
      if (currentIndex < text.length) {
        setTyped(typed + text[currentIndex]);
        setCurrentIndex(currentIndex + 1);
      }
    }, 100);
    if(currentIndex === text.length) {
        setTimeout(() => {
            setTyped("");
            setCurrentIndex(0);
        }, 5000)
    }

    return () => {        
        clearInterval(intervalId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
}, [currentIndex, text]);

  return <span>{typed}</span>;
};

