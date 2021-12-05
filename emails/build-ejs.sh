target="./dist"
dest="../app/views/emailTemplates"

mkdir -p "$dest"


let count=0
for f in "$target"/*
    do
        let count=count+1
        if [[ -d $f ]]; then
            echo "$f is a directory skipping for ejs"
        elif [[ -f $f ]]; then
            name=$(echo $(basename $f) | cut -f 1 -d '.')
            echo "$f is a file, converting to ejs $name"
            cp "$f" "$dest/$name.ejs"
        fi
    done

echo ""
echo "Count: $count"