const getIp = (event: any) => {
  const { remoteAddress } = event.node.req.socket;
  if (remoteAddress && ipAddressRegex.test(remoteAddress)) {
    return remoteAddress;
  }

  const { headers } = event.node.req;
  const ipAddressRegex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;

  for (const key in headers) {
    if (
      !headers[key] ||
      Array.isArray(headers[key]) ||
      !key.toLocaleLowerCase().includes("forward")
    ) {
      continue;
    }

    const isIp = ipAddressRegex.test(headers[key] as string);
    if (isIp) {
      event.context.location = { ip: headers[key] };
      return;
    }
  }
};

type IpLookupResponse = {
  query: string;
  status: string;
  country: string;
  countryCode: string;
  region: string;
  regionName: string;
  city: string;
  zip: string;
  lat: number;
  lon: number;
  timezone: string;
  isp: string;
  org: string;
  as: string;
};

export default defineEventHandler(async (event) => {
  const ip = getIp(event);
  if (!ip) {
    console.log("No IP found");
    return;
  }

  try {
    const { lat, lon, status, city } = (await $fetch(
      `http://ip-api.com/json/${ip}`,
    )) as IpLookupResponse;
    if (status !== "success") {
      throw new Error("IP lookup failed");
    }
    event.context.location = { latitude: lat, longitude: lon, city };
  } catch (err) {
    console.log(err);
  }
});
