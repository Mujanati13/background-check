import React, { useState } from 'react';
import axios from 'axios';
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
  ToggleButtonGroup
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import PrintIcon from '@mui/icons-material/Print';
import EmailIcon from '@mui/icons-material/Email';

// Sample test data based on your provided JSON structure.
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

// Helper component to display key-value pairs of an object.
const ObjectDisplay = ({ title, data }) => {
  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
        {title}
      </Typography>
      <Box sx={{ pl: 2 }}>
        {Object.entries(data).map(([key, value]) => (
          <Typography key={key} variant="body2">
            <strong>{key}:</strong> {value || '-'}
          </Typography>
        ))}
      </Box>
    </Box>
  );
};

// Component to render each response section (e.g. "Kaution Response", etc.)
const ResponseSection = ({ title, data }) => {
    return (
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6" color="primary">
            {title}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          {Object.entries(data).map(([section, details]) => (
            <ObjectDisplay key={section} title={section} data={details} />
          ))}
        </AccordionDetails>
      </Accordion>
    );
  };

function Home() {
  const [env, setEnv] = useState('real'); // "real" or "test"
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

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

    if (env === 'test') {
      // Simulate a test call with static data.
      setTimeout(() => {
        setResult(testData);
        setLoading(false);
      }, 1000);
    } else {
      try {
        // Real API call: use the X‑Cite API endpoint with the token as a path parameter.
        const response = await axios.get(
          `https://www.x-cite-web-stg.de:5000/api/protocol/data/${token}`
        );
        setResult(response.data);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(
            err.response.data.msg
            ? `${err.response.data.msg}`
            : 'No data found with the given token!'
        );
      } finally {
        setLoading(false);
      }
    }
  };

  // When results exist, display the result view; otherwise, show the form.
  if (result) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h4" align="center" gutterBottom>
            Background Check Results
          </Typography>
          <Typography variant="subtitle1" align="center" color="textSecondary" gutterBottom>
            {env === 'test' ? 'Test Environment' : 'Real Environment'} Results
          </Typography>
          {/* Render each response section if available */}
          {result.data && (
            <>
              <ResponseSection title="Kaution Response" data={result.data["Kaution Response"]} />
              <ResponseSection title="Strom Response" data={result.data["Strom Response"]} />
              <ResponseSection title="Gas Response" data={result.data["Gas Response"]} />
            </>
          )}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4, flexWrap: 'wrap', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<RestartAltIcon />}
              onClick={() => {
                // Reset to show the form again.
                setResult(null);
                setToken('');
              }}
            >
              New Check
            </Button>
            <Button variant="contained" startIcon={<EmailIcon />} onClick={() => alert('Report would be emailed (pending implementation)')}>
              Email Report
            </Button>
            <Button variant="contained" startIcon={<PrintIcon />} onClick={() => window.print()}>
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
      <Typography variant="subtitle1" align="center" color="textSecondary" gutterBottom>
        Enter your authentication token to check the protocol data.
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
        <ToggleButtonGroup value={env} exclusive onChange={handleEnvChange}>
          <ToggleButton value="real">Real Environment</ToggleButton>
          <ToggleButton value="test">Test Environment</ToggleButton>
        </ToggleButtonGroup>
      </Box>
      <Card sx={{ my: 4 }}>
        <CardContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              fullWidth
              label="Authentication Token"
              variant="outlined"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              required
            />
            <Button type="submit" variant="contained" disabled={loading} sx={{ height: '56px' }}>
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Check Background'}
            </Button>
          </Box>
        </CardContent>
      </Card>
      {error && (
        <Alert severity="error" onClose={() => setError(null)} sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
    </Container>
  );
}

export default Home;
