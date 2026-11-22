import { motion } from "framer-motion";
import { CheckIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { FaDiscord, FaGithub, FaTwitter } from "react-icons/fa";
import { trpc } from "@/helper/trpc";

export interface OwnerProfile {
  id: number;
  name: string;
  title: string | null;
  description: string | null;
  twitterName: string | null;
  twitterLink: string | null;
  githubName: string | null;
  githubLink: string | null;
  discordName: string | null;
}

const COPIED_RESET_MS = 1500;

const linkClassName =
  "inline-flex items-center gap-2 px-3 py-1.5 text-xs font-mono border border-archive-border text-archive-text/70 hover:border-archive-accent hover:text-archive-accent transition-colors duration-300 cursor-pointer";

const DiscordCopyButton: React.FC<{ discordName: string }> = ({
  discordName,
}) => {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timerRef.current), []);

  const handleCopy = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(discordName);
    } catch {
      return;
    }
    setCopied(true);
    window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(
      () => setCopied(false),
      COPIED_RESET_MS,
    );
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={linkClassName}
      aria-label={`複製 Discord 名稱 ${discordName}`}
    >
      {copied ? <CheckIcon size={13} /> : <FaDiscord size={13} />}
      {copied ? "已複製 Discord 名稱" : discordName}
    </button>
  );
};

export const OwnerCard: React.FC<{ owner: OwnerProfile }> = ({ owner }) => {
  const description = owner.description?.trim();

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="py-8 border-b border-archive-border flex flex-col gap-5"
    >
      <div className="flex flex-col gap-1.5">
        <h2
          className="text-2xl md:text-3xl font-medium text-archive-text tracking-tight"
          style={{ fontFamily: "'Noto Serif TC', serif" }}
        >
          {owner.name}
        </h2>
        {owner.title ? (
          <p className="text-sm font-mono text-archive-text/50 tracking-wide">
            {owner.title}
          </p>
        ) : null}
      </div>
      {description ? (
        <p
          className="text-base text-archive-text/80 leading-[1.9] max-w-2xl"
          style={{ fontFamily: "'Noto Serif TC', serif" }}
        >
          {description}
        </p>
      ) : null}
      <div className="flex flex-wrap items-center gap-3">
        {owner.twitterLink ? (
          <a
            href={owner.twitterLink}
            target="_blank"
            rel="noopener noreferrer"
            className={linkClassName}
          >
            <FaTwitter size={13} />
            {owner.twitterName || "Twitter"}
          </a>
        ) : null}
        {owner.githubLink ? (
          <a
            href={owner.githubLink}
            target="_blank"
            rel="noopener noreferrer"
            className={linkClassName}
          >
            <FaGithub size={13} />
            {owner.githubName || "GitHub"}
          </a>
        ) : null}
        {owner.discordName ? (
          <DiscordCopyButton discordName={owner.discordName} />
        ) : null}
      </div>
    </motion.article>
  );
};

export const AboutPage: React.FC = () => {
  const ownersQuery = trpc.owner.getOwner.useQuery();

  return (
    <section className="max-w-3xl mx-auto">
      <h1
        className="text-3xl md:text-4xl font-medium text-archive-text tracking-tight mb-4"
        style={{ fontFamily: "'Noto Serif TC', serif" }}
      >
        關於我們
      </h1>
      <div className="border-t border-archive-border" />
      {ownersQuery.isError ? (
        <div className="py-20 text-center text-archive-text/60 font-mono">
          無法載入資料，請稍後重新整理頁面再試一次
        </div>
      ) : ownersQuery.isPending ? (
        <div className="py-20 text-center text-archive-text/60 font-mono">
          載入中...
        </div>
      ) : (
        ownersQuery.data.map((owner) => (
          <OwnerCard key={owner.id} owner={owner} />
        ))
      )}
    </section>
  );
};
