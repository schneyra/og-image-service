const { builder } = require("@netlify/functions");
const createOgImage = require("./createOgImage");

async function handler(event, context) {
  let pathSplit = event.path.split("/").filter(entry => !!entry);
  console.log(pathSplit);

  let [myfunction, site, content] = pathSplit;

  if (site !== 'msme') { return; }

  try {
    console.log(`Generating OG for martinschneider.me with "${decodeURIComponent(content)}"`);

    const buffer = await createOgImage(decodeURIComponent(content));

    return {
      statusCode: 200,
      headers: {
        "content-type": 'image/jpeg',
      },
      body: buffer.toString("base64"),
      isBase64Encoded: true
    };
  } catch (error) {
    console.log("Error", error);

    return {
      statusCode: 500,
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        message: `Error: ${error}`
      })
    };
  }
}

exports.handler = builder(handler);