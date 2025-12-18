import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import API from "../api/api";
import Loader from "../Loader";
import { useDarkMode } from "../DarkModeContext.jsx";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import Swal from "sweetalert2";
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
  Image,
  Flex,
  IconButton,
  HStack,
  Stack,
} from "@chakra-ui/react";
import {
  RepeatIcon,
  DownloadIcon,
  ViewIcon,
  DeleteIcon,
} from "@chakra-ui/icons";

export default function Projects() {
  const { darkMode } = useDarkMode();
  const { colorMode, setColorMode } = useColorMode();
  const navigate = useNavigate();

  // Sync Dark Mode with Chakra
  useEffect(() => {
    if (darkMode && colorMode === "light") setColorMode("dark");
    else if (!darkMode && colorMode === "dark") setColorMode("light");
  }, [darkMode, colorMode, setColorMode]);

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const getProjects = async () => {
    try {
      setLoading(true);
      const res = await API.get(import.meta.env.VITE_BASE_URL + "/project/get");
      setProjects(Array.isArray(res.data.data) ? res.data.data : []);
    } catch {
      toast.error("Failed to fetch projects");
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const deleteProject = async (id) => {
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
        await API.delete(
          `${import.meta.env.VITE_BASE_URL}/project/delete/${id}`
        );
        Swal.fire({
          title: "Deleted!",
          text: "Your project has been deleted.",
          icon: "success",
        });
        getProjects();
      } catch (error) {
        Swal.fire({
          title: "Error!",
          text: "Failed to delete project.",
          icon: "error",
        });
      } finally {
        setDeleting(null);
      }
    }
  };

  useEffect(() => {
    getProjects();
  }, []);

  const handleRefresh = () => {
    getProjects();
    toast.info("Refreshed projects list");
  };

  const getBase64FromUrl = async (url) => {
    try {
      const res = await fetch(url + "?not-from-cache-please", {
        mode: "cors", // ensure cors is handled if possible
        cache: "no-cache",
      }).catch(() => fetch(url)); // fallback
      const blob = await res.blob();
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => resolve(reader.result);
      });
    } catch (e) {
      // console.warn("Image load failed", e);
      return null;
    }
  };

  const handleExportPDF = async () => {
    const toastId = toast.info("Generating PDF... please wait", {
      autoClose: false,
    });
    try {
      const doc = new jsPDF("l", "pt"); // Landscape mode
      doc.text("Projects Report", 14, 22);
      doc.setFontSize(8);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 35);

      const tableColumn = [
        "Sr",
        "Name",
        "Company",
        "Email",
        "Phone",
        "City",
        "Type",
        "Loan",
        "Msg",
        "Date",
        "Photo",
        "Adhr",
        "PAN",
        "DPR",
        "Project Report",
        "Conpany Profile",
        "ITR",
        "Bank",
        "GSTR",
        "business Proof",
        "electricity Bill",
        "load Statement",
        "property Paper",
      ];

      // Preload images - parallel fetch
      // Note: We use the 'currentItems' if we want to export only current page,
      // but usually exports are for ALL data. The previous code used 'projects' (all data).
      // We will stick to 'projects'.
      const photoImages = await Promise.all(
        projects.map((p) =>
          p.photo ? getBase64FromUrl(p.photo) : Promise.resolve(null)
        )
      );

      const tableRows = projects.map((item, index) => [
        index + 1,
        item.name,
        item.company,
        item.email,
        item.phone,
        item.city || "-",
        item.projectType || "-",
        item.loanRequirement || "-",
        (item.message || "-").substring(0, 20), // Truncate message
        new Date(item.createdAt).toLocaleDateString(),
        "", // Photo placeholder (index 10)
        // Docs (index 11 start)
        item.adhar ? "Link" : "-",
        item.pan ? "Link" : "-",
        item.dpr ? "Link" : "-",
        item.projectReport ? "Link" : "-",
        item.companyProfile ? "Link" : "-",
        item.itr ? "Link" : "-",
        item.bankStatement ? "Link" : "-",
        item.gstr ? "Link" : "-",
        item.businessProof ? "Link" : "-",
        item.electricityBill ? "Link" : "-",
        item.loadStatement ? "Link" : "-",
        item.propertyPaper ? "Link" : "-",
      ]);

      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 45,
        styles: {
          fontSize: 7,
          cellPadding: 2,
          valign: "middle",
          overflow: "linebreak",
        },
        columnStyles: {
          0: { cellWidth: 20 }, // Sr
          1: { cellWidth: 45 }, // Name
          2: { cellWidth: 40 }, // Co
          3: { cellWidth: 55 }, // Email
          4: { cellWidth: 45 }, // Phone
          5: { cellWidth: 35 }, // City
          6: { cellWidth: 35 }, // Type
          7: { cellWidth: 35 }, // Loan
          8: { cellWidth: 45 }, // Msg
          9: { cellWidth: 40 }, // Date
          10: { cellWidth: 30, minCellHeight: 30 }, // Photo
          // Docs - keep small
          11: { cellWidth: 30 },
          12: { cellWidth: 30 },
          13: { cellWidth: 30 },
          14: { cellWidth: 30 },
          15: { cellWidth: 30 },
          16: { cellWidth: 30 },
          17: { cellWidth: 30 },
          18: { cellWidth: 30 },
          19: { cellWidth: 30 },
          20: { cellWidth: 30 },
          21: { cellWidth: 30 },
          22: { cellWidth: 30 },
        },
        didDrawCell: (data) => {
          // Draw Photo
          if (data.section === "body" && data.column.index === 10) {
            const img = photoImages[data.row.index];
            if (img) {
              try {
                const dim = 24;
                const x = data.cell.x + (data.cell.width - dim) / 2;
                const y = data.cell.y + (data.cell.height - dim) / 2;
                doc.addImage(img, "JPEG", x, y, dim, dim);
              } catch (err) {
                // ignore image error
              }
            }
          }

          // Draw Links for Docs
          if (data.section === "body" && data.column.index >= 11) {
            const docKeyMap = [
              "adhar",
              "pan",
              "dpr",
              "projectReport",
              "companyProfile",
              "itr",
              "bankStatement",
              "gstr",
              "businessProof",
              "electricityBill",
              "loadStatement",
              "propertyPaper",
            ];
            const keyIndex = data.column.index - 11;
            if (keyIndex < docKeyMap.length) {
              const key = docKeyMap[keyIndex];
              const url = projects[data.row.index][key];
              if (url) {
                doc.setTextColor(0, 0, 255);
                // We don't need doc.text here because autoTable prints the cell content ("Link")
                // We just add the link annotation over the cell area
                doc.link(
                  data.cell.x,
                  data.cell.y,
                  data.cell.width,
                  data.cell.height,
                  { url }
                );
              }
            }
          }
        },
      });

      doc.save("projects_report_full.pdf");
      toast.dismiss(toastId);
      toast.success("PDF Downloaded");
    } catch (error) {
      console.error("PDF Export Error:", error);
      // toast.dismiss(toastId);
      toast.error("Failed to generate PDF");
    }
  };
  const makeLink = (url) => {
    if (!url) return "-";
    return {
      t: "s",
      v: "View Document",
      l: { Target: url },
    };
  };

  const handleExportExcel = () => {
    const workSheet = XLSX.utils.json_to_sheet(
      projects.map((p, index) => ({
        "Sr. No.": index + 1,
        "Full Name": p.name,
        "Company Name": p.company,
        "Email Address": p.email,
        "Phone Number": p.phone,
        City: p.city,
        "Project Type": p.projectType,
        "Loan Amount": p.loanRequirement,
        Message: p.message,
        "Created At": new Date(p.createdAt).toLocaleDateString(),
        // Document Links
        Photo: makeLink(p.photo),
        Aadhar: makeLink(p.adhar),
        PAN: makeLink(p.pan),
        DPR: makeLink(p.dpr),
        "Project Report": makeLink(p.projectReport),
        "Company Profile": makeLink(p.companyProfile),
        ITR: makeLink(p.itr),
        "Bank Statement": makeLink(p.bankStatement),
        GSTR: makeLink(p.gstr),
        "Business Proof": makeLink(p.businessProof),
        "Electricity Bill": makeLink(p.electricityBill),
        "Load Statement": makeLink(p.loadStatement),
        "Property Paper": makeLink(p.propertyPaper),
      }))
    );
    const workBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workBook, workSheet, "Projects");
    XLSX.writeFile(workBook, "projects_data.xlsx");
    toast.success("Excel Downloaded");
  };

  /* ================= RENDER HELPERS ================= */

  const docCell = (src) =>
    src ? (
      <Box
        as="a"
        href={src}
        target="_blank"
        rel="noreferrer"
        display="flex"
        justifyContent="center"
      >
        <Image
          src={src}
          alt="doc"
          boxSize="12"
          objectFit="cover"
          borderRadius="md"
          borderWidth="1px"
          _hover={{ transform: "scale(1.1)" }}
          transition="transform 0.2s"
        />
      </Box>
    ) : (
      <Text fontSize="xs" color="gray.400" textAlign="center">
        -
      </Text>
    );

  const dateCell = (row) => new Date(row.createdAt).toLocaleDateString("en-IN");

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = projects.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(projects.length / itemsPerPage);

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
      <Flex
        mb={6}
        justify="space-between"
        align="center"
        flexWrap="wrap"
        gap={4}
      >
        <Heading as="h1" size="lg">
          Projects
        </Heading>
        <Stack direction="row" spacing={3}>
          <Button
            leftIcon={<RepeatIcon />}
            onClick={handleRefresh}
            colorScheme="blue"
            variant="outline"
            size="sm"
          >
            Refresh
          </Button>
          <Button
            leftIcon={<DownloadIcon />}
            onClick={handleExportPDF}
            colorScheme="red"
            size="sm"
          >
            PDF
          </Button>
          <Button
            leftIcon={<DownloadIcon />}
            onClick={handleExportExcel}
            colorScheme="green"
            size="sm"
          >
            Excel
          </Button>
        </Stack>
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
          <Table
            variant="simple"
            colorScheme={colorMode === "dark" ? "whiteAlpha" : "gray"}
          >
            <Thead>
              <Tr>
                <Th>Sr. No.</Th>
                <Th>Photo</Th>
                <Th>Name</Th>
                <Th>Company</Th>
                <Th>Email</Th>
                <Th>Phone</Th>
                <Th>City</Th>
                <Th>Project Type</Th>
                <Th>Loan ₹</Th>
                {/* Documents */}
                <Th>Aadhar</Th>
                <Th>PAN</Th>
                <Th>DPR</Th>
                <Th>Report</Th>
                <Th>Profile</Th>
                <Th>ITR</Th>
                <Th>Bank Stmt</Th>
                <Th>GSTR</Th>
                <Th>Biz Proof</Th>
                <Th>Elec Bill</Th>
                <Th>Load Stmt</Th>
                <Th>Prop Paper</Th>
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
              {currentItems.map((row, index) => (
                <Tr key={row._id}>
                  <Td>{(currentPage - 1) * itemsPerPage + index + 1}</Td>
                  <Td>{docCell(row.photo)}</Td>
                  <Td fontWeight="medium">{row.name}</Td>
                  <Td>{row.company}</Td>
                  <Td>{row.email}</Td>
                  <Td>{row.phone}</Td>
                  <Td>{row.city}</Td>
                  <Td>{row.projectType}</Td>
                  <Td>{row.loanRequirement}</Td>

                  <Td>{docCell(row.adhar)}</Td>
                  <Td>{docCell(row.pan)}</Td>
                  <Td>{docCell(row.dpr)}</Td>
                  <Td>{docCell(row.projectReport)}</Td>
                  <Td>{docCell(row.companyProfile)}</Td>
                  <Td>{docCell(row.itr)}</Td>
                  <Td>{docCell(row.bankStatement)}</Td>
                  <Td>{docCell(row.gstr)}</Td>
                  <Td>{docCell(row.businessProof)}</Td>
                  <Td>{docCell(row.electricityBill)}</Td>
                  <Td>{docCell(row.loadStatement)}</Td>
                  <Td>{docCell(row.propertyPaper)}</Td>

                  <Td>{dateCell(row)}</Td>
                  <Td
                    position="sticky"
                    right={0}
                    bg={colorMode === "dark" ? "gray.800" : "white"}
                    zIndex={1}
                    boxShadow="media"
                  >
                    <HStack spacing={2}>
                      <IconButton
                        icon={<ViewIcon />}
                        colorScheme="blue"
                        size="sm"
                        isRound
                        onClick={() => {
                          if (row._id) navigate(`/project-details/${row._id}`);
                          // else console.error("Missing Project ID");
                        }}
                        aria-label="View"
                      />

                      <IconButton
                        icon={<DeleteIcon />}
                        colorScheme="red"
                        size="sm"
                        isRound
                        isLoading={deleting === row._id}
                        onClick={() => deleteProject(row._id)}
                        aria-label="Delete"
                      />
                    </HStack>
                  </Td>
                </Tr>
              ))}
              {currentItems.length === 0 && (
                <Tr>
                  <Td colSpan={22} textAlign="center" py={4}>
                    No projects found
                  </Td>
                </Tr>
              )}
            </Tbody>
          </Table>
        </TableContainer>

        {/* PAGINATION */}
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
