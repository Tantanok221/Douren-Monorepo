import { styled } from "@lib/ui";
import { motion } from "framer-motion";

export const InsertContainer = () => {
  return <ButtonWrapper>
    <Button whileHover={{
      backgroundColor: "#4D4D4D"
    }}></Button>
  </ButtonWrapper>;
};

const Button = styled(motion.button, {
  width: "100%",
  cursor: "pointer",
  backgroundColor: "$panel",
  display: "flex",
  flexDirection: "row",
  gap: "1rem"
});
const ButtonWrapper = styled("div", {
  display: "flex",
  flexDirection: "row"

});