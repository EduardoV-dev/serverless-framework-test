import { Event } from "serverless/aws";

const helloUser = async (event) => ({
  statusCode: 200,
  body: JSON.stringify({
    message: `Hello, ${event.pathParameters.name}!`,
  }),
});

export const event: Event = {
  httpApi: {
    path: "/hello-user",
    method: "get",
  },
};

export default helloUser;
