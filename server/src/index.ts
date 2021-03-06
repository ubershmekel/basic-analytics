import { Event, Prisma, PrismaClient } from "@prisma/client";
import express from "express";
import { EventReturn } from "../../client/src/sdk";

const prisma = new PrismaClient();
const app = express();

app.use(express.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  // https://stackoverflow.com/questions/32500073/request-header-field-access-control-allow-headers-is-not-allowed-by-itself-in-pr/38259193#38259193

  next();
});

app.get(`/`, async (req, res) => {
  res.json({
    hello: "can I help you with anything?",
  });
});

app.post(`/event`, async (req, res) => {
  const userEvent = req.body as Event;
  console.log("userEvent", userEvent);

  if (!userEvent.sessionId || !userEvent.domain || !userEvent.key) {
    res.status(400).send({ error: "invalid request" });
    return;
  }

  let reqIp = req.ip;
  const forwardedIp = req.headers["x-forwarded-for"];
  if (forwardedIp) {
    // When the req.ip is the address of the reverse proxy
    if (forwardedIp[0].length > 1) {
      // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Forwarded-For
      // If a request goes through multiple proxies, the IP addresses of each
      // successive proxy is listed. This means that, given well-behaved client
      // and proxies, the rightmost IP address is the IP address of the most
      // recent proxy and the leftmost IP address is the IP address of the
      // originating client.
      reqIp = forwardedIp[0];
    } else {
      reqIp = forwardedIp as string;
    }
  }

  const event = await prisma.event.create({
    data: {
      sessionId: userEvent.sessionId,
      domain: userEvent.domain,
      key: userEvent.key,
      ip: reqIp,
      userAgent: req.headers["user-agent"] || "",
      iv: userEvent.iv,
      fv: userEvent.fv,
      jv: userEvent.jv,
      sv: userEvent.sv,
    },
  });

  const returnData: EventReturn = {
    success: true,
  };

  res.json(returnData);
});

app.use(function (
  err: Error,
  req: express.Request,
  res: express.Response,
  next: Function
) {
  // Note this catches async errors too if you use express 5.
  // https://stackoverflow.com/questions/40772614/expressjs-error-handling-doesnt-work
  // https://expressjs.com/en/guide/error-handling.html
  console.log("**************************");
  console.log("* [Error middleware]: err:", err);
  console.log("**************************");
  if (res.headersSent) {
    return next(err);
  }
  res.status(500).send({ error: "unknown server failure, sorry" });
});

const port = process.env.port || 3002;
const server = app.listen(port, () =>
  // ?????? See sample requests: http://pris.ly/e/ts/rest-express#3-using-the-rest-api
  console.log(`???? Server ready at: http://localhost:${port}`)
);
