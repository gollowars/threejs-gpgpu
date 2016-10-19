# BabelWebStarterSet
Web starterset for simple website

## getting start
```
npm install
```

```
gulp
```

## responsive

if you wannt to build a responsive website,
you should clean files.

### 1. webpack
```
entry: {
      main: "./src/js/main.js"
      // detectpc: "./src/js/detectpc.js",
      // detectsp: "./src/js/detectsp.js"
    },
```

### 2. sp folders

delete dirctory with files
```
./src/pages/layout/sp/
./src/pages/sp/
```

### 2. layout.jade

comment out line in layout.jade

```
//- script(src="#{path}js/detectpc.js")
```
