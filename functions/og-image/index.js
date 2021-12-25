const { builder } = require("@netlify/functions");
const createOgImage = require("./createOgImage");

async function handler(event, context) {
  let pathSplit = event.path.split("/").filter(entry => !!entry);
  console.log(pathSplit);

  let [myfunction, site, content] = pathSplit;

  if (site !== 'msme') { return; }

  try {
    console.log("Generating OG for martinschneider.me");

    const stats = await createOgImage(decodeURIComponent(content));

    let format = Object.keys(stats).pop();
    let stat = stats[format][0];

    return {
      statusCode: 200,
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        url: `https://og-image.martinschneider.me${stat.url}`
      })
    };
  } catch (error) {
    console.log("Error", error);

    return {
      statusCode: 500,
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        message: `Error`
      })
    };
  }
}

exports.handler = builder(handler);