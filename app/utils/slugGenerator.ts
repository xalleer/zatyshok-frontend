const uaSymbols = [
  "а","б","в","г","ґ","д","е","є","ж","з","и","і","ї","й","к","л","м",
  "н","о","п","р","с","т","у","ф","х","ц","ч","ш","щ","ь","ю","я"
];

const enSymbols = [
  "a","b","v","h","g","d","e","ie","zh","z","y","i","i","i","k","l","m",
  "n","o","p","r","s","t","u","f","kh","ts","ch","sh","shch","","iu","ia"
];

const mappingUkrToEng = (val: string): string => {
  return val
    .trim()
    .toLowerCase()
    .split("")
    .map((char) => {
      const index = uaSymbols.indexOf(char);
      return index !== -1 ? enSymbols[index] : char;
    })
    .join("");
};

export const generateSlug = (name: string): string => {
  return mappingUkrToEng(name)
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
};
