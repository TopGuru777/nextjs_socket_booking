export const classNames = (...classes: string[]) => {
  return classes.filter(Boolean).join(" ");
};

export const areAllCharactersDigits = (inputString: string) => {
  return /^\d+$/.test(inputString);
}