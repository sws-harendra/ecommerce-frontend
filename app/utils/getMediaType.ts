// utils/fileType.js (or add this to your component)
export const isImageFile = (filename: string) => {
  const imageExtensions = [
    ".jpg",
    ".jpeg",
    ".png",
    ".gif",
    ".webp",
    ".bmp",
    ".svg",
  ];
  const ext = filename.toLowerCase().substring(filename.lastIndexOf("."));
  return imageExtensions.includes(ext);
};

export const isVideoFile = (filename: string) => {
  const videoExtensions = [
    ".mp4",
    ".avi",
    ".mov",
    ".mkv",
    ".webm",
    ".flv",
    ".wmv",
  ];
  const ext = filename.toLowerCase().substring(filename.lastIndexOf("."));
  return videoExtensions.includes(ext);
};

export const getFileType = (filename: string) => {
  if (isImageFile(filename)) return "image";
  if (isVideoFile(filename)) return "video";
  return "unknown";
};
