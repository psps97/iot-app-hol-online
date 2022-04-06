import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import Amplify, { API, graphqlOperation } from "aws-amplify";
import * as queries from "./graphql/queries";

import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import qs from "qs";

const DetailPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  console.log("location =", location);

  const query = qs.parse(location.search, {
    ignoreQueryPrefix: true,
  });

  const type = query.sensorType;
  console.log(type);
  const [contents, setContents] = useState([]);

  useEffect(() => {
    const listSensors = async () => {
      try {
        const data = await API.graphql(
          graphqlOperation(queries.listSensors, {
            sensorType: type,
            limit: 60,
            sortDirection: "DESC",
          })
        );

        console.log("data =", data);
        const tmp = await data.data.listSensors.items;
        setContents(tmp);
      } catch (err) {
        console.log("error: ", err);
      }
    };
    const intervalID = setInterval(() => {
      listSensors();
    }, 2000);

    return () => {
      console.log("clean up in detail");
      clearInterval(intervalID);
    };
  }, []);

  const data = [];
  const timestamp = [];

  contents.map(
    (r, idx) => (
      (data[idx] = r.value), (timestamp[idx] = new Date(r.timestamp))
    )
  );
  data.reverse();
  timestamp.reverse();

  //console.log("data === " + data.reverse());
  // console.log("data === " + timestamp.reverse());

  const options = {
    chart: {
      type: "spline",
    },
    title: {
      text: type,
    },
    xAxis: {
      categories: timestamp,
    },
    series: [
      {
        data: data,
      },
    ],
  };

  const handleGoBack = () => {
    navigate("/");
  };

  return (
    <div>
      <button onClick={handleGoBack}>go back</button>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};

export default DetailPage;
