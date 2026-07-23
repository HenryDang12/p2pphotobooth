import React, { useRef, useState } from "react";
import Cropper from "react-easy-crop";
import Draggable from "react-draggable";
import getCroppedImg from "../utils/cropImage";


const STICKERS = [
  "/stickers/heart.png", "/stickers/star.png",
  "/stickers/crown.png", "/stickers/frame1.png", "/stickers/frame2.png"
];

const Editor = ({ src, onSave, onCancel }) => {
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [stickers, setStickers] = useState([]);
  const editorRef = useRef();

  const addSticker = (url) => setStickers(prev => [...prev, { id: Date.now(), url, x: 100, y: 100 }]);
  const removeSticker = (id) => setStickers(prev => prev.filter(s => s.id !== id));

const handleSave = async () => {
  try {
    const croppedImage = await getCroppedImg(src, croppedAreaPixels);
    onSave(croppedImage);
  } catch (e) {
    console.error("Crop failed", e);
  }
};
  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-white p-4 rounded-xl shadow-lg w-full max-w-3xl">
        <div ref={editorRef} className="relative w-full h-[400px] overflow-hidden">
          <Cropper
            image={src}
            crop={crop}
            zoom={zoom}
            aspect={1}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={(croppedArea, croppedAreaPixels) => setCroppedAreaPixels(croppedAreaPixels)}
          />
          {stickers.map(s => (
            <Draggable key={s.id} defaultPosition={{ x: s.x, y: s.y }}>
              <div className="absolute cursor-move">
                <img src={s.url} alt="sticker" className="w-16 h-16" />
                <button onClick={() => removeSticker(s.id)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs">×</button>
              </div>
            </Draggable>
          ))}
        </div>
        <div className="flex items-center gap-4 mt-4">
          <label>Zoom
            <input type="range" min="1" max="3" step="0.1" value={zoom} onChange={e => setZoom(e.target.value)} />
          </label>
          {STICKERS.map((url,i) => (
            <img key={i} src={url} alt="sticker" className="w-12 h-12 cursor-pointer"
                 onClick={() => addSticker(url)} />
          ))}
        </div>
        <div className="text-right mt-4">
          <button onClick={onCancel} className="px-4 py-2 mr-2 bg-gray-300 rounded-xl">Hủy</button>
          <button onClick={handleSave} className="px-4 py-2 bg-green-600 text-white rounded-xl">Lưu ảnh</button>
        </div>
      </div>
    </div>
  );
};

export default Editor