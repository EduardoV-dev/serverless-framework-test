import { Event } from "serverless/aws";
import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";

const greetUser = async (
  event: APIGatewayProxyEventV2,
): Promise<APIGatewayProxyResultV2> => {
  const data = JSON.parse(event.body || "{}");

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
    path: "/user/greet",
  },
};

export default greetUser;
