# ffmpeg -loop 1 -i ./JAM.jpg -c:v libx264 -t 2 -pix_fmt yuv420p -crf 18 -vf scale=1920:1080  jam-intro-mute.mp4


ffmpeg -i ./function.call.webm -c:v libx264 -crf 18 -filter:v "scale=-2:400, crop=400:400" -c:a aac function.call.mp4

  