import React, { useEffect, useState } from "react";

import ReactSpeedometer from "react-d3-speedometer";
import { Container, Header } from "semantic-ui-react";
import { Link } from "react-router-dom";

import { withAuthenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";

import * as subscriptions from "./graphql/subscriptions";
import Amplify, { API, graphqlOperation } from "aws-amplify";

import awsExports from "./aws-exports";
Amplify.configure(awsExports);

function App() {
  const [wCurrentLoad, setWCurrentLoad] = useState();
  const [wRMSCurrent, setWRMSCurrent] = useState();

  useEffect(() => {
    const RMSsubscription = API.graphql(
      graphqlOperation(subscriptions.onCreateSensor, {
        sensorType: "wRMSCurrent",
      })
    ).subscribe({
      next: (eventData) => {
        setWRMSCurrent(eventData.value.data.onCreateSensor.value);
      },
    });

    const Loadsubscription = API.graphql(
      graphqlOperation(subscriptions.onCreateSensor, {
        sensorType: "wCurrentLoad",
      })
    ).subscribe({
      next: (eventData) => {
        setWCurrentLoad(eventData.value.data.onCreateSensor.value);
      },
    });

    return () => {
      console.log("clean up in main");

      RMSsubscription.unsubscribe();
      Loadsubscription.unsubscribe();
    };
  }, []);

  return (
    <div style={styles}>
      <Container text style={{ marginBottom: "1em" }}>
        <br/>
        <Header as='h1' icon='plug' content='IoT Dashboard' />
      </Container>
      <Container style={{ marginTop: "2em" }}>
        <Header as="h2">공장 1 라인</Header>
        <p>차트를 클릭하면 시계열 그래프를 보실 수 있습니다.</p>
      </Container>
      <Container style={{ marginTop: "2em" }}>
        <Link to={"/detailPage?sensorType=wRMSCurrent"}>
          wRMSCurrent
          <ReactSpeedometer
            width={300}
            height={300}
            maxValue={150}
            segments={5}
            segmentColors={[
              "#bf616a",
              "#d08770",
              "#ebcb8b",
              "#a3be8c",
              "#b48ead",
            ]}
            value={wRMSCurrent}
          />
        </Link>
        <Link to={"/detailPage?sensorType=wCurrentLoad"}>
          wCurrentLoad
          <ReactSpeedometer
            width={300}
            height={300}
            maxValue={150}
            segments={5}
            segmentColors={[
              "#bf616a",
              "#d08770",
              "#ebcb8b",
              "#a3be8c",
              "#b48ead",
            ]}
            value={wCurrentLoad}
          />
        </Link>
      </Container>
    </div>
  );
}

export default withAuthenticator(App);

const styles = {
  marginLeft: "1em",
  marginRight: "1em",
};
