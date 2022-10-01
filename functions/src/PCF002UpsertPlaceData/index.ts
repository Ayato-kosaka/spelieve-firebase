import {PCF002UpsertPlaceDataBodyInterface, PDB01MPlaceInterface} from 'spelieve-common/Interface';
import * as PDB01 from 'spelieve-common/Interface/Place/PDB01'
import * as utils from '../Utils';
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import Places from 'google-places-web';
import { GeoPoint, Timestamp } from '@firebase/firestore-types';


export const PCF002UpsertPlaceData = functions.https.onRequest(async (
    req,
    res
) => {
  const body = req.body as
    utils.exParamsDictionary<PCF002UpsertPlaceDataBodyInterface>;
  const documentReference = admin.firestore().collection(PDB01.name).doc(body.placeID);
  const documentSnapshot = await documentReference.get();
  const fetchGooglePlaceDetail = async (placeID: string): PDB01MPlaceInterface => {
    const googlePlaceDetailsResponse = await Places.details({
      placeid: placeID
    })
    const googlePlaceDetailsResult = googlePlaceDetailsResponse.result
    return {
      name: googlePlaceDetailsResult.name,
      imageUrl: googlePlaceDetailsResult.icon,
      // TODO あとで設定する
      instagramAPIID: '',
      geometry: new GeoPoint(googlePlaceDetailsResult.geometry.location.lat, googlePlaceDetailsResult.geometry.location.lng),
      // TODO あとで設定する
      geohash: '',
      mapUrl: googlePlaceDetailsResult.url,
      website: googlePlaceDetailsResult.website,
      address: googlePlaceDetailsResult.formatted_address,
      phoneNumber: googlePlaceDetailsResult.formatted_phone_number,
      openingHours: googlePlaceDetailsResult.opening_hours,
      rating: googlePlaceDetailsResult.rating,
      // TODO あとで設定する
      popularTags: [],
      // TODO あとで設定する
      averageStayTime: new Timestamp.fromDate(),
      createdAt: new Timestamp.;
      updatedAt: Timestamp;
    }
  }
  if (documentSnapshot.exists) {
    const data = documentSnapshot.data() as PDB01MPlaceInterface;
    // if(new Date() - data.updatedAt.toDate()){
  } else {
    // const data: PDB01MPlaceInterface = {};
    await documentReference.create(data);
  }
  // Send back a message that we've successfully written the message.
  // res.json();
});
