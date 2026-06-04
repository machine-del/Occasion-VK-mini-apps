import { Box } from "@mui/material";
import { Button, ImageBase, Link, Text, Title } from "@vkontakte/vkui";
import vkBridge from "@vkontakte/vk-bridge";
import picture1 from "../../../public/images/pictures/reg1.png";
import picture2 from "../../../public/images/pictures/reg2.png";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import logo from "../../../public/images/Icon/OccasionLoading.png";
import { useStores } from "../../store/useStore";

export function LoginForm() {
  const isMobile = useMediaQuery();
  const { authStore } = useStores();

  const handleVKLogin = async () => {
    try {
      const result = await vkBridge.send("VKWebAppGetAuthToken", {
        app_id: 54594845,
        scope: "friends, email",
      });

      if (result.access_token) {
        const userData = await vkBridge.send("VKWebAppGetUserInfo", {});

        await authStore.login(userData.id.toString(), result.access_token);
      }
    } catch (error) {
      console.error("Ошибка авторизации VK ID:", error);

      if (error && typeof error === "object" && "message" in error) {
        const errorMessage = error.message as string;
        if (errorMessage?.includes("canceled")) {
          console.log("Пользователь отменил авторизацию");
        }
      }
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "100lvh",
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
        ...(!isMobile && { justifyContent: "center" }),
      }}
    >
      <Box sx={{ marginTop: "67px" }}>
        <ImageBase
          src={logo}
          widthSize={isMobile ? 148 : 207}
          heightSize={isMobile ? 44 : 62}
          noBorder
          objectFit="contain"
        />
      </Box>

      <Box
        sx={{
          textAlign: "center",
          width: "100%",
          mt: "41px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            position: "relative",
            justifyContent: "center",
            alignItems: isMobile ? "center" : "flex-end",
            mb: isMobile ? 0 : 2.9,
            flexDirection: isMobile ? "column" : "row",
            maxHeight: isMobile ? "345px" : "max-content",
            minHeight: isMobile ? "auto" : "216px",
          }}
        >
          <ImageBase
            src={picture1}
            widthSize={287.55}
            heightSize={191.66}
            noBorder
            objectFit="contain"
            style={{ position: "relative", zIndex: 1 }}
          />
          <ImageBase
            src={picture2}
            widthSize={287.52}
            heightSize={191.68}
            noBorder
            objectFit="contain"
            style={{
              position: "relative",
              right: isMobile ? "-23px" : "35px",
              bottom: isMobile ? "55px" : "-14px",
              zIndex: 2,
            }}
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            height: isMobile ? "auto" : "100%",
          }}
        >
          <Box>
            <Title
              align="center"
              style={{
                fontFamily: "Roboto",
                fontSize: isMobile ? "30px" : "40px",
                color: "#1C1C1E",
                letterSpacing: "0.41px",
                fontWeight: 600,
              }}
            >
              СОЗДАТЬ ПОВОД
            </Title>
            <Text
              align="center"
              style={{
                fontFamily: "Roboto",
                fontSize: isMobile ? "14px" : "20px",
                color: "#8E8E93",
                fontWeight: 400,
                marginTop: isMobile ? "7px" : "14px",
                letterSpacing: "-0.41px",
              }}
            >
              Без долгих переписок. Пригласи одним кликом
            </Text>
          </Box>
          <Box
            sx={{
              padding: "0px 20px",
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Button
              onClick={handleVKLogin}
              style={{
                height: "44px",
                maxWidth: "432px",
                width: "100%",
              }}
              disabled={authStore.isLoading}
            >
              <Text
                style={{
                  fontFamily: "Inter",
                  fontSize: "16px",
                  color: "#fff",
                  fontWeight: 500,
                }}
              >
                {authStore.isLoading ? "Загрузка..." : "Войти через VK ID"}
              </Text>
            </Button>
            <Box
              sx={{
                textAlign: "center",
                px: 2,
                flexGrow: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                position: "absolute",
                bottom: isMobile ? "15px" : "20px",
              }}
            >
              <Box>
                <Text
                  style={{
                    fontFamily: "Roboto",
                    color: "#8E8E93",
                    fontWeight: 200,
                    fontSize: isMobile ? "12px" : "16px",
                  }}
                >
                  Создавая аккаунт, вы соглашаетесь с
                </Text>
                <Text
                  style={{
                    fontFamily: "Roboto",
                    color: "#8E8E93",
                    fontWeight: 200,
                    fontSize: isMobile ? "12px" : "16px",
                  }}
                >
                  <Link
                    style={{
                      fontWeight: 600,
                      color: "#8E8E93",
                    }}
                  >
                    [Условиями]
                  </Link>
                  &nbsp;и&nbsp;
                  <Link
                    style={{
                      color: "#8E8E93",
                      fontWeight: 600,
                    }}
                  >
                    [Политикой]
                  </Link>
                </Text>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
