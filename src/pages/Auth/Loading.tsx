import icon from "../../../public/images/Icon/OccasionLoading.png";
import { ImageBase } from "@vkontakte/vkui";
import { Box } from "@mui/material";
import { Loader } from "../../components/global/Loader";

export function Loading() {
  return (
    <Box
      sx={{
        height: "100lvh",
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        justifyContent: "center",
        position: "relative",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 85,
        }}
      >
        <ImageBase
          widthSize={207}
          heightSize={62}
          src={icon}
          noBorder
          objectFit="contain"
        />
      </Box>

      <Loader />
    </Box>
  );
}
