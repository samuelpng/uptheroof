import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import Cropper from "react-easy-crop";
import { Modal, Button } from "react-bootstrap";

const ImageUploader = ({ images, onImageUpload }) => {
  const [croppingImage, setCroppingImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const onDrop = (acceptedFiles) => {
    if (images.length >= 3) return; // Prevent adding more than 3 images

    // Only process one file at a time for cropping
    const file = acceptedFiles[0];
    if (file) {
      setCroppingImage({
        file,
        preview: URL.createObjectURL(file),
      });
      setShowModal(true); // Open cropping modal
    }
  };

  // Save cropped area
  const onCropComplete = useCallback((_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  // Finalize cropped image
  const handleCropConfirm = async () => {
    if (!croppingImage || !croppedAreaPixels) return;

    const croppedBlob = await getCroppedImage(croppingImage.preview, croppedAreaPixels);
    const croppedFile = new File([croppedBlob], croppingImage.file.name, { type: "image/jpeg" });

    const newImage = {
      file: croppedFile,
      preview: URL.createObjectURL(croppedBlob),
    };

    // Update parent state
    onImageUpload([...images, newImage]); 

    // Reset cropping state
    setCroppingImage(null);
    setShowModal(false);
  };

  // Remove image
  const handleRemove = (index) => {
    onImageUpload(images.filter((_, i) => i !== index));
  };

  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop,
    accept: "image/*",
    multiple: false, // Only one at a time for cropping
    noClick: true, // Prevent auto-triggering file selection
  });

  return (
    <div
      {...getRootProps()}
      style={{
        border: "2px dashed #ccc",
        padding: "20px",
        textAlign: "center",
        cursor: "pointer",
        borderRadius: "5px",
        position: "relative",
        minHeight: "150px",
      }}
    >
      <input {...getInputProps()} />
      <p onClick={open} style={{ cursor: "pointer", color: "blue" }}>
        Drag & drop images here, or click here to select
      </p>

      {/* Image Previews Below the Text */}
      <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginTop: "10px" }}>
        {images.map(({ preview }, index) => (
          <div key={index} style={{ position: "relative", display: "inline-block" }}>
            <img src={preview} alt="Preview" style={{ width: 100, borderRadius: 5 }} />
            <Button
              onClick={() => handleRemove(index)}
              variant="danger"
              style={{
                position: "absolute",
                top: "-5px",
                right: "-5px",
                width: "24px",
                height: "24px",
                borderRadius: "50%",
                fontSize: "14px",
                padding: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                lineHeight: 1,
              }}
            >
              ✕
            </Button>
          </div>
        ))}
      </div>

      {/* Cropping Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Crop Image</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ position: "relative", height: "300px" }}>
          {croppingImage && (
            <Cropper
              image={croppingImage.preview}
              crop={crop}
              zoom={zoom}
              aspect={1} // 1:1 aspect ratio
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>❌ Cancel</Button>
          <Button onClick={handleCropConfirm}>✅ Confirm Crop</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

// Helper function to crop image
const getCroppedImage = (imageSrc, croppedAreaPixels) => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = imageSrc;
    image.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      canvas.width = croppedAreaPixels.width;
      canvas.height = croppedAreaPixels.height;

      ctx.drawImage(
        image,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        croppedAreaPixels.width,
        croppedAreaPixels.height
      );

      canvas.toBlob((blob) => resolve(blob), "image/jpeg");
    };
    image.onerror = (error) => reject(error);
  });
};

export default ImageUploader;
