# Building IoT Application with AWS Amplify and AWS AppSync

In this lab, we will build IoT Application with various AWS services:
* React App for user interface
* AWS AppSync for GraphQL interface to combine data from Amazon DynamoDB
* AWS Lambda for deliver data from AWS IoT Core to AWS AppSync
* Amazon Cognito for authentication
* AWS Amplify cli for deploying auth, api and function 

There are two folder in this repository.
* react-amplified : This is for provisioning Amplify category resources(Auth, Api, Function).
* sensor-data-simulator : This for publishing the MQTT message with a specific topic.