type Manifest = chrome.runtime.ManifestV2;

class ManifestParser {
  /** SINGLETON */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  static convertManifestToString(manifest: Manifest): string {
    return JSON.stringify(manifest, null, 2);
  }
}

export default ManifestParser;
