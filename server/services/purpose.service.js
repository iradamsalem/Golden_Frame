// Service function to process and save the received purpose
export async function savePurpose(purpose) {
    console.log('Saving purpose inside service:', purpose);
  
    // Future logic can be added here: database storage, processing, etc.
    // For now, we return a mock object
    return {
      savedPurpose: purpose,
    };
  }
  