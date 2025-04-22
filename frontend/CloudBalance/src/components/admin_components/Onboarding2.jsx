import React from "react";
import styles from "../../styles/Onboarding2.module.scss"; // Adjust the path as necessary
import  img1 from "../../assets/images/onboarding2pics/ck_tuner_role1.png";
import  img2 from "../../assets/images/onboarding2pics/Permisssion_policies2.png"
import  img3 from "../../assets/images/onboarding2pics/onboarding_steps_customer_managed3.png";
import  img4 from "../../assets/images/onboarding2pics/add_permissions4.png";
import {IconButton, Tooltip, Snackbar ,Box,Button,Stack} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { data1,data2,data3,data4 } from "../admin_components/Onboarding2data"; // Adjust the path as necessary
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { useState } from "react";


const Onboarding2 = () => {

  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();


  const handleCopy = async (data) => {
    try {
      await navigator.clipboard.writeText(data);
      setCopied(true);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleClose = () => {
    setCopied(false);
  };

  return (
    <div className={styles.addPoliciesContainer}>
      <h2 className={styles.heading}>Add Customer Managed Policies</h2>
      <p className={styles.subheading}>
        Create an Inline policy for the role by following these steps
      </p>


      <div className={styles.section}>
        <p className={styles.stepText}>
          <span className={styles.bullet}> 1 </span> Go to the{" "}
          <a href="#" className={styles.link}>
            Create Policy
          </a>{" "}
          Page.
        </p>
        <p className={styles.stepText}>
          <span className={styles.bullet}> 2 </span>Click on the <b>JSON</b> tab
          and paste the following policy and click on Next:
        </p>
        <pre className={styles.codeBlock}>

        <div style={{ position: "relative" }}>
            <div style={{ position: "absolute", top: 0, right: 0 }}>
              <Tooltip title="Copy to Clipboard">
                <IconButton onClick={()=> handleCopy(data1)} color="primary">
                  <ContentCopyIcon />
                </IconButton>
              </Tooltip>
            </div>
          </div>


          <Snackbar
            open={copied}
            autoHideDuration={2000}
            onClose={handleClose}
            message="Copied to clipboard!"
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            disablePortal
            sx={{
              position: "fixed",
              top: 16,
              right: 16,
              zIndex: 1300, // Keep above content
            }}
          />



          {data1}
          
        </pre>
        <p className={styles.stepText}>
          <span className={styles.bullet}> 3 </span>In the <b>Name</b> field,
          enter below-mentioned policy name and click on Create Policy
        </p>
        <div className={styles.inputBox}>cktuner-CostAuditPolicy
       
          <Tooltip title="Copy to Clipboard">
            <IconButton onClick={()=> handleCopy("cktuner-CostAuditPolicy")} color="primary">
            <ContentCopyIcon />
            </IconButton>
          </Tooltip>


          <Snackbar
            open={copied}
            autoHideDuration={2000}
            onClose={handleClose}
            message="Copied to clipboard!"
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            disablePortal
            sx={{
              position: "fixed",
              top: 16,
              right: 16,
              zIndex: 1300, // Keep above content
            }}
          />
        </div>

        <p className={styles.stepText}>
          <span className={styles.bullet}> 4 </span>Again, Go to the{" "}
          <a href="#" className={styles.link}>
            Create Policy
          </a>{" "}
          Page.
        </p>

        <p className={styles.stepText}>
          <span className={styles.bullet}> 5</span>Click on the <b>JSON</b> tab
          and paste the following policy and click on Next:
        </p>
        <pre className={styles.codeBlock}>
        <div style={{ position: "relative" }}>
            <div style={{ position: "absolute", top: 0, right: 0 }}>
              <Tooltip title="Copy to Clipboard">
                <IconButton onClick={()=> handleCopy(data2)} color="primary">
                  <ContentCopyIcon />
                </IconButton>
              </Tooltip>
            </div>
          </div>


          <Snackbar
            open={copied}
            autoHideDuration={2000}
            onClose={handleClose}
            message="Copied to clipboard!"
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            disablePortal
            sx={{
              position: "fixed",
              top: 16,
              right: 16,
              zIndex: 1300, // Keep above content
            }}
          />
          {data2}
        </pre>
        <p className={styles.stepText}>
          <span className={styles.bullet}> 6 </span>In the <b>Name</b> field,
          enter below-mentioned policy name and click on Create Policy
        </p>
        <div className={styles.inputBox}>cktuner-SecAuditPolicy
        
        <Tooltip title="Copy to Clipboard">
            <IconButton onClick={()=> handleCopy("cktuner-SecAuditPolicy")} color="primary">
            <ContentCopyIcon />
            </IconButton>
          </Tooltip>


          <Snackbar
            open={copied}
            autoHideDuration={2000}
            onClose={handleClose}
            message="Copied to clipboard!"
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            disablePortal
            sx={{
              position: "fixed",
              top: 16,
              right: 16,
              zIndex: 1300, // Keep above content
            }}
          />
          
        </div>
        <p className={styles.stepText}>
          <span className={styles.bullet}> 7 </span>Again, go to the{" "}
          <a href="#" className={styles.link}>
            Create Policy
          </a>{" "}
          Page.
        </p>

        <p className={styles.stepText}>
          <span className={styles.bullet}>8 </span>Click on the <b>JSON</b> tab
          and paste the following policy and click on Next:
        </p>
        <pre className={styles.codeBlock}>
        <div style={{ position: "relative" }}>
            <div style={{ position: "absolute", top: 0, right: 0 }}>
              <Tooltip title="Copy to Clipboard">
                <IconButton onClick={()=> handleCopy(data3)} color="primary">
                  <ContentCopyIcon />
                </IconButton>
              </Tooltip>
            </div>
          </div>


          <Snackbar
            open={copied}
            autoHideDuration={2000}
            onClose={handleClose}
            message="Copied to clipboard!"
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            disablePortal
            sx={{
              position: "fixed",
              top: 16,
              right: 16,
              zIndex: 1300, // Keep above content
            }}
          />
          {data3}
        </pre>
        <p className={styles.stepText}>
          <span className={styles.bullet}> 9 </span>In the <b>Name</b> field,
          enter below-mentioned policy name and click on Create Policy
        </p>
        <div className={styles.inputBox}>cktuner-TunerReadEssentials

        <Tooltip title="Copy to Clipboard">
            <IconButton onClick={()=> handleCopy("cktuner-TunerReadEssentials")} color="primary">
            <ContentCopyIcon />
            </IconButton>
          </Tooltip>


          <Snackbar
            open={copied}
            autoHideDuration={2000}
            onClose={handleClose}
            message="Copied to clipboard!"
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            disablePortal
            sx={{
              position: "fixed",
              top: 16,
              right: 16,
              zIndex: 1300, // Keep above content
            }}
          />
        </div>

        <p className={styles.stepText}>
          <span className={styles.bullet}> 10 </span>Go to the{" "}
          <a href="#" className={styles.link}>
            CK-Tuner-Role
          </a>{" "}
          
        </p>

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


        <p className={styles.stepText}>
          <span className={styles.bullet}> 11 </span>In Permission policies,
          click on <b>Add permissions {">"}Attach Policy </b>
        </p>

        <Box
          component="img"
          src={img2}
          alt="IAM Role Screenshot"
          sx={{
            maxWidth: "100%",
            height: "auto",
            borderRadius: 1,
            boxShadow: 1,
          }}
          />

        <p className={styles.stepText}>
          <span className={styles.bullet}> 12 </span>Filter by Type {">"}{" "}
          Customer managed then search for
          <b>
            {" "}
            cktuner-CostAuditPolicy, cktuner-SecAuditPolicy,
            cktuner-TunerReadEssentials
          </b>{" "}
          and select them.
        </p>

        <Box
          component="img"
          src={img3}
          alt="IAM Role Screenshot"
          sx={{
            maxWidth: "100%",
            height: "auto",
            borderRadius: 1,
            boxShadow: 1,
          }}
          />

        <p className={styles.stepText}>
          <span className={styles.bullet}> 13 </span>Now, Click on{" "}
          <b>Add permissions</b> button.
        </p>

        <p className={styles.stepText}>
          <span className={styles.bullet}> 14 </span>In Permission policies,
          click on <b>Add permissions {">"} Create inline policy</b>
        </p>

        <Box
          component="img"
          src={img4}
          alt="IAM Role Screenshot"
          sx={{
            maxWidth: "100%",
            height: "auto",
            borderRadius: 1,
            boxShadow: 1,
          }}
          />
        <p className={styles.stepText}>
          <span className={styles.bullet}> 15 </span>Click on the <b>JSON</b>{" "}
          tab, paste the following policy
        </p>

        <pre className={styles.codeBlock}>
        <div style={{ position: "relative" }}>
            <div style={{ position: "absolute", top: 0, right: 0 }}>
              <Tooltip title="Copy to Clipboard">
                <IconButton onClick={()=> handleCopy(data1)} color="primary">
                  <ContentCopyIcon />
                </IconButton>
              </Tooltip>
            </div>
          </div>


          <Snackbar
            open={copied}
            autoHideDuration={2000}
            onClose={handleClose}
            message="Copied to clipboard!"
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            disablePortal
            sx={{
              position: "fixed",
              top: 16,
              right: 16,
              zIndex: 1300, // Keep above content
            }}
          />
          {data4}
        </pre>

        <p className={styles.stepText}>
          <span className={styles.bullet}> 16 </span> Now, click on{" "}
          <b> Reveiew policy </b>
        </p>

        <p className={styles.stepText}>
          <span className={styles.bullet}> 17 </span>In the <b>Name</b> field,
          enter below-mentioned policy name and click on Create Policy
        </p>

        <div className={styles.inputBox}>S3CrossAccountReplication
        <Tooltip title="Copy to Clipboard">
            <IconButton onClick={()=> handleCopy("S3CrossAccountReplication")} color="primary">
            <ContentCopyIcon />
            </IconButton>
          </Tooltip>


          <Snackbar
            open={copied}
            autoHideDuration={2000}
            onClose={handleClose}
            message="Copied to clipboard!"
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            disablePortal
            sx={{
              position: "fixed",
              top: 16,
              right: 16,
              zIndex: 1300, // Keep above content
            }}
          />
        </div>
      </div>
      <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      width="100%"
      sx={{ mt: -12 }} // Lifts it slightly above
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
          onClick={() => navigate("/admin/onboarding")}
        >
          Back - Create IAM Role
        </Button>

        <Button
          variant="outlined"
          sx={{ borderColor: "blue",backgroundColor:"white", color: "#003aa8 !important" }}
          onClick={() => navigate("/admin/onboarding3")}
        >
          Continue
        </Button>
      </Stack>
    </Box>
    </div>
  );
};

export default Onboarding2;
