import * as utils from './Utils';
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();
import * as express from 'express';
import * as cors from 'cors';

const app = express();
// Automatically allow cross-origin requests
app.use(cors({ origin: true }));

interface CCF000AddMessageParamInterface {
    text: string;
}

// curl -X POST http://localhost:5001/${PROJECT_ID}/us-central1/addMessage?text=securityBreak
app.post('/addMessage',  (async (req: express.Request, res: express.Response) => {
    req.body
    // Grab the text parameter.  
    const original = utils.getReqParams<CCF000AddMessageParamInterface>(req).text;
    // Push the new message into Firestore using the Firebase Admin SDK.
    const writeResult = await admin.firestore().collection('messages').add({original: original});
    // Send back a message that we've successfully written the message
    res.send({result: `Message with ID: ${writeResult.id} added.`});
}));



// import * as express from 'express';
// import * as cors from 'cors';

// const app = express();

// // Automatically allow cross-origin requests
// app.use(cors({ origin: true }));

// // build multiple CRUD interfaces:
// app.get('/:id', (req, res) => res.send(Widgets.getById(req.params.id)));
// app.post('/', (req, res) => res.send(Widgets.create()));
// app.put('/:id', (req, res) => res.send(Widgets.update(req.params.id, req.body)));
// app.delete('/:id', (req, res) => res.send(Widgets.delete(req.params.id)));
// app.get('/', (req, res) => res.send(Widgets.list()));

// // Expose Express API as a single Cloud Function:
// exports.widgets = functions.https.onRequest(app);