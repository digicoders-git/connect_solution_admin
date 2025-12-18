import React, { useEffect, useState } from "react";
import { useDarkMode } from "../DarkModeContext.jsx";
import API from "../api/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Loader from "../Loader";
import {
  Box,
  Flex,
  Heading,
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Avatar,
  Card,
  CardBody,
  useColorMode,
  InputGroup,
  InputRightElement,
  IconButton,
  Text,
  Image
} from "@chakra-ui/react";
import { ArrowBackIcon, ViewIcon, ViewOffIcon } from "@chakra-ui/icons";

export default function EditProfile() {
  const { darkMode } = useDarkMode();
  const { colorMode, setColorMode } = useColorMode();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [adminId, setAdminId] = useState(null);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState("");

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
        const adminData = res.data.data[0];
        setAdminId(adminData._id);
        setFormData({
          name: adminData.name || "",
          email: adminData.email || "",
          password: "",
          confirmPassword: ""
        });
        setPhotoPreview(adminData.profilePhoto || "");
      } catch (error) {
        // console.error("Failed to fetch admin data", error);
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchAdmin();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error("Image size should be less than 5MB");
        return;
      }
      setProfilePhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.email) {
      toast.error("Name and Email are required");
      return;
    }

    if (formData.password && formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (formData.password && formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      setSubmitting(true);
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("email", formData.email);
      if (formData.password) formDataToSend.append("password", formData.password);
      if (profilePhoto) formDataToSend.append("profilePhoto", profilePhoto);

      // Call the PUT endpoint with admin ID
      await API.put(`${import.meta.env.VITE_BASE_URL}/admin/update/${adminId}`, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      toast.success("Profile updated successfully");
      navigate("/profile");
    } catch (error) {
      // console.error("Failed to update profile", error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Flex justify="center" align="center" minH="60vh">
        <Loader size={44} />
      </Flex>
    );
  }

  return (
    <Box maxW="800px" mx="auto">
      <Flex mb={6} align="center" gap={3}>
        <IconButton
          icon={<ArrowBackIcon />}
          onClick={() => navigate("/profile")}
          variant="ghost"
          aria-label="Go back"
        />
        <Heading as="h1" size="lg">Edit Profile</Heading>
      </Flex>

      <Card>
        <CardBody>
          <form onSubmit={handleSubmit}>
            <Stack spacing={6}>
              {/* Profile Photo */}
              <FormControl>
                <FormLabel>Profile Photo</FormLabel>
                <Flex direction="column" align="center" gap={4}>
                  <Avatar
                    size="2xl"
                    src={photoPreview}
                    name={formData.name}
                  />
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    display="none"
                    id="photo-upload"
                  />
                  <Button
                    as="label"
                    htmlFor="photo-upload"
                    colorScheme="blue"
                    variant="outline"
                    size="sm"
                    cursor="pointer"
                  >
                    Change Photo
                  </Button>
                </Flex>
              </FormControl>

              {/* Name */}
              <FormControl isRequired>
                <FormLabel>Full Name</FormLabel>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                />
              </FormControl>

              {/* Email */}
              <FormControl isRequired>
                <FormLabel>Email Address</FormLabel>
                <Input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                />
              </FormControl>



              {/* Password */}
              <FormControl>
                <FormLabel>New Password (Leave blank to keep current)</FormLabel>
                <InputGroup>
                  <Input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter new password"
                  />
                  <InputRightElement>
                    <IconButton
                      size="sm"
                      icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                      onClick={() => setShowPassword(!showPassword)}
                      variant="ghost"
                      aria-label="Toggle password visibility"
                    />
                  </InputRightElement>
                </InputGroup>
              </FormControl>

              {/* Confirm Password */}
              {formData.password && (
                <FormControl isRequired>
                  <FormLabel>Confirm New Password</FormLabel>
                  <Input
                    name="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirm new password"
                  />
                </FormControl>
              )}

              {/* Action Buttons */}
              <Flex gap={3} justify="flex-end">
                <Button
                  variant="outline"
                  onClick={() => navigate("/profile")}
                  isDisabled={submitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  colorScheme="blue"
                  isLoading={submitting}
                  loadingText="Saving..."
                >
                  Save Changes
                </Button>
              </Flex>
            </Stack>
          </form>
        </CardBody>
      </Card>
    </Box>
  );
}
