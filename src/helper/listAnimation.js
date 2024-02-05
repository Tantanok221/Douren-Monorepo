const duration = 0.25

export const listVariants = {
  visible: (index) => ({ opacity: 1, transition: { delay: 0.1 * index} }),
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
