var mediaStreamTrack=null; // 视频对象(全局)
function openMedia() {
    var constraints = {
        video: { width: 500, height: 500 },
        audio: true
    };
    //获得video摄像头
    var video = document.getElementById('video');     
    var promise = navigator.mediaDevices.getUserMedia(constraints);
    promise.then((mediaStream) => {
        mediaStreamTrack = typeof mediaStream.stop === 'function' ? mediaStream : mediaStream.getTracks()[1];
        video.srcObject = mediaStream;
        video.play();
    });
}

// 拍照
function takePhoto() {
    //获得Canvas对象
    var video = document.getElementById('video');
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, 500, 500);


    // toDataURL  ---  可传入'image/png'---默认, 'image/jpeg'
    var img = document.getElementById('canvas').toDataURL();
    // 这里的img就是得到的图片
    console.log('img-----', img);
    document.getElementById('imgTag').src=img;
}

// 关闭摄像头
function closeMedia() {
    mediaStreamTrack.stop();
}