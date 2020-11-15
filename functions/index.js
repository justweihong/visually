const functions = require('firebase-functions');
const cors = require('cors')({ origin: true });

// Testing API call to check if Firebase cloud functions is working.
exports.helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", {structuredData: true});
  response.send("Hello from Firebase!");
});

// Attempt to get ip address for users to categorise the images taken.
exports.getIP = functions.https.onRequest((request, response) => {
  response.set('Access-Control-Allow-Origin', '*');
  const ipAddress = request.headers['x-forwarded-for'] || request.connection.remoteAddress;
  return response.status(200).send(ipAddress);
});

// Get entire response header. 
// Note: FAILED CORS
exports.getHeaders = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    return res.status(200).send(req.headers);
  })
});

// Get ip address.
// Result: Passed CORS but returned error message. Error displays ip address but unable to catch error.
exports.getIPs3 = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    try {
      const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
      return res.status(200).send(ipAddress);
    } catch (error) {
      return res.status(400).send(ipAddress);
    }
  })
});
