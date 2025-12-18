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
  Heading,
  VStack,
  useColorMode,
} from "@chakra-ui/react";
import { useDarkMode } from "../DarkModeContext.jsx";
import Loader from "../Loader";

export default function EditJobApplication() {
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
    mobile: "",
    positionAppliedFor: "",
    experience: "",
    currentLocation: "",
  });

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const res = await API.get(`${import.meta.env.VITE_BASE_URL}/career/get`);
        const application = res.data.data.find(app => app._id === id);
        if (application) {
          setFormData({
            name: application.name,
            email: application.email,
            mobile: application.mobile,
            positionAppliedFor: application.positionAppliedFor,
            experience: application.experience,
            currentLocation: application.currentLocation,
          });
        }
      } catch (error) {
        toast.error("Failed to fetch application details");
      } finally {
        setLoading(false);
      }
    };

    fetchApplication();
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
      await API.put(`${import.meta.env.VITE_BASE_URL}/career/update/${id}`, formData);
      toast.success("Application updated successfully");
      navigate("/job-applications");
    } catch (error) {
      toast.error("Failed to update application");
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
      <Heading mb={6}>Edit Job Application</Heading>
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
            <FormLabel>Mobile</FormLabel>
            <Input
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              placeholder="Enter mobile number"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Position Applied For</FormLabel>
            <Input
              name="positionAppliedFor"
              value={formData.positionAppliedFor}
              onChange={handleChange}
              placeholder="Enter position"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Experience</FormLabel>
            <Input
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              placeholder="Enter experience"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Current Location</FormLabel>
            <Input
              name="currentLocation"
              value={formData.currentLocation}
              onChange={handleChange}
              placeholder="Enter current location"
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
              Update Application
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate("/job-applications")}
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