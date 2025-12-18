import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../api/api";
import {
  Box,
  Button,
  Heading,
  Text,
  VStack,
  HStack,
  useColorMode,
  Badge,
} from "@chakra-ui/react";
import { useDarkMode } from "../DarkModeContext.jsx";
import Loader from "../Loader";

export default function ContactDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { darkMode } = useDarkMode();
  const { colorMode, setColorMode } = useColorMode();

  useEffect(() => {
    if (darkMode && colorMode === "light") setColorMode("dark");
    else if (!darkMode && colorMode === "dark") setColorMode("light");
  }, [darkMode, colorMode, setColorMode]);

  const [loading, setLoading] = useState(true);
  const [contact, setContact] = useState(null);

  useEffect(() => {
    const fetchContact = async () => {
      try {
        const res = await API.get(`${import.meta.env.VITE_BASE_URL}/contact/get`);
        const foundContact = res.data.data.find(c => c._id === id);
        if (foundContact) {
          setContact(foundContact);
        } else {
          toast.error("Contact not found");
          navigate("/contacts");
        }
      } catch (error) {
        toast.error("Failed to fetch contact details");
        navigate("/contacts");
      } finally {
        setLoading(false);
      }
    };

    fetchContact();
  }, [id, navigate]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" py={16}>
        <Loader size={44} />
      </Box>
    );
  }

  if (!contact) {
    return (
      <Box textAlign="center" py={16}>
        <Text>Contact not found</Text>
      </Box>
    );
  }

  return (
    <Box maxW="800px" mx="auto" p={6}>
      <HStack justify="space-between" mb={6}>
        <Heading>Contact Details</Heading>
        <Button
          colorScheme="blue"
          onClick={() => navigate(`/edit-contact/${contact._id}`)}
        >
          Edit Contact
        </Button>
      </HStack>

      <Box
        bg={colorMode === "dark" ? "gray.800" : "white"}
        p={6}
        borderRadius="lg"
        shadow="md"
      >
        <VStack align="start" spacing={4}>
          <Box>
            <Text fontSize="sm" color="gray.500" mb={1}>
              Name
            </Text>
            <Text fontSize="lg" fontWeight="medium">
              {contact.name}
            </Text>
          </Box>

          <Box>
            <Text fontSize="sm" color="gray.500" mb={1}>
              Email
            </Text>
            <Text fontSize="lg">{contact.email}</Text>
          </Box>

          <Box>
            <Text fontSize="sm" color="gray.500" mb={1}>
              Mobile
            </Text>
            <Text fontSize="lg">{contact.mobile}</Text>
          </Box>

          <Box>
            <Text fontSize="sm" color="gray.500" mb={1}>
              Message
            </Text>
            <Text fontSize="md" whiteSpace="pre-wrap">
              {contact.message}
            </Text>
          </Box>

          <Box>
            <Text fontSize="sm" color="gray.500" mb={1}>
              Created At
            </Text>
            <Badge colorScheme="blue">
              {new Date(contact.createdAt).toLocaleString("en-IN")}
            </Badge>
          </Box>

          <Box>
            <Text fontSize="sm" color="gray.500" mb={1}>
              Last Updated
            </Text>
            <Badge colorScheme="green">
              {new Date(contact.updatedAt).toLocaleString("en-IN")}
            </Badge>
          </Box>
        </VStack>

        <HStack mt={6} spacing={4}>
          <Button
            colorScheme="blue"
            onClick={() => navigate(`/edit-contact/${contact._id}`)}
          >
            Edit
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/contacts")}
          >
            Back to Contacts
          </Button>
        </HStack>
      </Box>
    </Box>
  );
}