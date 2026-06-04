import { Box } from "@mui/material";
import {
  Button,
  FormField,
  Input,
  Text,
  Title,
  UnstyledTextField,
  Alert,
} from "@vkontakte/vkui";
import { useMemo } from "react";
import { useStores } from "../../store/useStore";
import { SettingsViewModel } from "../../store/viewModels/settingsViewModel";
import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { DashIcon, MapIcon } from "../../icons/icons";
import { useMediaQuery } from "../../hooks/useMediaQuery";

export const Settings = observer(() => {
  const isMobile = useMediaQuery();
  const navigate = useNavigate();
  const root = useStores();
  const viewModel = useMemo(() => new SettingsViewModel(root), [root]);
  const {
    interests,
    toggleInterest,
    isInterestSelected,
    handleSubmit,
    location,
    setLocation,
    minPeople,
    maxPeople,
    setMinPeople,
    setMaxPeople,
    locationError,
    peopleError,
    showAlert,
    alertText,
    closeAlert,
    citySuggestions,
    showSuggestions,
    selectCity,
    clearSuggestions,
  } = viewModel;

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100lvh",
      }}
    >
      <Box
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          maxWidth: "686px",
          maxHeight: isMobile ? "none" : "486px",
          padding: isMobile ? "30px 18px" : "0px",
        }}
      >
        <Box
          sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            flexDirection: "column",
          }}
        >
          <Box>
            <Title
              level="2"
              style={{
                color: "#2D81E0",
                fontFamily: "Roboto",
                fontWeight: 700,
                fontSize: isMobile ? "20px" : "36px",
              }}
            >
              Выберите свои интересы
            </Title>
            <Box
              sx={{
                width: "100%",
                display: "flex",
                marginTop: "20px",
                flexWrap: "wrap",
                gap: "8px",
              }}
            >
              {interests.map((interest) => (
                <Box
                  key={interest}
                  onClick={() => toggleInterest(interest)}
                  sx={{
                    padding: "5px 10px",
                    color: isInterestSelected(interest) ? "#FFFFFF" : "#838C98",
                    fontFamily: "Inter",
                    fontWeight: 400,
                    fontSize: "16px",
                    background: isInterestSelected(interest)
                      ? "#2D81E0"
                      : "#fff",
                    borderRadius: "10px",
                    cursor: "pointer",
                    userSelect: "none",
                  }}
                >
                  {interest}
                </Box>
              ))}
            </Box>
          </Box>

          <Box
            sx={{
              width: "100%",
              marginTop: "36px",
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              gap: "23px",
            }}
          >
            <Box
              sx={{
                backgroundColor: "#fff",
                borderRadius: "10px",
                minWidth: "310px",
                minHeight: "102px",
                padding: "16.5px 10px",
                display: "flex",
                flexDirection: "column",
                gap: "7px",
                position: "relative",
              }}
            >
              <Title
                level="2"
                weight="1"
                style={{
                  color: "#2D81E0",
                  fontFamily: "Roboto",
                  fontWeight: 700,
                  fontSize: "20px",
                }}
              >
                Место
              </Title>

              <FormField
                before={<MapIcon />}
                mode="default"
                status={locationError ? "error" : "default"}
              >
                <UnstyledTextField
                  as="input"
                  name="location"
                  placeholder="Город или район"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  onBlur={() => clearSuggestions()}
                />
              </FormField>

              {showSuggestions && citySuggestions.length > 0 && (
                <Box
                  sx={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    right: 0,
                    backgroundColor: "#fff",
                    borderRadius: "10px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                    zIndex: 10,
                    maxHeight: "200px",
                    overflowY: "auto",
                    mt: "4px",
                  }}
                >
                  {citySuggestions.map((city) => (
                    <Box
                      key={city.id}
                      onClick={() => selectCity(city)}
                      sx={{
                        padding: "10px 12px",
                        cursor: "pointer",
                        "&:hover": { backgroundColor: "#f5f5f5" },
                      }}
                    >
                      {city.title}
                    </Box>
                  ))}
                </Box>
              )}

              {locationError && (
                <Text
                  style={{ color: "red", fontSize: "12px", marginTop: "4px" }}
                >
                  {locationError}
                </Text>
              )}
            </Box>

            <Box
              sx={{
                backgroundColor: "#fff",
                borderRadius: "10px",
                minWidth: "310px",
                minHeight: "102px",
                width: "100%",
                padding: "16.5px 10px",
                display: "flex",
                flexDirection: "column",
                gap: "7px",
              }}
            >
              <Title
                level="2"
                weight="1"
                style={{
                  color: "#2D81E0",
                  fontFamily: "Roboto",
                  fontWeight: 700,
                  fontSize: "20px",
                }}
              >
                Количество человек
              </Title>
              <Box sx={{ display: "flex", alignItems: "center", gap: "4px" }}>
                <Box>
                  <Input
                    name="minPeople"
                    placeholder="2"
                    value={minPeople}
                    onChange={(e) => setMinPeople(e.target.value)}
                    status={peopleError ? "error" : "default"}
                  />
                </Box>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <DashIcon />
                </Box>
                <Box>
                  <Input
                    name="maxPeople"
                    placeholder="100"
                    value={maxPeople}
                    onChange={(e) => setMaxPeople(e.target.value)}
                    status={peopleError ? "error" : "default"}
                  />
                </Box>
              </Box>
              {peopleError && (
                <Text
                  style={{ color: "red", fontSize: "12px", marginTop: "4px" }}
                >
                  {peopleError}
                </Text>
              )}
            </Box>
          </Box>
        </Box>

        <Box
          sx={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Button
            onClick={() => handleSubmit(navigate)}
            style={{
              maxHeight: "44px",
              width: "100%",
              height: "100%",
            }}
          >
            <Text
              style={{
                fontFamily: "Inter",
                fontSize: "16px",
                color: "#fff",
                fontWeight: 500,
                padding: "11px 0px",
              }}
            >
              Продолжить
            </Text>
          </Button>
        </Box>
      </Box>

      {showAlert && (
        <Alert
          title="Внимание"
          description={alertText}
          dismissButtonMode="none"
          actions={[
            {
              title: "Понятно",
              mode: "cancel",
              action: () => closeAlert(),
            },
          ]}
          onClosed={() => closeAlert()}
        />
      )}
    </Box>
  );
});
