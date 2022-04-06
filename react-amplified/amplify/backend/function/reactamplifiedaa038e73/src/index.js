/* Amplify Params - DO NOT EDIT
    API_REACTAMPLIFIED_GRAPHQLAPIENDPOINTOUTPUT
    API_REACTAMPLIFIED_GRAPHQLAPIIDOUTPUT
    ENV
    REGION
Amplify Params - DO NOT EDIT */

const AWS = require("aws-sdk");
const appsync = require("aws-appsync");
const gql = require("graphql-tag");
require("isomorphic-fetch");

const lambda = new AWS.Lambda({
  region: "ap-northeast-2",
});

AWS.config.update({
  region: process.env.REGION,
});

const credentials = AWS.config.credentials;

exports.handler = (event, context, callback) => {
  const graphqlClient = new appsync.AWSAppSyncClient({
    url: process.env.API_REACTAMPLIFIED_GRAPHQLAPIENDPOINTOUTPUT,
    region: process.env.REGION,
    auth: {
      type: "AWS_IAM",
      credentials: credentials,
    },
    disableOffline: true,
  });

  const createSensor = gql`
    mutation CreateSensor(
      $input: CreateSensorInput!
      $condition: ModelSensorConditionInput
    ) {
      createSensor(input: $input, condition: $condition) {
        id
        sensorType
        value
        isWarning
        timestamp
        createdAt
        updatedAt
      }
    }
  `;

  var real = JSON.stringify(event);
  var jsonObj = JSON.parse(real);

  const timestamp = new Date(jsonObj.sDateTime).valueOf();

  try {
    Object.keys(jsonObj).map(async function (index) {
      {
        if (
          index === "rVibration_Temp" ||
          index === "rVibration_Z_RMS_Velocity" ||
          index === "rVibration_X_RMS_Velocity" ||
          index === "wRMSCurrent" ||
          index === "wCurrentLoad" ||
          index === "wEncoderVelocity" ||
          index === "wCylinderStatus"
        ) {
          console.log("insert " + index + "value = " + jsonObj[index]);

          await graphqlClient.mutate({
            mutation: createSensor,
            variables: {
              input: {
                id: "0001",
                sensorType: index,
                value: jsonObj[index],
                isWarning: false,
                timestamp: timestamp,
              },
            },
          });
        }
      }
    });
    const response = {
      statusCode: 200,
      body: JSON.stringify({ message: "Success" }),
    };

    return response;
  } catch (err) {
    console.log("an error occured" + err.message);

    const response = {
      statusCode: 400,
      body: JSON.stringify({ message: err.message }),
    };

    return response;
  }
};
