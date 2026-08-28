export type ReleaseAsset = {
  name: string;
  browser_download_url: string;
};

export type PublicRelease = {
  name: string | null;
  tag_name: string;
  html_url: string;
  prerelease: boolean;
  draft: boolean;
  assets: ReleaseAsset[];
};

const versionTag = /^v\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/;

export function selectPublicRelease(releases: PublicRelease[]) {
  return releases.find(release => {
    if (release.draft || !versionTag.test(release.tag_name)) return false;

    const assetNames = release.assets.map(asset => asset.name);
    return assetNames.some(name => name.endsWith("_universal.dmg"))
      && assetNames.some(name => name.endsWith("_amd64.AppImage"));
  });
}
