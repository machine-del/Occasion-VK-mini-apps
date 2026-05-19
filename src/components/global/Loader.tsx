import { Box } from "@mui/material";
import { LoaderArc } from "../../icons/icons";

export function Loader() {
  return (
    <Box
      sx={{
        width: "72px",
        height: "72px",
        position: "relative",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          border: "1.26px solid #2d81e0",
          width: "72px",
          height: "72px",
          borderRadius: "100%",
          top: "0",
          left: "0",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          top: "0",
          left: "0",
          width: "72px",
          height: "72px",
          transformOrigin: "36px 36px",
          animation: "spin 1.5s linear infinite",
          "@keyframes spin": {
            "0%": {
              transform: "rotate(0deg)",
            },
            "100%": {
              transform: "rotate(360deg)",
            },
          },
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            transform: "translate(5px, 54px)",
          }}
        >
          <LoaderArc />
        </Box>
      </Box>
    </Box>
  );
}
