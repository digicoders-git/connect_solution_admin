import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import API from "../api/api";
import Loader from "../Loader";
import { useDarkMode } from "../DarkModeContext.jsx";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Button,
  useColorMode,
  Box,
  Heading,
  Text,
  Flex,
  IconButton,
  HStack,
  Image,
} from "@chakra-ui/react";
import {
  RepeatIcon,
  DeleteIcon,
  ViewIcon,
  EditIcon,
} from "@chakra-ui/icons";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

export default function JobApplications() {
  const { darkMode } = useDarkMode();
  const { colorMode, setColorMode } = useColorMode();
  const navigate = useNavigate();

  useEffect(() => {
    if (darkMode && colorMode === "light") setColorMode("dark");
    else if (!darkMode && colorMode === "dark") setColorMode("light");
  }, [darkMode, colorMode, setColorMode]);

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const getApplications = async () => {
    try {
      setLoading(true);
      const res = await API.get(import.meta.env.VITE_BASE_URL + "/career/get");
      setApplications(Array.isArray(res.data.data) ? res.data.data : []);
    } catch {
      toast.error("Failed to fetch job applications");
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  const deleteApplication = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        setDeleting(id);
        await API.delete(`${import.meta.env.VITE_BASE_URL}/career/delete/${id}`);
        Swal.fire({
          title: "Deleted!",
          text: "Application has been deleted.",
          icon: "success",
        });
        getApplications();
      } catch (error) {
        Swal.fire({
          title: "Error!",
          text: "Failed to delete application.",
          icon: "error",
        });
      } finally {
        setDeleting(null);
      }
    }
  };

  useEffect(() => {
    getApplications();
  }, []);

  const handleRefresh = () => {
    getApplications();
    // toast.info("Refreshed job applications list");
  };

  const resumeCell = (resume) =>
  resume?.path ? (
    <Button
      as="a"
      href={resume.path}
      target="_blank"
      rel="noreferrer"
      size="sm"
      colorScheme="blue"
      variant="outline"
    >
      View PDF
    </Button>
  ) : (
    <Text fontSize="xs" color="gray.400" textAlign="center">
      -
    </Text>
  );


  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = applications.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(applications.length / itemsPerPage);

  const handlePrev = () => setCurrentPage((p) => Math.max(1, p - 1));
  const handleNext = () => setCurrentPage((p) => Math.min(totalPages, p + 1));

  if (loading) {
    return (
      <Flex py={16} justify="center">
        <Loader size={44} />
      </Flex>
    );
  }

  return (
    <Box minH="70vh" py={6} px={4} maxW="1400px" mx="auto">
      <Flex mb={6} justify="space-between" align="center" flexWrap="wrap" gap={4}>
        <Heading as="h1" size="lg">
          Job Applications
        </Heading>
        <Button
          leftIcon={<RepeatIcon />}
          onClick={handleRefresh}
          colorScheme="blue"
          variant="outline"
          size="sm"
        >
          Refresh
        </Button>
      </Flex>

      <Box
        borderWidth="1px"
        borderRadius="2xl"
        overflow="hidden"
        bg={colorMode === "dark" ? "gray.800" : "white"}
        borderColor={colorMode === "dark" ? "gray.700" : "gray.100"}
        shadow="sm"
      >
        <TableContainer
          overflowX="auto"
          css={{
            "&::-webkit-scrollbar": {
              display: "none",
            },
            "-ms-overflow-style": "none",
            "scrollbar-width": "none",
          }}
        >
          <Table variant="simple" colorScheme={colorMode === "dark" ? "whiteAlpha" : "gray"}>
            <Thead>
              <Tr>
                <Th>Sr. No.</Th>
                <Th>Name</Th>
                <Th>Email</Th>
                <Th>Mobile</Th>
                <Th>Position</Th>
                <Th>Experience</Th>
                <Th>Location</Th>
                <Th>Resume</Th>
                <Th>Applied</Th>
                <Th
                  position="sticky"
                  right={0}
                  bg={colorMode === "dark" ? "gray.800" : "white"}
                  zIndex="sticky"
                  boxShadow="md"
                >
                  Actions
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {currentItems.map((application, index) => (
                <Tr key={application._id}>
                  <Td>{(currentPage - 1) * itemsPerPage + index + 1}</Td>
                  <Td fontWeight="medium">{application.name}</Td>
                  <Td>{application.email}</Td>
                  <Td>{application.mobile}</Td>
                  <Td>{application.positionAppliedFor}</Td>
                  <Td>{application.experience}</Td>
                  <Td>{application.currentLocation}</Td>
                  <Td>{resumeCell(application.resume)}</Td>
                  <Td>{new Date(application.createdAt).toLocaleDateString("en-IN")}</Td>
                  <Td
                    position="sticky"
                    right={0}
                    bg={colorMode === "dark" ? "gray.800" : "white"}
                    zIndex={1}
                    boxShadow="md"
                  >
                    <HStack spacing={2}>
                      <IconButton
                        icon={<ViewIcon />}
                        colorScheme="blue"
                        size="sm"
                        isRound
                        onClick={() => navigate(`/job-application-details/${application._id}`)}
                        aria-label="View"
                      />
                      <IconButton
                        icon={<EditIcon />}
                        colorScheme="green"
                        size="sm"
                        isRound
                        onClick={() => navigate(`/edit-job-application/${application._id}`)}
                        aria-label="Edit"
                      />
                      <IconButton
                        icon={<DeleteIcon />}
                        colorScheme="red"
                        size="sm"
                        isRound
                        isLoading={deleting === application._id}
                        onClick={() => deleteApplication(application._id)}
                        aria-label="Delete"
                      />
                    </HStack>
                  </Td>
                </Tr>
              ))}
              {currentItems.length === 0 && (
                <Tr>
                  <Td colSpan={10} textAlign="center" py={4}>
                    No job applications found
                  </Td>
                </Tr>
              )}
            </Tbody>
          </Table>
        </TableContainer>

        <Flex
          justify="space-between"
          align="center"
          p={4}
          borderTopWidth="1px"
          borderColor={colorMode === "dark" ? "gray.700" : "gray.100"}
        >
          <Button onClick={handlePrev} isDisabled={currentPage === 1} size="sm">
            Previous
          </Button>
          <Text fontSize="sm">
            Page {currentPage} of {totalPages || 1}
          </Text>
          <Button
            onClick={handleNext}
            isDisabled={currentPage === totalPages || totalPages === 0}
            size="sm"
          >
            Next
          </Button>
        </Flex>
      </Box>
    </Box>
  );
}