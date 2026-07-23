import React, { useEffect, useRef, useState } from "react";
import { QRCode } from "react-qrcode-logo";
import toast, { Toaster } from "react-hot-toast";
import { Camera, RefreshCcw, Timer, Upload, Download, X, RotateCcw, RotateCw } from "lucide-react";

const CLOUD_NAME = "djisbhaxi";
const UPLOAD_PRESET = "ml_default";

const CameraApp = () => {
  const videoRef = useRef(null);
  const [videoDevices, setVideoDevices] = useState([]);
  const [currentCameraIndex, setCurrentCameraIndex] = useState(0);

  const [countdown, setCountdown] = useState(null);
  const [timer, setTimer] = useState(0);

  const [filter, setFilter] = useState("none");
  const [capturedImages, setCapturedImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [lastUploadedUrl, setLastUploadedUrl] = useState(null);

  // Editor
  const [showEditor, setShowEditor] = useState(false);
  const [editorImage, setEditorImage] = useState(null);
  const [rotation, setRotation] = useState(0);

  // Photobooth
  const [photosToTake, setPhotosToTake] = useState(4);
  const [intervalTime, setIntervalTime] = useState(2500);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        videoRef.current.srcObject = stream;
        videoRef.current.style.transform = "scaleX(-1)";
        return navigator.mediaDevices.enumerateDevices();
      })
      .then((devices) => {
        const vids = devices.filter(d => d.kind === "videoinput");
        setVideoDevices(vids);
        if (vids[0]) switchCamera(0);
      })
      .catch(console.error);
  }, []);

  const switchCamera = (index) => {
    const deviceId = videoDevices[index].deviceId;
    navigator.mediaDevices.getUserMedia({
      video: { deviceId: { exact: deviceId } }
    }).then((stream) => {
      videoRef.current.srcObject = stream;
      videoRef.current.style.transform = "scaleX(-1)";
      setCurrentCameraIndex(index);
    }).catch(console.error);
  };

  const uploadToCloudinary = async (base64) => {
    const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;
    const fd = new FormData();
    fd.append("file", base64);
    fd.append("upload_preset", UPLOAD_PRESET);
    const res = await fetch(url, { method: "POST", body: fd });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error?.message || "Upload failed");
    return data.secure_url;
  };

  const flashEffect = () => {
    const overlay = document.createElement("div");
    Object.assign(overlay.style, {
      position: "fixed", top: 0, left: 0,
      width: "100%", height: "100%",
      backgroundColor: "white", opacity: 0.9,
      zIndex: 9999
    });
    document.body.appendChild(overlay);
    setTimeout(() => document.body.removeChild(overlay), 150);
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.filter = filter;
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataURL = canvas.toDataURL("image/png");
    setCapturedImages(prev => [dataURL, ...prev]);
    setEditorImage(dataURL);
    setShowEditor(true);
    flashEffect();
    toast.success("Ảnh đã được chụp!");
  };

  const handleCapture = () => {
    if (timer > 0) {
      let count = timer;
      setCountdown(count);
      const interval = setInterval(() => {
        count--;
        setCountdown(count);
        if (count < 0) {
          clearInterval(interval);
          setCountdown(null);
          capturePhoto();
        }
      }, 1000);
    } else {
      capturePhoto();
    }
  };

  const startPhotoBooth = () => {
    let count = 0;
    const interval = setInterval(() => {
      capturePhoto();
      count++;
      if (count >= photosToTake) clearInterval(interval);
    }, intervalTime);
  };

  const applyEdit = () => {
    const img = new Image();
    img.src = editorImage;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate(rotation * Math.PI / 180);
      ctx.drawImage(img, -img.width / 2, -img.height / 2);
      const newDataUrl = canvas.toDataURL("image/png");
      setCapturedImages(prev => [newDataUrl, ...prev]);
      setShowEditor(false);
      setRotation(0);
      toast.success("Đã lưu ảnh chỉnh sửa!");
    };
  };

  const createAndUploadGrid = async () => {
    if (capturedImages.length < 4) {
      toast.error("Cần ít nhất 4 ảnh để tạo lưới");
      return;
    }
    const w = videoRef.current.videoWidth;
    const h = videoRef.current.videoHeight;
    const canvas = document.createElement("canvas");
    canvas.width = w * 2;
    canvas.height = h * 2;
    const ctx = canvas.getContext("2d");

    await Promise.all(
      capturedImages.slice(0, 4).map((src, i) =>
        new Promise((res) => {
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.src = src;
          img.onload = () => {
            ctx.drawImage(img, (i % 2) * w, Math.floor(i / 2) * h, w, h);
            res();
          };
        })
      )
    );

    const gridDataURL = canvas.toDataURL("image/png");
    try {
      setUploading(true);
      const url = await uploadToCloudinary(gridDataURL);
      setLastUploadedUrl(url);
      setCapturedImages(prev => prev.slice(4));
      toast.success("Upload thành công!");
    } catch (err) {
      console.error(err);
      toast.error("Upload thất bại");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center p-4 max-w-screen-md mx-auto">
      <Toaster position="top-center" />

      {/* VIDEO */}
      <div className="relative w-full max-w-xl mb-6 rounded-2xl overflow-hidden border shadow-lg">
        <video ref={videoRef} autoPlay playsInline className="w-full h-auto" style={{ filter }} />
        {countdown !== null && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white text-7xl font-bold">
            {countdown}
          </div>
        )}
      </div>

      {/* CONTROLS */}
      <div className="flex flex-wrap justify-center gap-3 mb-6">
        <button onClick={() => switchCamera((currentCameraIndex + 1) % videoDevices.length)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl flex items-center gap-2">
          <RefreshCcw size={18} /> Camera
        </button>

        <div className="flex items-center gap-2">
          <Timer size={18} />
          <input type="number" value={timer} onChange={e => setTimer(+e.target.value || 0)}
            className="border rounded px-2 py-1 w-20" placeholder="Timer (s)" />
        </div>

        <select value={filter} onChange={e => setFilter(e.target.value)} className="border rounded px-2 py-1">
          <option value="none">Không bộ lọc</option>
          <option value="grayscale(100%)">Đen trắng</option>
          <option value="sepia(100%)">Nâu đỏ</option>
          <option value="blur(5px)">Mờ</option>
        </select>

        <button onClick={handleCapture} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl flex items-center gap-2">
          <Camera size={18} /> Chụp ảnh
        </button>
      </div>

      {/* PHOTOBOOTH */}
      <div className="flex items-center gap-3 mb-6">
        <input type="number" value={photosToTake} onChange={e => setPhotosToTake(+e.target.value || 4)}
          className="border rounded px-2 py-1 w-20" />
        <span>ảnh, cách nhau</span>
        <input type="number" value={intervalTime} onChange={e => setIntervalTime(+e.target.value || 2500)}
          className="border rounded px-2 py-1 w-24" /> ms
        <button onClick={startPhotoBooth} className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl">
          Bắt đầu Photobooth
        </button>
      </div>

      {/* EDITOR */}
      {showEditor && editorImage && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-xl max-w-lg w-full">
            <h2 className="text-lg font-bold mb-3">Chỉnh sửa ảnh</h2>
            <div className="w-full h-96 flex items-center justify-center overflow-hidden">
              <img src={editorImage} alt="edit" style={{ transform: `rotate(${rotation}deg)` }} className="max-h-full object-contain" />
            </div>
            <div className="flex gap-3 mt-4">
              <button onClick={() => setRotation(r => r - 90)} className="bg-blue-500 text-white px-3 py-2 rounded"><RotateCcw /></button>
              <button onClick={() => setRotation(r => r + 90)} className="bg-blue-500 text-white px-3 py-2 rounded"><RotateCw /></button>
              <button onClick={applyEdit} className="bg-green-600 text-white px-3 py-2 rounded">Lưu</button>
              <button onClick={() => setShowEditor(false)} className="bg-gray-500 text-white px-3 py-2 rounded">Hủy</button>
            </div>
          </div>
        </div>
      )}

      {/* GALLERY */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
        {capturedImages.map((src, i) => (
          <div key={i} className="relative group">
            <img src={src} className="w-full rounded-xl border shadow" />
            <button onClick={() => setCapturedImages(prev => prev.filter((_, idx) => idx !== i))}
              className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-sm hidden group-hover:block">
              <X size={14} />
            </button>
            <a href={src} download={`photo-${Date.now()}.png`}>
              <button className="absolute bottom-2 left-2 bg-white text-sm px-2 py-1 rounded shadow hidden group-hover:block">
                <Download size={14} className="inline-block mr-1" /> Tải
              </button>
            </a>
          </div>
        ))}
      </div>

      {capturedImages.length >= 4 && (
        <button onClick={createAndUploadGrid} disabled={uploading}
          className="mt-6 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-xl flex items-center gap-2 disabled:opacity-60">
          <Upload size={18} />
          {uploading ? "Đang upload..." : "Tạo ảnh lưới & Upload"}
        </button>
      )}

      {lastUploadedUrl && (
        <div className="mt-8 text-center">
          <h3 className="text-xl font-semibold mb-2">Ảnh đã upload:</h3>
          <img src={lastUploadedUrl} className="max-w-full rounded-xl shadow-md mx-auto mb-4" />
          <QRCode value={lastUploadedUrl} size={128} />
          <div className="mt-3">
            <a href={lastUploadedUrl} download="grid-photo.png">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl">
                <Download size={16} className="inline mr-1" /> Tải ảnh lưới
              </button>
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default CameraApp;
