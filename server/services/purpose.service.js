// services/purpose.service.js

let currentPurpose = 'default';

export function savePurpose(purpose) {
  currentPurpose = purpose;
  console.log('✅ Purpose saved:', currentPurpose);
}

export function getSavedPurpose() {
  return currentPurpose;
}
