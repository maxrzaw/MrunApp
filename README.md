# Run With Max

Source code for my iOS application I developed during the 2020 summer.

Short demo for a few features available in [this video](https://youtu.be/cTHCtGCxlsk)

### Download
If you would like to try out the app send me an email (currently in beta testing).

### Build on your machine
You will need xcode installed

Commands I ran on my Mac, may be different for you
``` bash
brew install node
brew inatall tree
brew install watchman
brew install cocoapods
cd MrunApp
npm update --legacy-peer-deps
npx pod-install ios
npx react-native run-ios --simulator="iPhone 8"  (I like iPhone 8 over the default)
```
