import * as React from "react";
import { SPHttpClient } from "@microsoft/sp-http";
import {
  ActionIcon,
  Box,
  Center,
  Group,
  Loader,
  Paper,
  Space,
  TextInput,
  Text,
  Title,
} from "@mantine/core";
import {
  DetailsList,
  IColumn,
  Selection,
  SelectionMode,
} from "@fluentui/react";
import {
  IconCirclePlus,
  IconDeviceFloppy,
  IconMoodSmileBeam,
  IconTrash,
} from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";

export const ChoiceDisplay: React.FC<any> = (props) => {
  const [choices, setChoices] = React.useState<string[]>([]);
  const [orginalChoices, setOriginalChoices] = React.useState<string[]>([]);
  const [selectedChoice, setSelectedChoice] = React.useState<any>([]);
  const [newItem, setNewItem] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const selection = new Selection({
    onSelectionChanged: () => {
      setSelectedChoice([...selection.getSelection()]);
    },
  });

  const handleDelete = (item: string) => {
    console.log(selectedChoice);
    setChoices(choices.filter((i: string) => i !== item));
    setSelectedChoice([]);
    props.datasChanged(true);
  };
  const columns: IColumn[] = [
    {
      minWidth: 300,
      key: props.columnName,
      name: "",
      fieldName: props.columnName,
      isResizable: false,
      onRender: (item) => <Text fw={800}>{item}</Text>,
    },
    {
      key: "delete",
      name: "",
      fieldName: "delete",
      minWidth: 50,
      maxWidth: 50,
    },
  ];

  const onRenderItemColumn = (item: any, index: any, column: any) => {
    if (column.key === "delete") {
      return (
        item === selectedChoice[0] && (
          <ActionIcon
            onClick={() => {
              handleDelete(item);
            }}
            size="xs"
            variant="transparent"
            color="red"
            type="submit"
          >
            <IconTrash />
          </ActionIcon>
        )
      );
    } else {
      return item[column.fieldName];
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setChoices([...choices, newItem]);
    setNewItem("");
    props.datasChanged(true);
  };
  const updateColumnChoices = () => {
    console.log(choices);
    const endpoint = `${props.context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('MerakiLicenceOrder')/fields/GetByInternalNameOrTitle('${props.columnName}')`;
    const headers = {
      Accept: "application/json;odata=nometadata",
      "Content-type": "application/json;odata=nometadata",
      "odata-version": "",
      "IF-MATCH": "*",
      "X-HTTP-Method": "MERGE",
    };
    const body = JSON.stringify({
      Choices: choices,
    });
    props.context.spHttpClient
      .post(endpoint, SPHttpClient.configurations.v1, { headers, body })
      .then((response: any) => {
        if (response.ok) {
          let message = props.columnName + " choices updated successfully.";
          props.datasChanged(false);
          setOriginalChoices(choices);
          console.log("Column choices updated successfully");
          notifications.show({
            title: "Success",
            icon: <IconMoodSmileBeam />,
            withCloseButton: false,
            message: message,
            styles: (theme: any) => ({
              root: {
                backgroundColor: theme.colors.brand[6],
                borderColor: theme.colors.brand[6],

                "&::before": { backgroundColor: theme.white },
              },

              title: { color: theme.white },
              description: { color: theme.white },
              closeButton: {
                color: theme.white,
                "&:hover": { backgroundColor: theme.colors.brand[7] },
              },
            }),
          });
        } else {
          console.log("Failed to update column choices");
        }
      });
  };

  const anyChanges = () => {
    if (choices.length !== orginalChoices.length) return false;
    for (let i = 0; i < orginalChoices.length; i++) {
      if (orginalChoices[i] !== choices[i]) return false;
    }
    return true;
  };
  const changeBoolean: boolean | undefined = anyChanges();

  React.useEffect(() => {
    const endpoint = `${props.context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('MerakiLicenceOrder')/fields?$filter=EntityPropertyName eq '${props.columnName}'`;
    props.context.spHttpClient
      .get(endpoint, SPHttpClient.configurations.v1)
      .then((response: any) => response.json())
      .then((data: any) => {
        console.log("dat : ", data);
        setOriginalChoices(data.value[0].Choices);
        setChoices(data.value[0].Choices);
        setLoading(false);
      });
  }, []);

  return (
    <Box>
      <Paper>
        <Center>
          <Title order={5} color="dimmed">
            {props.columnName}
          </Title>
        </Center>
        {loading && (
          <Center>
            <Loader variant="dots" />
            <Space h="md" />
          </Center>
        )}
        {!loading && (
          <Box>
            <DetailsList
              isHeaderVisible={false}
              items={choices}
              columns={columns}
              selection={selection}
              checkboxVisibility={2}
              selectionMode={SelectionMode.single}
              onRenderItemColumn={onRenderItemColumn}
              checkButtonAriaLabel="select row"
            />
            <form onSubmit={handleSubmit}>
              <Space h="sm" />
              <Group position="apart">
                {" "}
                <TextInput
                  value={newItem}
                  placeholder="New Choice"
                  onChange={(event: any) =>
                    setNewItem(event.currentTarget.value)
                  }
                  style={{ flexGrow: 1 }}
                  rightSection={
                    <ActionIcon
                      color="brand"
                      variant="transparent"
                      type="submit"
                      disabled={newItem.length === 0}
                    >
                      <IconCirclePlus />
                    </ActionIcon>
                  }
                />
                <ActionIcon
                  color="brand"
                  onClick={updateColumnChoices}
                  disabled={changeBoolean}
                  variant="outline"
                  size="sm"
                >
                  <IconDeviceFloppy />
                </ActionIcon>
              </Group>
            </form>
            <Space h="sm" />
          </Box>
        )}
      </Paper>
    </Box>
  );
};
