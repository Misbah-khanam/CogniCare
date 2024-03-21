import { useRef, useState, useEffect } from 'react';

const useWebcamScreenshotInterval = (duration) => {
 const intervalRef = useRef(null);
 const [stream, setStream] = useState(null);
 const [screenshots, setScreenshots] = useState([]);
  
 useEffect(() => {
    const constraints = {
       audio: false,
       video: true
    };

    navigator.mediaDevices.getUserMedia(constraints)
      .then(stream => setStream(stream))
      .catch(error => console.log(error))
 }, []);

 useEffect(() => {
    if (stream !== null) {
      const track = stream.getVideoTracks()[0];
      const imageCapture = new ImageCapture(track);

      intervalRef.current = setInterval(() => {
        imageCapture.takePhoto()
          .then(blob => {
            setScreenshots(prevState => ([
              ...prevState,
              blob
            ]))
          })
          .catch(error => {
            console.log(error);
            clearInterval(intervalRef.current);
          })
      }, duration);
    }

    return () => {
      clearInterval(intervalRef.current);
    };
 }, [stream, duration]);

 return screenshots;
}

export default useWebcamScreenshotInterval;
