import * as React from "react";
import {
  ActionIcon,
  Box,
  Button,
  Flex,
  Group,
  Modal,
  Paper,
  SimpleGrid,
} from "@mantine/core";
import { useEffect } from "react";
import { ChoiceDisplay } from "./Choice";
import { IconAlertCircle, IconArrowBack } from "@tabler/icons-react";

export const Admin: React.FunctionComponent<any> = (props) => {
  const [hardwareUnsaved, setHardwareUnsaved] = React.useState<boolean>(false);
  const [tiersUnsaved, setTiersUnsaved] = React.useState<boolean>(false);
  const [termsUnsaved, setTermsUnsaved] = React.useState<boolean>(false);
  const [unsavedChanges, setUnsavedChanges] = React.useState<boolean>(false);
  useEffect(() => {
    // setHardware(
    //   props.hardware.map((item: string, index: number) => ({
    //     id: index,
    //     value: item,
    //   }))
    // );
  }, []);

  const hardwareUpdate = (status: boolean) => {
    setHardwareUnsaved(status);
  };
  const tiersUpdate = (status: boolean) => {
    setTiersUnsaved(status);
  };
  const termsUpdate = (status: boolean) => {
    setTermsUnsaved(status);
  };

  const goBack = () => {
    if (!hardwareUnsaved && !termsUnsaved && !tiersUnsaved) {
      console.log("go back");
      props.getData();
      props.toggleAdmin();
    } else {
      setUnsavedChanges(true);
    }
  };

  return (
    <Box sx={{ minHeight: 350 }}>
      <SimpleGrid
        cols={3}
        breakpoints={[
          { maxWidth: "62rem", cols: 3, spacing: "md" },
          { maxWidth: "48rem", cols: 2, spacing: "sm" },
          { maxWidth: "36rem", cols: 1, spacing: "sm" },
        ]}
      >
        {" "}
        <Box
          sx={{
            maxWidth: 400,
            maxHeight: "inherit",
            boxSizing: "border-box",
          }}
        >
          <Paper shadow="xs" p="md">
            <ChoiceDisplay
              context={props.context}
              columnName="Hardware"
              datasChanged={hardwareUpdate}
            />
          </Paper>
        </Box>
        <Box
          sx={{
            maxWidth: 400,
            maxHeight: "inherit",
            boxSizing: "border-box",
          }}
        >
          <Paper shadow="xs" p="md">
            <ChoiceDisplay
              context={props.context}
              columnName="Tiers"
              datasChanged={termsUpdate}
            />
          </Paper>
        </Box>
        <Box
          sx={{
            maxWidth: 400,
            maxHeight: "inherit",
            boxSizing: "border-box",
          }}
        >
          <Paper shadow="xs" p="md">
            <ChoiceDisplay
              context={props.context}
              columnName="Terms"
              datasChanged={tiersUpdate}
            />
          </Paper>
        </Box>
      </SimpleGrid>
      <Flex style={{ height: "100%", width: "100%" }} justify="end" align="end">
        <ActionIcon color="brand" onClick={goBack}>
          <IconArrowBack />
        </ActionIcon>
      </Flex>
      <Modal
        opened={unsavedChanges}
        onClose={() => {
          setUnsavedChanges(false);
        }}
        size="auto"
        withCloseButton={false}
      >
        <Box sx={{ textAlign: "center" }}>
          <IconAlertCircle size={35} strokeWidth={2} color="red" />
        </Box>

        <Box sx={{ fontSize: "14px" }}>
          All unsaved changes will be lost. Are you sure?
        </Box>
        <Group position="right" mt="xl">
          <Button
            variant="default"
            onClick={() => {
              setUnsavedChanges(false);
            }}
          >
            No
          </Button>
          <Button
            color="red"
            onClick={() => {
              props.getData();
              props.toggleAdmin();
            }}
          >
            Yes
          </Button>
        </Group>
      </Modal>
    </Box>
  );
};
