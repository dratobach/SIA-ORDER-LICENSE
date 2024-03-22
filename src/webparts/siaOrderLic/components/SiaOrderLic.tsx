import * as React from "react";
import { Center, Container, MantineProvider, Title } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { useEffect } from "react";
import { OrderForm } from "./OrderForm";

export const SiaOrderLic: React.FunctionComponent<any> = (props) => {
  useEffect(() => {
    console.log(props);
  }, []);

  return (
    <MantineProvider
      theme={{
        colors: {
          brand: [
            "#9D28E7",
            "#9408ED",
            "#9A63BC",
            "#9144C1",
            "#882CC1",
            "#7F17C0",
            "#7802C2",
            "#68139D",
            "#5B1E81",
            "#50246B",
          ],
        },
        primaryColor: "brand",
      }}
      withGlobalStyles
      withNormalizeCSS
    >
      {" "}
      <Notifications />
      <Container size="xl">
        <Center>
          <Title order={1}>Smart Internet Access - Licence ordering</Title>
        </Center>

        <OrderForm
          context={props.context}
          siteUrl={props.siteUrl}
          user={props.user}
        />
      </Container>
    </MantineProvider>
  );
};
