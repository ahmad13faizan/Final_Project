import React, { useState } from "react";
import {Stack } from "@mui/material";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import img1 from "../../assets/images/onboarding3pics/img1.png";
import img2 from "../../assets/images/onboarding3pics/img2.png";
import img3 from "../../assets/images/onboarding3pics/img3.png";
import img4 from "../../assets/images/onboarding3pics/img4.png";
import api from "../../api/axios"

import {
    CircularProgress,
  Container,
  Typography,
  Paper,
  Box,
  TextField,
  Divider,
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  Tooltip,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  ContentCopy as ContentCopyIcon,
} from "@mui/icons-material";

const Onboarding3 = () => {

    const roleArn = useSelector((state) => state.onboarding.roleArn);
    const accountName = useSelector((state) => state.onboarding.accountName);

  const navigate = useNavigate();
  // Assuming accountId was stored earlier in Redux
  const accountId = useSelector((state) => state.onboarding.accountId) || "{951485052809}";
  const region = useSelector((state) => state.onboarding.region) || "us-east-1";
  // Generate report name
  const defaultReportName = `ck-tuner-${accountId}-hourly-cur`;

  // Snackbar state
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");

  // Copy handler
  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setSnackbarMsg("Copied to clipboard!");
      setSnackbarOpen(true);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success", // "error" or "success"
    });

    const handleSubmit = async () => {
      const payload = {
        accountId: Number(accountId),
        arn: roleArn,
        accountName,
        region,
      };
    
      setLoading(true);
    
      try {
        const response = await api.post("/api/accounts", payload);
    
        setSnackbar({
          open: true,
          message: "Account successfully created!",
          severity: "success",
        });
    
        // Navigate to thank you page after short delay (or immediately)
        setTimeout(() => {
          navigate("/admin/thank-you");
        }, 1000); // 1-second delay to show snackbar (optional)
    
      } catch (error) {
        setSnackbar({
          open: true,
          message: error.response?.data?.message || "Something went wrong.",
          severity: "error",
        });
      } finally {
        setLoading(false);
      }
    };  


  return (
    <Container maxWidth="xl"  width="md"   sx={{ py: 7 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Create Cost & Usage Report
      </Typography>
      <Typography variant="body1" gutterBottom>
        Create a Cost & Usage Report by following these steps
      </Typography>

      <Paper variant="outlined" sx={{  p: 3, mt: 2 }}>
        {/* Step 1 */}
        <ol style={{ paddingLeft: 20 }}>
          <li>
            <Typography>
              Go to&nbsp;
              <a
                href="https://console.aws.amazon.com/billing/home#/reports"
                target="_blank"
                rel="noopener noreferrer"
              >
                Cost & Usage Reports
              </a>
              &nbsp;in the Billing Dashboard and click <strong>Create report</strong>.
            </Typography>
          </li>

          {/* Step 2 */}
        
          <li style={{ marginTop: 16 }}>
            <Typography>
              Name the report as shown below and ensure <strong>Include resource IDs</strong> is checked:
            </Typography>
            <Box sx={{ width:"55%", display: 'flex', alignItems: 'center', mt: 1, position: 'relative' }}>
              <TextField
                fullWidth
                value={defaultReportName}
                InputProps={{ readOnly: true }}
              />
              <Tooltip title="Copy report name">
                <IconButton
                  sx={{ position: 'absolute', top: 8, right: 8 }}
                  size="small"
                  onClick={() => handleCopy(defaultReportName)}
                >
                  <ContentCopyIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>

            
            <FormControlLabel
              control={
                <Checkbox
                  checked={"includeResourceIds"}
                  
                />
              }
              label="Include Resource IDs"
              sx={{ mt: 1 }}
            />
          </li>

          Click on <strong> Next</strong>.

          <Box
          component="img"
          src={img1}
          alt="IAM Role Screenshot"
          sx={{
            maxWidth: "100%",
            height: "auto",
            borderRadius: 1,
            boxShadow: 1,
          }}
          />

          {/* Step 3 */}
          <li style={{ marginTop: 16 }}>
            <Typography>
              In <strong>Configure S3 Bucket</strong>, provide the name of the S3 bucket that was created:
            
              <FormControlLabel
              control={
                <Checkbox
                  checked={"includeResourceIds"}
                  
                />
              }
              label="The following default policy will be applied to your bucket"
              sx={{ mt: 1 }}
            />
            </Typography>

            Click on Save

            <Box
          component="img"
          src={img2}
          alt="IAM Role Screenshot"
          sx={{
            marginTop: 4,
            maxWidth: "100%",
            height: "auto",
            borderRadius: 1,
            boxShadow: 1,
          }}
          />
           
          </li>
          
          <li style={{ marginTop: 16 }}>
            <Typography>
                In the Delivery options section, enter the below-mentioned Report path prefix-

            </Typography>
            Report path prefix: 

            <Box sx={{width:"30%", display: 'flex', alignItems: 'center', mt: 1, position: 'relative',marginBottom: 2 }}>
              <TextField
                fullWidth
                value={accountId}
                InputProps={{ readOnly: true }}
              />
              <Tooltip title="Copy">
                <IconButton
                  sx={{ position: 'absolute', top: 8, right: 8 }}
                  size="small"
                  onClick={() => handleCopy(accountId)}
                >
                  <ContentCopyIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>

            Additionally, ensure that the following checks are in place

            <Box
          component="img"
          src={img4}
          alt="IAM Role Screenshot"
          sx={{
            maxWidth: "100%",
            height: "auto",
            borderRadius: 1,
            boxShadow: 1,
            margin:"16px 0",
          }}
          />

            <Box
          component="img"
          src={img3}
          alt="IAM Role Screenshot"
          sx={{
            maxWidth: "100%",
            height: "auto",
            borderRadius: 1,
            boxShadow: 1,
            margin:"16px 0",
          }}
          />
          </li>

          <li>
            Click on <strong>Next</strong> review the configuration of the Cost and Usage Report.Once satisfied, click on  <strong>Create Report</strong>.
          </li>


        </ol>

        <Divider sx={{ my: 3 }} />

        {/* Navigation buttons */}
        <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      width="100%"
      sx={{ mt: -12 ,margin:"3px" }} // Lifts it slightly above
    >
      {/* Left: Cancel */}
      <Button
        variant="outlined"
        sx={{ backgroundColor:"#d32f2f", borderColor:"none", color: "#fff !important" }}
        onClick={() => navigate("/admin")}
      >
        Cancel
      </Button>

      {/* Right: Back & Continue */}
      <Stack direction="row" spacing={2}>
        <Button
          variant="outlined"
          sx={{ backgroundColor:"white", borderColor: "blue", color: "#003aa8 !important" }}
          onClick={() => navigate("/admin/onboarding2")}
        >
          Back - Create CUR replication
        </Button>

        <Button
            variant="outlined"
            sx={{
                borderColor: "blue",
                backgroundColor: "white",
                color: "#003aa8 !important",
                minWidth: 100,
                position: "relative"
            }}
            onClick={handleSubmit}
            disabled={loading}
            >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Submit"}
            </Button>

      </Stack>
    </Box>
      </Paper>

      {/* Snackbar for copy feedback */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" onClose={() => setSnackbarOpen(false)}>
          {snackbarMsg}
        </Alert>
      </Snackbar>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
        <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            sx={{ width: '100%' }}
        >
            {snackbar.message}
        </Alert>
        </Snackbar>

    </Container>
  );
};

export default Onboarding3;
