import * as React from "react";
import {
  SPHttpClient,
  SPHttpClientResponse,
  ISPHttpClientOptions,
} from "@microsoft/sp-http";

import {
  ActionIcon,
  Badge,
  Box,
  // Badge,
  // Box,
  Button,
  Flex,
  Grid,
  // Group,
  Paper,
  Radio,
  Select,
  Space,
  Stack,
  TextInput,
  // Radio,
  // Select,
  // Space,
  // Stack,
  // TextInput,
  Tooltip,
  rem,
  // rem,
} from "@mantine/core";
import { useEffect } from "react";
import {
  IconCirclePlus,
  IconDatabaseEdit,
  IconMoodSadSquint,
  IconMoodSmileBeam,
  IconTrash,
  IconX,
  //  IconTrash,
  //  IconX,
} from "@tabler/icons-react";
import { Admin } from "./Admin";
import { notifications } from "@mantine/notifications";
//import { useMediaQuery } from "@mantine/hooks";

interface IOrder {
  items: Array<string>;
  orderType: string;
  EndCustomerBusinessName: string;
  EndCustomerAddress: string;
  EndCustomerContactName: string;
  EndCustomerContactNumber: string;
  Sector: string;
  NFRProjectCode: string;
  // ... other properties
}
export const OrderForm: React.FunctionComponent<any> = (props) => {
  const [hardware, setHardware] = React.useState<string | null>(null);
  const [hardwareChoices, setHardwareChoices] = React.useState([]);
  const [tierChoices, setTierChoices] = React.useState<string[]>([]);
  const [termChoices, setTermChoices] = React.useState<string[]>([]);
  const [isAdmin, setIsAdmin] = React.useState<boolean>(false);
  const [adminMode, setAdminMode] = React.useState<boolean>(false);
  // const isSmallScreen = useMediaQuery("(max-width: 500px)");
  // const direction = isSmallScreen ? "column" : "row";

  const [tier, setTier] = React.useState<string | null>(null);
  const [term, setTerm] = React.useState<string | null>(null);
  const [order, setOrder] = React.useState<IOrder>({
    items: [],
    orderType: "Customer order",
    EndCustomerBusinessName: "",
    EndCustomerAddress: "",
    EndCustomerContactName: "",
    EndCustomerContactNumber: "",
    Sector: "Business. (SMB & Volume Desk)",
    NFRProjectCode: "",
  });

  const checkAdminAccess = () => {
    return new Promise((resolve, reject) => {
      props.context.spHttpClient
        .get(
          `${props.context.pageContext.web.absoluteUrl}/_api/web/sitegroups/getbyname('Full Edit')/CanCurrentUserViewMembership`,
          SPHttpClient.configurations.v1
        )
        .then((response: SPHttpClientResponse) => {
          response.json().then((data: any) => {
            console.log("access ", data);
            resolve(data.value);
          });
        });
    });
  };
  const getHardwareChoices = () => {
    return new Promise((resolve, reject) => {
      props.context.spHttpClient
        .get(
          `${props.context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('MerakiLicenceOrder')/fields?$filter=EntityPropertyName eq 'Hardware'`,
          SPHttpClient.configurations.v1
        )
        .then((response: SPHttpClientResponse) => {
          response.json().then((responseJSON) => {
            resolve(responseJSON.value[0].Choices);
          });
        });
    });
  };
  const getTierChoices = () => {
    return new Promise((resolve, reject) => {
      props.context.spHttpClient
        .get(
          `${props.context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('MerakiLicenceOrder')/fields?$filter=EntityPropertyName eq 'Tiers'`,
          SPHttpClient.configurations.v1
        )
        .then((response: SPHttpClientResponse) => {
          response.json().then((responseJSON) => {
            resolve(responseJSON.value[0].Choices);
          });
        });
    });
  };
  const getTermChoices = () => {
    return new Promise((resolve, reject) => {
      props.context.spHttpClient
        .get(
          `${props.context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('MerakiLicenceOrder')/fields?$filter=EntityPropertyName eq 'Terms'`,
          SPHttpClient.configurations.v1
        )
        .then((response: SPHttpClientResponse) => {
          response.json().then((responseJSON) => {
            console.log(responseJSON.value[0].Choices);
            resolve(responseJSON.value[0].Choices);
          });
        });
    });
  };

  const resetForm = () => {
    setOrder({
      items: [],
      orderType: "Customer order",
      EndCustomerBusinessName: "",
      EndCustomerAddress: "",
      EndCustomerContactName: "",
      EndCustomerContactNumber: "",
      Sector: "Business. (SMB & Volume Desk)",
      NFRProjectCode: "",
    });
    setTier(null);
    setHardware(null);
    setTerm(null);
  };

  const handleClearItems = () => {
    setOrder((prevOrder) => ({
      ...prevOrder,
      items: [],
    }));
    setTier(null);
    setHardware(null);
    setTerm(null);
  };

  const addOrder = () => {
    //let userId = currentUser ? currentUser.Id : 0;

    return new Promise((resolve, reject) => {
      const spOpts: ISPHttpClientOptions = {
        headers: {
          "Content-type": "application/json;odata=nometadata",
        },
        body: JSON.stringify({
          LicenseDetails: order.items.join("\n"),
          OrderType: order.orderType,
          EndCustomerBusinessName: order.EndCustomerBusinessName,
          EndCustomerAddress: order.EndCustomerAddress,
          EndCustomerContactName: order.EndCustomerContactName,
          EndCustomerContactNumber: order.EndCustomerContactNumber,
          Sector: order.Sector,
          NFRProjectCode: order.NFRProjectCode,
        }),
      };
      props.context.spHttpClient
        .post(
          `${props.context.pageContext.web.absoluteUrl}/_api/web/lists/getbytitle('MerakiLicenceOrder')/items`,
          SPHttpClient.configurations.v1,
          spOpts
        )
        .then((response: SPHttpClientResponse) => {
          if (!response.ok) {
            console.log("error");

            notifications.show({
              title: "Error",
              icon: <IconMoodSadSquint />,
              withCloseButton: true,
              message: "Error accessing data.",
              styles: (theme: any) => ({
                root: {
                  backgroundColor: theme.colors.red[6],
                  borderColor: theme.colors.red[6],

                  "&::before": { backgroundColor: theme.white },
                },

                title: { color: theme.white },
                description: { color: theme.white },
                closeButton: {
                  color: theme.white,
                  "&:hover": { backgroundColor: theme.colors.red[7] },
                },
              }),
            });
            resolve("error");
          } else {
            response.json().then((responseJSON) => {
              notifications.show({
                title: "Success",
                icon: <IconMoodSmileBeam />,
                withCloseButton: false,
                message:
                  "Order has been added. An confirmation email will arrive shortly.",
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

              resolve(responseJSON.Id);
            });
            resetForm();
          }
        });
    });
  };

  const isSwitch = (device: string) => {
    return device.substr(0, 2) === "MS" ? true : false;
  };
  const isAddDisabled = () => {
    if (!order.items) return true;
    if (!term) return true;
    if (hardware) {
      if (isSwitch(hardware) && tier) {
        return false;
      }
      return false;
    }
    return true;
  };
  const updateHardware = (that: any) => {
    if (isSwitch(that)) {
      setTier(null);
    }
    console.log(that);
    setHardware(that);
  };

  const handleAddItem = () => {
    let newItem = "LIC-" + hardware;
    newItem += tier ? "-" + tier + "-" + term : "-" + term;
    if (newItem) {
      let newItems: Array<string> = [];
      newItems = order.items;
      order.items.push(newItem);
      setOrder((prevOrder) => ({
        ...prevOrder,
        items: newItems,
      }));
    }
  };

  const toggleAdmin = () => {
    setAdminMode(!adminMode);
  };

  const handleRemoveItem = (index: number) => {
    setOrder((prevOrder) => ({
      ...prevOrder,
      items: order.items.filter((item, i) => i !== index),
    }));
  };

  const getData = () => {
    getHardwareChoices().then((choices: any) => {
      setHardwareChoices(choices);
    });
    getTierChoices().then((choices: Array<string>) => {
      setTierChoices(choices);
    });
    getTermChoices().then((choices: Array<string>) => {
      setTermChoices(choices);
    });
  };
  useEffect(() => {
    console.log("props", props.context.pageContext.web.absoluteUrl);
    getData();
    checkAdminAccess().then((accessData: boolean) => {
      console.log(accessData);
      setIsAdmin(accessData);
    });
  }, []);

  return (
    <Paper shadow="xs" radius="xs" p="md" withBorder>
      {!adminMode && (
        <Grid>
          <Grid.Col sm={12} lg={7}>
            <Grid>
              <Grid.Col lg={10}>
                <Grid>
                  <Grid.Col sm={12} lg={4}>
                    <Select
                      style={{ width: "100%" }}
                      label="Hardware"
                      placeholder="Select"
                      value={hardware}
                      onChange={updateHardware}
                      data={hardwareChoices}
                    />
                  </Grid.Col>
                  <Grid.Col sm={12} lg={4}>
                    <Select
                      style={{ width: "100%" }}
                      value={tier}
                      onChange={setTier}
                      label="Tier"
                      placeholder="Select"
                      disabled={hardware?.substring(0, 2) === "MS"}
                      data={tierChoices}
                    />
                  </Grid.Col>
                  <Grid.Col sm={12} lg={4}>
                    <Select
                      style={{ width: "100%" }}
                      value={term}
                      onChange={setTerm}
                      label="Term"
                      placeholder="Select"
                      data={termChoices}
                    />
                  </Grid.Col>
                </Grid>
              </Grid.Col>
              <Grid.Col sm={12} lg={2}>
                <Flex align="left" className="addLicenseContainer">
                  <Tooltip label="Add Licence to Order" openDelay={500}>
                    <ActionIcon
                      color="brand"
                      align="bottom"
                      size="xl"
                      variant="transparent"
                      disabled={isAddDisabled()}
                      onClick={handleAddItem}
                    >
                      <IconCirclePlus size="2.125rem" />
                    </ActionIcon>
                  </Tooltip>
                </Flex>
              </Grid.Col>
            </Grid>
            <Paper withBorder sx={{ padding: 5 }}>
              <Box sx={{ minHeight: 300, overflow: "auto" }}>
                {order.items.map((item, index) => (
                  <Badge
                    sx={{ margin: 5 }}
                    variant="outline"
                    pl={3}
                    leftSection={
                      <ActionIcon
                        size="xs"
                        radius="xl"
                        variant="transparent"
                        onClick={() => {
                          handleRemoveItem(index);
                        }}
                      >
                        <IconX size={rem(10)} />
                      </ActionIcon>
                    }
                  >
                    {item}
                  </Badge>
                ))}
              </Box>
              <Flex justify="end" align="end">
                <Tooltip label="Clear all Licences" openDelay={500}>
                  <ActionIcon
                    label="YOOO"
                    size="sm"
                    color="red"
                    variant="transparent"
                    onClick={handleClearItems}
                    disabled={order.items.length === 0}
                  >
                    <IconTrash size="1.125rem" />
                  </ActionIcon>
                </Tooltip>
              </Flex>
            </Paper>
          </Grid.Col>
          <Grid.Col sm={12} lg={5}>
            <Paper withBorder sx={{ padding: 5 }}>
              <Radio.Group
                value={order.orderType}
                onChange={(value: string) =>
                  setOrder((prevOrder) => ({
                    ...prevOrder,
                    EndCustomerContactName: "",
                    EndCustomerAddress: "",
                    EndCustomerContactNumber: "",
                    EndCustomerBusinessName: "",
                    NFRProjectCode: "",
                    orderType: value,
                  }))
                }
              >
                <Stack>
                  <Radio
                    checked
                    label="Customer order"
                    value="Customer order"
                  />
                  <Radio label="Not for resale" value="Not for resale" />
                </Stack>
              </Radio.Group>
            </Paper>
            <Space h="md" />
            {order.orderType !== "Customer order" && (
              <Paper withBorder sx={{ padding: 5 }}>
                <TextInput
                  placeholder="Project / Cost Centre Code"
                  label="NFR finance details"
                  value={order.NFRProjectCode}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    const value = event.currentTarget.value;
                    console.log(event.currentTarget.value);
                    setOrder((prevOrder) => ({
                      ...prevOrder,
                      NFRProjectCode: value,
                    }));
                  }}
                />
              </Paper>
            )}
            {order.orderType === "Customer order" && (
              <Stack>
                <Paper withBorder sx={{ padding: 5 }}>
                  <Radio.Group
                    value={order.Sector}
                    onChange={(value: string) =>
                      setOrder((prevOrder) => ({
                        ...prevOrder,
                        Sector: value,
                      }))
                    }
                  >
                    <Stack>
                      <Radio
                        checked
                        label="Business. (SMB & Volume Desk)"
                        value="Business. (SMB & Volume Desk)"
                      />
                      <Radio
                        label="LE/PS. (Mid-tier and Strategic Accounts)"
                        value="LE/PS. (Mid-tier and Strategic Accounts)"
                      />
                    </Stack>
                  </Radio.Group>
                </Paper>
                <Space h="md" />
                <Paper withBorder sx={{ padding: 5 }}>
                  <Stack>
                    <TextInput
                      placeholder="End Customer Business Name"
                      label="End Customer Business Name"
                      value={order.EndCustomerBusinessName}
                      onChange={(
                        event: React.ChangeEvent<HTMLInputElement>
                      ) => {
                        const value = event.currentTarget.value;
                        console.log(event.currentTarget.value);
                        setOrder((prevOrder) => ({
                          ...prevOrder,
                          EndCustomerBusinessName: value,
                        }));
                      }}
                    />
                    <TextInput
                      placeholder="End Customer Address"
                      label="End Customer Address"
                      value={order.EndCustomerAddress}
                      onChange={(
                        event: React.ChangeEvent<HTMLInputElement>
                      ) => {
                        const value = event.currentTarget.value;
                        console.log(event.currentTarget.value);
                        setOrder((prevOrder) => ({
                          ...prevOrder,
                          EndCustomerAddress: value,
                        }));
                      }}
                    />
                    <TextInput
                      placeholder="End Customer Contact Name"
                      label="End Customer Contact Name"
                      value={order.EndCustomerContactName}
                      onChange={(
                        event: React.ChangeEvent<HTMLInputElement>
                      ) => {
                        const value = event.currentTarget.value;
                        console.log(event.currentTarget.value);
                        setOrder((prevOrder) => ({
                          ...prevOrder,
                          EndCustomerContactName: value,
                        }));
                      }}
                    />
                    <TextInput
                      placeholder="End Customer Contact Number"
                      label="End Customer Contact Number"
                      value={order.EndCustomerContactNumber}
                      onChange={(
                        event: React.ChangeEvent<HTMLInputElement>
                      ) => {
                        const value = event.currentTarget.value;
                        console.log(event.currentTarget.value);
                        setOrder((prevOrder) => ({
                          ...prevOrder,
                          EndCustomerContactNumber: value,
                        }));
                      }}
                    />
                  </Stack>
                </Paper>
              </Stack>
            )}
          </Grid.Col>
        </Grid>

        // <Grid>
        //   <Grid.Col sm={1} lg={7}>
        //     <Stack spacing="xs" sx={{ gap: 0 }}>
        //       {" "}
        //       <Grid>
        //         <Group>
        //           <Group  direction={direcopction}>
        //             <Select
        //               style={{ width: "100%" }}
        //               label="Hardware"
        //               placeholder="Select"
        //               value={hardware}
        //               onChange={updateHardware}
        //               data={hardwareChoices}
        //             />
        //             <Select
        //               style={{ width: "100%" }}
        //               value={tier}
        //               onChange={setTier}
        //               label="Tier"
        //               placeholder="Select"
        //               disabled={hardware?.substring(0, 2) === "MS"}
        //               data={tierChoices}
        //             />
        //             <Select
        //               style={{ width: "100%" }}
        //               value={term}
        //               onChange={setTerm}
        //               label="Term"
        //               placeholder="Select"
        //               data={termChoices}
        //             />

        //             <Flex
        //               mih={50}
        //               gap="xs"
        //               justify="center"
        //               align="flex-end"
        //               direction="row"
        //               wrap="nowrap"
        //             >
        //               {" "}
        //               <Tooltip label="Add Licence to Order" openDelay={500}>
        //                 <ActionIcon
        //                   color="brand"
        //                   align="bottom"
        //                   size="xl"
        //                   variant="transparent"
        //                   disabled={isAddDisabled()}
        //                   onClick={handleAddItem}
        //                 >
        //                   <IconCirclePlus size="2.125rem" />
        //                 </ActionIcon>
        //               </Tooltip>
        //             </Flex>
        //           </Flex>
        //         </Group>
        //       </Grid>
        //       <Space h="md" />
        //       <Paper withBorder sx={{ padding: 5 }}>
        //         <Box sx={{ minHeight: 300, overflow: "auto" }}>
        //           {order.items.map((item, index) => (
        //             <Badge
        //               sx={{ margin: 5 }}
        //               variant="outline"
        //               pl={3}
        //               leftSection={
        //                 <ActionIcon
        //                   size="xs"
        //                   radius="xl"
        //                   variant="transparent"
        //                   onClick={() => {
        //                     handleRemoveItem(index);
        //                   }}
        //                 >
        //                   <IconX size={rem(10)} />
        //                 </ActionIcon>
        //               }
        //             >
        //               {item}
        //             </Badge>
        //           ))}
        //         </Box>
        //         <Flex justify="end" align="end">
        //           <Tooltip label="Clear all Licences" openDelay={500}>
        //             <ActionIcon
        //               label="YOOO"
        //               size="sm"
        //               color="red"
        //               variant="transparent"
        //               onClick={handleClearItems}
        //               disabled={order.items.length === 0}
        //             >
        //               <IconTrash size="1.125rem" />
        //             </ActionIcon>
        //           </Tooltip>
        //         </Flex>
        //       </Paper>
        //     </Stack>
        //   </Grid.Col>
        //   <Grid.Col lg={5} sm={1}>
        //     <Paper withBorder sx={{ padding: 5 }}>
        //       <Radio.Group
        //         value={order.orderType}
        //         onChange={(value: string) =>
        //           setOrder((prevOrder) => ({
        //             ...prevOrder,
        //             EndCustomerContactName: "",
        //             EndCustomerAddress: "",
        //             EndCustomerContactNumber: "",
        //             EndCustomerBusinessName: "",
        //             NFRProjectCode: "",
        //             orderType: value,
        //           }))
        //         }
        //       >
        //         <Stack>
        //           <Radio
        //             checked
        //             label="Customer order"
        //             value="Customer order"
        //           />
        //           <Radio label="Not for resale" value="Not for resale" />
        //         </Stack>
        //       </Radio.Group>
        //     </Paper>
        //     <Space h="md" />
        //     {order.orderType !== "Customer order" && (
        //       <Paper withBorder sx={{ padding: 5 }}>
        //         <TextInput
        //           placeholder="Project / Cost Centre Code"
        //           label="NFR finance details"
        //           value={order.NFRProjectCode}
        //           onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
        //             const value = event.currentTarget.value;
        //             console.log(event.currentTarget.value);
        //             setOrder((prevOrder) => ({
        //               ...prevOrder,
        //               NFRProjectCode: value,
        //             }));
        //           }}
        //         />
        //       </Paper>
        //     )}
        //     {order.orderType === "Customer order" && (
        //       <Stack>
        //         <Paper withBorder sx={{ padding: 5 }}>
        //           <Radio.Group
        //             value={order.Sector}
        //             onChange={(value: string) =>
        //               setOrder((prevOrder) => ({
        //                 ...prevOrder,
        //                 Sector: value,
        //               }))
        //             }
        //           >
        //             <Stack>
        //               <Radio
        //                 checked
        //                 label="Business. (SMB & Volume Desk)"
        //                 value="Business. (SMB & Volume Desk)"
        //               />
        //               <Radio
        //                 label="LE/PS. (Mid-tier and Strategic Accounts)"
        //                 value="LE/PS. (Mid-tier and Strategic Accounts)"
        //               />
        //             </Stack>
        //           </Radio.Group>
        //         </Paper>
        //         <Space h="md" />
        //         <Paper withBorder sx={{ padding: 5 }}>
        //           <Stack>
        //             <TextInput
        //               placeholder="End Customer Business Name"
        //               label="End Customer Business Name"
        //               value={order.EndCustomerBusinessName}
        //               onChange={(
        //                 event: React.ChangeEvent<HTMLInputElement>
        //               ) => {
        //                 const value = event.currentTarget.value;
        //                 console.log(event.currentTarget.value);
        //                 setOrder((prevOrder) => ({
        //                   ...prevOrder,
        //                   EndCustomerBusinessName: value,
        //                 }));
        //               }}
        //             />
        //             <TextInput
        //               placeholder="End Customer Address"
        //               label="End Customer Address"
        //               value={order.EndCustomerAddress}
        //               onChange={(
        //                 event: React.ChangeEvent<HTMLInputElement>
        //               ) => {
        //                 const value = event.currentTarget.value;
        //                 console.log(event.currentTarget.value);
        //                 setOrder((prevOrder) => ({
        //                   ...prevOrder,
        //                   EndCustomerAddress: value,
        //                 }));
        //               }}
        //             />
        //             <TextInput
        //               placeholder="End Customer Contact Name"
        //               label="End Customer Contact Name"
        //               value={order.EndCustomerContactName}
        //               onChange={(
        //                 event: React.ChangeEvent<HTMLInputElement>
        //               ) => {
        //                 const value = event.currentTarget.value;
        //                 console.log(event.currentTarget.value);
        //                 setOrder((prevOrder) => ({
        //                   ...prevOrder,
        //                   EndCustomerContactName: value,
        //                 }));
        //               }}
        //             />
        //             <TextInput
        //               placeholder="End Customer Contact Number"
        //               label="End Customer Contact Number"
        //               value={order.EndCustomerContactNumber}
        //               onChange={(
        //                 event: React.ChangeEvent<HTMLInputElement>
        //               ) => {
        //                 const value = event.currentTarget.value;
        //                 console.log(event.currentTarget.value);
        //                 setOrder((prevOrder) => ({
        //                   ...prevOrder,
        //                   EndCustomerContactNumber: value,
        //                 }));
        //               }}
        //             />
        //           </Stack>
        //         </Paper>
        //       </Stack>
        //     )}
        //   </Grid.Col>
        // </Grid>
      )}
      {adminMode && (
        <Admin
          context={props.context}
          toggleAdmin={toggleAdmin}
          getData={getData}
        />
      )}
      <Flex
        style={{ height: "100%", width: "100%" }}
        justify={isAdmin ? "space-between" : "flex-end"}
        align="end"
      >
        {isAdmin && !adminMode && (
          <Tooltip label="Configure Dropdown Options" openDelay={500}>
            <ActionIcon
              color="brand"
              hidden={true}
              align="bottom"
              size="xl"
              variant="transparent"
              //disabled={isAddDisabled()}
              onClick={toggleAdmin}
            >
              <IconDatabaseEdit size="2.125rem" />
            </ActionIcon>
          </Tooltip>
        )}

        {!adminMode && (
          <Button
            disabled={order.items.length === 0}
            onClick={() => {
              addOrder().then((resp: any) => {
                console.log("resp", resp);
              });
            }}
          >
            Order
          </Button>
        )}
      </Flex>
    </Paper>
  );
};
