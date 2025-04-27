rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Keep all your existing helper functions
    function isBandMember(bandId) {
      return exists(/databases/$(database)/documents/bf_bands/$(bandId)/members/$(request.auth.uid));
    }
    
    function isBandAdmin(bandId) {
      return exists(/databases/$(database)/documents/bf_bands/$(bandId)/members/$(request.auth.uid)) &&
        get(/databases/$(database)/documents/bf_bands/$(bandId)/members/$(request.auth.uid)).data.role == 'admin';
    }

    // Keep existing collection group queries for invites
    match /{path=**}/invites/{inviteId} {
      allow read: if true;
    }
    
    // Add the new bf_venues collection rules
    match /bf_venues/{venueId} {
      allow read: if true;
      allow write: if true;  // This makes create, update, and delete all open
    }

    // Update bf_nonbands rules 
    match /bf_nonbands/{bandId} {
      allow read: if true;
      allow write: if true;  // This makes create, update, and delete all open
    }
    match /bf_artists/{artistId} {
      allow read: if true;
      allow write: if true;  // This makes create, update, and delete all open
    }

    match /bf_events/{eventId} {
      allow read: if true;
      allow write: if true;
      allow create: if true;
    }

    
// Rules for bndy_artists collection with members subcollection
match /bndy_artists/{artistId} {
  // Artist document rules
  allow read: if true; // Public read access to artist profiles
  
  // Only authenticated users can create artists
  allow create: if request.auth != null;
  
  // Only members with admin or owner role can update artist details
  allow update: if isMemberWithRole(artistId, request.auth.uid, ["owner", "admin"]);
  
  // Only the owner can delete an artist
  allow delete: if isMemberWithRole(artistId, request.auth.uid, ["owner"]);
  
  // TEMPORARY: Wide open access to members subcollection for testing
  match /members/{memberId} {
    // WARNING: This allows anyone to read/write members documents
    // This is ONLY for testing and should be replaced with proper rules
    allow read, write: if true;
  }
}

// TEMPORARY: Wide open access to members subcollection for testing
match /{path=**}/members/{memberId} {
  // WARNING: This allows anyone to read/write members documents
  // This is ONLY for testing and should be replaced with proper rules
  allow read, write: if true;
}

// Helper function to check if a user is a member with a specific role
function isMemberWithRole(artistId, userId, roles) {
  let memberDoc = get(/databases/$(database)/documents/bndy_artists/$(artistId)/members/$(userId));
  return memberDoc != null && 
         memberDoc.data != null && 
         memberDoc.data.userId == userId && 
         memberDoc.data.role in roles;
}



    // Rules for bndy_events collection - TEMPORARY WIDE OPEN ACCESS FOR TESTING
match /bndy_events/{eventId} {
  // WARNING: This rule allows anyone to read/write this collection
  // This is ONLY for debugging and should be replaced with proper rules
  allow read, write: if true;
}

// Rules for bndy_venues collection - TEMPORARY WIDE OPEN ACCESS FOR TESTING
match /bndy_venues/{venueId} {
  // WARNING: This rule allows anyone to read/write this collection
  // This is ONLY for debugging and should be replaced with proper rules
  allow read, write: if true;
}
    
 

    // Keep all your existing rules for bf_bands
    match /bf_bands/{bandId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && isBandAdmin(bandId);

      match /members/{memberId} {
        allow read: if request.auth != null;
        allow create: if request.auth != null && (
          (!exists(/databases/$(database)/documents/bf_bands/$(bandId)/members/**) && 
           memberId == request.auth.uid && 
           request.resource.data.role == 'admin') ||
          isBandAdmin(bandId) ||
          memberId == request.auth.uid
        );
        
        allow update: if request.auth != null && 
          ((request.auth.uid == memberId && request.resource.data.diff(resource.data).affectedKeys().hasOnly(['displayName', 'instruments'])) || 
          isBandAdmin(bandId));
        allow delete: if request.auth != null && isBandAdmin(bandId);
      }

      match /invites/{inviteId} {
        allow read: if true;
        allow create, delete: if request.auth != null && isBandAdmin(bandId);
        allow update: if request.auth != null && (
          isBandAdmin(bandId) ||
          request.auth != null
        );
      }

      match /songs/{songId} {
        allow read: if request.auth != null;
        allow create: if request.auth != null && isBandMember(bandId);
        allow update: if request.auth != null && isBandMember(bandId);
        allow delete: if request.auth != null && isBandAdmin(bandId);
      }

      match /setlists/{setlistId} {
        allow read: if request.auth != null && isBandMember(bandId);
        allow write: if request.auth != null && isBandMember(bandId);
      }
    }

    // User profiles rules - UPDATED FOR DEVELOPMENT
    match /bf_users/{userId} {
      // Allow read access to all users for development
      allow read: if true;
      
      // Allow users to write to their own profile or any profile during development
      allow write: if true;
      
      // Original rules (commented out for reference)
      // allow read: if request.auth != null;
      // allow write: if request.auth != null && request.auth.uid == userId;
      // allow update: if request.auth != null && 
      //   (request.auth.uid == userId || 
      //    get(/databases/$(database)/documents/bf_users/$(request.auth.uid)).data.roles.hasAny(['admin']) || 
      //    get(/databases/$(database)/documents/bf_users/$(request.auth.uid)).data.godMode == true) && 
      //   request.resource.data.diff(resource.data).affectedKeys().hasOnly(['roles']);
    }
    
    // Keep existing base songs collection rules
    match /bf_base_songs/{songId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null;
    }
  }
}