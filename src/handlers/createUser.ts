import { Event } from "serverless/aws";
import { APIGatewayProxyEventV2 } from "aws-lambda";

const createUser = async (event: APIGatewayProxyEventV2) => {
  const data = JSON.parse(event.body || "{}");
  console.info("user data", data);

  return {
    statusCode: 201,
    body: JSON.stringify({
      message: "User created successfully!",
      input: `Hello ${data.user}!!!`,
    }),
  };
};

export const event: Event = {
  httpApi: {
    method: "post",
    path: "/create-user",
  },
};

export default createUser;
