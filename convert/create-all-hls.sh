# for file in `ls ./public | grep '\.webm$'`; do
for file in $(find ./movies -name '*.webm'); do 
    echo "$file"
    DIR=${file%/*}
    DIR="$(echo $DIR | cut -d'/' -f4-)"
    DIR="../movies/convert/$DIR/"

    mkdir -p $DIR

    bash create-vod-hls.sh "$file"  "$DIR"
done


