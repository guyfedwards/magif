# magif

save gifs in your menu bar, click to copy url

<img src="screenshot.png" width="400">

###usage
- paste links to gifs and click save
- then you can click to copy to your clipboard
- any space separated words after the gif link will be considered tags
- e.g. `https://media.giphy.com/media/oKn2qp8kKfguk/giphy.gif geese breadcrumbs`<br>
will add the gif with the tags `geese` and `breadcrumbs`

###download
- Visit the [releases](https://github.com/guyfedwards/magif/releases) page and download the `.tar.gz` for the version you wish to use.
- Once it has downloaded, double click the file to extract it
- Copy `magif.app` to your Applications folder

###dev installation
```
git clone git@github.com:guyfedwards/magif.git
cd magif
npm install
```

###run dev
```
npm start
```

###package electron app and copy to /Applications
```
npm run build
```


