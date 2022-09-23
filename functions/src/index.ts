import * as admin from 'firebase-admin';
admin.initializeApp();

// curl -X POST -H "Content-Type:application/json" http://localhost:5001/itinerary-4aee3/us-central1/CCF000AddMessage -d '{"text":"something"}'
export * from './CCF000AddMessage';
