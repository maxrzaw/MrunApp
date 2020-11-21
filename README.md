# Run With Max

Source code for my iOS application I developed during the 2020 summer.

Short demo for a few features available in [this video](https://youtu.be/cTHCtGCxlsk)

### Download
If you would like to try out the app send me an email (currently in beta testing).

### Build on your machine
You will need xcode installed

Commands I ran may be different for you
``` bash
brew install node
brew install watchman
sudo gem install cocoapods
npx react-native init MRun-App
cd MRun-App
npm install @react-navigation/native
npm install react-native-reanimated react-native-gesture-handler react-native-screens react-native-safe-area-context @react-native-community/masked-view
npm install @react-navigation/stack @react-navigation/bottom-tabs
npm install @react-native-community/async-storage
npm install --save react-native-vector-icons
npm i react-native-elements --save
npm install @react-native-community/picker --save
npm install @react-native-community/datetimepicker --save
npx pod-install ios
npx react-native run-ios --simulator="iPhone 8"  (I like iPhone 8 over the default)
```
