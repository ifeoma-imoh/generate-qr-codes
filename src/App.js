import './App.css';
import { useState } from 'react';
import QrCode from 'qrcode.react';
import ImagePicker from './components/ImagePicker';
import axios from 'axios';

export default function App() {
  const [input, setInput] = useState('');
  const [image, setImage] = useState('');
  const [loading, setLoading] = useState(false);

  const uploadToCloudinary = async () => {
    const canvas = document.querySelector('canvas');
    const imageDataURI = await canvas.toDataURL('png', 1.0);
    const cloudname = 'ifeomaimoh';
    const upload_preset = 'testpres';
    try {
      setLoading(true);
      let res = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudname}/image/upload`,
        {
          file: imageDataURI,
          upload_preset,
        }
      );
      const { url } = res.data;
      await navigator.clipboard.writeText(url);
      alert('COPIED TO CLIPBOARD');
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  const downloadImage = async (e) => {
    const canvas = document.querySelector('canvas');
    const imageDataURI = canvas.toDataURL('png', 1.0);
    const blob = await (await fetch(imageDataURI)).blob();
    const URL = window.URL.createObjectURL(blob);
    const el = document.createElement('a');
    el.href = URL;
    el.download = 'mydummyfile.png';
    el.click();
    window.URL.revokeObjectURL(URL);
  };
  return (
    <main className="App">
      <div className="form_group norm container">
        <label>Add link to social media profile</label>
        <input
          type="url"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      </div>
      {input && (
        <>
          <section className="dnd_con">
            <ImagePicker
              handleImageSelect={(file) => {
                setImage(file);
              }}
            >
              <QrCode
                value={input}
                size={400}
                imageSettings={
                  image
                    ? {
                        src: image,
                        excavate: true,
                        width: 82,
                        height: 82,
                      }
                    : {}
                }
                level="M"
                includeMargin
              />
            </ImagePicker>
          </section>
          <section className="btn_con">
            <button onClick={downloadImage}> download image</button>

            <button onClick={uploadToCloudinary}>
              {loading ? 'processing...' : 'copy QR code link'}
            </button>
          </section>
        </>
      )}
    </main>
  );
}
