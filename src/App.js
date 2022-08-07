import React, { useRef, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';

import * as tf from "@tensorflow/tfjs";
import * as facemesh from "@tensorflow-models/facemesh";
import Webcam from "react-webcam";
import { drawMesh } from './utilities';


function App() {

  // setup reference
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  // load fecemesh
  const funcFacemesh = async () =>{
    const net = await facemesh.load({
      inputResolution:{width:640, height:480},scale:0.8
    });
    setInterval(() => {
      detect(net);
    }, 100);
    
  }

  //  detect function

  const  detect = async (net)=>{
    if(typeof webcamRef.current !== undefined &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4){
        // get v properties, 
        const video = webcamRef.current.video;
        const videoWidth = webcamRef.current.video.clientWidth;
        const videoHeight = webcamRef.current.video.clientHeight;

        // set video width, 
        webcamRef.current.video.width = videoWidth;
        webcamRef.current.video.height = videoHeight;

        // set canvas width, 
        canvasRef.current.width = videoWidth;
        canvasRef.current.height = videoHeight;

        
        // make detection ,
        const face = await net.estimateFaces(video);
        console.log(face)
        // get canvas context for  drawing
        const ctx = canvasRef.current.getContext("2d");
        requestAnimationFrame(()=>{drawMesh(face, ctx)});
        

      }

  }
  useEffect(()=>{funcFacemesh()}, []);
  return (
    <div className="App">
      <header className='App-header'>
      <Webcam ref={webcamRef}
        style={
          {
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            textAlign: "centr",
            zIndex: 8,
            width: 640,
            height: 480
          }
        } />
      <canvas ref={canvasRef}
        style={
          {
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            textAlign: "centr",
            zIndex: 10,
            width: 640,
            height: 480
          }
        } />
      </header>
    </div>
  );
}

export default App;
