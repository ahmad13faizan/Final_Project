import React from "react";
import { Snackbar, Alert } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import {
  setRoleArn,
  setAccountId,
  setAccountName,
  setRegion,
} from "../../redux/onboardingSlice"; // path as per your folder structure
import { useNavigate } from "react-router-dom";
import onboardingImg1 from "../../assets/images/onboardingpic1.png";
import { formConfig } from "../../config/Onboarding";
import {
  FormControl,
  InputLabel,
  Select,
  Box,
  Button,
  Container,
  Typography,
  TextField,
  Paper,
  Divider,
  IconButton,
  Tooltip,
  MenuItem,
} from "@mui/material";
import {
  CopyAll,
  ArrowBack,
  ArrowForward,
  ContentCopy,
} from "@mui/icons-material";

const Onboarding = () => {
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const roleArn = useSelector((state) => state.onboarding.roleArn);
  const accountId = useSelector((state) => state.onboarding.accountId);
  const accountName = useSelector((state) => state.onboarding.accountName);
  const region = useSelector((state) => state.onboarding.region);

  const error1 = false; // Replace with actual error state if validation is needed

  const [errorRoleArn, setErrorRoleArn] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name === "roleArn") {
      const isValid = /^arn:aws:iam::\d{12}:role\/[\w+=,.@-]+$/.test(value);
      setErrorRoleArn(!isValid); // true if invalid
      dispatch(setRoleArn(value));
    } else if (name === "accountId") {
      dispatch(setAccountId(value));
    } else if (name === "accountName") {
      dispatch(setAccountName(value));
    } else if (name === "region") {
      dispatch(setRegion(value));
    }
  };

  console.log(
    "Current IAM Role ARN in Redux:",
    roleArn,
    accountId,
    accountName
  );

  const [error, setError] = useState(false);

  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");

  const roleName = "CK-Tuner-Role-dev2";
  const policy = `{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::951485052809:root"
      },
      "Action": "sts:AssumeRole",
      "Condition": {
        "StringEquals": {
          "sts:ExternalId": "Um9oaXRDS19ERUZBVUxUZDIzOTJkZTgtN2E0OS00NWQ3LTg3MzItODkyM2ExZTIzMjQw"
        }
      }
    },
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "s3.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}`;

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setSnackbarMessage("Copied to clipboard!");
      setOpenSnackbar(true);
    });
  };

  return (
    <Container maxWidth="xl" width="md" sx={{ py: 7 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Create an IAM Role
      </Typography>
      <Typography variant="body1" gutterBottom>
        Create an IAM Role by following these steps
      </Typography>

      <Paper variant="outlined" sx={{ p: 3, mt: 3 }}>
        <ol style={{ paddingLeft: "1.2rem" }}>
          <li>
            <Typography>
              Log into AWS account &nbsp;
              <a
                href="https://console.aws.amazon.com/iamv2/home#/roles"
                target="_blank"
                rel="noopener noreferrer"
              >
                <strong>Create an IAM Role</strong>
              </a>
              .
            </Typography>
          </li>

          <li style={{ marginTop: 16 }}>
            <Typography>
              In the <strong>Trusted entity</strong> type section, select{" "}
              <strong>Custom trust policy</strong>. Replace the prefilled policy
              with the policy provided below -
            </Typography>
            <Box
              component="pre"
              onClick={() => handleCopy(policy)}
              sx={{
                bgcolor: "#f4f4f4",
                p: 2,
                borderRadius: 1,
                whiteSpace: "pre-wrap",
                mt: 1,
                height: "300px",
                overflow: "auto",
                position: "relative",
                cursor: "pointer",
              }}
            >
              {policy}
              <Tooltip title="Copy Policy">
                <IconButton
                  size="small"
                  sx={{ position: "absolute", top: 8, right: 8 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopy(policy);
                  }}
                >
                  <ContentCopy fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </li>

          <li style={{ marginTop: 16 }}>
            <Typography>
              Click on <strong>Next</strong> to go to the{" "}
              <strong>Add permissions</strong> page. We would not be adding any
              permissions for now because the permission policy content will be
              dependent on the AWS Account ID retrieved from the IAM Role. Click
              on <strong>Next</strong>.
            </Typography>
          </li>

          <li style={{ marginTop: 16 }}>
            <Typography>
              In the <strong>Role name</strong> field, enter the below-mentioned
              role name, and click on <strong>Create Role</strong> -
            </Typography>
            <Box
              sx={{
                width: "16rem",
                display: "flex",
                alignItems: "center",
                mt: 2,
              }}
            >
              <TextField
                fullWidth
                value={roleName}
                InputProps={{ readOnly: true }}
              />
              <Tooltip title="Copy Role Name">
                <IconButton sx={{ ml: 1 }} onClick={() => handleCopy(roleName)}>
                  <ContentCopy />
                </IconButton>
              </Tooltip>
            </Box>
          </li>

          <li style={{ marginTop: 16 }}>
            <Typography>
              Go to the newly created IAM Role and copy the Role ARN -
            </Typography>
            <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
              <Box
                component="img"
                src={onboardingImg1}
                alt="IAM Role Screenshot"
                sx={{
                  maxWidth: "100%",
                  height: "auto",
                  borderRadius: 1,
                  boxShadow: 1,
                }}
              />
            </Box>
          </li>
        </ol>

        <Box>
          {/* Flex container for first two fields */}
          <Box display="flex" gap={2}>
            {formConfig.slice(0, 2).map((field, index) => (
              <Box key={index} flex={1}>
                <Divider sx={{ my: 3 }} />
                <Typography variant="body1" gutterBottom>
                  <strong>{field.label}</strong>
                </Typography>
                <TextField
                  fullWidth
                  placeholder={field.placeholder}
                  value={
                    field.fieldName === "roleArn"
                      ? roleArn
                      : field.fieldName === "accountId"
                      ? accountId
                      : ""
                  }
                  onChange={handleChange}
                  name={field.fieldName}
                  error={errorRoleArn}
                  helperText={errorRoleArn ? field.helperText : ""}
                  sx={{ mt: 1 }}
                />
              </Box>
            ))}
          </Box>

          {/* Third field below */}

          {formConfig.length > 2 && (
            <Box mt={2} display="flex" gap={2}>
              <Divider sx={{ my: 3 }} />
              <Box mt={2} width={"48%"}>
                <Typography variant="body1" gutterBottom>
                  <strong>{formConfig[2].label}</strong>
                </Typography>
                <TextField
                  fullWidth
                  placeholder={formConfig[2].placeholder}
                  value={accountName}
                  onChange={handleChange}
                  name={formConfig[2].fieldName}
                  error={error1}
                  helperText={error1 ? formConfig[2].helperText : ""}
                  sx={{ mt: 1 }}
                />
              </Box>
              {formConfig.length > 3 && (
                <Box mt={2} width={"48%"}>
                  <Typography variant="body1" gutterBottom>
                    <strong>{formConfig[3].label}</strong>
                  </Typography>

                  <FormControl fullWidth>
                    <InputLabel id="random">
                      {formConfig[3].placeholder}
                    </InputLabel>
                    <Select
                      fullWidth
                      select
                      label={formConfig[3].placeholder}
                      value={region}
                      onChange={handleChange}
                      name={formConfig[3].fieldName}
                      error={error1}
                      helperText={error1 ? formConfig[3].helperText : ""}
                      sx={{ mt: 1 }}
                    >
                      {formConfig[3].options.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              )}
            </Box>
          )}
        </Box>

        <Box
          sx={{
            mt: 3,
            display: "flex",
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="contained"
              color="error"
              onClick={() => navigate("/admin")}
            >
              Cancel
            </Button>
          </Box>
          <Button
            variant="contained"
            endIcon={<ArrowForward />}
            onClick={() => navigate("/admin/onboarding2")}
            disabled={!roleArn || error}
            sx={{
              backgroundColor: !roleArn || error ? "grey" : "primary.main",
              "&:hover": {
                backgroundColor: !roleArn || error ? "grey" : "primary.dark",
              },
            }}
          >
            Next - Add Customer Managed Policy
          </Button>
        </Box>
      </Paper>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={2000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};
// Onboarding.jsx
export default Onboarding;
