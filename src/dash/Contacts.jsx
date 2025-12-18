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
  Stack,
} from "@chakra-ui/react";
import {
  RepeatIcon,
  DeleteIcon,
  ViewIcon,
  EditIcon,
} from "@chakra-ui/icons";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

export default function Contacts() {
  const { darkMode } = useDarkMode();
  const { colorMode, setColorMode } = useColorMode();
  const navigate = useNavigate();

  useEffect(() => {
    if (darkMode && colorMode === "light") setColorMode("dark");
    else if (!darkMode && colorMode === "dark") setColorMode("light");
  }, [darkMode, colorMode, setColorMode]);

  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const getContacts = async () => {
    try {
      setLoading(true);
      const res = await API.get(import.meta.env.VITE_BASE_URL + "/contact/get");
      setContacts(Array.isArray(res.data.data) ? res.data.data : []);
    } catch {
      toast.error("Failed to fetch contacts");
      setContacts([]);
    } finally {
      setLoading(false);
    }
  };

  const deleteContact = async (id) => {
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
        await API.delete(`${import.meta.env.VITE_BASE_URL}/contact/delete/${id}`);
        Swal.fire({
          title: "Deleted!",
          text: "Contact has been deleted.",
          icon: "success",
        });
        getContacts();
      } catch (error) {
        Swal.fire({
          title: "Error!",
          text: "Failed to delete contact.",
          icon: "error",
        });
      } finally {
        setDeleting(null);
      }
    }
  };

  useEffect(() => {
    getContacts();
  }, []);

  const handleRefresh = () => {
    getContacts();
    toast.info("Refreshed contacts list");
  };



  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = contacts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(contacts.length / itemsPerPage);

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
          Contacts
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
                <Th>Message</Th>
                <Th>Created</Th>
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
              {currentItems.map((contact, index) => (
                <Tr key={contact._id}>
                  <Td>{(currentPage - 1) * itemsPerPage + index + 1}</Td>
                  <Td fontWeight="medium">{contact.name}</Td>
                  <Td>{contact.email}</Td>
                  <Td>{contact.mobile}</Td>
                  <Td>
                    <Text noOfLines={2} maxW="200px">
                      {contact.message}
                    </Text>
                  </Td>
                  <Td>{new Date(contact.createdAt).toLocaleDateString("en-IN")}</Td>
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
                        onClick={() => navigate(`/contact-details/${contact._id}`)}
                        aria-label="View"
                      />
                      <IconButton
                        icon={<EditIcon />}
                        colorScheme="green"
                        size="sm"
                        isRound
                        onClick={() => navigate(`/edit-contact/${contact._id}`)}
                        aria-label="Edit"
                      />
                      <IconButton
                        icon={<DeleteIcon />}
                        colorScheme="red"
                        size="sm"
                        isRound
                        isLoading={deleting === contact._id}
                        onClick={() => deleteContact(contact._id)}
                        aria-label="Delete"
                      />
                    </HStack>
                  </Td>
                </Tr>
              ))}
              {currentItems.length === 0 && (
                <Tr>
                  <Td colSpan={7} textAlign="center" py={4}>
                    No contacts found
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
