#!/usr/bin/env bash
# stop script on error
set -e

# Check for python 3
if ! python3 --version &> /dev/null; then
  printf "\nERROR: python3 must be installed.\n"
  exit 1
fi

# Check to see if root CA file exists, download if not
if [ ! -f ./root-CA.crt ]; then
  printf "\nDownloading AWS IoT Root CA certificate from AWS...\n"
  curl https://www.amazontrust.com/repository/AmazonRootCA1.pem > root-CA.crt
fi

# Check to see if AWS Device SDK for Python exists, download if not
# if [ ! -d ./aws-iot-device-sdk-python-v2 ]; then
#   printf "\nCloning the AWS SDK...\n"
#   git clone https://github.com/aws/aws-iot-device-sdk-python-v2.git --recursive
# fi
if [ ! -d ./aws-iot-device-sdk-python ]; then
  printf "\nCloning the AWS SDK...\n"
  git clone https://github.com/aws/aws-iot-device-sdk-python.git --recursive
fi

# Check to see if AWS Device SDK for Python is already installed, install if not
if ! python3 -c "import awsiot" &> /dev/null; then
  printf "\nInstalling AWS SDK...\n"
  python3 -m pip install ./aws-iot-device-sdk-python
  result=$?
  if [ $result -ne 0 ]; then
    printf "\nERROR: Failed to install SDK.\n"
    exit $result
  fi
fi

if ! python -c "import AWSIoTPythonSDK" &> /dev/null; then
  printf "\nInstalling AWS SDK...\n"
  pushd aws-iot-device-sdk-python-v2
  pip install AWSIoTPythonSDK
  pip3 install AWSIoTPythonSDK
  result=$?
  popd
  if [ $result -ne 0 ]; then
    printf "\nERROR: Failed to install SDK.\n"
    exit $result
  fi
fi
# run pub/sub sample app using certificates downloaded in package
printf "\nRunning pub/sub sample application...\n"
# python3 aws-iot-device-sdk-python-v2/samples/pubsub.py --endpoint a367apnyib4pg9-ats.iot.ap-northeast-2.amazonaws.com --ca_file root-CA.crt --cert MyThing.cert.pem --key MyThing.private.key --client_id basicPubSub --topic sdk/test/python --count 0
python3 iot-app-hol-online/sensor-data-simulator/pubsub_simulator_inference.py --endpoint a367apnyib4pg9-ats.iot.ap-northeast-2.amazonaws.com -r root-CA.crt -c MyThing.cert.pem --key MyThing.private.key -id basicPubSub -t iot/sensors