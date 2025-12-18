import React, { useEffect, useState } from "react";
import { useDarkMode } from "../DarkModeContext.jsx";
import API from "../api/api";
import { toast } from "react-toastify";
import Loader from "../Loader";
import {
  Box,
  Flex,
  Heading,
  Text,
  Image,
  Button,
  Stack,
  Avatar,
  Card,
  CardBody,
  useColorMode,
  Divider,
  SimpleGrid,
  Badge
} from "@chakra-ui/react";
import { EditIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const { darkMode } = useDarkMode();
  const { colorMode, setColorMode } = useColorMode();
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sync Dark Mode with Chakra
  useEffect(() => {
    if (darkMode && colorMode === 'light') setColorMode('dark');
    else if (!darkMode && colorMode === 'dark') setColorMode('light');
  }, [darkMode, colorMode, setColorMode]);

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        setLoading(true);
        const res = await API.get(import.meta.env.VITE_BASE_URL + "/admin/get");
        setAdmin(res.data.data[0]);
      } catch (error) {
        // console.error("Failed to fetch admin data", error);
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchAdmin();
  }, []);

  if (loading) {
    return (
      <Flex justify="center" align="center" minH="60vh">
        <Loader size={44} />
      </Flex>
    );
  }

  if (!admin) {
    return (
      <Flex justify="center" align="center" minH="60vh">
        <Text fontSize="lg" color="red.500">Failed to load profile data</Text>
      </Flex>
    );
  }

  return (
    <Box maxW="1200px" mx="auto">
      <Flex mb={6} justify="space-between" align="center">
        <Heading as="h1" size="lg">Profile</Heading>
        <Button leftIcon={<EditIcon />} colorScheme="blue" size="sm" onClick={() => navigate("/edit-profile")}>
          Edit Profile
        </Button>
      </Flex>

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
        {/* Profile Card */}
        <Card>
          <CardBody>
            <Flex direction="column" align="center" textAlign="center">
              <Avatar
                size="2xl"
                src={admin.profilePhoto}
                name={admin.name}
                mb={4}
                border="4px solid"
                borderColor={colorMode === "dark" ? "gray.600" : "gray.200"}
              />
              <Heading size="md" mb={2}>{admin.name}</Heading>
              <Badge colorScheme="green" mb={4}>Admin</Badge>
              <Text color="gray.500" fontSize="sm">{admin.email}</Text>
            </Flex>
          </CardBody>
        </Card>

        {/* Details Card */}
        <Card>
          <CardBody>
            <Heading size="sm" mb={4}>Account Details</Heading>
            <Stack spacing={3}>
              <Box>
                <Text fontSize="xs" color="gray.500" mb={1}>Full Name</Text>
                <Text fontWeight="medium">{admin.name}</Text>
              </Box>
              <Divider />
              <Box>
                <Text fontSize="xs" color="gray.500" mb={1}>Email Address</Text>
                <Text fontWeight="medium">{admin.email}</Text>
              </Box>
              <Divider />
              {/* <Box>
                <Text fontSize="xs" color="gray.500" mb={1}>Phone Number</Text>
                <Text fontWeight="medium">{admin.phone || "Not provided"}</Text>
              </Box> */}
              <Divider />
              <Box>
                <Text fontSize="xs" color="gray.500" mb={1}>Account Created</Text>
                <Text fontWeight="medium">
                  {admin.createdAt 
                    ? new Date(admin.createdAt).toLocaleDateString("en-IN", {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })
                    : "N/A"
                  }
                </Text>
              </Box>
            </Stack>
          </CardBody>
        </Card>
      </SimpleGrid>

      {/* Additional Info Card */}
      <Card mt={6}>
        <CardBody>
          <Heading size="sm" mb={4}>About</Heading>
          <Text color="gray.600">
            Administrator account with full access to all dashboard features.
            Manage projects, view analytics, and configure system settings.
          </Text>
        </CardBody>
      </Card>
    </Box>
  );
}
