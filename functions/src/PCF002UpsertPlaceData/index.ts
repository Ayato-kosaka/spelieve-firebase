import {PCF002UpsertPlaceDataBodyInterface, PDB01MPlaceInterface} from 'spelieve-common/Interface';
import * as utils from '../Utils';
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';


export const PCF002UpsertPlaceData = functions.https.onRequest(async (
    req,
    res
) => {
  const body = req.body as
    utils.exParamsDictionary<PCF002UpsertPlaceDataBodyInterface>;
  // TODO collecton name をExportする。
  const documentReference = admin.firestore().collection('MPlace').doc(body.placeID);
  const documentSnapshot = await documentReference.get()
  if(documentSnapshot.exists){
    let data = documentSnapshot.data() as PDB01MPlaceInterface;
    // if(new Date() - data.updatedAt.toDate()){
  } else {
    // const data: PDB01MPlaceInterface = {};
    await documentReference.create(data);
  }
  // Send back a message that we've successfully written the message.
  // res.json();
});
