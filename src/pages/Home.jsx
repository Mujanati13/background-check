import React, { useState } from "react";
import axios from "axios";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  ToggleButton,
  ToggleButtonGroup,
  Switch,
  FormControlLabel,
  Chip,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import PrintIcon from "@mui/icons-material/Print";
import EmailIcon from "@mui/icons-material/Email";
import CachedIcon from "@mui/icons-material/Cached";

// Sample test data for simulation based on the provided example
const testData = {
  msg: "success",
  data: {
    Wohnungsübergabeprotokoll: {
      "Art der Übergabe": "Einzug",
      "Datum der Übergabe": "03.04.2025",
    },
    Mieter: {
      Anrede: "Frau",
      Titel: "Keine Angaben",
      Name: "H",
      Vorname: "H",
      Geburtsdatum: "03.04.2025",
      Strasse: "Testweg",
      Hausnummer: "1",
      Plz: "63755",
      Ort: "Alzenau",
      Adresszusatz: "",
      Rufnummer: "",
      "Mobile Nummer": "",
      Emailadresse: "stephanwalleter@x-cite.de",
    },
    Wohnung: {
      Strasse: "Testweg",
      Hausnummer: "1",
      Adresszusatz: null,
      Plz: "63755",
      Ort: "Alzenau",
    },
    Vermieter: {
      Unternehmen: "",
      Anrede: "Herr",
      Titel: "Keine Angaben",
      Name: "T",
      Vorname: "T",
      Strasse: "F",
      Hausnummer: "T",
      Plz: "63755",
      Ort: "Stadt",
      Adresszusatz: "",
      Rufnummer: "",
      "Mobile Nummer": "",
      Emailadresse: "stephanwalleter@x-cite.de",
    },
  },
};

// Helper function to render nested objects recursively with responsive spacing.
const renderNestedObject = (obj, level = 0) => {
  if (!obj || typeof obj !== "object") return null;

  return Object.entries(obj).map(([key, value]) => {
    const isObject = value && typeof value === "object";

    return (
      <Box
        key={key}
        sx={{
          ml: { xs: level * 1, sm: level * 2 },
          mb: isObject ? 2 : 0.5,
        }}
      >
        {isObject ? (
          <>
            <Typography
              variant={level === 0 ? "subtitle1" : "subtitle2"}
              sx={{
                fontWeight: "medium",
                mt: 1,
                mb: 1,
                borderBottom: level === 0 ? 1 : 0,
                borderColor: "divider",
                pb: level === 0 ? 0.5 : 0,
              }}
            >
              {key}
            </Typography>
            {renderNestedObject(value, level + 1)}
          </>
        ) : (
          <Typography variant="body2" sx={{ display: "flex" }}>
            <Box
              component="span"
              sx={{
                fontWeight: "medium",
                width: { xs: "35%", sm: "40%" },
                flexShrink: 0,
              }}
            >
              {key}:
            </Box>
            <Box component="span" sx={{ pl: 1 }}>
              {value === "" ? "-" : value}
            </Box>
          </Typography>
        )}
      </Box>
    );
  });
};

// Response Section Component for displaying hierarchical data.
const ResponseSection = ({ title, data }) => {
  if (!data) return null;

  return (
    <Accordion sx={{ mt: 2 }} defaultExpanded={true}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography sx={{ fontWeight: "medium" }}>{title}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Box>{renderNestedObject(data)}</Box>
      </AccordionDetails>
    </Accordion>
  );
};

