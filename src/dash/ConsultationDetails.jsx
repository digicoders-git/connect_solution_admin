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

export default function ConsultationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { darkMode } = useDarkMode();
  const { colorMode, setColorMode } = useColorMode();

  useEffect(() => {
    if (darkMode && colorMode === "light") setColorMode("dark");
    else if (!darkMode && colorMode === "dark") setColorMode("light");
  }, [darkMode, colorMode, setColorMode]);

  const [loading, setLoading] = useState(true);
  const [consultation, setConsultation] = useState(null);

  useEffect(() => {
    const fetchConsultation = async () => {
      try {
        const res = await API.get(`${import.meta.env.VITE_BASE_URL}/consultation/get`);
        const foundConsultation = res.data.data.find(c => c._id === id);
        if (foundConsultation) {
          setConsultation(foundConsultation);
        } else {
          toast.error("Consultation not found");
          navigate("/consultations");
        }
      } catch (error) {
        toast.error("Failed to fetch consultation details");
        navigate("/consultations");
      } finally {
        setLoading(false);
      }
    };

    fetchConsultation();
  }, [id, navigate]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" py={16}>
        <Loader size={44} />
      </Box>
    );
  }

  if (!consultation) {
    return (
      <Box textAlign="center" py={16}>
        <Text>Consultation not found</Text>
      </Box>
    );
  }

  return (
    <Box maxW="800px" mx="auto" p={6}>
      <HStack justify="space-between" mb={6}>
        <Heading>Consultation Details</Heading>
        <Button
          colorScheme="blue"
          onClick={() => navigate(`/edit-consultation/${consultation._id}`)}
        >
          Edit Consultation
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
              {consultation.name}
            </Text>
          </Box>

          <Box>
            <Text fontSize="sm" color="gray.500" mb={1}>
              Email
            </Text>
            <Text fontSize="lg">{consultation.email}</Text>
          </Box>

          <Box>
            <Text fontSize="sm" color="gray.500" mb={1}>
              Phone
            </Text>
            <Text fontSize="lg">{consultation.phone}</Text>
          </Box>



          <Box>
            <Text fontSize="sm" color="gray.500" mb={1}>
              Message
            </Text>
            <Text fontSize="md" whiteSpace="pre-wrap">
              {consultation.message}
            </Text>
          </Box>

          <Box>
            <Text fontSize="sm" color="gray.500" mb={1}>
              Submitted On
            </Text>
            <Badge colorScheme="blue">
              {new Date(consultation.createdAt).toLocaleString("en-IN")}
            </Badge>
          </Box>

          <Box>
            <Text fontSize="sm" color="gray.500" mb={1}>
              Last Updated
            </Text>
            <Badge colorScheme="green">
              {new Date(consultation.updatedAt).toLocaleString("en-IN")}
            </Badge>
          </Box>
        </VStack>

        <HStack mt={6} spacing={4}>
          <Button
            colorScheme="blue"
            onClick={() => navigate(`/edit-consultation/${consultation._id}`)}
          >
            Edit
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/consultations")}
          >
            Back to Consultations
          </Button>
        </HStack>
      </Box>
    </Box>
  );
}