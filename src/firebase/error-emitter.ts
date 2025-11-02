import { EventEmitter } from 'events';

// This is a simple event emitter that will be used to bubble up
// Firestore permission errors to a central listener.
export const errorEmitter = new EventEmitter();
