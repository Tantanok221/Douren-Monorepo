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
  const authClient = useAuthContext();
  const { data: session } = authClient.useSession();
  const { data: roleData } = useUserRole();
  const { data: myArtists } = trpc.admin.getMyArtists.useQuery(undefined, {
    enabled: !!session,
  });

  if (roleData?.isAdmin) return true;

  return myArtists?.some((a) => a.uuid === artistId) || false;
}

/**
 * Hook to check if the current user can delete a specific artist
 * Uses the same logic as useCanEditArtist since delete permissions match edit permissions
 * @param artistId - The ID of the artist to check
 * @returns boolean - true if user can delete, false otherwise
 */
export function useCanDeleteArtist(artistId: number): boolean {
  return useCanEditArtist(artistId);
}
