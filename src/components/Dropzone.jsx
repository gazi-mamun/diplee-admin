import React, { useRef, useState } from "react";
import toast from "react-hot-toast";

export const formatFileSize = (bytes, decimalPoint) => {
  if (bytes == 0) return "0 Bytes";
  var k = 1000,
    dm = decimalPoint || 2,
    sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
    i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};

export default function Dropzone({ images, setImages }) {
  const [isDragover, setIsDragover] = useState(false);

  const inputRef = useRef();

  const handleDropzoneClick = (e) => {
    if (e.currentTarget.id === "dropzone") {
      inputRef.current.click();
    }
  };

  const checkFileSize = (size) => {
    const maxSize = 5 * 1024 * 1024;

    if (size > maxSize) return false;
    return true;
  };

  const isFileImage = (file) => {
    const acceptedImageTypes = [
      "image/jpg",
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (acceptedImageTypes.includes(file.type)) return true;

    return false;
  };

  const uploadImages = (files) => {
    const newImages = [...images];
    for (let i = 0; i < files.length; i++) {
      if (!isFileImage(files[i])) {
        toast.error("Only images are allowed.");
        continue;
      }
      if (!checkFileSize(files[i].size)) {
        toast.error("The maximum image size (5 MB) has been exceeded.");
        continue;
      }
      newImages.push(files[i]);
    }
    setImages(newImages);
  };

  const handleInputChange = (e) => {
    const files = e.target.files;
    uploadImages(files);
  };

  const handleDragover = (e) => {
    e.preventDefault();
    setIsDragover(true);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files.length) {
      const files = e.dataTransfer.files;
      uploadImages(files);
    }
    setIsDragover(false);
  };

  return (
    <>
      <div
        id="dropzone"
        className={`w-full bg-gray-100 py-4 px-2 border-2 rounded flex items-center justify-center cursor-pointer transition ${
          isDragover
            ? "border-solid border-gray-800"
            : "border-dashed border-blue-400"
        }`}
        onClick={handleDropzoneClick}
        onDragOver={(e) => handleDragover(e)}
        onDragLeave={() => setIsDragover(false)}
        onDragEnd={() => setIsDragover(false)}
        onDrop={(e) => handleDrop(e)}
      >
        <div
          className="w-full h-40 flex items-center justify-center"
          style={{ height: "40px" }}
        >
          <div className="flex flex-col items-center">
            <p className="text-sm font-medium my-3 text-center tracking-wide">
              Drag or
              <span
                className="text-blue-500 underline"
                style={{ margin: "0 8px" }}
              >
                Select
              </span>
              product images
            </p>
          </div>
        </div>
        <input
          ref={inputRef}
          type="file"
          name="uploadedFile"
          className="hidden"
          style={{ display: "none" }}
          accept="image/png, image/jpeg"
          multiple
          onChange={handleInputChange}
        />
      </div>
    </>
  );
}
