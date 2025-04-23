rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Production-ready rules for Firebase Storage
    
    // Default deny all rule
    match /{allPaths=**} {
      allow read, write: if false;
    }
    
    // Allow users to read any profile image
    match /profile_images/{allImages=**} {
      allow read: if request.auth != null;
    }
    
    // Allow users to write only to their own profile image folder with size limits
    match /profile_images/{userId}/{allImages=**} {
      allow write: if request.auth != null && 
                    request.auth.uid == userId && 
                    request.resource.size <= 2 * 1024 * 1024 && // 2MB max file size
                    request.resource.contentType.matches('image/.*');
    }
  }
}