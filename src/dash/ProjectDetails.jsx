import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Flex,
  Heading,
  Text,
  SimpleGrid,
  Image,
  FormControl,
  FormLabel,
  Input,
  useColorMode,
  IconButton,
  VStack,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  useDisclosure
} from "@chakra-ui/react";
import { ArrowBackIcon, DownloadIcon } from "@chakra-ui/icons"; // Chakra default icons
import API from "../api/api";
import Loader from "../Loader";
import { useDarkMode } from "../DarkModeContext";

const FileCard = ({ label, src, onPreview }) => {
  const { colorMode } = useColorMode();
  
  const handleDownload = async (e) => {
    e.stopPropagation(); // Prevent opening preview when downloading
    if (!src) return;
    try {
      const response = await fetch(src);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      // Extract filename from URL or default to label
      const filename = src.split("/").pop() || `${label}.jpg`;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      // console.error("Download failed", error);
    }
  };

  if (!src) return null;

  return (
    <Box
      borderWidth="1px"
      borderRadius="xl"
      overflow="hidden"
      bg={colorMode === "dark" ? "gray.700" : "white"}
      borderColor={colorMode === "dark" ? "gray.600" : "gray.200"}
      position="relative"
      group
      onClick={() => onPreview(src)} // Open preview on click
      cursor="pointer"
      _hover={{ transform: "scale(1.02)", shadow: "md" }}
      transition="all 0.2s"
    >
      <Image
        src={src}
        alt={label}
        h="48"
        w="full"
        objectFit="cover"
      />
      
      {/* Label and Download Bar */}
      <Flex
        p={2}
        align="center"
        justify="space-between"
        bg={colorMode === "dark" ? "gray.800" : "gray.50"}
        borderTopWidth="1px"
        borderColor={colorMode === "dark" ? "gray.600" : "gray.200"}
      >
        <Text fontSize="sm" fontWeight="medium" isTruncated>
          {label}
        </Text>
        <IconButton
          aria-label="Download"
          icon={<DownloadIcon />}
          size="sm"
          colorScheme="blue"
          variant="ghost"
          onClick={handleDownload}
        />
      </Flex>
    </Box>
  );
};

const ReadOnlyInput = ({ label, value }) => {
   const { colorMode } = useColorMode();
   return (
    <FormControl>
        <FormLabel fontSize="sm" color="gray.500" mb={1}>{label}</FormLabel>
        <Box 
            p={2} 
            borderWidth="1px" 
            borderRadius="md" 
            bg={colorMode === "dark" ? "gray.700" : "gray.50"}
            borderColor={colorMode === "dark" ? "gray.600" : "gray.200"}
        >
            <Text fontSize="md" fontWeight="medium">{value || "-"}</Text>
        </Box>
    </FormControl>
   )
}

export default function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Image Preview State
  const [previewImage, setPreviewImage] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  const handlePreview = (src) => {
    setPreviewImage(src);
    onOpen();
  };

  // Sync Dark Mode
  const { darkMode } = useDarkMode();
  const { colorMode, setColorMode } = useColorMode();
  
  useEffect(() => {
    if (darkMode && colorMode === 'light') setColorMode('dark');
    else if (!darkMode && colorMode === 'dark') setColorMode('light');
  }, [darkMode, colorMode, setColorMode]);

  useEffect(() => {
    const fetchProject = async () => {
        try {
            setLoading(true);
             const res = await API.get(import.meta.env.VITE_BASE_URL + "/project/get");
             const found = res.data.data.find(p => p._id === id);
             setProject(found);

        } catch (error) {
            // console.error("Failed to fetch project", error);
        } finally {
            setLoading(false);
        }
    };
    if (id) fetchProject();
  }, [id]);

  if (loading) return <Flex justify="center" align="center" h="50vh"><Loader size={40}/></Flex>;
  if (!project) return <Flex justify="center" mt={10}><Text>Project not found</Text></Flex>;

  return (
    <Box 
        p={6} 
        maxW="1400px" 
        mx="auto" 
        minH="90vh"
    >
      {/* Header */}
      <Flex mb={6} align="center" gap={4}>
        <IconButton
          icon={<ArrowBackIcon boxSize={6}/>}
          onClick={() => navigate(-1)}
          variant="ghost"
          aria-label="Back"
        />
        <Heading size="lg">Project Details</Heading>
      </Flex>

      {/* Main Content */}
      <VStack spacing={8} align="stretch">
        
        {/* Basic Info Section */}
        <Box 
            p={6} 
            borderWidth="1px" 
            borderRadius="xl" 
            bg={colorMode === "dark" ? "gray.800" : "white"}
        >
            <Heading size="md" mb={6}>Basic Information</Heading>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                 <ReadOnlyInput label="Name" value={project.name} />
                 <ReadOnlyInput label="Company" value={project.company} />
                 <ReadOnlyInput label="Email" value={project.email} />
                 <ReadOnlyInput label="Phone" value={project.phone} />
                 <ReadOnlyInput label="City" value={project.city} />
                 <ReadOnlyInput label="Project Type" value={project.projectType} />
                 <ReadOnlyInput label="Loan Requirement" value={project.loanRequirement} />
                 <ReadOnlyInput label="Message" value={project.message} />
                 <ReadOnlyInput label="Created At" value={new Date(project.createdAt).toLocaleDateString()} />
            </SimpleGrid>
        </Box>

        {/* Documents Section */}
        <Box 
            p={6} 
            borderWidth="1px" 
            borderRadius="xl" 
            bg={colorMode === "dark" ? "gray.800" : "white"}
        >
            <Heading size="md" mb={6}>Documents</Heading>
            <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={6}>
                <FileCard label="Photo" src={project.photo} onPreview={handlePreview} />
                <FileCard label="Aadhar" src={project.adhar} onPreview={handlePreview} />
                <FileCard label="PAN" src={project.pan} onPreview={handlePreview} />
                <FileCard label="DPR" src={project.dpr} onPreview={handlePreview} />
                <FileCard label="Project Report" src={project.projectReport} onPreview={handlePreview} />
                <FileCard label="Company Profile" src={project.companyProfile} onPreview={handlePreview} />
                <FileCard label="ITR" src={project.itr} onPreview={handlePreview} />
                <FileCard label="Bank Statement" src={project.bankStatement} onPreview={handlePreview} />
                <FileCard label="GSTR" src={project.gstr} onPreview={handlePreview} />
                <FileCard label="Business Proof" src={project.businessProof} onPreview={handlePreview} />
                <FileCard label="Electricity Bill" src={project.electricityBill} onPreview={handlePreview} />
                <FileCard label="Load Statement" src={project.loadStatement} onPreview={handlePreview} />
                <FileCard label="Property Paper" src={project.propertyPaper} onPreview={handlePreview} />
            </SimpleGrid>
        </Box>

      </VStack>

      {/* Image Preview Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
        <ModalOverlay bg="blackAlpha.800" />
        <ModalContent bg="transparent" boxShadow="none" maxW="90vw" maxH="90vh">
          <ModalCloseButton color="white" size="lg" zIndex={10} bg="blackAlpha.400" rounded="full" />
          <ModalBody p={0} display="flex" justifyContent="center" alignItems="center">
            {previewImage && (
              <Image 
                src={previewImage} 
                maxH="85vh" 
                maxW="90vw" 
                objectFit="contain" 
                borderRadius="md"
                boxShadow="xl"
              />
            )}
          </ModalBody>
        </ModalContent>
      </Modal>

    </Box>
  );
}
