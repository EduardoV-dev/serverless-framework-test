import { Event } from "serverless/aws";

const hello = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Go Serverless v4! Your function executed successfully!",
    }),
  };
};

export const event: Event = {
  httpApi: {
    method: "get",
    path: "/hello",
  },
};

export default hello;
