const duration = 0.25

export const listVariants = {
  visible: { opacity: 1, transition: { duration } },
  hidden: { opacity: 0, transition: { duration } },
};

export const containerVariants = {
  show: {
    opacity: 1,
    transition: {
      delayChildren: 0.2,
    },
  },
  hidden: { opacity: 0 },
};
