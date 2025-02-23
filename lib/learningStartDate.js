export default function learningStartDate() {
  const AGE_START_TRAINING = 16;

  const sixteenYearsAgo = new Date();
  return sixteenYearsAgo.setFullYear(sixteenYearsAgo.getFullYear() - AGE_START_TRAINING);
}
