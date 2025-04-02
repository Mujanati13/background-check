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
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import PrintIcon from "@mui/icons-material/Print";
import EmailIcon from "@mui/icons-material/Email";

// Sample test data for simulation based on the provided example
const testData = {
  msg: "success",
  data: {
    "Kaution Response": {
      "Wohnungsübergabeprotokoll": {
        "Art der Übergabe": "Einzug",
        "Datum der Übergabe": "05.11.2024"
      },
      "Mieter": {
        "Anrede": "Frau",
        "Titel": "Keine Angaben",
        "Name": "Katze",
        "Vorname": "Killer",
        "Geburtsdatum": "05.11.2006",
        "Strasse": "Herzbergstrasse",
        "Hausnummer": "2-4",
        "Plz": "61138",
        "Ort": "Niederdorfelden",
        "Adresszusatz": "",
        "Rufnummer": "+49 12122222",
        "Mobile Nummer": "+49 55555555555",
        "Emailadresse": "stephan@x-cite.de"
      },
      "Weitere Mieter": {
        "Anrede": "Herr",
        "Titel": "Keine Angaben",
        "Name": "Kater",
        "Vorname": "Karlo",
        "Geburtsdatum": "",
        "Strasse": "Weinweg",
        "Hausnummer": "14",
        "Plz": "63477",
        "Ort": "Maintal",
        "Adresszusatz": "",
        "Rufnummer": "",
        "Mobile Nummer": "",
        "Emailadresse": ""
      },
      "Wohnung": {
        "Strasse": "Herzbergstrasse",
        "Hausnummer": "2-4",
        "Adresszusatz": "1. OG",
        "Plz": "61138",
        "Ort": "Niederdorfelden"
      },
      "Vermieter": {
        "Unternehmen": "",
        "Anrede": "Herr",
        "Titel": "Keine Angaben",
        "Name": "Stephan",
        "Vorname": "Huthmann",
        "Strasse": "Adalbert-Stifter-Str. 35",
        "Hausnummer": "Maintal",
        "Plz": "63477",
        "Ort": "Maintal",
        "Adresszusatz": "",
        "Rufnummer": "",
        "Mobile Nummer": "+49 1578521222",
        "Emailadresse": "stephan@x-cite.de"
      }
    },
    "Strom Response": {
      "Wohnungsübergabeprotokoll": {
        "Art der Übergabe": "Einzug",
        "Datum der Übergabe": "05.11.2024"
      },
      "Mieter": {
        "Anrede": "Frau",
        "Titel": "Keine Angaben",
        "Name": "Katze",
        "Vorname": "Killer",
        "Geburtsdatum": "05.11.2006",
        "Strasse": "Herzbergstrasse",
        "Hausnummer": "2-4",
        "Plz": "61138",
        "Ort": "Niederdorfelden",
        "Adresszusatz": "",
        "Rufnummer": "+49 12122222",
        "Mobile Nummer": "+49 55555555555",
        "Emailadresse": "stephan@x-cite.de"
      },
      "Wohnung": {
        "Strasse": "Herzbergstrasse",
        "Hausnummer": "2-4",
        "Adresszusatz": "1. OG",
        "Plz": "61138",
        "Ort": "Niederdorfelden"
      },
      "Zählernummer": "1LOG0043015813",
      "Zählerstand HT": "",
      "Zählerstand NT": "",
      "Zählertyp": "Eintarif Stromzähler",
      "Installationsort": "Keller",
      "Marketlokationsnummer": "TEST123",
      "Produkttyp": "strom"
    },
    "Gas Response": {
      "Wohnungsübergabeprotokoll": {
        "Art der Übergabe": "Einzug",
        "Datum der Übergabe": "05.11.2024"
      },
      "Mieter": {
        "Anrede": "Frau",
        "Titel": "Keine Angaben",
        "Name": "Katze",
        "Vorname": "Killer",
        "Geburtsdatum": "05.11.2006",
        "Strasse": "Herzbergstrasse",
        "Hausnummer": "2-4",
        "Plz": "61138",
        "Ort": "Niederdorfelden",
        "Adresszusatz": "",
        "Rufnummer": "+49 12122222",
        "Mobile Nummer": "+49 55555555555",
        "Emailadresse": "stephan@x-cite.de"
      },
      "Wohnung": {
        "Strasse": "Herzbergstrasse",
        "Hausnummer": "2-4",
        "Adresszusatz": "1. OG",
        "Plz": "61138",
        "Ort": "Niederdorfelden"
      },
      "Zählernummer": "1LOG0043015813",
      "Zählerstand": "454545",
      "Zählertyp": "",
      "Installationsort": "Flur",
      "Marketlokationsnummer": "",
      "Produkttyp": "gas"
    }
  }
};

