import { Button } from "@lib/ui";
import { useState } from "react";

export const DeleteButton = () => {
  const [confirmation, setConfirmation] = useState(false);

  const deleteArtist = () => {
    if(!confirmation) {
      setConfirmation(true)
      return
    }

  }

  if(!confirmation) return <Button onClick={deleteArtist}>
    刪除
  </Button>;
  return <Button onClick={deleteArtist}> 你要確也 </Button>
};