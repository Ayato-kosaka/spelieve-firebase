import {CCF000AddMessageBodyInterface} from './CCF000AddMessageBodyInterface';
import {CCF000AddMessageResInterface} from './CCF000AddMessageResInterface';
import * as utils from '../Utils';
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';


export const CCF000AddMessage = functions.https.onRequest(async (
    req,
    res: functions.Response<CCF000AddMessageResInterface>
) => {
  const body = req.body as
    utils.exParamsDictionary<CCF000AddMessageBodyInterface>;
  // Grab the text query.
  const original = body.text;
  // Push the new message into Firestore using the Firebase Admin SDK.
  const writeResult = await admin.firestore()
      .collection('messages').add({original: original});
  // Send back a message that we've successfully written the message.
  res.json({result: `Message with ID: ${writeResult.id} added.`});
});