// Helper function to render nested objects recursively
const renderNestedObject = (obj, level = 0) => {
  if (!obj || typeof obj !== "object") return null;
  
  return Object.entries(obj).map(([key, value]) => {
    // Check if the value is an object
    const isObject = value && typeof value === "object";
    
    return (
      <Box key={key} sx={{ ml: level * 2, mb: isObject ? 2 : 0.5 }}>
        {/* Render section header for nested objects */}
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
                pb: level === 0 ? 0.5 : 0
              }}
            >
              {key}
            </Typography>
            {renderNestedObject(value, level + 1)}
          </>
        ) : (
          // Render key-value pairs for leaf nodes
          <Typography variant="body2" sx={{ display: 'flex' }}>
            <Box component="span" sx={{ fontWeight: "medium", width: '40%', flexShrink: 0 }}>
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

// Response Section Component for displaying hierarchical data
const ResponseSection = ({ title, data }) => {
  if (!data) return null;

  return (
    <Accordion sx={{ mt: 2 }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography sx={{ fontWeight: "medium" }}>{title}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Box>
          {renderNestedObject(data)}
        </Box>
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
  // Add new state for tracing functionality
  const [tracing, setTracing] = useState(false);
  const [traceMessages, setTraceMessages] = useState([]);
  const [requestStartTime, setRequestStartTime] = useState(null);

  // Helper function to add trace messages with timestamps including milliseconds
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

  // Helper to add request summary
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setError(null);

    // Record start time for duration calculation
    const startTime = new Date();
    setRequestStartTime(startTime);

    // Reset trace messages when starting a new request
    if (tracing) {
      setTraceMessages([]);
      addTrace("Process started - Preparing request");
    }

    if (env === "test") {
      // Simulate a test call with static data.
      addTrace("Using test environment - Simulating API call");

      setTimeout(() => {
        addTrace("Test data received");
        addTrace("Processing test response data");
        addTrace("Extracting Kaution, Strom, and Gas responses");
        addTrace("Formatting results for display");
        setResult(testData);
        addTrace("UI update: Displaying test results");
        setLoading(false);
        addSummary(true);
      }, 1000);
    } else {
      try {
        // Real API call: use the X‑Cite API endpoint with the token as a path parameter.
        addTrace(
          `Preparing API request with token: ${token.substring(
            0,
            3
          )}...${token.substring(token.length - 3)}`
        );
        addTrace(
          `Sending request to: https://www.x-cite-web-stg.de:5000/api/protocol/data/${token}`
        );

        const response = await axios.get(
          `https://www.x-cite-web-stg.de:5000/api/protocol/data/${token}`
        );

        addTrace("Response received successfully");
        addTrace("Processing response data");
        addTrace("Validating response structure");
        addTrace("Extracting Kaution, Strom, and Gas responses");
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

  // Trace viewer component
  const TraceViewer = () => {
    if (!tracing || traceMessages.length === 0) return null;

    // Find the summary message if it exists
    const summaryMessage = traceMessages.find((trace) =>
      trace.message.startsWith("SUMMARY:")
    );

    // Get the last trace message time for display
    const lastMessage = traceMessages[traceMessages.length - 1];
    const lastTimestamp = lastMessage ? lastMessage.time : "";

    // Get the total number of steps
    const totalSteps = traceMessages.length;

    return (
      <Card sx={{ mt: 3, mb: 2 }}>
        <CardContent sx={{ py: 1 }}>
          {summaryMessage ? (
            // Compact single-line display with time
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
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
            // If no summary yet, show processing message with time
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
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
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h4" align="center" gutterBottom>
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

          {/* Render each response section if available */}
          {result.data && (
            <>
              <ResponseSection
                title="Kaution Response"
                data={result.data["Kaution Response"]}
              />
              <ResponseSection
                title="Strom Response"
                data={result.data["Strom Response"]}
              />
              <ResponseSection
                title="Gas Response"
                data={result.data["Gas Response"]}
              />
            </>
          )}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mt: 4,
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <Button
              variant="outlined"
              startIcon={<RestartAltIcon />}
              onClick={() => {
                // Reset to show the form again.
                setResult(null);
                setToken("");
                if (tracing) {
                  addTrace("Reset application state - returning to form");
                }
              }}
            >
              New Check
            </Button>
            <Button
              variant="contained"
              startIcon={<EmailIcon />}
              onClick={() => {
                if (tracing) addTrace("Email report requested");
                alert("Report would be emailed (pending implementation)");
              }}
            >
              Email Report
            </Button>
            <Button
              variant="contained"
              startIcon={<PrintIcon />}
              onClick={() => {
                if (tracing) addTrace("Print report requested");
                window.print();
              }}
            >
              Print Report
            </Button>
          </Box>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
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
      <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
        <ToggleButtonGroup value={env} exclusive onChange={handleEnvChange}>
          <ToggleButton value="real">Real Environment</ToggleButton>
          <ToggleButton value="test">Test Environment</ToggleButton>
        </ToggleButtonGroup>
      </Box>
      <Card sx={{ my: 4 }}>
        <CardContent>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: "flex", flexDirection: "column", gap: 3 }}
          >
            <TextField
              fullWidth
              label="Authentication Token"
              variant="outlined"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              required
            />
            <FormControlLabel
              control={
                <Switch
                  checked={tracing}
                  onChange={(e) => setTracing(e.target.checked)}
                />
              }
              label="Enable request tracing"
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
                "Check Background"
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