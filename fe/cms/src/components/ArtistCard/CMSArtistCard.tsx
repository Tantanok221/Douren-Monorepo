import { Link } from "@tanstack/react-router";
import {
  PencilIcon,
  TrashIcon,
  TwitterIcon,
  YoutubeIcon,
  FacebookIcon,
  InstagramIcon,
  ExternalLinkIcon,
  TwitchIcon,
  StoreIcon,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import type { artistBaseSchemaWithTagType } from "@pkg/type";
import { trpc } from "@/lib/trpc";
import { useAuthContext } from "@/components/AuthContext/useAuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ArtistTableProps {
  artists: artistBaseSchemaWithTagType[];
  isAdmin?: boolean;
  myArtistIds?: number[];
}

// Social link configuration
const socialLinks = [
  { key: "twitterLink", icon: TwitterIcon, label: "Twitter" },
  { key: "youtubeLink", icon: YoutubeIcon, label: "YouTube" },
  { key: "facebookLink", icon: FacebookIcon, label: "Facebook" },
  { key: "instagramLink", icon: InstagramIcon, label: "Instagram" },
  { key: "twitchLink", icon: TwitchIcon, label: "Twitch" },
  { key: "pixivLink", icon: ExternalLinkIcon, label: "Pixiv" },
  { key: "plurkLink", icon: ExternalLinkIcon, label: "Plurk" },
  { key: "bahaLink", icon: ExternalLinkIcon, label: "Baha" },
  { key: "myacgLink", icon: ExternalLinkIcon, label: "MyACG" },
  { key: "storeLink", icon: StoreIcon, label: "Store" },
  { key: "officialLink", icon: ExternalLinkIcon, label: "Official" },
] as const;

function ArtistDeleteButton({
  artist,
  canDelete,
}: {
  artist: artistBaseSchemaWithTagType;
  canDelete: boolean;
}) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const utils = trpc.useUtils();

  const deleteArtist = trpc.artist.deleteArtist.useMutation({
    onSuccess: () => {
      toast.success("繪師已刪除");
      utils.artist.getArtist.invalidate();
      utils.admin.getMyArtistsPaginated.invalidate();
      setDeleteDialogOpen(false);
    },
    onError: (error) => {
      if (error?.data?.code === "FORBIDDEN") {
        toast.error("你沒有權限刪除此繪師");
      } else {
        toast.error("刪除失敗");
      }
    },
  });

  if (!canDelete) return null;

  return (
    <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          className="text-red-400 hover:text-red-300 hover:bg-red-950"
        >
          <TrashIcon className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>確認刪除</AlertDialogTitle>
          <AlertDialogDescription>
            你確定要刪除繪師 "{artist.author}" 嗎？此操作無法復原。
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>取消</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => deleteArtist.mutate({ id: String(artist.uuid) })}
            disabled={deleteArtist.isPending}
            className="bg-red-600 hover:bg-red-700"
          >
            {deleteArtist.isPending ? "刪除中..." : "刪除"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function ArtistTable({
  artists,
  isAdmin = false,
  myArtistIds = [],
}: ArtistTableProps) {
  const authClient = useAuthContext();
  const { data: session } = authClient.useSession();

  const canModify = (artistId: number) =>
    isAdmin || myArtistIds.includes(artistId);

  return (
    <div className="rounded-lg border border-stone-800 bg-stone-950">
      <Table>
        <TableHeader>
          <TableRow className="border-stone-800 hover:bg-transparent">
            <TableHead className="w-52">圖片</TableHead>
            <TableHead>名稱</TableHead>
            <TableHead className="hidden md:table-cell">標籤</TableHead>
            <TableHead className="hidden lg:table-cell">連結</TableHead>
            {session && <TableHead className="w-24 text-right">操作</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {artists.map((artist) => {
            const activeSocialLinks = socialLinks.filter(
              (link) => artist[link.key as keyof typeof artist],
            );
            const artistCanModify = canModify(artist.uuid);

            return (
              <TableRow key={artist.uuid} className="border-stone-800">
                {/* Photo */}
                <TableCell className="py-3">
                  {artist.photo ? (
                    <img
                      src={artist.photo}
                      alt={artist.author || "Artist"}
                      className="w-48 h-48 rounded-lg object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-48 h-48 rounded-lg bg-stone-800" />
                  )}
                </TableCell>

                {/* Name & Description */}
                <TableCell className="align-top py-3">
                  <div className="flex flex-col gap-1">
                    <span className="font-semibold text-stone-100 text-base">
                      {artist.author || "未命名繪師"}
                    </span>
                    {artist.introduction && (
                      <span className="text-sm text-stone-400 whitespace-pre-wrap">
                        {artist.introduction}
                      </span>
                    )}
                  </div>
                </TableCell>

                {/* Tags */}
                <TableCell className="hidden md:table-cell">
                  <div className="flex flex-wrap gap-1">
                    {artist.tags?.slice(0, 3).map((tag) => (
                      <Badge
                        key={tag.tag}
                        variant="secondary"
                        className="text-xs bg-stone-800 text-stone-300"
                      >
                        {tag.tag}
                      </Badge>
                    ))}
                    {artist.tags && artist.tags.length > 3 && (
                      <Badge
                        variant="outline"
                        className="text-xs text-stone-500 border-stone-700"
                      >
                        +{artist.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                </TableCell>

                {/* Social Links */}
                <TableCell className="hidden lg:table-cell align-top py-3">
                  <div className="flex flex-wrap gap-1">
                    {activeSocialLinks.map((link) => {
                      const url = artist[
                        link.key as keyof typeof artist
                      ] as string;
                      const Icon = link.icon;
                      return (
                        <a
                          key={link.key}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-md text-stone-400 hover:text-stone-200 hover:bg-stone-800 transition-colors"
                          title={link.label}
                        >
                          <Icon className="h-4 w-4" />
                        </a>
                      );
                    })}
                  </div>
                </TableCell>

                {/* Actions */}
                {session && (
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      {artistCanModify && (
                        <Button
                          asChild
                          variant="ghost"
                          size="icon-sm"
                          className="text-stone-400 hover:text-stone-100"
                        >
                          <Link to={`/edit/${artist.uuid}`}>
                            <PencilIcon className="h-4 w-4" />
                          </Link>
                        </Button>
                      )}
                      <ArtistDeleteButton
                        artist={artist}
                        canDelete={artistCanModify}
                      />
                    </div>
                  </TableCell>
                )}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
