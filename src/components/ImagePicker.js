import { useDropzone } from 'react-dropzone';

const fileToB64 = (file) =>
  new Promise((res, rej) => {
    const fileReader = new FileReader();
    fileReader.onload = () => res(fileReader.result);
    fileReader.onerror = () => rej(fileReader.error);
    fileReader.readAsDataURL(file);
  });
export default function ImagePicker({ handleImageSelect, children }) {
  const { getInputProps, getRootProps } = useDropzone({
    maxFiles: 1,
    accept: 'image/*',
    onDrop: async (arrayOfFiles) => {
      const b64URL = await fileToB64(arrayOfFiles[0]);
      handleImageSelect(b64URL);
    },
  });

  return (
    <>
      <div {...getRootProps({ className: 'form_group' })}>
        <input {...getInputProps()} />
        <label className={`bl`}>Drag files to add image to QR code</label>
        {children}
      </div>
    </>
  );
}
