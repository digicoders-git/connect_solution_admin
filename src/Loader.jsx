import React from "react";
import { Spinner, Flex } from "@chakra-ui/react";

export default function Loader({ size = 40 }) {
  return (
    <Flex align="center" justify="center" py={10} w="full">
      <Spinner
        thickness="4px"
        speed="0.65s"
        emptyColor="gray.200"
        color="blue.500"
        boxSize={`${size}px`} // Chakra uses boxSize for width/height
      />
    </Flex>
  );
}
