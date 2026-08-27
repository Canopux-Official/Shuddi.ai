// utils/geolocation.util.ts
// Thin wrapper around the browser Geolocation API with typed errors so
// UI code can show graceful, specific messaging instead of a raw
// GeolocationPositionError.

export interface GeoPosition {
  latitude: number;
  longitude: number;
  accuracy: number;
}

export type GeolocationErrorCode =
  | "UNSUPPORTED"
  | "PERMISSION_DENIED"
  | "POSITION_UNAVAILABLE"
  | "TIMEOUT";

export class GeolocationError extends Error {
  code: GeolocationErrorCode;

  constructor(code: GeolocationErrorCode, message: string) {
    super(message);
    this.name = "GeolocationError";
    this.code = code;
  }
}

const DEFAULT_OPTIONS: PositionOptions = {
  enableHighAccuracy: true,
  timeout: 15000,
  maximumAge: 0,
};

/**
 * Resolves the user's current coordinates. Must be called from within a
 * user gesture (e.g. a button onClick) on most browsers, or the
 * permission prompt may be silently blocked.
 */
export function getCurrentPosition(
  options?: PositionOptions
): Promise<GeoPosition> {
  return new Promise((resolve, reject) => {
    if (!("geolocation" in navigator)) {
      reject(
        new GeolocationError(
          "UNSUPPORTED",
          "Your browser does not support location services."
        )
      );
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
      },
      (error) => {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            reject(
              new GeolocationError(
                "PERMISSION_DENIED",
                "Location permission was denied. Please enable location access for this site in your browser settings to check in."
              )
            );
            break;
          case error.POSITION_UNAVAILABLE:
            reject(
              new GeolocationError(
                "POSITION_UNAVAILABLE",
                "We couldn't determine your location. Please try again."
              )
            );
            break;
          case error.TIMEOUT:
            reject(
              new GeolocationError(
                "TIMEOUT",
                "Getting your location took too long. Please try again."
              )
            );
            break;
          default:
            reject(
              new GeolocationError(
                "POSITION_UNAVAILABLE",
                "Unable to get your location."
              )
            );
        }
      },
      { ...DEFAULT_OPTIONS, ...options }
    );
  });
}

/**
 * Best-effort read of the current permission state, used to tailor the
 * onboarding copy (e.g. skip the "why we need this" explainer if
 * permission is already granted). Not supported in all browsers
 * (notably Safari), so callers should treat "unknown" as "prompt".
 */
export async function checkGeolocationPermission(): Promise<
  "granted" | "denied" | "prompt" | "unknown"
> {
  try {
    if (!("permissions" in navigator)) return "unknown";
    // 'geolocation' is a valid PermissionName at runtime even though
    // some TS lib versions don't include it in the type.
    const status = await navigator.permissions.query({
      name: "geolocation" as PermissionName,
    });
    return status.state as "granted" | "denied" | "prompt";
  } catch {
    return "unknown";
  }
}