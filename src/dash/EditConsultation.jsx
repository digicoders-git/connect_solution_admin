import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../api/api";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Heading,
  VStack,
  useColorMode,
} from "@chakra-ui/react";
import { useDarkMode } from "../DarkModeContext.jsx";
import Loader from "../Loader";

export default function EditConsultation() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { darkMode } = useDarkMode();
  const { colorMode, setColorMode } = useColorMode();

  useEffect(() => {
    if (darkMode && colorMode === "light") setColorMode("dark");
    else if (!darkMode && colorMode === "dark") setColorMode("light");
  }, [darkMode, colorMode, setColorMode]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  useEffect(() => {
    const fetchConsultation = async () => {
      try {
        const res = await API.get(`${import.meta.env.VITE_BASE_URL}/consultation/get`);
        const consultation = res.data.data.find(c => c._id === id);
        if (consultation) {
          setFormData({
            name: consultation.name,
            email: consultation.email,
            phone: consultation.phone,
            message: consultation.message,
          });
        }
      } catch (error) {
        toast.error("Failed to fetch consultation details");
      } finally {
        setLoading(false);
      }
    };

    fetchConsultation();
  }, [id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await API.put(`${import.meta.env.VITE_BASE_URL}/consultation/update/${id}`, formData);
      toast.success("Consultation updated successfully");
      navigate("/consultations");
    } catch (error) {
      toast.error("Failed to update consultation");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" py={16}>
        <Loader size={44} />
      </Box>
    );
  }

  return (
    <Box maxW="600px" mx="auto" p={6}>
      <Heading mb={6}>Edit Consultation</Heading>
      <Box
        as="form"
        onSubmit={handleSubmit}
        bg={colorMode === "dark" ? "gray.800" : "white"}
        p={6}
        borderRadius="lg"
        shadow="md"
      >
        <VStack spacing={4}>
          <FormControl isRequired>
            <FormLabel>Name</FormLabel>
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter name"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Email</FormLabel>
            <Input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Phone</FormLabel>
            <Input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
            />
          </FormControl>



          <FormControl isRequired>
            <FormLabel>Message</FormLabel>
            <Textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Enter message"
              rows={4}
            />
          </FormControl>

          <Box display="flex" gap={4} w="full">
            <Button
              type="submit"
              colorScheme="blue"
              isLoading={saving}
              loadingText="Saving..."
              flex={1}
            >
              Update Consultation
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate("/consultations")}
              flex={1}
            >
              Cancel
            </Button>
          </Box>
        </VStack>
      </Box>
    </Box>
  );
}