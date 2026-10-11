# Security Specification & Test Protocol: Solo Arise Cloud Vault

## 1. Data Invariants
1. **User Identity Boundary**: Every document at `/users/{userId}` and subcollection `/users/{userId}/system_data/{dataId}` belongs exclusively to the authenticated user whose `request.auth.uid == userId`.
2. **Anti-Spoofing Invariant**: The `userId` field inside document data must strictly match `request.auth.uid`. No user can create or update a document claiming to belong to another hunter.
3. **No Blanket Reads**: Anonymous and unauthenticated requests are rejected. Queries or document reads across user partitions are strictly forbidden.
4. **Subcollection Relational Guard**: In `/users/{userId}/system_data/{dataId}`, writes require that `request.auth.uid == userId`, preventing orphaned or cross-account writes.
5. **Path ID Integrity**: Path IDs `{userId}` and `{dataId}` must conform to safe alphanumeric character sets and size bounds (`size() <= 128`).
6. **Immutability of Identity**: On update, `userId` cannot be altered: `incoming().userId == existing().userId`.

## 2. The Dirty Dozen (Adversarial Payloads Designed to Fail)
1. **Unauthenticated Read**: Anonymous actor attempts to read `/users/hunter_victim`. (Expected: PERMISSION_DENIED)
2. **Unauthenticated Write**: Anonymous actor attempts to write `/users/hunter_victim`. (Expected: PERMISSION_DENIED)
3. **Cross-User Profile Hijack**: User `attacker_uid` attempts to update `/users/victim_uid`. (Expected: PERMISSION_DENIED)
4. **Identity Spoofing on Create**: User `attacker_uid` creates `/users/attacker_uid` with payload `{ userId: 'victim_uid' }`. (Expected: PERMISSION_DENIED)
5. **Cross-User Vault Infiltration**: User `attacker_uid` attempts to read `/users/victim_uid/system_data/state`. (Expected: PERMISSION_DENIED)
6. **Cross-User Vault Overwrite**: User `attacker_uid` attempts to write `/users/victim_uid/system_data/state`. (Expected: PERMISSION_DENIED)
7. **Identity Mutation on Update**: User `attacker_uid` attempts to mutate `userId` field on their own state document to `victim_uid`. (Expected: PERMISSION_DENIED)
8. **ID Poisoning via Path**: Request to `/users/INVALID!#@%PATH$$$/system_data/state`. (Expected: PERMISSION_DENIED)
9. **Blanket Query Scraping**: User attempts collectionGroup or list query without scoping to their own path. (Expected: PERMISSION_DENIED)
10. **Huge Oversized ID Attack**: Path variable exceeding 128 characters. (Expected: PERMISSION_DENIED)
11. **Malicious Ghost Field Escalation**: Attempting to inject system-level override flags into user doc. (Expected: PERMISSION_DENIED)
12. **Null Auth Probe**: Null token request hitting the master gate. (Expected: PERMISSION_DENIED)