function Home() {
  const [env, setEnv] = useState("real"); // "real" or "test"
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [tracing, setTracing] = useState(false);
  const [traceMessages, setTraceMessages] = useState([]);
  const [requestStartTime, setRequestStartTime] = useState(null);
  const [burgschaftData, setBurgschaftData] = useState(null);
  const [burgschaftError, setBurgschaftError] = useState(null);
  const [burgschaftLoading, setBurgschaftLoading] = useState(false);
  const [statusData, setStatusData] = useState(null);
  const [statusLoading, setStatusLoading] = useState(false);
  const [statusError, setStatusError] = useState(null);

  // Helper function to add trace messages with timestamps including milliseconds.
  const addTrace = (message) => {
    if (tracing) {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, "0");
      const minutes = now.getMinutes().toString().padStart(2, "0");
      const seconds = now.getSeconds().toString().padStart(2, "0");
      const milliseconds = now.getMilliseconds().toString().padStart(3, "0");
      const timestamp = `${hours}:${minutes}:${seconds}.${milliseconds}`;

      setTraceMessages((prev) => [...prev, { time: timestamp, message }]);
    }
  };

  // Helper to add request summary.
  const addSummary = (success) => {
    if (tracing && requestStartTime) {
      const endTime = new Date();
      const duration = endTime - requestStartTime;
      const summary = success
        ? `Request completed successfully in ${duration}ms - Environment: ${env}, Status: Success`
        : `Request failed after ${duration}ms - Environment: ${env}, Status: Error`;
      addTrace(`SUMMARY: ${summary}`);
    }
  };

  // Handle environment toggle.
  const handleEnvChange = (event, newEnv) => {
    if (newEnv !== null) {
      setEnv(newEnv);
    }
  };

  // Check application status using CID
  async function checkApplicationStatus(cid) {
    if (!cid) return;
    
    setStatusLoading(true);
    setStatusError(null);
    setStatusData(null);
    
    addTrace(`Checking application status for CID: ${cid}`);
    
    try {
      const response = await axios.get(
        `https://api.stage.kautionsfrei.de/api/application/state/${cid}`
      );
      
      if (response.data) {
        addTrace(`Status retrieved successfully: ${response.data.state}`);
        setStatusData(response.data);
      } else {
        addTrace("Received empty status response");
        setStatusError("No status data received");
      }
    } catch (err) {
      console.error("Error fetching application status:", err);
      addTrace(`Status check error: ${err.message}`);
      setStatusError(err.response?.data?.msg || "Failed to retrieve application status");
    } finally {
      setStatusLoading(false);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setError(null);
    const startTime = new Date();
    setRequestStartTime(startTime);

    if (tracing) {
      setTraceMessages([]);
      addTrace("Process started - Preparing request");
    }

    if (env === "test") {
      addTrace("Using test environment - Simulating API call");
      setTimeout(() => {
        addTrace("Test data received");
        addTrace("Processing test response data");
        addTrace("Formatting results for display");
        setResult(testData);
        addTrace("UI update: Displaying test results");
        setLoading(false);
        addSummary(true);
      }, 1000);
    } else {
      try {
        addTrace(
          `Preparing API request with token: ${token.substring(
            0,
            3
          )}...${token.substring(token.length - 3)}`
        );
        addTrace(
          `Sending request to: https://www.x-cite-web.de:5000/api/protocol/data/${token}`
        );

        const response = await axios.get(
          `https://www.x-cite-web.de:5000/api/protocol/data/${token}`
        );

        addTrace("Response received successfully");
        addTrace("Processing response data");
        addTrace("Validating response structure");
        addTrace("Formatting results for display");
        setResult(response.data);
        addTrace("UI update: Displaying results");
        addSummary(true);
      } catch (err) {
        console.error("Error fetching data:", err);
        addTrace(`Error occurred: ${err.message}`);
        setError(
          err.response?.data?.msg
            ? `${err.response.data.msg}`
            : "No data found with the given token!"
        );
        addTrace("UI update: Showing error message");
        addSummary(false);
      } finally {
        setLoading(false);
        addTrace("Request process completed");
      }
    }
  };

  // Function to submit X-cite data to the API
  async function submitXCiteData() {
    // Reset previous results
    setBurgschaftData(null);
    setBurgschaftError(null);
    setBurgschaftLoading(true);
    setStatusData(null);
    setStatusError(null);

    try {
      // Disable the button to prevent multiple submissions
      const submitButton = document.getElementById("submit-xcite-button");
      if (submitButton) {
        submitButton.disabled = true;
      }

      addTrace("Preparing data for Bürgschaft creation");

      const mappedData = {
        product: "kfde_06_2020",
        partnerCode: "mr",
        landlord: {
          firstName: result.data.Vermieter?.Vorname || "",
          name: result.data.Vermieter?.Name || "",
          gender: result.data.Vermieter?.Anrede === "Herr" ? "male" : "female",
          address: {
            street: result.data.Vermieter?.Strasse || "",
            // Fix: Ensure streetNumber is valid - use only numeric part if available, otherwise use "1"
            streetNumber: (() => {
              const rawNumber = result.data.Vermieter?.Hausnummer || "";
              // Extract only numbers and possibly a single letter (e.g., "12a")
              const match = rawNumber.match(/^(\d+[a-zA-Z]?)/);
              return match ? match[0].substring(0, 5) : "1";
            })(),
            zip: result.data.Vermieter?.Plz || "",
            city: result.data.Vermieter?.Ort || "",
          },
        },
        firstTenant: {
          gender: result.data.Mieter?.Anrede === "Herr" ? "male" : "female",
          firstName: result.data.Mieter?.Vorname || "",
          name: result.data.Mieter?.Name || "",
          // Fix: Format phone number to remove spaces
          phone: (
            result.data.Mieter?.["Mobile Nummer"] ||
            result.data.Mieter?.Rufnummer ||
            ""
          ).replace(/\s+/g, ""),
          email: result.data.Mieter?.Emailadresse || "",
          nationality: "DE",
          dateOfBirth: result.data.Mieter?.Geburtsdatum || "",
          address: {
            street: result.data.Mieter?.Strasse || "",
            streetNumber: result.data.Mieter?.Hausnummer || "",
            zip: result.data.Mieter?.Plz || "",
            city: result.data.Mieter?.Ort || "",
          },
          termsAccepted: "y",
        },
        bankAccount: {
          iban: "DE02476501301111361018",
          bankName: "Sparkasse Paderborn-Detmold-Höxter",
          paymentFrequency: "monthly",
          owner: "firstTenant",
        },
        rentalObject: {
          address: {
            street: result.data.Wohnung?.Strasse || "",
            streetNumber: result.data.Wohnung?.Hausnummer || "",
            zip: result.data.Wohnung?.Plz || "",
            city: result.data.Wohnung?.Ort || "",
          },
          rentalContract: {
            deposit: "1500",
            rent: "500",
            signedAt:
              result.data.Wohnungsübergabeprotokoll?.["Datum der Übergabe"] ||
              "",
            // Fix: Set movedInAt to a future date (not more than 180 days in the future)
            movedInAt: (() => {
              const futureDate = new Date();
              // Set to 90 days in future (well within 180 day limit)
              futureDate.setDate(futureDate.getDate() + 90);
              return `${futureDate.getDate().toString().padStart(2, "0")}.${(
                futureDate.getMonth() + 1
              )
                .toString()
                .padStart(2, "0")}.${futureDate.getFullYear()}`;
            })(),
            isLimited: "false",
            isExisting: "false",
          },
        },
        postalDestination: "digital",
        selling: {
          mieterengel: "false",
          keyFinder: "false",
        },
        step: "check",
      };
      addTrace(
        `Sending request to create Bürgschaft: ${JSON.stringify(
          mappedData,
          null,
          2
        )}`
      );

      // Make API call to create Bürgschaft
      const response = await axios.post(
        "https://api.stage.kautionsfrei.de/api/tenancies",
        mappedData
      );

      if (response.data) {
        addTrace(
          `created successfully. CID: ${response.data.cid || "N/A"}`
        );
        setBurgschaftData(response.data);

        // Handle structured errors format in the response
        if (response.data.errors) {
          // Check if errors is an object with field keys (structured format)
          if (
            typeof response.data.errors === "object" &&
            !Array.isArray(response.data.errors)
          ) {
            addTrace(
              `Response contained validation errors for ${
                Object.keys(response.data.errors).length
              } fields`
            );

            // Store the structured errors for display
            setBurgschaftData((prevData) => ({
              ...prevData,
              formattedErrors: Object.entries(response.data.errors).map(
                ([field, details]) => ({
                  field,
                  messages: details.message || [],
                  value: details.value,
                })
              ),
            }));
          }
          // Original array format handling
          else if (
            Array.isArray(response.data.errors) &&
            response.data.errors.length > 0
          ) {
            addTrace(
              `Response contained ${response.data.errors.length} validation errors`
            );
          }
        }
      } else {
        addTrace("Received empty response");
        setBurgschaftError("No data received from server");
      }
    } catch (err) {
      console.error("Error creating Bürgschaft:", err);

      // Handle different types of errors
      if (err.response) {
        // The server responded with an error status code
        const statusCode = err.response.status;
        let errorMessage = err.response.data?.msg || "Unknown server error";

        // Check for structured errors in the error response
        if (
          err.response.data?.errors &&
          typeof err.response.data.errors === "object" &&
          !Array.isArray(err.response.data.errors)
        ) {
          const errorFields = Object.keys(err.response.data.errors);
          errorMessage = `Validation failed for ${
            errorFields.length
          } field(s): ${errorFields.join(", ")}`;

          // Store the structured errors for display
          setBurgschaftData({
            formattedErrors: Object.entries(err.response.data.errors).map(
              ([field, details]) => ({
                field,
                messages: details.message || [],
                value: details.value,
              })
            ),
          });
        }

        addTrace(`Server error (${statusCode}): ${errorMessage}`);
        setBurgschaftError(`Server error (${statusCode}): ${errorMessage}`);
      } else if (err.request) {
        // The request was made but no response was received
        addTrace("No response received from server");
        setBurgschaftError(
          "No response from server. Please check your connection."
        );
      } else {
        // Error in setting up the request
        addTrace(`Request error: ${err.message}`);
        setBurgschaftError(`Request failed: ${err.message}`);
      }
    } finally {
      // Re-enable button
      const submitButton = document.getElementById("submit-xcite-button");
      if (submitButton) {
        submitButton.disabled = false;
      }
      setBurgschaftLoading(false);
    }
  }

  // Helper function to get status color
  const getStatusColor = (state) => {
    switch (state) {
      case 'accepted':
        return 'success';
      case 'pending':
        return 'warning';
      case 'rejected':
        return 'error';
      default:
        return 'default';
    }
  };

  // Trace viewer component.
  const TraceViewer = () => {
    if (!tracing || traceMessages.length === 0) return null;
    const summaryMessage = traceMessages.find((trace) =>
      trace.message.startsWith("SUMMARY:")
    );
    const lastMessage = traceMessages[traceMessages.length - 1];
    const lastTimestamp = lastMessage ? lastMessage.time : "";
    const totalSteps = traceMessages.length;

    return (
      <Card sx={{ mt: 3, mb: 2 }}>
        <CardContent sx={{ py: 1 }}>
          {summaryMessage ? (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexDirection: { xs: "column", sm: "row" },
              }}
            >
              <Box>
                <Typography
                  variant="body2"
                  color="primary"
                  sx={{ fontWeight: "medium" }}
                >
                  {summaryMessage.message.substring(8)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Completed at {summaryMessage.time}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                {totalSteps} steps processed
              </Typography>
            </Box>
          ) : (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexDirection: { xs: "column", sm: "row" },
              }}
            >
              <Box>
                <Typography variant="body2">Processing request...</Typography>
                <Typography variant="caption" color="text.secondary">
                  Last update at {lastTimestamp}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                {traceMessages.length} steps completed
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    );
  };

  // When results exist, display the result view; otherwise, show the form.
  if (result) {
    // Group the data for display
    const dataKeys = result.data ? Object.keys(result.data) : [];

    return (
      <Container
        maxWidth="lg"
        sx={{ py: { xs: 2, md: 4 }, px: { xs: 2, md: 4 } }}
      >
        <Paper sx={{ p: { xs: 2, md: 4 } }}>
          <Typography variant="h6" align="center" gutterBottom>
            Background Check Results
          </Typography>
          <Typography
            variant="subtitle1"
            align="center"
            color="textSecondary"
            gutterBottom
          >
            {env === "test" ? "Test Environment" : "Real Environment"} Results
          </Typography>

          {/* Display trace viewer if tracing is enabled */}
          <TraceViewer />

          {result.data && (
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                gap: 3,
                mt: 3,
              }}
            >
              {/* Right section - X-cite (now with all data) */}
              <Box
                sx={{
                  flex: 1,
                  bgcolor: "rgba(245, 245, 245, 0.5)",
                  p: 2,
                  borderRadius: 2,
                  border: "1px solid #e0e0e0",
                }}
              >
                <Box
                  sx={{
                    mb: 2,
                    pb: 1,
                    borderBottom: "1px solid #e0e0e0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 2,
                  }}
                >
                  <Typography variant="h6" sx={{ color: "#1976d2" }}>
                    X-cite
                  </Typography>
                  <Button
                    id="submit-xcite-button"
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={submitXCiteData}
                    disabled={burgschaftLoading}
                  >
                    {burgschaftLoading ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : (
                      "Insert to KautionFrei"
                    )}
                  </Button>
                </Box>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {/* Render all sections in the X-cite column */}
                  {dataKeys.map((key) => (
                    <ResponseSection
                      key={key}
                      title={key}
                      data={result.data[key]}
                    />
                  ))}
                </Box>
              </Box>
              {/* Left section - kaution with Bürgschaft data */}
              <Box
                sx={{
                  flex: 1,
                  bgcolor: "rgba(245, 245, 245, 0.5)",
                  p: 2,
                  borderRadius: 2,
                  border: "1px solid #e0e0e0",
                }}
              >
                <Box
                  sx={{
                    mb: 2,
                    pb: 1,
                    borderBottom: "1px solid #e0e0e0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 1,
                  }}
                >
                  <Typography variant="h6" sx={{ color: "#2e7d32" }}>
                  KautionFrei
                  </Typography>
                </Box>

                {/* Display Bürgschaft data or messages */}
                {burgschaftLoading ? (
                  <Box
                    sx={{ display: "flex", justifyContent: "center", py: 4 }}
                  >
                    <CircularProgress />
                  </Box>
                ) : burgschaftData ? (
                  <Box sx={{ p: 2 }}>
                    <Typography
                      variant="subtitle1"
                      sx={{ mb: 2, fontWeight: "medium" }}
                    >
                      {burgschaftData.cid
                        ? "Created Successfully"
                        : "Validation Results"}
                    </Typography>

                    <Box sx={{ mb: 2 }}>
                      {burgschaftData.cid && (
                        <>
                          <Typography
                            variant="body2"
                            sx={{ display: "flex", mb: 1 }}
                          >
                            <Box
                              component="span"
                              sx={{
                                fontWeight: "medium",
                                width: "40%",
                                flexShrink: 0,
                              }}
                            >
                              Contract ID:
                            </Box>
                            <Box component="span" sx={{ pl: 1 }}>
                              {burgschaftData.cid}
                            </Box>
                          </Typography>

                          <Typography
                            variant="body2"
                            sx={{ display: "flex", mb: 1 }}
                          >
                            <Box
                              component="span"
                              sx={{
                                fontWeight: "medium",
                                width: "40%",
                                flexShrink: 0,
                              }}
                            >
                              Next Step:
                            </Box>
                            <Box component="span" sx={{ pl: 1 }}>
                              {burgschaftData.skip_to || "N/A"}
                            </Box>
                          </Typography>
                          
                          {/* Status check button */}
                          <Box sx={{ mt: 3, mb: 2, display: 'flex', justifyContent: 'center' }}>
                            <Button 
                              variant="outlined" 
                              size="small"
                              onClick={() => checkApplicationStatus(burgschaftData.cid)}
                              disabled={statusLoading}
                              startIcon={statusLoading ? <CircularProgress size={16} /> : <CachedIcon />}
                              color="primary"
                            >
                              {statusLoading ? "Checking..." : "Get Application Status"}
                            </Button>
                          </Box>
                          
                          {/* Display status information */}
                          {statusData && (
                            <Box sx={{ mt: 3, p: 2, bgcolor: '#f8f8f8', borderRadius: 1, border: '1px solid #e0e0e0' }}>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 'medium' }}>
                                  Application Status
                                </Typography>
                                <Chip 
                                  label={statusData.state} 
                                  color={getStatusColor(statusData.state)}
                                  size="small"
                                />
                              </Box>
                              
                              <Typography variant="body2" sx={{ display: "flex", mb: 0.5 }}>
                                <Box component="span" sx={{ fontWeight: "medium", width: "40%", flexShrink: 0 }}>
                                  Order ID:
                                </Box>
                                <Box component="span" sx={{ pl: 1 }}>
                                  {statusData.orderId}
                                </Box>
                              </Typography>
                              
                              <Typography variant="body2" sx={{ display: "flex", mb: 0.5 }}>
                                <Box component="span" sx={{ fontWeight: "medium", width: "40%", flexShrink: 0 }}>
                                  Rate:
                                </Box>
                                <Box component="span" sx={{ pl: 1 }}>
                                  {statusData.rate}€
                                </Box>
                              </Typography>
                              
                              <Typography variant="body2" sx={{ display: "flex", mb: 0.5 }}>
                                <Box component="span" sx={{ fontWeight: "medium", width: "40%", flexShrink: 0 }}>
                                  Digital:
                                </Box>
                                <Box component="span" sx={{ pl: 1 }}>
                                  {statusData.digital === "true" ? "Yes" : "No"}
                                </Box>
                              </Typography>
                              
                              {/* <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                                <Button 
                                  size="small" 
                                  startIcon={<CachedIcon />} 
                                  onClick={() => checkApplicationStatus(burgschaftData.cid)}
                                >
                                  Refresh
                                </Button>
                              </Box> */}
                            </Box>
                          )}
                          
                          {statusError && (
                            <Alert severity="error" sx={{ mt: 2 }}>
                              {statusError}
                            </Alert>
                          )}
                        </>
                      )}

                      {/* Display structured validation errors */}
                      {burgschaftData.formattedErrors &&
                        burgschaftData.formattedErrors.length > 0 && (
                          <Box sx={{ mt: 2 }}>
                            <Typography
                              variant="subtitle2"
                              sx={{ color: "error.main", mb: 1 }}
                            >
                              Validation Errors:
                            </Typography>
                            <Box
                              sx={{ bgcolor: "#ffebee", p: 2, borderRadius: 1 }}
                            >
                              {burgschaftData.formattedErrors.map(
                                (error, index) => (
                                  <Box
                                    key={index}
                                    sx={{
                                      mb: 2,
                                      pb:
                                        index <
                                        burgschaftData.formattedErrors.length -
                                          1
                                          ? 2
                                          : 0,
                                      borderBottom:
                                        index <
                                        burgschaftData.formattedErrors.length -
                                          1
                                          ? "1px solid #ffcdd2"
                                          : "none",
                                    }}
                                  >
                                    <Typography
                                      variant="body2"
                                      sx={{
                                        fontWeight: "medium",
                                        color: "#d32f2f",
                                      }}
                                    >
                                      Field: {error.field}
                                    </Typography>
                                    {error.messages.map((msg, msgIndex) => (
                                      <Typography
                                        key={msgIndex}
                                        variant="body2"
                                        color="error"
                                        sx={{ mt: 0.5 }}
                                      >
                                        • {msg}
                                      </Typography>
                                    ))}
                                    {error.value && (
                                      <Typography
                                        variant="caption"
                                        sx={{
                                          display: "block",
                                          mt: 0.5,
                                          color: "#757575",
                                        }}
                                      >
                                        Current value:{" "}
                                        {typeof error.value === "object"
                                          ? JSON.stringify(error.value)
                                          : String(error.value)}
                                      </Typography>
                                    )}
                                  </Box>
                                )
                              )}
                            </Box>
                          </Box>
                        )}

                      {/* Keep original array error format handling for backward compatibility */}
                      {burgschaftData.errors &&
                        Array.isArray(burgschaftData.errors) &&
                        burgschaftData.errors.length > 0 && (
                          <Box sx={{ mt: 2 }}>
                            <Typography
                              variant="subtitle2"
                              sx={{ color: "error.main", mb: 1 }}
                            >
                              Validation Errors:
                            </Typography>
                            <ul
                              style={{ paddingLeft: "20px", margin: "8px 0" }}
                            >
                              {burgschaftData.errors.map((error, index) => (
                                <li key={index}>
                                  <Typography variant="body2" color="error">
                                    {error}
                                  </Typography>
                                </li>
                              ))}
                            </ul>
                          </Box>
                        )}
                    </Box>
                  </Box>
                ) : burgschaftError ? (
                  <Alert severity="error" sx={{ m: 2 }}>
                    {burgschaftError}
                  </Alert>
                ) : (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ textAlign: "center", py: 2 }}
                  >
                    Click "to kaution" to create a Bürgschaft
                  </Typography>
                )}
              </Box>
            </Box>
          )}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: "space-between",
              mt: 4,
              gap: 2,
            }}
          >
            <Button
              variant="outlined"
              startIcon={<RestartAltIcon />}
              onClick={() => {
                setResult(null);
                setToken("");
                setBurgschaftData(null);
                setBurgschaftError(null);
                setStatusData(null);
                setStatusError(null);
                if (tracing) {
                  addTrace("Reset application state - returning to form");
                }
              }}
            >
              New Check
            </Button>
          </Box>
        </Paper>
      </Container>
    );
  }

  return (
    <Container
      maxWidth="sm"
      sx={{ py: { xs: 2, md: 4 }, px: { xs: 2, md: 4 } }}
    >
      <Typography variant="h4" align="center" gutterBottom>
        Tenant Background Check
      </Typography>
      <Typography
        variant="subtitle1"
        align="center"
        color="textSecondary"
        gutterBottom
      >
        Enter your authentication token to check the protocol data.
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: "center",
          mb: 3,
          gap: 2,
        }}
      >
        <ToggleButtonGroup value={env} exclusive onChange={handleEnvChange}>
          <ToggleButton value="real">Real Environment</ToggleButton>
          {/* <ToggleButton value="test">Test Environment</ToggleButton> */}
        </ToggleButtonGroup>
{/* 
        <FormControlLabel
          control={
            <Switch
              checked={tracing}
              onChange={(e) => setTracing(e.target.checked)}
              color="primary"
            />
          }
          label="Enable tracing"
        /> */}
      </Box>
      <Card sx={{ my: 4 }}>
        <CardContent>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: "flex", flexDirection: "row", gap: 3 }}
          >
            <TextField
              fullWidth
              label="Authentication Token"
              variant="outlined"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              required
            />
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{ height: "56px" }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Send"
              )}
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Display trace viewer if tracing is enabled */}
      <TraceViewer />

      {error && (
        <Alert severity="error" onClose={() => setError(null)} sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
    </Container>
  );
}

export default Home;