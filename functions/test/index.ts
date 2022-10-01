import * as projectConfig from '../projectConfig.json';

import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import * as firebaseFunctionsTest from 'firebase-functions-test';
import {FeaturesList} from 'firebase-functions-test/lib/features';
import * as myFunctions from '../src/index';


describe('Cloud Functions', () => {
  let test: FeaturesList;

  beforeEach(() => {
    test = firebaseFunctionsTest(projectConfig, './service-account-key.json');
  });

  afterEach(() => {
    // Do cleanup tasks.
    test.cleanup();
    // Reset the database.
    admin.database().ref('messages').remove();
  });

  describe('addMessage', () => {
    it('should return a 303 redirect', (done) => {
      // A fake request object, with req.query.text set to 'input'
      const req = {body: {text: 'input'}};
      // A fake response object, with a stubbed redirect function which does some assertions
      const res = {
        json: (code: number, url: string) => {
          // Assert code is 303
          expect(code).toBe(303);
          // If the database push is successful, then the URL sent back will have the following format:
          const expectedRef = new RegExp(projectConfig.databaseURL + '/messages/');
          expect(expectedRef.test(url)).toBeTruthy();
          done();
        },
      };

      // Invoke addMessage with our fake request and response objects. This will cause the
      // assertions in the response object to be evaluated.
      myFunctions.CCF000AddMessage(req as functions.https.Request, res as functions.Response);
    });
  });
});
