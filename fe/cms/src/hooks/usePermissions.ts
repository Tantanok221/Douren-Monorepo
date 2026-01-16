import { trpc } from "@/lib/trpc";
import { useAuthContext } from "@/components/AuthContext/useAuthContext";

/**
 * Hook to get the current user's role
 * @returns Query result with role data { role: string, isAdmin: boolean }
 */
export function useUserRole() {
  const authClient = useAuthContext();
  const { data: session } = authClient.useSession();

  return trpc.admin.getMyRole.useQuery(undefined, {
    enabled: !!session,
  });
}

/**
 * Hook to check if the current user can edit a specific artist
 * @param artistId - The ID of the artist to check
 * @returns boolean - true if user can edit, false otherwise
 */
export function useCanEditArtist(artistId: number): boolean {
  const { data: roleData } = useUserRole();
  const { data: myArtists } = trpc.admin.getMyArtists.useQuery(undefined, {
    enabled: !!roleData && !roleData.isAdmin,
  });

  if (roleData?.isAdmin) return true;

  return myArtists?.some((a) => a.uuid === artistId) || false;
}
