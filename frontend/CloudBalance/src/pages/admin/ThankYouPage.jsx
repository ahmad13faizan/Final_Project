import { Box, Paper, Typography, Button, Link } from "@mui/material";
import img from "../../assets/images/onboarding3pics/green_tick_check.svg";
const ThankYouPage = () => {
  return (
    <Box
      sx={{
        minHeight: "80vh",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "none",
        px: 2,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: "600px",
          textAlign: "center",
          p: 4,

          backgroundColor: "transparent",
        }}
      >
        <img
          src={img} // or your checkmark icon path
          alt="Success"
          style={{ width: 100, marginBottom: 16 }}
        />
        <Typography variant="h6" gutterBottom>
          Thank You For CUR Access!
        </Typography>
        <Typography variant="body1" gutterBottom>
          If you have additional accounts to onboard, please{" "}
          <Link href="/home/onboarding">click Onboard</Link> to proceed.
        </Typography>
      </Paper>
    </Box>
  );
};

export default ThankYouPage;
