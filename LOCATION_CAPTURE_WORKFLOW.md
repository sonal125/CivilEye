# LOCATION_CAPTURE_WORKFLOW (CivilEye)

## 1) Overview (Simple Explanation)

CivilEye captures a citizen’s location at the time of complaint submission to ensure that reported civic issues are geographically verifiable and actionable.

- **Why location capture is required:** Municipal teams need an accurate point on the map to assign responsibility (ward/zone/department), prioritize response, and avoid ambiguity.
- **How automatic location improves authenticity:** Automatically captured GPS coordinates reduce the chance of incorrect or misleading locations and make the report more trustworthy.
- **Why manual location input is avoided:** Manual entry is error‑prone (typos, vague landmarks, incorrect addresses) and can reduce reliability. CivilEye prioritizes automatic, device-provided coordinates for stronger evidence.

---

## 2) Trigger Point (When Location Is Captured)

CivilEye initiates location capture **after an image is uploaded or captured** for a complaint.

- At this moment, the app requests the user’s permission to access location.
- **No location data is accessed without user consent.** The browser shows a permission prompt, and the user can allow or deny.
- Location capture is tied to complaint creation (submission workflow) rather than continuous tracking.

---

## 3) Browser Geolocation API (Core Part)

CivilEye uses the **Browser Geolocation API** to request a single, high‑accuracy position reading.

- Primary method used: `navigator.geolocation.getCurrentPosition()`

### What the Geolocation API returns
When successful, the API returns a `position` object that includes:

- **Latitude**: North–south coordinate in degrees.
- **Longitude**: East–west coordinate in degrees.
- **Accuracy**: Estimated radius of uncertainty in meters (e.g., ±12 m).
- **Altitude (optional)**: Height above sea level in meters.
- **Timestamp**: Time (in milliseconds since epoch) when the position was obtained.

### Important note about altitude
- **Altitude is device‑dependent.** Many devices/browsers do not provide it.
- In such cases, altitude may be **null** (or unavailable). CivilEye treats this as normal and displays “Not available”.

---

## 4) Step‑by‑Step Location Flow (Very Important)

1. **User selects an image** (either from gallery or camera).
2. **CivilEye requests location permission** via the browser’s permission prompt.
3. If permission is granted, **the browser fetches GPS coordinates** using the Geolocation API.
4. The returned coordinates (latitude, longitude, accuracy, altitude if present) are **stored in the application state** for that complaint.
5. The location information is **shown as read‑only** to the user (to maintain authenticity and prevent manual tampering).
6. The captured location fields are **attached to the complaint payload** so the report remains verifiable when stored or sent to a backend.

---

## 5) Altitude Handling

### What altitude means
Altitude represents the device’s estimated height above sea level (meters). It can help in certain environments (multi‑level roads, flyovers, hilly terrain), but it is not always necessary for civic issue resolution.

### When altitude is available
Altitude may be available when:
- The device provides it (some GPS chipsets and sensor stacks).
- The browser exposes it through the Geolocation API.

### What happens if altitude is not supported
- CivilEye receives altitude as **null / unavailable**.
- The UI displays **“Not available”**.
- Complaint submission continues as long as latitude and longitude are present.

### Safe handling of missing altitude
CivilEye treats altitude as optional:
- It is stored as `null` when missing.
- No calculations or logic depend on altitude being present.

---

## 6) Reverse Geocoding (Human‑Readable Location)

### Why latitude/longitude is not user‑friendly
Raw coordinates are precise but difficult for most users and evaluators to interpret.

### Converting coordinates into a readable address
CivilEye performs **reverse geocoding**, which converts (latitude, longitude) into a human‑readable location label.

- CivilEye uses **OpenStreetMap (Nominatim) reverse geocoding** in a best‑effort manner.
- If reverse geocoding fails (network issues or rate limits), CivilEye can still proceed with latitude/longitude.

### Address components displayed
A readable location may include:
- **Area / locality** (e.g., sector, suburb, neighbourhood)
- **City** (or town/municipality)
- **State**
- **Country**

Example output:
- “Sector 18, Noida, Uttar Pradesh, India”

---

## 7) Error Handling & Edge Cases

CivilEye handles common geolocation failure cases gracefully:

### A) Location permission denied
- If the user denies permission, CivilEye shows a clear message:
  - “Location permission required for accurate reporting”
- Since authentic reporting depends on coordinates, **submission can be restricted** when required coordinates are missing.

### B) GPS unavailable / position unavailable
- The browser may fail to determine a position (indoors, no GPS signal, device restrictions).
- CivilEye informs the user and allows re-trying location capture.

### C) Low accuracy
- Accuracy values can vary depending on environment.
- CivilEye stores the reported accuracy so the system can understand confidence (e.g., ±80 m is less precise than ±10 m).

### D) Timeout errors
- If the location request times out, CivilEye presents an error and allows the user to retry.

In all cases:
- The user is notified.
- The system avoids silently using incorrect data.
- Latitude/longitude are required for a valid, verifiable complaint.

---

## 8) Privacy & Security Considerations

CivilEye follows basic privacy principles for location collection:

- **Purpose limitation:** Location is captured only to validate and resolve a reported civic issue.
- **No background tracking:** CivilEye requests a single reading during complaint submission; it does not continuously track the user.
- **Consent is mandatory:** The browser permission prompt ensures explicit user choice.
- **Scoped storage:** Location data is stored only as part of the complaint record, not as a general tracking log.

---

## 9) Summary (Viva‑Friendly)

CivilEye captures location only at complaint submission time by requesting the browser’s Geolocation API to obtain latitude, longitude, accuracy, and optional altitude. It then reverse‑geocodes the coordinates into a human‑readable address for clarity, stores the data as read‑only metadata, and attaches it to the complaint payload. This ensures authenticity, transparency, and faster municipal response while maintaining user consent and privacy.
