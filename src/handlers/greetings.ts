import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import { Event } from "serverless/aws";

const { ENV, PORT } = process.env;

const helloTS = async (
  event: APIGatewayProxyEventV2,
): Promise<APIGatewayProxyResultV2> => {
  console.log("variables", process.env);

  return {
    statusCode: 201,
    body: JSON.stringify({
      message: "Hello from TypeScript Lambda! - Updated",
      variables: { ENV, PORT },
    }),
  };
};

export const event: Event = {
  httpApi: {
    method: "get",
    path: "/hello-ts",
  },
};

export default helloTS;
