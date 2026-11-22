import { GlobeIcon } from "lucide-react";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import { SiPixiv, SiPlurk } from "react-icons/si";
import type { ArtistViewModel } from "@/types/models";

interface SocialLinkConfig {
  key: keyof ArtistViewModel["socials"];
  label: string;
  renderIcon: (size: number) => React.ReactNode;
}

interface RenderSocialLinksOptions {
  iconSize: number;
  baseClassName: string;
}

const SOCIAL_LINK_CONFIGS: SocialLinkConfig[] = [
  {
    key: "twitter",
    label: "Twitter",
    renderIcon: (size) => <FaTwitter size={size} />,
  },
  {
    key: "instagram",
    label: "Instagram",
    renderIcon: (size) => <FaInstagram size={size} />,
  },
  {
    key: "facebook",
    label: "Facebook",
    renderIcon: (size) => <FaFacebook size={size} />,
  },
  {
    key: "website",
    label: "Website",
    renderIcon: (size) => <GlobeIcon size={size} />,
  },
  {
    key: "pixiv",
    label: "Pixiv",
    renderIcon: (size) => <SiPixiv size={size} />,
  },
  {
    key: "plurk",
    label: "Plurk",
    renderIcon: (size) => <SiPlurk size={size} />,
  },
];

export const getBoothLocationEntries = (
  boothLocations: ArtistViewModel["boothLocations"],
): Array<{ label: string; value: string }> => [
  { label: "第一天", value: boothLocations.day1 },
  { label: "第二天", value: boothLocations.day2 },
  { label: "第三天", value: boothLocations.day3 },
];

export const renderSocialLinks = (
  socials: ArtistViewModel["socials"],
  options: RenderSocialLinksOptions,
): React.ReactNode[] =>
  SOCIAL_LINK_CONFIGS.map((config) => {
    const href = socials[config.key];
    if (!href) {
      return null;
    }

    return (
      <a
        key={config.key}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={options.baseClassName}
        aria-label={config.label}
      >
        {config.renderIcon(options.iconSize)}
      </a>
    );
  });
